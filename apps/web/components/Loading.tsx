// Loading.tsx
"use client";

import React from "react";
import Spinner from "./Spinner";
import { GlowEffect1 } from "./ui/GlowEffect1";

export const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black space-y-6">
      {/* A subtle glow effect in the background */}
      <GlowEffect1 />
      {/* The spinner */}
      <Spinner />
      {/* Loading message */}
      <p className="text-xl text-white">Loading, please wait...</p>
    </div>
  );
};

export default Loading;
