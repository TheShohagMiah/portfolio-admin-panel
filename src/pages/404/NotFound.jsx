import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiHome, FiArrowLeft, FiTerminal, FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full bg-[#050505] text-white flex items-center justify-center p-6 overflow-hidden selection:bg-primary selection:text-black"
    >
      {/* Background Interactive Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 z-0 transition-opacity duration-500 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.15), transparent 40%)`,
          }}
        />
      </div>

      <div className="max-w-4xl w-full grid lg:grid-cols-3 gap-6 relative z-10">
        {/* Main Error Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-white/[0.02] border border-white/5 backdrop-blur-2xl rounded-[2.5rem] p-12 flex flex-col justify-center items-start relative overflow-hidden group"
        >
          <div className="relative z-10">
            <motion.h1
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-[8rem] md:text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10"
            >
              404
            </motion.h1>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 italic font-serif text-primary">
              Page Decrypted.
            </h2>
            <p className="text-gray-500 mt-6 max-w-sm leading-relaxed">
              The coordinate you requested does not exist in our current
              architecture. It may have been moved or deleted.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/")}
                className="px-8 py-4 bg-primary text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
              >
                <FiHome /> Return Home
              </motion.button>

              <button
                onClick={() => navigate(-1)}
                className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
              >
                <FiArrowLeft /> Go Back
              </button>
            </div>
          </div>

          {/* Glitch Effect Decorative Circles */}
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
        </motion.div>

        {/* Sidebar Info Cards */}
        <div className="flex flex-col gap-6">
          {/* Diagnostic Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.02] border border-white/5 backdrop-blur-xl p-8 rounded-[2rem]"
          >
            <FiTerminal className="text-primary mb-4" size={24} />
            <h3 className="text-sm font-black uppercase tracking-widest mb-4">
              Diagnostics
            </h3>
            <ul className="space-y-3 font-mono text-[10px] text-gray-500">
              <li className="flex justify-between">
                <span>STATUS:</span>{" "}
                <span className="text-red-500">FAILED</span>
              </li>
              <li className="flex justify-between">
                <span>ERROR_TYPE:</span> <span>NOT_FOUND</span>
              </li>
              <li className="flex justify-between">
                <span>PATH:</span>{" "}
                <span className="truncate ml-2">
                  {window.location.pathname}
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Quick Links Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-primary/5 border border-primary/10 backdrop-blur-xl p-8 rounded-[2rem] flex-1"
          >
            <FiSearch className="text-primary mb-4" size={24} />
            <h3 className="text-sm font-black uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                to="/projects"
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Portfolio Projects
              </Link>
              <Link
                to="/contact"
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Contact Support
              </Link>
              <Link
                to="/auth/signin"
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Admin Portal
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
