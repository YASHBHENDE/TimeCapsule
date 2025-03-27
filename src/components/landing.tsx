import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function TimeCapsuleLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex flex-col items-center justify-center px-6">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center py-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          TimeCapsule
        </h1>
        <nav>
          <ul className="flex space-x-6 text-lg font-medium">
            <li><a href="#about" className="hover:text-purple-300 transition">About</a></li>
            <li><a href="#features" className="hover:text-purple-300 transition">Features</a></li>
            <li><a href="/walletoptions" className="hover:text-purple-300 transition">Connect Wallet</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="text-center mt-20">
        <h2 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400 drop-shadow-lg mb-2">
          Store Memories Securely on Blockchain
        </h2>
        <p className="text-gray-500 mt-4 text-xl max-w-3xl mx-auto leading-relaxed ">
          TimeCapsule lets you securely store data for a chosen duration using decentralized blockchain technology.
        </p>
        <motion.button 
          className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-lg font-semibold rounded-xl shadow-xl transition transform hover:scale-105"
          onClick={() => navigate('/walletoptions')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Connect Wallet
        </motion.button>
      </main>

      {/* Features Section */}
      <section id="features" className="w-full max-w-6xl mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Decentralized Storage", text: "Your data remains safe, immutable, and tamper-proof." },
          { title: "Time-Locked Access", text: "Define how long your data stays before it gets unlocked." },
          { title: "Privacy Focused", text: "Only you control who can access your stored information." },
        ].map((feature, index) => (
          <motion.div 
            key={index} 
            className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg text-center border border-gray-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <h3 className="text-2xl font-semibold text-purple-400">{feature.title}</h3>
            <p className="text-gray-300 mt-2 text-lg">{feature.text}</p>
          </motion.div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-20 py-6 text-gray-500 text-sm text-center w-full border-t border-gray-700">
        &copy; {new Date().getFullYear()} TimeCapsule. All rights reserved.
      </footer>
    </div>
  );
}
