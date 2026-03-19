import React, { useState, useMemo, useRef, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLayout,
  FiServer,
  FiLayers,
  FiZap,
  FiCode,
  FiSave,
  FiPlus,
  FiX,
  FiSearch,
  FiGrid,
  FiBox,
  FiMonitor,
  FiSmartphone,
  FiDatabase,
  FiCloud,
  FiShield,
  FiCpu,
  FiGlobe,
  FiMail,
  FiSettings,
  FiTool,
  FiTerminal,
  FiPackage,
  FiTrendingUp,
  FiBarChart2,
  FiPieChart,
  FiActivity,
  FiCamera,
  FiImage,
  FiMusic,
  FiHeadphones,
  FiWifi,
  FiAnchor,
  FiAlertCircle,
  FiCode as FiInlineCode,
} from "react-icons/fi";
import {
  MdDesignServices,
  MdOutlineAnalytics,
  MdOutlineIntegrationInstructions,
  MdOutlineAutoAwesome,
  MdOutlineDashboard,
  MdOutlineApi,
  MdOutlineScience,
  MdOutlineRocketLaunch,
  MdOutlineStorage,
  MdOutlineSecurity,
  MdOutlineSpeed,
  MdOutlinePalette,
} from "react-icons/md";
import {
  LuBrainCircuit,
  LuBot,
  LuNetwork,
  LuWorkflow,
  LuGitBranch,
  LuSparkles,
  LuBlocks,
  LuConstruction,
  LuFlame,
  LuAtom,
  LuLoader,
  LuRotateCcw,
} from "react-icons/lu";
import {
  TbApi,
  TbBrandReact,
  TbBrandNodejs,
  TbBrandDocker,
  TbBrandFigma,
  TbBrandGithub,
  TbChartDots,
  TbDeviceDesktop,
  TbTestPipe,
  TbBulb,
  TbRocket,
  TbBrandAws,
} from "react-icons/tb";
import axios from "axios";
import toast from "react-hot-toast";
import PageHeader from "../../components/shared/PageHeader";

// ═══════════════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════════════
const API_BASE =
  import.meta.env.VITE_API_URL || "https://themiahshohag.vercel.app/";

