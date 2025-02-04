import { PencilIcon } from "@heroicons/react/24/outline"

export const Header = () => {
    return       <header className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center z-10 relative">
    <div className="flex items-center space-x-3">
      <PencilIcon className="w-10 h-10 text-blue-400" />
      <h1 className="text-3xl font-extrabold tracking-tight">Slugger</h1>
    </div>
    <nav className="space-x-6">
      <a href="#features" className="text-gray-300 hover:text-white transition">Features</a>
      <a href="#faq" className="text-gray-300 hover:text-white transition">FAQ</a>
      <a href="#contact" className="text-gray-300 hover:text-white transition">Contact</a>
    </nav>
  </header>
}