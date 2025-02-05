"use client";

import React from "react";

export const Spinner = () => {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer static ring */}
      <div className="w-16 h-16 border-4 border-gray-200 rounded-full" />
      {/* Inner rotating ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default Spinner;
