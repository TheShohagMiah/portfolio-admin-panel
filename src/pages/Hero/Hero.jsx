import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSave,
  FiExternalLink,
  FiActivity,
  FiLink,
  FiType,
} from "react-icons/fi";
import {
  MdOutlineWork,
  MdOutlineDoNotDisturb,
  MdOutlineWorkOff,
} from "react-icons/md";
import { LuLoader, LuRotateCcw } from "react-icons/lu";
import axios from "axios";
import { toast } from "react-hot-toast";
import PageHeader from "../../components/shared/PageHeader";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://themiahshohag.vercel.app/";

// ═════════���═════════════════════════════════════════════════════
//  INPUT CLASS
// ═══════════════════════════════════════════════════════════════
export const inputCls = (hasError = false) =>
  `w-full bg-secondary border rounded-xl py-3 px-4 text-sm text-foreground
   placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-200
   ${
     hasError
       ? "border-destructive/60 focus:ring-2 focus:ring-destructive/20"
       : "border-border hover:border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
   }`;

// ═══════════════════════════════════════════════════════════════
//  FORM FIELD
// ═══════════════════════════════════════════════════════════════
const FormField = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 font-mono ml-0.5">
      {label}
    </label>
    {children}
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[10px] text-destructive ml-1 mt-1 font-mono"
      >
        {error}
      </motion.p>
    )}
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  SECTION CARD
// ═══════════════════════════════════════════════════════════════
const SectionCard = ({ icon: Icon, title, tag, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    className="relative rounded-2xl border border-border bg-card overflow-hidden"
  >
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border bg-secondary/30">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
          <Icon size={14} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground font-mono">
          {title}
        </span>
      </div>
      {tag && (
        <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground font-mono flex-shrink-0">
          {tag}
        </span>
      )}
    </div>
    <div className="p-4 sm:p-6">{children}</div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
//  ACTION CARD (CTA)
// ═══════════════════════════════════════════════════════════════
const ActionCard = ({ title, chartVar, children }) => (
  <div className="relative rounded-xl border border-border bg-secondary/20 overflow-hidden">
    <div
      className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
      style={{ background: `var(${chartVar})`, opacity: 0.6 }}
    />
    <div className="px-4 sm:px-5 pt-4 pb-5">
      <div className="flex items-center gap-2 mb-4">
        <span
          className="text-[8px] font-black uppercase tracking-[0.3em] font-mono"
          style={{ color: `var(${chartVar})` }}
        >
          {title}
        </span>
        <div
          className="flex-1 h-[1px]"
          style={{
            background: `linear-gradient(90deg, color-mix(in oklch, var(${chartVar}) 40%, transparent), transparent)`,
          }}
        />
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  CHAR RING
// ═══════════════════════════════════════════════════════════════
const CharRing = ({ current, max }) => {
  const pct = Math.min(current / max, 1);
  const r = 10;
  const c = 2 * Math.PI * r;
  const danger = pct > 0.85;
  return (
    <div className="relative w-8 h-8 flex-shrink-0">
      <svg viewBox="0 0 24 24" className="-rotate-90 w-full h-full">
        <circle
          cx="12"
          cy="12"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-border"
        />
        <motion.circle
          cx="12"
          cy="12"
          r={r}
          fill="none"
          stroke={danger ? "var(--destructive)" : "var(--primary)"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c - pct * c }}
          transition={{ duration: 0.3 }}
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center text-[7px] font-black font-mono ${danger ? "text-destructive" : "text-muted-foreground"}`}
      >
        {max - current}
      </span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  STATUS OPTIONS
// ═══════════════════════════════════════════════════════════════
const STATUS_OPTIONS = [
  {
    value: "available",
    label: "Available",
    icon: <MdOutlineWork size={13} />,
    chartVar: "--chart-2",
  },
  {
    value: "busy",
    label: "Busy",
    icon: <MdOutlineDoNotDisturb size={13} />,
    chartVar: "--chart-3",
  },
  {
    value: "unavailable",
    label: "Unavailable",
    icon: <MdOutlineWorkOff size={13} />,
    chartVar: "--chart-5",
  },
];

// ═══════════════════════════════════════════════════════════════
//  STATUS SELECTOR
// ═══════════════════════════════════════════════════════════════
const StatusSelector = ({ value, onChange }) => (
  <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2">
    {STATUS_OPTIONS.map((opt) => {
      const isSelected = value === opt.value;
      return (
        <motion.button
          key={opt.value}
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChange(opt.value)}
          className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest font-mono transition-all duration-200"
          style={
            isSelected
              ? {
                  color: `var(${opt.chartVar})`,
                  borderColor: `color-mix(in oklch, var(${opt.chartVar}) 35%, transparent)`,
                  backgroundColor: `color-mix(in oklch, var(${opt.chartVar}) 10%, transparent)`,
                }
              : {
                  color: "var(--muted-foreground)",
                  borderColor: "var(--border)",
                  backgroundColor: "transparent",
                }
          }
        >
          {opt.icon}
          <span className="hidden xs:inline sm:inline">{opt.label}</span>
          {isSelected && (
            <motion.span
              layoutId="hero-status-dot"
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: `var(${opt.chartVar})` }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </motion.button>
      );
    })}
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  LOADING SCREEN
// ═══════════════════════════════════════════════════════════════
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-6">
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
        Loading Hero Config
      </p>
      <p className="text-[8px] text-muted-foreground/30 font-mono uppercase tracking-widest">
        Connecting to system core...
      </p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════
const HeroManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const lastSavedData = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({ defaultValues: { freelanceStatus: "available" } });

  const description = watch("description", "");
  const freelanceStatus = watch("freelanceStatus", "available");
  const MAX_DESC = 160;

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_BASE}/api/hero`);
        const payload = res.data?.data;
        if (payload) {
          reset(payload);
          lastSavedData.current = payload;
        }
      } catch {
        toast.error("Failed to connect to the System Core");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.patch(`${API_BASE}/api/hero/update`, data, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        reset(res.data.data);
        lastSavedData.current = res.data.data;
        setLastSaved(new Date());
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Transmission Interrupted");
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <section className="py-6 sm:py-8 text-foreground bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-6">
        <PageHeader title="Hero Management" />

        {/* ── Unsaved changes banner ───────────────────────── */}
        <AnimatePresence>
          {isDirty && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center justify-between px-4 py-3 rounded-xl border"
              style={{
                borderColor:
                  "color-mix(in oklch, var(--chart-3) 30%, transparent)",
                backgroundColor:
                  "color-mix(in oklch, var(--chart-3) 5%,  transparent)",
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "var(--chart-3)" }}
                />
                <span
                  className="text-[10px] font-bold uppercase tracking-widest font-mono truncate"
                  style={{ color: "var(--chart-3)" }}
                >
                  Unsaved changes
                </span>
              </div>
              <button
                type="button"
                onClick={() => reset(lastSavedData.current)}
                className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest font-mono text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 ml-3"
              >
                <LuRotateCcw size={10} />
                <span className="hidden xs:inline">Discard</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Last saved ───────────────────────────────────── */}
        {lastSaved && !isDirty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-1"
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "var(--chart-2)" }}
            />
            <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest">
              Saved at {lastSaved.toLocaleTimeString()}
            </span>
          </motion.div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          {/* ══ SECTION 1 — Headline Content ══════════════════ */}
          <SectionCard
            icon={FiType}
            title="Headline Content"
            tag="Required"
            delay={0}
          >
            <div className="space-y-4 sm:space-y-5">
              {/* ✅ Stack on mobile, side-by-side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Main Title" error={errors.title?.message}>
                  <input
                    {...register("title", { required: "Title is required" })}
                    placeholder="e.g. Full Stack Developer"
                    className={inputCls(!!errors.title)}
                  />
                </FormField>
                <FormField label="Sub Title" error={errors.subTitle?.message}>
                  <input
                    {...register("subTitle", {
                      required: "Sub title is required",
                    })}
                    placeholder="e.g. Building digital experiences"
                    className={inputCls(!!errors.subTitle)}
                  />
                </FormField>
              </div>

              {/* Description */}
              <FormField
                label="Introduction"
                error={errors.description?.message}
              >
                <div className="relative">
                  <textarea
                    rows={4}
                    {...register("description", {
                      required: "Introduction is required",
                      maxLength: {
                        value: MAX_DESC,
                        message: `Max ${MAX_DESC} characters`,
                      },
                    })}
                    placeholder="Write a short, compelling introduction..."
                    className={`${inputCls(!!errors.description)} resize-none pr-12`}
                  />
                  <div className="absolute bottom-3 right-3">
                    <CharRing current={description.length} max={MAX_DESC} />
                  </div>
                </div>
                <p className="text-[9px] text-muted-foreground/40 font-mono mt-1 ml-1">
                  {description.length}/{MAX_DESC} characters
                </p>
              </FormField>

              {/* Availability status */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 font-mono ml-0.5">
                  Availability Status
                </label>
                <input type="hidden" {...register("freelanceStatus")} />
                <StatusSelector
                  value={freelanceStatus}
                  onChange={(val) =>
                    setValue("freelanceStatus", val, {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    })
                  }
                />
              </div>
            </div>
          </SectionCard>

          {/* ══ SECTION 2 — CTA Buttons ═══════════════════════ */}
          <SectionCard
            icon={FiExternalLink}
            title="Action Triggers"
            tag="CTAs"
            delay={0.08}
          >
            {/* ✅ Stack on mobile, side-by-side on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ActionCard title="Primary CTA" chartVar="--chart-1">
                <FormField label="Button Label" error={errors.ctaText?.message}>
                  <input
                    {...register("ctaText")}
                    placeholder="e.g. View My Work"
                    className={inputCls(!!errors.ctaText)}
                  />
                </FormField>
                <FormField label="Endpoint URL" error={errors.ctaLink?.message}>
                  <div className="relative">
                    <FiLink
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"
                    />
                    <input
                      {...register("ctaLink")}
                      placeholder="https://..."
                      className={`${inputCls(!!errors.ctaLink)} pl-9`}
                    />
                  </div>
                </FormField>
              </ActionCard>

              <ActionCard title="Secondary CTA" chartVar="--chart-4">
                <FormField
                  label="Button Label"
                  error={errors.downloadText?.message}
                >
                  <input
                    {...register("downloadText")}
                    placeholder="e.g. Download CV"
                    className={inputCls(!!errors.downloadText)}
                  />
                </FormField>
                <FormField
                  label="Resource URL"
                  error={errors.downloadLink?.message}
                >
                  <div className="relative">
                    <FiLink
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"
                    />
                    <input
                      {...register("downloadLink")}
                      placeholder="https://..."
                      className={`${inputCls(!!errors.downloadLink)} pl-9`}
                    />
                  </div>
                </FormField>
              </ActionCard>
            </div>
          </SectionCard>

          {/* ══ FOOTER — Save / Discard ════════════════════════ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-3 px-4 sm:px-6 py-4 rounded-2xl border border-border bg-card"
          >
            {/* Status */}
            <div className="flex items-center gap-2">
              <FiActivity
                size={13}
                className="text-muted-foreground/40 flex-shrink-0"
              />
              <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest">
                {isDirty ? "Pending changes" : "All changes saved"}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <AnimatePresence>
                {isDirty && (
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    type="button"
                    onClick={() => reset(lastSavedData.current)}
                    disabled={isSubmitting}
                    className="flex flex-1 xs:flex-none items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-secondary
                      text-[10px] font-bold uppercase tracking-widest font-mono
                      text-muted-foreground hover:text-foreground transition-all"
                  >
                    <LuRotateCcw size={12} /> Discard
                  </motion.button>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isSubmitting || !isDirty}
                whileHover={!isSubmitting && isDirty ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting && isDirty ? { scale: 0.97 } : {}}
                className="flex flex-1 xs:flex-none items-center justify-center gap-2.5 px-5 sm:px-6 py-2.5 rounded-xl
                  bg-primary text-primary-foreground text-[10px] font-black uppercase
                  tracking-widest font-mono shadow-lg transition-all overflow-hidden relative
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <LuLoader size={13} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={13} /> Save Changes
                    </>
                  )}
                </span>
              </motion.button>
            </div>
          </motion.div>
        </form>
      </div>
    </section>
  );
};

export default HeroManagement;
