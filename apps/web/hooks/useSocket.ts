"use client"
import { useEffect, useState } from "react";
import { WS_URL } from "../lib/config";

export function useSocket () {
    const [loading,setLoading] = useState<boolean>(true);
    const [socket,setSocket] = useState<WebSocket |null>(null);

    useEffect(()=>{
        const token = localStorage.getItem("token");
     if(!token) {
        alert("No token found , please login");
        setLoading(false);
        return
     }
     const ws = new WebSocket(`${WS_URL}?token=${token}`);
     ws.onopen = () => {
        console.log("WebSocket connection established");
        setSocket(ws);
        setLoading(false);
     }

     ws.onerror = (error:unknown) => {
        console.error("WebSocket error:", error);
        setLoading(false);
    };

    ws.onclose = () => {
        console.log("WebSocket connection closed");
    };

    return () => {
        console.log("Cleaning up WebSocket connection...");
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CLOSING) {
          ws.close();
        }
      };

    },[])


    return {
        socket,
        loading
    }
}