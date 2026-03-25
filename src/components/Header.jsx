import React, { useState, useEffect, useRef } from "react";
import { RiArrowDownSLine, RiLogoutBoxLine, RiMenu2Line } from "react-icons/ri";
import {
  LuMoon,
  LuSunDim,
  LuBell,
  LuSearch,
  LuRadio,
  LuUserRoundSearch,
} from "react-icons/lu";
import { PiGearSixBold } from "react-icons/pi";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

// ═══════════════════════════════════════════════════════
//  DROPDOWN ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════
const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.15 } },
};

// ═══════════════════════════════════════════════════════
//  ICON BUTTON — reusable
// ═══════════════════════════════════════════════════════
const IconButton = ({ onClick, active, children, className = "" }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`relative w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-200 ${
      active
        ? "bg-brand-muted border-brand text-brand"
        : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
    } ${className}`}
  >
    {children}
  </motion.button>
);

// ═══════════════════════════════════════════════════════
//  HEADER
// ═══════════════════════════════════════════════════════
const Header = ({ onMenuClick }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const { adminTheme, toggleAdminTheme } = useAdminTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      )
        setShowNotifications(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard shortcut ⌘K / Ctrl+K → focus search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("header-search")?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/signin", { replace: true });
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const initials =
    user?.fullName
      ?.trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AU";

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6
      bg-background/60 backdrop-blur-xl border-b border-border"
    >
      {/* ── Top shimmer line ─────────────────────────────── */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]
        bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none"
      />

      {/* ════════════════════════════════════════════════════
          LEFT — Menu + Search
      ════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-3 flex-1 ">
        {/* Mobile hamburger */}
        <IconButton onClick={onMenuClick} className="lg:hidden flex-shrink-0">
          <RiMenu2Line size={18} />
        </IconButton>

        {/* Search bar */}
        <div
          className={`relative hidden sm:flex items-center max-w-xs w-full transition-all duration-300 ${
            searchFocused ? "max-w-sm" : ""
          }`}
        >
          <LuSearch
            size={15}
            className={`absolute left-3 transition-colors duration-200 pointer-events-none ${
              searchFocused ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <input
            id="header-search"
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search..."
            className={`w-full pl-9 pr-16 py-2 text-[12px] font-mono rounded-xl border transition-all duration-200
              bg-secondary text-foreground placeholder:text-muted-foreground/50
              focus:outline-none focus:ring-2 focus:ring-primary/20
              ${
                searchFocused
                  ? "border-primary/40 bg-card"
                  : "border-border hover:border-primary/20"
              }`}
          />
          {/* ⌘K badge */}
          <div className="absolute right-2.5 flex items-center gap-0.5 pointer-events-none">
            <kbd
              className="px-1.5 py-0.5 rounded border border-border bg-muted
              text-[9px] font-bold text-muted-foreground/60 font-mono"
            >
              ⌘K
            </kbd>
          </div>
        </div>
        <div className="liveSite">
          <a
            href="https://shohagmiah.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="
          relative z-10 
          px-4 py-2
          bg-brand text-brand-fg 
          rounded-full 
          text-[10px] font-bold uppercase tracking-widest 
          flex items-center gap-2 
          transition-all duration-300
          hover:scale-105 active:scale-95
          shadow-md
        "
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
            </span>
            <LuRadio size={16} className="lg:hidden text-brand-fg" />
            <span className="hidden lg:block leading-none">Live site</span>
          </a>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          RIGHT — Clock, Theme, Notifications, Profile
      ════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Live clock — hidden on small screens */}
        <div className="hidden lg:flex flex-col items-end mr-1">
          <span className="text-[11px] font-black font-mono tabular-nums text-foreground tracking-wider">
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
          <span className="text-[8px] text-muted-foreground/40 font-mono uppercase tracking-widest">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-border mx-1" />

        {/* Theme toggle */}
        <IconButton onClick={toggleAdminTheme}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={adminTheme}
              initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
            >
              {adminTheme === "dark" ? (
                <LuSunDim size={16} />
              ) : (
                <LuMoon size={16} />
              )}
            </motion.span>
          </AnimatePresence>
        </IconButton>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <IconButton
            active={showNotifications}
            onClick={() => {
              setShowNotifications((p) => !p);
              setShowProfile(false);
            }}
          >
            <LuBell size={16} />
            {/* Unread badge */}
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full
                  bg-[var(--chart-5)] text-white text-[8px] font-black
                  flex items-center justify-center ring-2 ring-background"
              >
                {unreadCount}
              </motion.span>
            )}
          </IconButton>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 mt-2 w-80 bg-popover border border-border
                  rounded-2xl shadow-2xl z-50 overflow-hidden origin-top-right"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/40">
                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-[var(--chart-2)]"
                    />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] font-mono text-foreground">
                      Notifications
                    </h3>
                  </div>
                  <button
                    className="text-[9px] font-bold uppercase tracking-widest font-mono
                    text-brand hover:text-brand-soft transition-colors"
                  >
                    Clear all
                  </button>
                </div>

                {/* List */}
                <div
                  className="max-h-72 overflow-y-auto divide-y divide-border
                  [&::-webkit-scrollbar]:w-1
                  [&::-webkit-scrollbar-thumb]:bg-border
                  [&::-webkit-scrollbar-thumb]:rounded-full"
                >
                  {notifications.map((n, i) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex gap-3 items-start px-4 py-3.5 cursor-pointer
                        transition-colors duration-150 group
                        ${n.unread ? "hover:bg-secondary/60" : "hover:bg-secondary/30 opacity-60"}`}
                    >
                      {/* Dot */}
                      <div className="mt-1.5 flex-shrink-0">
                        {n.unread ? (
                          <motion.span
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="block w-1.5 h-1.5 rounded-full bg-brand"
                          />
                        ) : (
                          <span className="block w-1.5 h-1.5 rounded-full bg-border" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-[12px] leading-snug truncate ${
                            n.unread
                              ? "text-foreground font-semibold"
                              : "text-muted-foreground"
                          }`}
                        >
                          {n.text}
                        </p>
                        <p className="text-[9px] text-muted-foreground/50 font-mono mt-1 uppercase tracking-widest">
                          {n.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-border bg-secondary/20">
                  <button
                    className="w-full text-[9px] font-bold uppercase tracking-[0.25em]
                    font-mono text-muted-foreground hover:text-primary transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-border mx-1" />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowProfile((p) => !p);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-xl border border-border
              bg-secondary hover:border-primary/30 transition-all duration-200"
          >
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center
                text-[10px] font-black text-brand-fg flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand), var(--brand-soft))",
                boxShadow: "0 2px 10px var(--brand-glow)",
              }}
            >
              {initials}
            </div>

            {/* Name — hidden on small screens */}
            <div className="hidden md:block text-left">
              <p className="text-[11px] font-bold text-foreground leading-none truncate max-w-[80px]">
                {user?.fullName?.split(" ")[0] || "Admin"}
              </p>
              <p
                className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground/50 mt-0.5"
                style={{ color: "var(--brand-soft)" }}
              >
                {user?.role || "admin"}
              </p>
            </div>

            <motion.div
              animate={{ rotate: showProfile ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-0.5"
            >
              <RiArrowDownSLine
                size={14}
                className="text-muted-foreground/60"
              />
            </motion.div>
          </motion.button>

          {/* Profile dropdown */}
          <AnimatePresence>
            {showProfile && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 mt-2 w-56 bg-popover border border-border
                  rounded-2xl shadow-2xl z-50 overflow-hidden origin-top-right"
              >
                {/* User info */}
                <div className="px-4 py-3.5 border-b border-border bg-secondary/40">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center
                        text-xs font-black text-brand-fg flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--brand), var(--brand-soft))",
                        boxShadow: "0 2px 12px var(--brand-glow)",
                      }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">
                        {user?.fullName}
                      </p>
                      <a
                        href={`mailto:${user?.email}`}
                        className="text-[9px] font-mono truncate block hover:underline"
                        style={{ color: "var(--brand-soft)" }}
                      >
                        {user?.email?.toLowerCase()}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-1.5">
                  {[
                    {
                      to: `/admin/profile/me/${user?._id}`,
                      icon: <LuUserRoundSearch size={14} />,
                      label: "My Profile",
                      isLink: true,
                    },
                    {
                      icon: <PiGearSixBold size={14} />,
                      label: "Settings",
                      isLink: false,
                    },
                  ].map((item, i) =>
                    item.isLink ? (
                      <Link
                        key={i}
                        to={item.to}
                        onClick={() => setShowProfile(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px]
                          text-muted-foreground hover:text-foreground hover:bg-secondary
                          transition-all duration-150"
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        key={i}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px]
                          text-muted-foreground hover:text-foreground hover:bg-secondary
                          transition-all duration-150"
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ),
                  )}

                  <div className="my-1 h-[1px] bg-border mx-1" />

                  <motion.button
                    whileHover={{ x: 2 }}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12px]
                      font-semibold text-destructive hover:bg-destructive/10
                      transition-all duration-150"
                  >
                    <RiLogoutBoxLine size={14} />
                    Sign Out
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

// ── Static notifications data ──────────────────────────
const notifications = [
  { id: 1, text: "New message from client", time: "5 min ago", unread: true },
  {
    id: 2,
    text: "Project deadline tomorrow",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    text: "Server backup completed",
    time: "3 hours ago",
    unread: false,
  },
];

export default Header;
