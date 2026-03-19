import React from "react";

const SocialButton = ({ icon, label }) => {
  return (
    <div>
      <button className="w-full flex items-center justify-center gap-2 bg-white/[0.03] border border-white/5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/[0.08] hover:border-white/10 transition-all active:scale-95">
        {icon} {label}
      </button>
    </div>
  );
};

export default SocialButton;
