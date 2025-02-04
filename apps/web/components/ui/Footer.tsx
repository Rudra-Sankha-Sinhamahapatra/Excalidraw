import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"

export const Footer = () => {
    return   <footer className="py-8 bg-gray-800 text-center text-gray-400 relative z-10">
            <p className="mb-4">&copy; {new Date().getFullYear()} Slugger. All rights reserved.</p>
            <div className="flex justify-center space-x-6 text-2xl">
              <a href="#" className="hover:text-white"><FaTwitter /></a>
              <a href="#" className="hover:text-white"><FaGithub /></a>
              <a href="#" className="hover:text-white"><FaLinkedin /></a>
            </div>
          </footer>
}