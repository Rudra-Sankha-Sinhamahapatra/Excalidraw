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
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-full filter blur-[100px] animate-glowing"></div>

      {/* Main Content */}
      <div className="flex w-full max-w-7xl mx-auto p-8 space-x-8">
        {/* Drawing Canvas */}
        <div className="flex-1 relative z-10">
          <canvas
         
            width={800}
            height={600}
            className="w-full h-full bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700"
          />
        </div>

        {/* Chat Sidebar */}
        <div className="w-96 relative z-10 bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Chat Room</h2>

          {/* Chat Messages */}
          <div className="h-[500px] overflow-y-auto mb-4">
            {chats.map((m, index) => (
              <div key={index} className="text-white mb-2">
                {m.message}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex space-x-4">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-gray-700 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}