// ═══════════════════════════════════════════════════════════════
//  ICON REGISTRY
// ═══════════════════════════════════════════════════════════════
export const ICON_REGISTRY = [
  // Dev
  { name: "FiCode", component: <FiCode />, category: "Dev" },
  { name: "FiTerminal", component: <FiTerminal />, category: "Dev" },
  { name: "FiCpu", component: <FiCpu />, category: "Dev" },
  { name: "TbBrandReact", component: <TbBrandReact />, category: "Dev" },
  { name: "TbBrandNodejs", component: <TbBrandNodejs />, category: "Dev" },
  { name: "TbBrandDocker", component: <TbBrandDocker />, category: "Dev" },
  { name: "TbBrandGithub", component: <TbBrandGithub />, category: "Dev" },
  { name: "TbBrandAws", component: <TbBrandAws />, category: "Dev" },
  { name: "TbApi", component: <TbApi />, category: "Dev" },
  { name: "MdOutlineApi", component: <MdOutlineApi />, category: "Dev" },
  { name: "LuGitBranch", component: <LuGitBranch />, category: "Dev" },
  { name: "LuWorkflow", component: <LuWorkflow />, category: "Dev" },
  {
    name: "MdOutlineIntegrationInstructions",
    component: <MdOutlineIntegrationInstructions />,
    category: "Dev",
  },
  // Design
  { name: "FiLayout", component: <FiLayout />, category: "Design" },
  { name: "FiGrid", component: <FiGrid />, category: "Design" },
  { name: "FiBox", component: <FiBox />, category: "Design" },
  { name: "FiMonitor", component: <FiMonitor />, category: "Design" },
  { name: "FiSmartphone", component: <FiSmartphone />, category: "Design" },
  { name: "TbBrandFigma", component: <TbBrandFigma />, category: "Design" },
  {
    name: "MdOutlinePalette",
    component: <MdOutlinePalette />,
    category: "Design",
  },
  {
    name: "MdDesignServices",
    component: <MdDesignServices />,
    category: "Design",
  },
  {
    name: "MdOutlineAutoAwesome",
    component: <MdOutlineAutoAwesome />,
    category: "Design",
  },
  { name: "LuSparkles", component: <LuSparkles />, category: "Design" },
  // AI
  { name: "LuBrainCircuit", component: <LuBrainCircuit />, category: "AI" },
  { name: "LuBot", component: <LuBot />, category: "AI" },
  { name: "LuAtom", component: <LuAtom />, category: "AI" },
  { name: "MdOutlineScience", component: <MdOutlineScience />, category: "AI" },
  {
    name: "MdOutlineAnalytics",
    component: <MdOutlineAnalytics />,
    category: "AI",
  },
  { name: "TbChartDots", component: <TbChartDots />, category: "AI" },
  { name: "FiBarChart2", component: <FiBarChart2 />, category: "AI" },
  { name: "FiPieChart", component: <FiPieChart />, category: "AI" },
  { name: "FiTrendingUp", component: <FiTrendingUp />, category: "AI" },
  { name: "FiActivity", component: <FiActivity />, category: "AI" },
  // Infra
  { name: "FiServer", component: <FiServer />, category: "Infra" },
  { name: "FiDatabase", component: <FiDatabase />, category: "Infra" },
  { name: "FiCloud", component: <FiCloud />, category: "Infra" },
  { name: "FiLayers", component: <FiLayers />, category: "Infra" },
  { name: "FiPackage", component: <FiPackage />, category: "Infra" },
  { name: "LuNetwork", component: <LuNetwork />, category: "Infra" },
  { name: "LuBlocks", component: <LuBlocks />, category: "Infra" },
  {
    name: "MdOutlineStorage",
    component: <MdOutlineStorage />,
    category: "Infra",
  },
  {
    name: "MdOutlineDashboard",
    component: <MdOutlineDashboard />,
    category: "Infra",
  },
  // Ops
  { name: "FiShield", component: <FiShield />, category: "Ops" },
  { name: "FiSettings", component: <FiSettings />, category: "Ops" },
  { name: "FiTool", component: <FiTool />, category: "Ops" },
  {
    name: "MdOutlineSecurity",
    component: <MdOutlineSecurity />,
    category: "Ops",
  },
  { name: "MdOutlineSpeed", component: <MdOutlineSpeed />, category: "Ops" },
  { name: "TbTestPipe", component: <TbTestPipe />, category: "Ops" },
  { name: "LuConstruction", component: <LuConstruction />, category: "Ops" },
  { name: "TbDeviceDesktop", component: <TbDeviceDesktop />, category: "Ops" },
  // General
  { name: "FiZap", component: <FiZap />, category: "General" },
  { name: "FiGlobe", component: <FiGlobe />, category: "General" },
  { name: "FiMail", component: <FiMail />, category: "General" },
  { name: "FiWifi", component: <FiWifi />, category: "General" },
  { name: "FiAnchor", component: <FiAnchor />, category: "General" },
  { name: "LuFlame", component: <LuFlame />, category: "General" },
  { name: "TbBulb", component: <TbBulb />, category: "General" },
  { name: "TbRocket", component: <TbRocket />, category: "General" },
  {
    name: "MdOutlineRocketLaunch",
    component: <MdOutlineRocketLaunch />,
    category: "General",
  },
  { name: "FiCamera", component: <FiCamera />, category: "General" },
  { name: "FiImage", component: <FiImage />, category: "General" },
  { name: "FiMusic", component: <FiMusic />, category: "General" },
  { name: "FiHeadphones", component: <FiHeadphones />, category: "General" },
];

// ═══════════════════════════════════════════════════════════════
//  ICON RENDERER
// ═══════════════════════════════════════════════════════════════
export const IconRenderer = ({ name, className = "" }) => {
  const found = ICON_REGISTRY.find((i) => i.name === name);
  return <span className={className}>{found?.component ?? <FiLayout />}</span>;
};

const ICON_CATEGORIES = [
  "All",
  "Dev",
  "Design",
  "AI",
  "Infra",
  "Ops",
  "General",
];

// ═══════════════════════════════════════════════════════════════
//  INPUT CLASS HELPER
// ═══════════════════════════════════════════════════════════════
export const inputCls = (hasError = false) =>
  `w-full bg-secondary border rounded-xl py-2.5 px-4 text-sm text-foreground
   placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-200
   ${
     hasError
       ? "border-destructive/60 focus:ring-2 focus:ring-destructive/20"
       : "border-border hover:border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
   }`;

