"use client"
import { useEffect, useState } from "react"

export const Hero = () => {
    const [logged,setLogged] = useState<boolean>(false);

    useEffect(()=>{
     const token = localStorage.getItem("token");
     if(token){
        setLogged(true);
     } else {
        setLogged(false);
     }
    },[])

    return      <section className="flex flex-col items-center justify-center text-center h-[75vh] px-6 relative z-10">
    <h2 className="text-6xl md:text-7xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 animate-text-glow">
      Draw. Collaborate. Create.
    </h2>
    <p className="text-lg text-gray-300 max-w-2xl mb-8">
      Slugger is your real-time collaborative drawing tool designed for modern teams, artists, and creators. Sketch ideas and bring them to life instantly.
    </p>
    {
        logged?
    <a
      href="/join-room"
      className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all"
    >
      Get Started for Free
    </a>
    :
    <a
    href="/auth"
    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all"
  >
    Get Started for Free
  </a>
}
  </section>
}