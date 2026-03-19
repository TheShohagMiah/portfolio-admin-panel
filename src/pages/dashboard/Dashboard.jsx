import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  FiActivity,
  FiLayers,
  FiMail,
  FiGlobe,
  FiArrowUpRight,
  FiZap,
  FiCheckCircle,
  FiShield,
  FiCpu,
  FiTerminal,
  FiRadio,
  FiTrendingUp,
  FiUser,
  FiBox,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { Link } from "react-router-dom";
import axios from "axios";

// ═══════════════════════════════════════════════════════════════
//  PARTICLE FIELD — uses CSS var colors
// ═══════════════════════════════════════════════════════════════
const ParticleField = () =>
  Array.from({ length: 24 }).map((_, i) => (
    <motion.div
      key={i}
      className="pointer-events-none fixed w-[2px] h-[2px] rounded-full bg-primary/20 z-0"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{ y: [0, -60, 0], opacity: [0, 0.6, 0], scale: [0, 1.2, 0] }}
      transition={{
        duration: 5 + Math.random() * 5,
        repeat: Infinity,
        delay: Math.random() * 8,
        ease: "easeInOut",
      }}
    />
  ));

// ═══════════════════════════════════════════════════════════════
//  HOLOGRAPHIC TILT CARD
// ═══════════════════════════════════════════════════════════════
const HoloCard = ({ children, className = "" }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouse = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative overflow-hidden group ${className}`}
    >
      {/* Shimmer layer — uses ring color */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[inherit] bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      {children}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  ANIMATED COUNTER
// ═══════════════════════════════════════════════════════════════
const AnimatedCounter = ({ value, loading, suffix = "" }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (loading) return;
    const end = parseInt(value?.toString().replace(/,/g, "")) || 0;
    if (isNaN(end)) {
      setDisplay(value);
      return;
    }
    let startTime = null;
    const tick = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / 1400, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(end);
    };
    requestAnimationFrame(tick);
  }, [value, loading]);

  if (loading)
    return (
      <span className="inline-block w-20 h-9 bg-muted animate-pulse rounded-lg" />
    );

  return (
    <span className="tabular-nums font-mono">
      {typeof display === "number" ? display.toLocaleString() : display}
      {suffix}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════
//  SVG RING PROGRESS — uses chart-1 token
// ═══════════════════════════════════════════════════════════════
const RingProgress = ({ value = 98 }) => {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        className="text-border"
      />
      <motion.circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="var(--chart-1)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.4 }}
      />
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
//  SPARKLINE — uses CSS chart tokens
// ═══════════════════════════════════════════════════════════════
const Sparkline = ({ chartVar = "--chart-2" }) => {
  const pts = Array.from({ length: 12 }, () => 20 + Math.random() * 36);
  const max = Math.max(...pts),
    min = Math.min(...pts);
  const ny = (v) => 40 - ((v - min) / (max - min || 1)) * 36;
  const d = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${(i / 11) * 100} ${ny(p)}`)
    .join(" ");
  const color = `var(${chartVar})`;

  return (
    <svg viewBox="0 0 100 44" className="w-full h-9 opacity-50">
      <defs>
        <linearGradient
          id={`spark-${chartVar.replace("--", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${d} L 100 44 L 0 44 Z`}
        fill={`url(#spark-${chartVar.replace("--", "")})`}
      />
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
      />
    </svg>
  );
};

// ═══════════════════════════════════════════════════════════════
//  STAT CARD CONFIG — only CSS vars, no hardcoded colors
// ═══════════════════════════════════════════════════════════════
const STATS_CONFIG = [
  {
    label: "Portfolio Visits",
    sub: (d) => `+${d.todayVisitors} today`,
    value: (d) => d.totalVisitors,
    icon: <FiActivity />,
    chartVar: "--chart-2",
    accentClass: "text-[var(--chart-2)]",
    bgClass: "bg-[var(--chart-2)]/10",
    borderClass: "border-[var(--chart-2)]/20",
    suffix: "",
    isRing: false,
  },
  {
    label: "Live Projects",
    sub: () => "In production",
    value: (d) => d.totalProjects,
    icon: <FiBox />,
    chartVar: "--chart-1",
    accentClass: "text-[var(--chart-1)]",
    bgClass: "bg-[var(--chart-1)]/10",
    borderClass: "border-[var(--chart-1)]/20",
    suffix: "",
    isRing: false,
  },
  {
    label: "Services",
    sub: () => "Offered publicly",
    value: (d) => d.totalServices,
    icon: <FiCpu />,
    chartVar: "--chart-4",
    accentClass: "text-[var(--chart-4)]",
    bgClass: "bg-[var(--chart-4)]/10",
    borderClass: "border-[var(--chart-4)]/20",
    suffix: "",
    isRing: false,
  },
  {
    label: "Vault Health",
    sub: () => "All systems optimal",
    value: () => 98,
    icon: <FiShield />,
    chartVar: "--chart-5",
    accentClass: "text-[var(--chart-5)]",
    bgClass: "bg-[var(--chart-5)]/10",
    borderClass: "border-[var(--chart-5)]/20",
    suffix: "%",
    isRing: true,
  },
];

