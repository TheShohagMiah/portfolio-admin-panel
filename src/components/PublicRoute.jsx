import React from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LuLoader } from "react-icons/lu";
import { useAuth } from "../contexts/AuthContext";

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
    <div className="relative">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <LuLoader className="animate-spin text-primary" size={22} />
      </div>
      <motion.div
        className="absolute inset-0 rounded-2xl border border-primary/30"
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
    <div className="space-y-1 text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 font-mono animate-pulse">
        Loading
      </p>
      <p className="text-[8px] text-muted-foreground/30 font-mono uppercase tracking-widest">
        Please wait...
      </p>
    </div>
  </div>
);

const PublicRoute = ({ children, redirectTo = "/admin/dashboard" }) => {
  const { user, loading, authChecked } = useAuth();

  // ✅ Only show loader if no persisted user and check hasn't run
  if (!user && (loading || !authChecked)) return <LoadingScreen />;

  // Already authenticated — redirect away from auth pages
  if (user) return <Navigate to={redirectTo} replace />;

  return children;
};

export default PublicRoute;
