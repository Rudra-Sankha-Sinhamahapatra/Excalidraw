"use client";

import { useEffect,useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { GlowEffect1 } from "./ui/GlowEffect1";
import { Canvas } from "./Canvas";
import Loading from "./Loading";


export function ChatRoomClient({
  messages = [],
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const [chats, setChats] = useState(messages);
  const { socket, loading } = useSocket();

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

  if (!socket || loading || socket.readyState !== WebSocket.OPEN) {
    return <div><Loading/></div>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      <GlowEffect1 />
      <Canvas messages={chats} socket={socket} roomId={id}/>
    </div>
  );
}
