"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
  messages = [],
  id,
}: {
  messages: { message: string }[];
  id: string;
}) {
  const [chats, setChats] = useState(messages);
  const { socket, loading } = useSocket();
  const [currentMessage, setCurrentMessage] = useState("");

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
        if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CLOSING)) {
          console.log("Closing WebSocket connection");
          socket.close();
        }
      };
      
  }, [socket, loading, id]);

  return (
    <div>
      {chats.map((m, index) => (
        <div key={index}>{m.message}</div>
      ))}

      <input
        type="text"
        className="px-5 py-3 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={currentMessage}
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
      />

<button
  onClick={() => {
    if (socket?.readyState === WebSocket.OPEN) {  
      socket.send(
        JSON.stringify({
          type: "chat",
          roomId: id,
          message: currentMessage,
        })
      );
      setCurrentMessage("");
    } else {
      console.error("Cannot send message: WebSocket is not open.");
    }
  }}
>
  Send Message
</button>

    </div>
  );
}