// ═══════════════════════════════════════════════════════════════
//  ACTIONS CONFIG
// ═══════════════════════════════════════════════════════════════
const ACTIONS = [
  {
    title: "Hero Section",
    desc: "Edit headlines & CTA",
    link: "/admin/hero-management",
    icon: <FiZap />,
    chartVar: "--chart-3",
    tag: "UI",
  },
  {
    title: "Bio & About",
    desc: "Update identity profile",
    link: "/admin/about",
    icon: <FiUser />,
    chartVar: "--chart-1",
    tag: "Content",
  },
  {
    title: "Projects",
    desc: "Manage your portfolio work",
    link: "/admin/projects",
    icon: <FiLayers />,
    chartVar: "--chart-4",
    tag: "Data",
  },
  {
    title: "Messages",
    desc: "Client inquiries & inbox",
    link: "/admin/messages",
    icon: <FiMail />,
    chartVar: "--chart-5",
    tag: "Comms",
  },
  {
    title: "Services",
    desc: "What you offer clients",
    link: "/admin/services",
    icon: <FiGlobe />,
    chartVar: "--chart-2",
    tag: "Ops",
  },
  {
    title: "Analytics",
    desc: "Traffic & visitor insights",
    link: "/admin/dashboard",
    icon: <FiTrendingUp />,
    chartVar: "--chart-1",
    tag: "Stats",
  },
];

// ═══════════════════════════════════════════════════════════════
//  LOGS CONFIG
// ═══════════════════════════════════════════════════════════════
const LOGS = [
  {
    event: "Hero section deployed",
    time: "2m ago",
    chartVar: "--chart-2",
    icon: <FiCheckCircle />,
    code: "SYS_001",
  },
  {
    event: "New project 'Neural-Net'",
    time: "4h ago",
    chartVar: "--chart-1",
    icon: <FiBox />,
    code: "PRJ_042",
  },
  {
    event: "Bio profile updated",
    time: "Yesterday",
    chartVar: "--chart-4",
    icon: <FiUser />,
    code: "BIO_007",
  },
  {
    event: "Visitor spike detected",
    time: "2d ago",
    chartVar: "--chart-5",
    icon: <FiRadio />,
    code: "VIS_128",
  },
  {
    event: "New service published",
    time: "3d ago",
    chartVar: "--chart-3",
    icon: <FiZap />,
    code: "SVC_015",
  },
];

