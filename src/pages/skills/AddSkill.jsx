import React, { useState, useMemo, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSave,
  FiSearch,
  FiX,
  FiAlertCircle,
  FiLayers,
  FiZap,
} from "react-icons/fi";
import { LuLoader, LuRotateCcw } from "react-icons/lu";
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaGitAlt,
  FaVuejs,
  FaSass,
  FaAward,
} from "react-icons/fa";
import {
  SiJavascript,
  SiTypescript,
  SiMongodb,
  SiExpress,
  SiTailwindcss,
  SiNextdotjs,
  SiRedux,
  SiFirebase,
  SiPostman,
  SiGraphql,
  SiPostgresql,
  SiMysql,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiLinux,
  SiPrisma,
  SiSupabase,
  SiVercel,
  SiNetlify,
  SiVite,
  SiWebpack,
  SiFigma,
  SiAdobexd,
  SiStyledcomponents,
  SiFramer,
  SiJest,
  SiCypress,
} from "react-icons/si";
import { TbBrandGithub, TbBrandAws } from "react-icons/tb";
import axios from "axios";
import toast from "react-hot-toast";
import PageHeader from "../../components/shared/PageHeader";
import { createSkillSchema } from "../../validators/skills/skillValidations";

// ═══════════════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════════════
const API_BASE =
  import.meta.env.VITE_API_URL || "https://themiahshohag.vercel.app/";

// ════════��══════════════════════════════════════════════════════
//  ZOD SCHEMA — level removed
// ═══════════════════════════════════════════════════════════════
const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

// ═══════════════════════════════════════════════════════════════
//  DEFAULT VALUES — level removed
// ═══════════════════════════════════════════════════════════════
const DEFAULT_VALUES = {
  name: "",
  category: "frontend",
  iconName: "FaReact",
  color: "#61DAFB",
  order: 0,
};

