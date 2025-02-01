"use client"
import axios from "axios";
import { BACKEND_URL } from "../lib/config";


export async function getChats (roomId:string) {
    try {
       
  const token = localStorage.getItem("token");
  if(!token){
    console.error("no token found,kindly login")
    return;
  }

    const res = await axios.get(`${BACKEND_URL}/api/user/chats/room/${roomId}`,{
        headers:{
            Authorization: `${token}`
        }
        });
        console.log(res.data.messages)
    return res.data.messages;
  
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching room:', error.response?.status, error.message);
        } else {
            console.error('Unknown error:', error);
        }
        return null;  // Return null if not found or on error
    }
}