// ═══════════════════════════════════════════════════════════════
//  MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════
const Dashboard = () => {
  const [dashData, setDashData] = useState({
    totalVisitors: 0,
    totalProjects: 0,
    totalServices: 0,
    todayVisitors: 0,
  });
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());
  const [activeLog, setActiveLog] = useState(null);
  const [greeting, setGreeting] = useState("");

  // Live clock + greeting
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    const h = new Date().getHours();
    setGreeting(
      h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening",
    );
    return () => clearInterval(t);
  }, []);

  // Fetch API data
  useEffect(() => {
    (async () => {
      try {
        const [v, td, p, s] = await Promise.all([
          axios.get("https://themiahshohag.vercel.app//api/visitors/total"),
          axios.get("https://themiahshohag.vercel.app//api/visitors/today"),
          axios.get(
            "https://themiahshohag.vercel.app//api/miscellaneous/total-projects",
          ),
          axios.get(
            "https://themiahshohag.vercel.app//api/miscellaneous/total-services",
          ),
        ]);
        setDashData({
          totalVisitors: v.data.total,
          todayVisitors: td.data.total,
          totalProjects: p.data.total,
          totalServices: s.data.total,
        });
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();

    // Track visitor
    axios
      .post("https://themiahshohag.vercel.app//api/visitors/track", {
        page: "/dashboard",
      })
      .catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Particle background ───────────────────────────────── */}
      <ParticleField />

      {/* ── Subtle grid overlay ───────────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px),
                            linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Ambient glow orbs (theme-aware) ───────────────────── */}
      <div className="pointer-events-none fixed top-[-20%] left-[-10%] w-[480px] h-[480px] rounded-full bg-primary/[0.04] blur-[120px] z-0" />
      <div className="pointer-events-none fixed bottom-[-20%] right-[-10%] w-[380px] h-[380px] rounded-full bg-[var(--chart-4)]/[0.05] blur-[120px] z-0" />

      {/* ── Main content ─────────────────────────────────────────*/}
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* ════════════════════════════════════════════════════════
            HEADER
        ════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl border border-border bg-card backdrop-blur-xl p-6 md:p-8 overflow-hidden"
        >
          {/* Top shimmer line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Left: Greeting + Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HiOutlineSparkles className="text-primary size-3.5" />
                <span className="text-[10px] text-muted-foreground tracking-[0.35em] uppercase font-mono">
                  {greeting}, Commander
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none">
                <span className="text-foreground">Mission</span>{" "}
                <span className="text-brand">Control</span>
              </h1>
              <p className="text-muted-foreground text-sm font-mono flex items-center gap-2">
                <span className="text-[var(--chart-2)]">◉</span>
                All subsystems nominal · Portfolio OS v2.0
              </p>
            </div>

            {/* Right: Clock + Badges */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Live clock */}
              <div className="relative px-5 py-3 rounded-2xl border border-border bg-secondary overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <p className="text-[9px] text-muted-foreground tracking-[0.3em] uppercase font-mono mb-1">
                  System Time
                </p>
                <p className="text-xl font-black tracking-widest tabular-nums font-mono text-primary">
                  {time.toLocaleTimeString()}
                </p>
                <p className="text-[9px] text-muted-foreground/50 tracking-widest font-mono mt-0.5">
                  {time.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Status pills */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-[var(--chart-2)]/10 border border-[var(--chart-2)]/20 px-3 py-1.5 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--chart-2)] animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] font-mono text-[var(--chart-2)]">
                    Production Live
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-secondary border border-border px-3 py-1.5 rounded-lg">
                  <FiShield className="text-primary size-3" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] font-mono text-muted-foreground">
                    E2E Encrypted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════
            STATS GRID
        ════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS_CONFIG.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: i * 0.09,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <HoloCard
                className={`h-full rounded-3xl border ${stat.borderClass} bg-card p-6 cursor-default`}
              >
                {/* Subtle gradient wash */}
                <div
                  className={`absolute inset-0 ${stat.bgClass} opacity-30 rounded-3xl`}
                />

                {/* Top glow line */}
                <div
                  className="absolute top-0 left-8 right-8 h-[1px] rounded-full"
                  style={{
                    background: `linear-gradient(90deg, transparent, var(${stat.chartVar}), transparent)`,
                    opacity: 0.4,
                  }}
                />

                <div className="relative z-10 flex flex-col gap-3 h-full">
                  {/* Icon + badge / ring */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-2.5 rounded-xl ${stat.bgClass} border ${stat.borderClass} ${stat.accentClass}`}
                    >
                      <span className="text-lg">{stat.icon}</span>
                    </div>
                    {stat.isRing ? (
                      <RingProgress value={98} />
                    ) : (
                      <span
                        className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border font-mono ${stat.accentClass} ${stat.bgClass} ${stat.borderClass}`}
                      >
                        ↑ Live
                      </span>
                    )}
                  </div>

                  {/* Sparkline */}
                  <Sparkline chartVar={stat.chartVar} />

                  {/* Label */}
                  <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-mono">
                    {stat.label}
                  </p>

                  {/* Value */}
                  <p
                    className={`text-4xl font-black tracking-tighter leading-none ${stat.accentClass}`}
                  >
                    <AnimatedCounter
                      value={stat.value(dashData)}
                      loading={loading}
                      suffix={stat.suffix}
                    />
                  </p>

                  {/* Sub-label */}
                  <p className="text-[10px] text-muted-foreground font-mono tracking-wider">
                    {loading ? (
                      <span className="inline-block w-24 h-3 bg-muted animate-pulse rounded" />
                    ) : (
                      stat.sub(dashData)
                    )}
                  </p>
                </div>
              </HoloCard>
            </motion.div>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════
            ACTIONS + LOGS
        ════════════════════════════════════════════════════════ */}
        <div className="grid xl:grid-cols-5 gap-6">
          {/* ── Command Interface (3 cols) ──────────────────────── */}
          <div className="xl:col-span-3 space-y-4">
            <div className="flex items-center gap-3">
              <FiTerminal className="text-primary size-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground font-mono">
                Command Interface
              </span>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-border to-transparent" />
              <span className="text-[9px] text-muted-foreground/40 font-mono">
                {ACTIONS.length} modules
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {ACTIONS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.3 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link to={item.link}>
                    <motion.div
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 22,
                      }}
                      className="group relative rounded-2xl border border-border bg-card p-5 flex justify-between items-center overflow-hidden cursor-pointer"
                    >
                      {/* Hover bg wash */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, var(${item.chartVar})/8%, transparent 70%)`,
                        }}
                      />

                      {/* Bottom border reveal */}
                      <div
                        className="absolute bottom-0 left-4 right-4 h-[1px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"
                        style={{
                          background: `var(${item.chartVar})`,
                          opacity: 0.4,
                        }}
                      />

                      <div className="flex items-center gap-3.5 relative z-10">
                        <div
                          className="p-2.5 rounded-xl border bg-muted group-hover:scale-110 transition-transform"
                          style={{
                            color: `var(${item.chartVar})`,
                            borderColor: `color-mix(in oklch, var(${item.chartVar}) 25%, transparent)`,
                          }}
                        >
                          <span className="text-base">{item.icon}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                              {item.title}
                            </h4>
                            <span
                              className="text-[7px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-widest border bg-muted"
                              style={{
                                color: `var(${item.chartVar})`,
                                borderColor: `color-mix(in oklch, var(${item.chartVar}) 25%, transparent)`,
                              }}
                            >
                              {item.tag}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-xs leading-none">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <FiArrowUpRight className="shrink-0 relative z-10 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Live Feed / Logs (2 cols) ───────────────────────── */}
          <div className="xl:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FiRadio className="text-primary size-3.5" />
              </motion.div>
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-muted-foreground font-mono">
                Live Feed
              </span>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-border to-transparent" />
            </div>

            <div className="rounded-3xl border border-border bg-card overflow-hidden">
              {/* Terminal title bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-secondary/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-destructive/70 hover:bg-destructive transition-colors cursor-pointer" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--chart-3)]/70 hover:bg-[var(--chart-3)] transition-colors cursor-pointer" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--chart-2)]/70 hover:bg-[var(--chart-2)] transition-colors cursor-pointer" />
                </div>
                <span className="text-[9px] text-muted-foreground/40 font-mono tracking-widest">
                  audit.log · live
                </span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="text-[9px] font-mono font-bold text-[var(--chart-2)]"
                >
                  ● REC
                </motion.span>
              </div>

              {/* Log entries */}
              <div className="divide-y divide-border">
                <AnimatePresence>
                  {LOGS.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.07 }}
                      onClick={() => setActiveLog(activeLog === i ? null : i)}
                      className={`group relative flex gap-3 items-start px-5 py-4 cursor-pointer transition-colors duration-150 ${
                        activeLog === i ? "bg-accent" : "hover:bg-secondary/50"
                      }`}
                    >
                      {/* Left accent line on active */}
                      {activeLog === i && (
                        <div
                          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
                          style={{ background: `var(${log.chartVar})` }}
                        />
                      )}

                      <div
                        className="shrink-0 mt-0.5"
                        style={{ color: `var(${log.chartVar})` }}
                      >
                        {log.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold leading-none truncate text-foreground/80 group-hover:text-foreground transition-colors">
                          {log.event}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[8px] text-muted-foreground tracking-widest uppercase font-mono">
                            {log.time}
                          </span>
                          <span
                            className="text-[8px] font-bold tracking-widest font-mono opacity-50"
                            style={{ color: `var(${log.chartVar})` }}
                          >
                            #{log.code}
                          </span>
                        </div>
                      </div>

                      <motion.div
                        className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
                        style={{ background: `var(${log.chartVar})` }}
                        animate={{
                          opacity: activeLog === i ? [1, 0.3, 1] : [0.5, 0.5],
                        }}
                        transition={{
                          duration: 1.4,
                          repeat: activeLog === i ? Infinity : 0,
                        }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-border bg-secondary/30">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors font-mono py-1"
                >
                  <FiTerminal className="size-3" />
                  Access Full Audit Trail
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            STATUS FOOTER BAR
        ════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="relative rounded-2xl border border-border bg-card px-6 py-4 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--chart-2)]/[0.03] via-transparent to-[var(--chart-4)]/[0.03]" />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {[
                {
                  chartVar: "--chart-2",
                  label: "API Online",
                  sub: "99.9% uptime",
                },
                {
                  chartVar: "--chart-1",
                  label: "DB Synced",
                  sub: "< 2ms latency",
                },
                {
                  chartVar: "--chart-4",
                  label: "Auth Active",
                  sub: "JWT secured",
                },
                {
                  chartVar: "--chart-5",
                  label: "CDN Ready",
                  sub: "Edge cached",
                },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: `var(${s.chartVar})` }}
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{
                      duration: 2,
                      delay: i * 0.5,
                      repeat: Infinity,
                    }}
                  />
                  <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
                    {s.label}
                  </span>
                  <span className="text-[9px] text-muted-foreground/30 font-mono hidden sm:inline">
                    · {s.sub}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-[9px] text-muted-foreground/30 font-mono tracking-widest">
              Portfolio OS v2.0 · {new Date().getFullYear()}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
