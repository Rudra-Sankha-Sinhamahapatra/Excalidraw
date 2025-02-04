import Head from "next/head";
import { Footer } from "./ui/Footer";
import { Hero } from "./ui/Hero";
import { Header } from "./ui/Header";
import { GlowEffect1 } from "./ui/GlowEffect1";
import { Features } from "./ui/Features";
import { FAQ } from "./ui/FAQ";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
      <Head>
        <title>Slugger - Draw & Collaborate in Real-Time</title>
        <meta
          name="description"
          content="Collaborative, real-time drawing app with a modern twist."
        />
      </Head>
      <GlowEffect1 />
      <Header />
      <Hero />
      <Features />
      <FAQ />
      <Footer />
    </div>
  );
}
