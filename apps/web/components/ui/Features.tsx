import { FaUsers, FaPenNib, FaLock } from "react-icons/fa"


export const Features = () => {
    return  <section id="features" className="py-20 bg-gray-800/50 backdrop-blur-md rounded-t-3xl shadow-inner relative z-10">
            <div className="max-w-6xl mx-auto px-6">
              <h3 className="text-4xl font-bold text-center mb-12">Powerful Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                <div className="bg-gray-700/60 p-6 rounded-xl shadow-xl border border-gray-600 text-center">
                  <FaUsers className="text-5xl text-blue-400 mx-auto mb-4" />
                  <h4 className="text-2xl font-semibold mb-2">Real-Time Collaboration</h4>
                  <p className="text-gray-300">
                    Work with your team instantly. Watch as changes happen in real-time without any lag.
                  </p>
                </div>
             
                <div className="bg-gray-700/60 p-6 rounded-xl shadow-xl border border-gray-600 text-center">
                  <FaPenNib className="text-5xl text-purple-400 mx-auto mb-4" />
                  <h4 className="text-2xl font-semibold mb-2">Intuitive Drawing Tools</h4>
                  <p className="text-gray-300">
                    Use powerful yet simple drawing tools tailored for both beginners and professionals.
                  </p>
                </div>

                <div className="bg-gray-700/60 p-6 rounded-xl shadow-xl border border-gray-600 text-center">
                  <FaLock className="text-5xl text-green-400 mx-auto mb-4" />
                  <h4 className="text-2xl font-semibold mb-2">Secure & Private</h4>
                  <p className="text-gray-300">
                    Your drawings are encrypted and stored securely. Share with confidence.
                  </p>
                </div>
              </div>
            </div>
          </section>
}