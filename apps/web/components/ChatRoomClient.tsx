/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { GlowEffect1 } from "./ui/GlowEffect1";
import { initDraw } from "../draw";

export function ChatRoomClient({
  messages = [],
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const [chats, setChats] = useState(messages);
  const { socket, loading } = useSocket();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN && !loading) {
      socket.send(
        JSON.stringify({
          type: "join_room",
          roomId: id,
        })
      );

      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        if (parsedData.type === "chat") {
          setChats((c) => [...c, { message: parsedData.message }]);
        }
      };
    }

    return () => {
      if (
        socket &&
        (socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CLOSING)
      ) {
        console.log("Closing WebSocket connection");
        socket.close();
      }
    };
  }, [socket, loading, id]);

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current);
    }
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      <GlowEffect1 />

      <div className="flex w-full max-w-7xl mx-auto p-8 space-x-8">
        <div className="flex-1 relative z-10">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="w-full h-full bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700"
          />
        </div>
      </div>
    </div>
  );
}