// ═══════════════════════════════════════════════════════════════
//  ICON REGISTRY
// ═══════════════════════════════════════════════════════════════
export const SKILL_ICON_REGISTRY = [
  // Frontend
  {
    name: "FaReact",
    component: <FaReact />,
    color: "#61DAFB",
    category: "Frontend",
  },
  {
    name: "SiNextdotjs",
    component: <SiNextdotjs />,
    color: "#a8b3c9",
    category: "Frontend",
  },
  {
    name: "SiJavascript",
    component: <SiJavascript />,
    color: "#F7DF1E",
    category: "Frontend",
  },
  {
    name: "SiTypescript",
    component: <SiTypescript />,
    color: "#3178C6",
    category: "Frontend",
  },
  {
    name: "SiTailwindcss",
    component: <SiTailwindcss />,
    color: "#06B6D4",
    category: "Frontend",
  },
  {
    name: "SiRedux",
    component: <SiRedux />,
    color: "#764ABC",
    category: "Frontend",
  },
  {
    name: "FaVuejs",
    component: <FaVuejs />,
    color: "#42B883",
    category: "Frontend",
  },
  {
    name: "FaSass",
    component: <FaSass />,
    color: "#CC6699",
    category: "Frontend",
  },
  {
    name: "SiFramer",
    component: <SiFramer />,
    color: "#0055FF",
    category: "Frontend",
  },
  {
    name: "SiStyledcomponents",
    component: <SiStyledcomponents />,
    color: "#DB7093",
    category: "Frontend",
  },
  {
    name: "SiVite",
    component: <SiVite />,
    color: "#646CFF",
    category: "Frontend",
  },
  {
    name: "SiFigma",
    component: <SiFigma />,
    color: "#F24E1E",
    category: "Frontend",
  },
  {
    name: "SiAdobexd",
    component: <SiAdobexd />,
    color: "#FF61F6",
    category: "Frontend",
  },
  // Backend
  {
    name: "FaNodeJs",
    component: <FaNodeJs />,
    color: "#339933",
    category: "Backend",
  },
  {
    name: "SiExpress",
    component: <SiExpress />,
    color: "#a8b3c9",
    category: "Backend",
  },
  {
    name: "SiPostman",
    component: <SiPostman />,
    color: "#FF6C37",
    category: "Backend",
  },
  {
    name: "SiMongodb",
    component: <SiMongodb />,
    color: "#47A248",
    category: "Backend",
  },
  {
    name: "SiFirebase",
    component: <SiFirebase />,
    color: "#FFCA28",
    category: "Backend",
  },
  {
    name: "SiPostgresql",
    component: <SiPostgresql />,
    color: "#4169E1",
    category: "Backend",
  },
  {
    name: "SiMysql",
    component: <SiMysql />,
    color: "#4479A1",
    category: "Backend",
  },
  {
    name: "SiGraphql",
    component: <SiGraphql />,
    color: "#E10098",
    category: "Backend",
  },
  {
    name: "SiPrisma",
    component: <SiPrisma />,
    color: "#2D3748",
    category: "Backend",
  },
  {
    name: "SiSupabase",
    component: <SiSupabase />,
    color: "#3ECF8E",
    category: "Backend",
  },
  {
    name: "FaPython",
    component: <FaPython />,
    color: "#3776AB",
    category: "Backend",
  },
  // Tools
  {
    name: "FaGitAlt",
    component: <FaGitAlt />,
    color: "#F05032",
    category: "Tools",
  },
  { name: "SiGit", component: <SiGit />, color: "#F05032", category: "Tools" },
  {
    name: "SiDocker",
    component: <SiDocker />,
    color: "#2496ED",
    category: "Tools",
  },
  {
    name: "SiKubernetes",
    component: <SiKubernetes />,
    color: "#326CE5",
    category: "Tools",
  },
  {
    name: "TbBrandAws",
    component: <TbBrandAws />,
    color: "#FF9900",
    category: "Tools",
  },
  {
    name: "SiVercel",
    component: <SiVercel />,
    color: "#a8b3c9",
    category: "Tools",
  },
  {
    name: "SiNetlify",
    component: <SiNetlify />,
    color: "#00C7B7",
    category: "Tools",
  },
  {
    name: "SiLinux",
    component: <SiLinux />,
    color: "#FCC624",
    category: "Tools",
  },
  {
    name: "SiWebpack",
    component: <SiWebpack />,
    color: "#8DD6F9",
    category: "Tools",
  },
  {
    name: "SiJest",
    component: <SiJest />,
    color: "#C21325",
    category: "Tools",
  },
  {
    name: "SiCypress",
    component: <SiCypress />,
    color: "#17202C",
    category: "Tools",
  },
  {
    name: "TbBrandGithub",
    component: <TbBrandGithub />,
    color: "#a8b3c9",
    category: "Tools",
  },
];

const ICON_CATEGORIES = ["All", "Frontend", "Backend", "Tools"];
const SKILL_CATEGORIES = [
  { id: "frontend", label: "Frontend", icon: <FaReact /> },
  { id: "backend", label: "Backend", icon: <FaNodeJs /> },
];
const PRESET_COLORS = [
  "#61DAFB",
  "#F7DF1E",
  "#3178C6",
  "#06B6D4",
  "#339933",
  "#47A248",
  "#764ABC",
  "#FF6C37",
  "#F05032",
  "#FFCA28",
];

