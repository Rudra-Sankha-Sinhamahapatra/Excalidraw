"use client";

import { useEffect, useRef, useState } from "react";
import { IconBar } from "./IconBar";
import { Tool } from "../lib/types";
import { Game } from "../draw/Game";

interface CanvasProps {
  messages: { message: string }[];
  socket: WebSocket;
  roomId: string;
}


export const Canvas = ({ messages, socket, roomId }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>(Tool.pencil);
  const [game,setGame] = useState<Game>();

  useEffect(()=>{
   game?.setTool(selectedTool);
  },[selectedTool,game])

  useEffect(() => {
    if (canvasRef.current) {
    const g = new Game(canvasRef.current,messages, socket, roomId);
    setGame(g);

    return () => {
     g.destroy();
    }
    }
  }, [canvasRef, messages, roomId, socket]);

  return (
    <div className="flex w-full max-w-7xl mx-auto p-8 space-x-8 flex-col">
      <IconBar
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
        />
            <div className="flex-1 relative mt-15">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-full bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700"
        />
      </div>
    </div>
  );
};
