import React from "react";
import { motion } from "framer-motion";

const SocialButton = ({ icon, label, onClick }) => {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl
      border border-border bg-secondary text-foreground text-[10px] font-black
      uppercase tracking-widest font-mono hover:border-primary/30
      hover:bg-secondary/80 transition-all duration-200"
    >
      <span className="text-base">{icon}</span>
      {label}
    </motion.button>
  );
};

export default SocialButton;