// ═══════════════════════════════════════════════════════════════
//  ICON RENDERER  (exported — used in Skills.jsx)
// ═══════════════════════════════════════════════════════════════
export const SkillIconRenderer = ({ name, color, size = 20 }) => {
  const found = SKILL_ICON_REGISTRY.find((i) => i.name === name);
  if (!found)
    return <FaReact size={size} style={{ color: color || "var(--brand)" }} />;
  return (
    <span
      style={{ color: color || found.color || "var(--brand)", fontSize: size }}
    >
      {found.component}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════
const inputCls = (hasError = false) =>
  `w-full bg-secondary border rounded-xl py-2.5 px-4 text-sm text-foreground
   placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-200
   ${
     hasError
       ? "border-destructive/60 focus:ring-2 focus:ring-destructive/20"
       : "border-border hover:border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
   }`;

const FieldError = ({ error }) =>
  error ? (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-[10px] text-destructive ml-1 mt-1 font-mono"
    >
      {error.message}
    </motion.p>
  ) : null;

const FormField = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 font-mono ml-0.5">
      {label}
    </label>
    {children}
    <FieldError error={error} />
  </div>
);

const SectionCard = ({ icon: Icon, title, tag, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    className="relative rounded-2xl border border-border bg-card overflow-hidden"
  >
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/30">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Icon size={14} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground font-mono">
          {title}
        </span>
      </div>
      {tag && (
        <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground font-mono">
          {tag}
        </span>
      )}
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
//  SKILL PREVIEW CARD — matches new pill design (no ring/level)
// ═══════════════════════════════════════════════════════════════
const SkillPreviewCard = ({ name, iconName, color }) => (
  <motion.div
    layout
    className="group flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-card
      cursor-default transition-all duration-200 relative overflow-hidden min-w-[160px]"
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = `color-mix(in oklch, ${color} 50%, transparent)`;
      e.currentTarget.style.boxShadow = `0 6px 24px color-mix(in oklch, ${color} 20%, transparent)`;
      e.currentTarget.style.background = `color-mix(in oklch, ${color} 7%, var(--card))`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "";
      e.currentTarget.style.boxShadow = "";
      e.currentTarget.style.background = "";
    }}
  >
    {/* Color wash */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style={{
        background: `radial-gradient(ellipse at 0% 50%, color-mix(in oklch, ${color} 12%, transparent), transparent 70%)`,
      }}
    />
    {/* Icon box */}
    <div
      className="relative w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{
        background: `color-mix(in oklch, ${color} 14%, transparent)`,
        border: `1px solid color-mix(in oklch, ${color} 22%, transparent)`,
      }}
    >
      <SkillIconRenderer name={iconName} color={color} size={14} />
    </div>
    {/* Name */}
    <span className="relative text-[12px] font-bold tracking-wide text-muted-foreground group-hover:text-foreground transition-colors duration-200">
      {name || "Skill Name"}
    </span>
  </motion.div>
);