// ═══════════════════════════════════════════════════════════════
//  FORM FIELD WRAPPER
// ═══════════════════════════════════════════════════════════════
const FormField = ({ label, error, hint, required, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-center gap-1.5 ml-0.5">
      <label className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 font-mono">
        {label}
      </label>
      {required && (
        <span className="text-[8px] text-destructive font-black">*</span>
      )}
      {hint && (
        <span className="text-[9px] text-muted-foreground/40 font-mono">
          — {hint}
        </span>
      )}
    </div>
    {children}
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[10px] text-destructive ml-1 font-mono"
      >
        {error}
      </motion.p>
    )}
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  SECTION CARD
// ═══════════════════════════════════════════════════════════════
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
//  ICON PICKER MODAL
// ═══════════════════════════════════════════════════════════════
const IconPickerModal = ({ value, onChange, onClose }) => {
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
      ICON_REGISTRY.filter((icon) => {
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
        className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />

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
              placeholder="Search icons... e.g. react, cloud, shield"
              className="w-full pl-9 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        {/* Category pills — FIX: merged duplicate className into one */}
        <div className="flex gap-1.5 px-6 py-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {ICON_CATEGORIES.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] font-mono transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Icon Grid */}
        <div
          className="px-6 pb-6 pt-1 max-h-72 overflow-y-auto
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-thumb]:bg-border
          [&::-webkit-scrollbar-thumb]:rounded-full"
        >
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
                  // FIX: merged duplicate className + style into single className
                  <motion.button
                    key={icon.name}
                    type="button"
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    title={icon.name}
                    onClick={() => {
                      onChange(icon.name);
                      onClose();
                    }}
                    className={`aspect-square flex items-center justify-center rounded-xl text-base border transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-transparent shadow-[0_0_12px_var(--brand-glow,theme(colors.primary.DEFAULT/30%))]"
                        : "bg-secondary border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
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

// ═══════════════════════════════════════════════════════════════
//  LIVE PREVIEW CARD
// ═══════════════════════════════════════════════════════════════
const PreviewCard = ({ title, description, tags, iconName }) => (
  <motion.div
    layout
    className="group relative bg-card p-8 rounded-3xl border border-border hover:border-primary/20 transition-all duration-500 shadow-xl overflow-hidden"
  >
    {/* Ambient glow */}
    <div className="absolute -top-16 -right-16 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

    <div className="mb-6 w-12 h-12 rounded-2xl bg-secondary border border-border flex items-center justify-center text-xl text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-300">
      <IconRenderer name={iconName} />
    </div>

    <div className="space-y-2 relative z-10">
      <h3 className="text-lg font-bold text-foreground group-hover:italic transition-all">
        {title || (
          <span className="text-muted-foreground/40 italic font-normal text-sm">
            Capability title...
          </span>
        )}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed min-h-[3rem]">
        {description || (
          <span className="text-muted-foreground/30 italic text-xs">
            Service description will appear here...
          </span>
        )}
      </p>
    </div>

    {tags.some((t) => t.value) && (
      <div className="flex flex-wrap gap-1.5 mt-5 pt-5 border-t border-border relative z-10">
        {tags.map((t, i) =>
          t.value ? (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg bg-secondary text-[9px] font-bold uppercase tracking-widest text-muted-foreground border border-border"
            >
              {t.value}
            </span>
          ) : null,
        )}
      </div>
    )}
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const AddService = () => {
  const [pickerOpen, setPickerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      icon: "FiLayout",
      tags: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "tags" });
  const watchAll = watch();
  const selectedIcon = watchAll.icon;
  const descLength = watchAll.description?.length || 0;
  const MAX_DESC = 220;

  // ── Submit ────────────────────────────────────────────────
  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/services`,
        { ...data, tags: data.tags.map((t) => t.value) },
        { withCredentials: true },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        reset();
      }
    } catch (err) {
      const resData = err.response?.data;
      if (resData?.errors) {
        Object.keys(resData.errors).forEach((key) =>
          setError(key, { type: "server", message: resData.errors[key] }),
        );
      }
      toast.error(resData?.message || "Something went wrong.");
    }
  };

  // ════════════════════════════════════════════════════════════
  return (
    <section className="py-8 min-h-screen text-foreground bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-6">
        {/* ── Page Header ──────────────────────────────────── */}
        <PageHeader title="Add New Service" />

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* ════════════════════════════════════════════════
              FORM COLUMN
          ════════════════════════════════════════════════ */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4"
          >
            {/* ── Service Info ─────────────────────────────── */}
            <SectionCard icon={FiLayout} title="Service Details" tag="Required">
              <div className="space-y-4">
                <FormField
                  label="Service Title"
                  required
                  error={errors.title?.message}
                >
                  <input
                    {...register("title", { required: "Title is required" })}
                    placeholder="e.g. Full Stack Development"
                    className={inputCls(!!errors.title)}
                  />
                </FormField>

                <FormField
                  label="Scope Description"
                  required
                  error={errors.description?.message}
                >
                  <div className="relative">
                    <textarea
                      rows={3}
                      {...register("description", {
                        required: "Description is required",
                        maxLength: {
                          value: MAX_DESC,
                          message: `Max ${MAX_DESC} characters`,
                        },
                      })}
                      placeholder="Describe what this service covers..."
                      className={`${inputCls(!!errors.description)} resize-none pr-16`}
                    />
                    {/* Char count */}
                    <div className="absolute bottom-3 right-3 flex items-center">
                      <span
                        className={`text-[9px] font-black font-mono tabular-nums ${
                          descLength > MAX_DESC * 0.9
                            ? "text-destructive"
                            : "text-muted-foreground/30"
                        }`}
                      >
                        {descLength}/{MAX_DESC}
                      </span>
                    </div>
                  </div>
                </FormField>
              </div>
            </SectionCard>

            {/* ── Icon Picker ──────────────────────────────── */}
            <SectionCard icon={FiZap} title="Visual Icon" tag="Required">
              {/* Hidden field keeps value in RHF */}
              <input type="hidden" {...register("icon")} />

              <div className="space-y-3">
                {/* Picker trigger */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setPickerOpen(true)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 bg-secondary border border-border rounded-xl hover:border-primary/40 hover:bg-secondary/80 transition-all group"
                >
                  {/* Selected icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 text-primary-foreground"
                    style={{
                      background: "var(--brand, var(--primary))",
                      boxShadow:
                        "0 2px 10px var(--brand-glow, rgb(0 0 0 / 0.15))",
                    }}
                  >
                    <IconRenderer name={selectedIcon} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xs font-bold text-foreground font-mono">
                      {selectedIcon}
                    </p>
                    <p className="text-[9px] text-muted-foreground/40 font-mono mt-0.5 uppercase tracking-widest">
                      {ICON_REGISTRY.length}+ icons available
                    </p>
                  </div>
                  <FiSearch
                    size={14}
                    className="text-muted-foreground/40 group-hover:text-primary transition-colors"
                  />
                </motion.button>

                {/* Icon preview row — FIX: merged duplicate className + style into single className */}
                <div className="flex gap-1.5 px-1">
                  {ICON_REGISTRY.slice(0, 8).map((icon) => {
                    const isSelected = selectedIcon === icon.name;
                    return (
                      <motion.button
                        key={icon.name}
                        type="button"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          setValue("icon", icon.name, { shouldDirty: true })
                        }
                        title={icon.name}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-transparent"
                            : "bg-secondary border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        }`}
                      >
                        {icon.component}
                      </motion.button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-black font-mono bg-secondary border border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
                  >
                    +{ICON_REGISTRY.length - 8}
                  </button>
                </div>
              </div>
            </SectionCard>

            {/* ── Tags ─────────────────────────────────────── */}
            <SectionCard
              icon={FiLayers}
              title="Tags / Technologies"
              tag="Required"
            >
              <div className="flex flex-wrap gap-2 p-4 bg-secondary/30 rounded-xl border border-border">
                <AnimatePresence>
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="flex flex-col"
                    >
                      <div
                        className={`flex items-center bg-card rounded-xl px-3 py-2 border transition-all ${
                          errors.tags?.[index]?.value
                            ? "border-destructive/50"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <input
                          {...register(`tags.${index}.value`, {
                            required: "Required",
                          })}
                          placeholder="e.g. React"
                          className="bg-transparent text-xs font-medium focus:outline-none w-20 text-foreground placeholder:text-muted-foreground/40"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="ml-2 text-muted-foreground/40 hover:text-destructive transition-colors"
                        >
                          <FiX size={12} />
                        </button>
                      </div>
                      {errors.tags?.[index]?.value && (
                        <span className="text-[9px] text-destructive mt-1 ml-1 font-mono">
                          {errors.tags[index].value.message}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => append({ value: "" })}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-dashed border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest font-mono hover:bg-primary/5 hover:border-primary/40 transition-all"
                >
                  <FiPlus size={12} /> Add Tag
                </motion.button>
              </div>
            </SectionCard>

            {/* ── Save bar ─────────────────────────────────── */}
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
                  {isDirty ? "Unsaved changes" : "State synced"}
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
                      onClick={() => reset()}
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
                        <FiSave size={13} /> Publish Module
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </form>

          {/* ════════════════════════════════════════════════
              PREVIEW COLUMN
          ════════════════════════════════════════════════ */}
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

            <PreviewCard
              title={watchAll.title}
              description={watchAll.description}
              tags={watchAll.tags}
              iconName={watchAll.icon}
            />

            <div className="p-5 rounded-2xl bg-secondary/30 border border-border">
              <p className="text-[10px] leading-relaxed text-muted-foreground/60 font-mono">
                <span className="font-black text-primary">Note:</span>{" "}
                Publishing will update your public Services section instantly.
                Ensure tags are correctly spelled for SEO.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Icon Picker Modal ────────────────────────────── */}
      <AnimatePresence>
        {pickerOpen && (
          <IconPickerModal
            value={selectedIcon}
            onChange={(name) => setValue("icon", name, { shouldDirty: true })}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default AddService;
