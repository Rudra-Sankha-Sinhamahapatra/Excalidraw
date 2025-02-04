"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GlowEffect1 } from "./ui/GlowEffect1";

export default function JoinRoom() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  useEffect(()=>{
  const token = localStorage.getItem("token");
  if(!token) {
    router.push("/auth")
  }
  },[router])

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
     <GlowEffect1/>
      <div className="text-center relative z-10">
        <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
         Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Slugger
          </span>
        </h1>
        <p className="text-gray-300 mb-8 text-lg animate-fade-in delay-100">
          Enter a room slug name to join or create a new draw room.
        </p>

        <div className="flex flex-col space-y-4 animate-fade-in delay-200">
          <input
            type="text"
            placeholder="Enter Room Slug Name"
            value={roomId}
            className="px-6 py-3  bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-600"
            onChange={(e) => setRoomId(e.target.value)}
          />

          <button
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={() => {
              if (roomId.trim()) {
                router.push(`/room/${roomId}`);
              }
            }}
          >
            Join Room
          </button>
        </div>
      </div>
    </div>
  );
}