// ════════════════════════════════════════════════���══════════════
//  SPOTLIGHT PREVIEW — mini version of the wall
// ═══════════════════════════════════════════════════════════════
const SpotlightPreview = ({ name, iconName, color }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = SKILL_ICON_REGISTRY.find((i) => i.name === iconName)?.component;

  return (
    <div className="p-4 rounded-2xl border border-border bg-card/50">
      <p className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground/30 mb-4 text-center">
        As seen in Spotlight Wall
      </p>
      <div className="flex justify-center">
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          className="relative flex flex-col items-center justify-center gap-2.5 py-6 px-8 rounded-2xl border cursor-default overflow-hidden"
          style={{ borderColor: "var(--border)", background: "var(--card)" }}
          animate={{
            background: hovered
              ? `color-mix(in oklch, ${color} 10%, var(--card))`
              : "var(--card)",
            borderColor: hovered
              ? `color-mix(in oklch, ${color} 40%, transparent)`
              : "var(--border)",
          }}
        >
          {/* Glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: `radial-gradient(60px at 50% 45%, color-mix(in oklch, ${color} 25%, transparent), transparent)`,
            }}
          />

          {/* Icon */}
          <motion.div
            animate={{
              y: hovered ? -4 : 0,
              scale: hovered ? 1.2 : 1,
              filter: hovered ? `drop-shadow(0 0 8px ${color})` : "none",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative z-10 text-[28px]"
            style={{
              color: hovered
                ? color
                : `color-mix(in oklch, ${color} 45%, var(--muted-foreground))`,
            }}
          >
            <SkillIconRenderer
              name={iconName}
              color={
                hovered ? color : `color-mix(in oklch, ${color} 45%, gray)`
              }
              size={28}
            />
          </motion.div>

          {/* Name */}
          <motion.span
            animate={{
              opacity: hovered ? 1 : 0.45,
              color: hovered ? color : "var(--muted-foreground)",
            }}
            className="relative z-10 text-[10px] font-black uppercase tracking-widest font-mono"
          >
            {name || "Skill"}
          </motion.span>

          {/* Bottom accent */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] rounded-full"
            animate={{
              width: hovered ? "60%" : "0%",
              opacity: hovered ? 1 : 0,
            }}
            style={{ background: color }}
          />
        </motion.div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  ICON PICKER MODAL
// ═══════════════════════════════════════════════════════════════
const IconPickerModal = ({ value, onSelect, onClose }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filtered = useMemo(
    () =>
      SKILL_ICON_REGISTRY.filter((icon) => {
        const matchQuery = icon.name
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchCategory = category === "All" || icon.category === category;
        return matchQuery && matchCategory;
      }),
    [query, category],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative bg-card border border-border rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <FiSearch size={13} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground font-mono">
                Icon Picker
              </p>
              <p className="text-[8px] text-muted-foreground/40 font-mono">
                {filtered.length} icons available
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-secondary border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <FiX size={13} />
          </motion.button>
        </div>

        {/* Search */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <FiSearch
              size={13}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
            />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search icons... e.g. react, mongo, docker"
              className="w-full pl-9 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-1.5 px-6 py-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {ICON_CATEGORIES.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] font-mono transition-all ${
                  !isActive
                    ? "bg-secondary text-muted-foreground hover:text-foreground"
                    : ""
                }`}
                style={
                  isActive
                    ? {
                        background: "var(--brand)",
                        color: "var(--brand-fg, #fff)",
                      }
                    : {}
                }
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Icon grid */}
        <div className="px-6 pb-6 pt-1 max-h-72 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <FiAlertCircle size={22} className="text-muted-foreground/30" />
              <p className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
                No icons match "{query}"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-8 gap-1.5">
              {filtered.map((icon) => {
                const isSelected = value === icon.name;
                return (
                  <motion.button
                    key={icon.name}
                    type="button"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    title={icon.name}
                    onClick={() => {
                      onSelect(icon);
                      onClose();
                    }}
                    className={`aspect-square flex items-center justify-center rounded-xl text-lg border transition-all ${
                      !isSelected
                        ? "bg-secondary border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        : ""
                    }`}
                    style={
                      isSelected
                        ? {
                            background: "var(--brand)",
                            color: "var(--brand-fg, #fff)",
                            borderColor: "transparent",
                            boxShadow: "0 0 12px var(--brand-glow)",
                          }
                        : { color: icon.color }
                    }
                  >
                    {icon.component}
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ═══════��═══════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════��═══
const AddSkill = () => {
  const [pickerOpen, setPickerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(createSkillSchema),
  });

  const watchedName = watch("name");
  const watchedCategory = watch("category");
  const watchedIconName = watch("iconName");
  const watchedColor = watch("color");

  // ── Submit ─────────────────────────────────────────────────
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${API_BASE}/api/skills`, data, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Skill published!");
        reset(DEFAULT_VALUES);
      }
    } catch (err) {
      const resData = err.response?.data;
      if (resData?.errors?.length) {
        resData.errors.forEach(({ field, message }) => {
          toast.error(`${field}: ${message}`);
        });
      }
      toast.error(resData?.message || "Failed to publish skill.");
    }
  };

  return (
    <section className="py-8 min-h-screen text-foreground bg-background">
      <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-6">
        <PageHeader title="Add New Skill" />

        <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
          {/* ══ FORM COLUMN ══════════════════════════════════ */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            {/* ── Skill Identity ──────────────────────────── */}
            <SectionCard icon={FiZap} title="Skill Identity" tag="Required">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Skill Name" error={errors.name}>
                  <input
                    {...register("name")}
                    placeholder="e.g. React, Node.js"
                    className={inputCls(!!errors.name)}
                  />
                </FormField>

                <FormField label="Category" error={errors.category}>
                  <div className="relative">
                    <select
                      {...register("category")}
                      className={`${inputCls(!!errors.category)} appearance-none cursor-pointer pr-9`}
                    >
                      {SKILL_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none text-xs">
                      ▾
                    </span>
                  </div>
                </FormField>
              </div>

              {/* Order field */}
              <div className="mt-4">
                <FormField
                  label="Display Order (optional)"
                  error={errors.order}
                >
                  <input
                    type="number"
                    min={0}
                    {...register("order", { valueAsNumber: true })}
                    placeholder="0"
                    className={inputCls(!!errors.order)}
                  />
                </FormField>
                <p className="text-[9px] font-mono text-muted-foreground/30 uppercase tracking-widest mt-1.5 ml-1">
                  Lower number = appears first in the grid
                </p>
              </div>
            </SectionCard>

            {/* ── Icon & Color ─────────────────────────────── */}
            <SectionCard icon={FiSearch} title="Icon & Color" tag="Required">
              <div className="space-y-4">
                <input type="hidden" {...register("iconName")} />

                {/* Picker trigger */}
                <FormField label="Select Icon" error={errors.iconName}>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setPickerOpen(true)}
                    className="w-full flex items-center gap-4 px-4 py-3.5 bg-secondary border border-border rounded-xl hover:border-primary/40 transition-all group"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `color-mix(in oklch, ${watchedColor} 15%, transparent)`,
                        border: `1px solid color-mix(in oklch, ${watchedColor} 30%, transparent)`,
                        color: watchedColor,
                      }}
                    >
                      <SkillIconRenderer
                        name={watchedIconName}
                        color={watchedColor}
                        size={20}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-xs font-bold text-foreground font-mono">
                        {watchedIconName}
                      </p>
                      <p className="text-[9px] text-muted-foreground/40 font-mono mt-0.5 uppercase tracking-widest">
                        {SKILL_ICON_REGISTRY.length} icons available — click to
                        browse
                      </p>
                    </div>
                    <FiSearch
                      size={14}
                      className="text-muted-foreground/40 group-hover:text-primary transition-colors"
                    />
                  </motion.button>
                </FormField>

                {/* Quick row */}
                <div className="flex gap-1.5 flex-wrap">
                  {SKILL_ICON_REGISTRY.slice(0, 10).map((icon) => (
                    <motion.button
                      key={icon.name}
                      type="button"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      title={icon.name}
                      onClick={() => {
                        setValue("iconName", icon.name, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue("color", icon.color, { shouldDirty: true });
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm border transition-all"
                      style={
                        watchedIconName === icon.name
                          ? {
                              background: "var(--brand)",
                              color: "var(--brand-fg,#fff)",
                              borderColor: "transparent",
                              boxShadow: "0 0 10px var(--brand-glow)",
                            }
                          : {
                              color: icon.color,
                              borderColor: "var(--border)",
                              background: "var(--secondary)",
                            }
                      }
                    >
                      {icon.component}
                    </motion.button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-black font-mono bg-secondary border border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
                  >
                    +{SKILL_ICON_REGISTRY.length - 10}
                  </button>
                </div>

                {/* Color */}
                <input type="hidden" {...register("color")} />
                <FormField label="Icon Color (Hex)" error={errors.color}>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={watchedColor}
                      onChange={(e) =>
                        setValue("color", e.target.value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      className="w-10 h-10 rounded-xl border border-border cursor-pointer bg-transparent p-0.5"
                    />
                    <input
                      type="text"
                      value={watchedColor}
                      onChange={(e) =>
                        setValue("color", e.target.value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      placeholder="#61DAFB"
                      className={`${inputCls(!!errors.color)} font-mono`}
                    />
                  </div>
                  {/* Presets */}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {PRESET_COLORS.map((c) => (
                      <motion.button
                        key={c}
                        type="button"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          setValue("color", c, {
                            shouldDirty: true,
                            shouldValidate: true,
                          })
                        }
                        className="w-5 h-5 rounded-md border-2 transition-all"
                        style={{
                          background: c,
                          borderColor:
                            watchedColor === c
                              ? "var(--foreground)"
                              : "transparent",
                          boxShadow:
                            watchedColor === c ? `0 0 8px ${c}60` : "none",
                        }}
                      />
                    ))}
                  </div>
                </FormField>
              </div>
            </SectionCard>

            {/* ── Footer / Save bar ────────────────────────── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-2.5">
                <motion.div
                  animate={isDirty ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: isDirty ? "var(--chart-3)" : "var(--chart-2)",
                  }}
                />
                <span className="text-[9px] font-black uppercase tracking-widest font-mono text-muted-foreground/50">
                  {isDirty ? "Unsaved changes" : "Ready to publish"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <AnimatePresence>
                  {isDirty && (
                    <motion.button
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      type="button"
                      onClick={() => reset(DEFAULT_VALUES)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-secondary text-[10px] font-bold uppercase tracking-widest font-mono text-muted-foreground hover:text-foreground transition-all"
                    >
                      <LuRotateCcw size={12} /> Discard
                    </motion.button>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.97 } : {}}
                  className="relative flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest font-mono shadow-lg transition-all overflow-hidden disabled:opacity-50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <LuLoader size={13} className="animate-spin" />{" "}
                        Publishing...
                      </>
                    ) : (
                      <>
                        <FiSave size={13} /> Publish Skill
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </form>

          {/* ══ PREVIEW COLUMN ═══════════════════════════════ */}
          <div className="lg:sticky lg:top-8 space-y-4">
            <div className="flex items-center gap-3 px-1">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 font-mono">
                Live Preview
              </span>
              <div className="flex-1 h-[1px] bg-border/50" />
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--chart-2)" }}
              />
            </div>

            {/* Pill preview */}
            <div className="p-6 rounded-2xl border border-border bg-card/50">
              <p className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground/30 mb-4 text-center">
                Pill style
              </p>
              <div className="flex justify-center">
                <SkillPreviewCard
                  name={watchedName}
                  iconName={watchedIconName}
                  color={watchedColor}
                />
              </div>
            </div>

            {/* Spotlight preview */}
            <SpotlightPreview
              name={watchedName}
              iconName={watchedIconName}
              color={watchedColor}
            />

            {/* Category badge */}
            <div className="p-4 rounded-xl border border-border bg-secondary/20">
              <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40 mb-2">
                Will appear in
              </p>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest font-mono w-fit"
                style={{
                  background: "var(--brand)",
                  color: "var(--brand-fg, #fff)",
                }}
              >
                <span className="text-base">
                  {SKILL_CATEGORIES.find((c) => c.id === watchedCategory)?.icon}
                </span>
                {SKILL_CATEGORIES.find((c) => c.id === watchedCategory)?.label}
              </div>
            </div>

            {/* Tip */}
            <div
              className="p-5 rounded-xl border"
              style={{
                borderColor:
                  "color-mix(in oklch, var(--brand) 20%, transparent)",
                backgroundColor:
                  "color-mix(in oklch, var(--brand) 5%, transparent)",
              }}
            >
              <p
                className="text-[9px] font-mono uppercase tracking-widest mb-2"
                style={{ color: "var(--brand)" }}
              >
                Tip
              </p>
              <p className="text-[10px] text-muted-foreground/60 leading-relaxed font-mono">
                Pick an icon whose color matches the technology's official brand
                color for the best look in the spotlight wall.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Icon Picker Modal */}
      <AnimatePresence>
        {pickerOpen && (
          <IconPickerModal
            value={watchedIconName}
            onSelect={(icon) => {
              setValue("iconName", icon.name, {
                shouldDirty: true,
                shouldValidate: true,
              });
              setValue("color", icon.color, { shouldDirty: true });
            }}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default AddSkill;
