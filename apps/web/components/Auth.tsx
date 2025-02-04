"use client";

import { useEffect, useState } from "react";
import { signUp, signIn } from "../actions/auth";
import { GlowEffect1 } from "./ui/GlowEffect1";
import { useRouter } from "next/navigation";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();


  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token) {
      router.push("/")
    }
    },[router])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        await signUp(name, email, password);
        alert("Sign Up Successful! You can now sign in.");
        router.push("/")
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        alert("Sign In Successful!");
        router.push("/")
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      <GlowEffect1 />

      <div className="text-center relative z-10 bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-gray-700">
        <h1 className="text-4xl font-bold text-white mb-6">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h1>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-gray-300 hover:text-white mb-6 underline focus:outline-none"
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {isSignUp && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="px-4 py-3 w-80 bg-gray-700 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="px-4 py-3 w-80 bg-gray-700 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="px-4 py-3 w-80 bg-gray-700 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
