"use client"

import { useEffect, useRef } from "react";
import { initDraw } from "../draw";

interface CanvasProps {
    messages: { message: string }[];
    socket: WebSocket;
    roomId:string
  }

export const Canvas = ({ messages, socket,roomId }: CanvasProps) => {
      const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current,messages,socket,roomId);
    }
  }, [messages,socket,roomId]);

    return   <div className="flex w-full max-w-7xl mx-auto p-8 space-x-8">
    <div className="flex-1 relative z-10">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="w-full h-full bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700"
      />
    </div>
  </div>
}