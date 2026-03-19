import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiPlus,
  FiTrash2,
  FiBookOpen,
  FiActivity,
  FiSave,
  FiCpu,
  FiChevronDown,
  FiMapPin,
  FiClock,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import { LuLoader, LuRotateCcw } from "react-icons/lu";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { aboutValidationSchema } from "../../validators/about/aboutValidation";
import DeleteModal from "../../components/shared/DeleteModal";
import PageHeader from "../../components/shared/PageHeader";

// ═══════════════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════════════
const API_BASE =
  import.meta.env.VITE_API_URL || "https://themiahshohag.vercel.app/";

// ═══════════════════════════════════════════════════════════════
//  INPUT CLASS HELPER
// ═══════════════════════════════════════════════════════════════
const inputCls = (hasError = false) =>
  `w-full bg-secondary border rounded-xl py-2.5 px-4 text-sm text-foreground
   placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-200
   ${
     hasError
       ? "border-destructive/60 focus:ring-2 focus:ring-destructive/20"
       : "border-border hover:border-primary/30 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
   }`;

// ═══════════════════════════════════════════════════════════════
//  FIELD ERROR
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
//  FORM FIELD WRAPPER
// ═══════════════════════════════════════════════════════════════
const FormField = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 font-mono ml-0.5">
      {label}
    </label>
    {children}
    <FieldError error={error} />
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  SECTION CARD
// ═══════════════════════════════════════════════════════════════
const SectionCard = ({ title, icon: Icon, children, className = "" }) => (
  <div
    className={`relative bg-card border border-border rounded-3xl overflow-hidden ${className}`}
  >
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border bg-secondary/30">
      <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
        <Icon size={14} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground font-mono">
        {title}
      </span>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  FREELANCE STATUS SELECTOR — ✅ uses setValue
// ═══════════════════════════════════════════════════════════════
const STATUS_OPTIONS = [
  { value: "available", label: "Available", chartVar: "--chart-2" },
  { value: "busy", label: "Busy", chartVar: "--chart-3" },
  { value: "unavailable", label: "Unavailable", chartVar: "--chart-5" },
];

const StatusSelector = ({ value, onChange }) => (
  <div className="flex gap-2 flex-wrap">
    {STATUS_OPTIONS.map((opt) => {
      const isSelected = value === opt.value;
      return (
        <motion.button
          key={opt.value}
          type="button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChange(opt.value)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest font-mono transition-all duration-200"
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
          {isSelected && (
            <motion.span
              layoutId="status-sel-dot"
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: `var(${opt.chartVar})` }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          {opt.label}
        </motion.button>
      );
    })}
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  EDUCATION STATUSES
// ═══════════════════════════════════════════════════════════════
const EDU_STATUSES = [
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
];

// ═══════════════════════════════════════════════════════════════
//  EDUCATION CARD
// ═══════════════════════════════════════════════════════════════
const EducationCard = ({ field, index, register, errors, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: -10 }}
    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    className="relative group rounded-2xl border border-border bg-secondary/20 overflow-hidden"
  >
    {/* Left accent bar */}
    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary/60 via-primary/20 to-transparent rounded-r-full" />

    {/* Card top bar */}
    <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-secondary/40">
      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 font-mono">
        Education · {String(index + 1).padStart(2, "0")}
      </span>
      <motion.button
        type="button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(field, index)}
        className="p-1.5 rounded-lg bg-destructive/5 border border-destructive/10 text-destructive/50 hover:bg-destructive/10 hover:text-destructive transition-all"
      >
        <FiTrash2 size={12} />
      </motion.button>
    </div>

    {/* Fields grid */}
    <div className="p-5 grid grid-cols-2 gap-3">
      <FormField
        label="Course Title"
        error={errors.education?.[index]?.courseTitle}
      >
        <input
          {...register(`education.${index}.courseTitle`)}
          className={inputCls(!!errors.education?.[index]?.courseTitle)}
          placeholder="BSc Computer Science"
        />
      </FormField>

      <FormField label="Status" error={errors.education?.[index]?.status}>
        <div className="relative">
          <select
            {...register(`education.${index}.status`)}
            className={`${inputCls(!!errors.education?.[index]?.status)} appearance-none cursor-pointer pr-9`}
          >
            {EDU_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <FiChevronDown
            size={13}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none"
          />
        </div>
      </FormField>

      <FormField label="Subject" error={errors.education?.[index]?.subject}>
        <input
          {...register(`education.${index}.subject`)}
          className={inputCls(!!errors.education?.[index]?.subject)}
          placeholder="Computer Science"
        />
      </FormField>

      <FormField
        label="Institution"
        error={errors.education?.[index]?.institution}
      >
        <input
          {...register(`education.${index}.institution`)}
          className={inputCls(!!errors.education?.[index]?.institution)}
          placeholder="University Name"
        />
      </FormField>

      <FormField label="From" error={errors.education?.[index]?.duration?.from}>
        <input
          {...register(`education.${index}.duration.from`)}
          className={inputCls(!!errors.education?.[index]?.duration?.from)}
          placeholder="2020"
        />
      </FormField>

      <FormField label="To" error={errors.education?.[index]?.duration?.to}>
        <input
          {...register(`education.${index}.duration.to`)}
          className={inputCls(!!errors.education?.[index]?.duration?.to)}
          placeholder='2024 or "Present"'
        />
      </FormField>

      <div className="col-span-2">
        <FormField label="Description (optional)">
          <textarea
            {...register(`education.${index}.description`)}
            rows={2}
            className={`${inputCls(false)} resize-none`}
            placeholder="Brief description..."
          />
        </FormField>
      </div>
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
//  LOADING SCREEN
// ═══════════════════════════════════════════════════════════════
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
    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50 font-mono animate-pulse">
      Loading Bio Config...
    </p>
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const UpdateBioForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [deleteConfig, setDeleteConfig] = useState({
    isOpen: false,
    id: null,
    index: null,
    title: "",
    isDeleting: false,
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    setValue, // ✅ KEY FIX — destructure setValue
    formState: { isSubmitting, isDirty, errors },
  } = useForm({
    defaultValues: { education: [], freelanceStatus: "available" },
    resolver: zodResolver(aboutValidationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  // ✅ Watch the freelanceStatus value for StatusSelector
  const freelanceStatus = watch("freelanceStatus", "available");

  // ── Fetch ───────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_BASE}/api/about`);
        const payload = res.data?.data;
        if (payload) reset(payload);
      } catch (err) {
        toast.error(
          err?.response?.data?.message || "Failed to connect to System Core",
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [reset]);

  // ── Delete education ────────────────────────────────────────
  const initiateDelete = (field, index) => {
    if (!field._id) {
      remove(index);
      return;
    }
    setDeleteConfig({
      isOpen: true,
      id: String(field._id),
      index,
      title: field.courseTitle || "this record",
      isDeleting: false,
    });
  };

  const handleDelete = async (eduId, index) => {
    if (!eduId) {
      remove(index);
      setDeleteConfig({
        isOpen: false,
        id: null,
        index: null,
        title: "",
        isDeleting: false,
      });
      return;
    }
    setDeleteConfig((p) => ({ ...p, isDeleting: true }));
    try {
      const res = await axios.delete(
        `${API_BASE}/api/about/education/${eduId}`,
        { withCredentials: true },
      );
      if (res.data.success) {
        toast.success(res.data.message || "Record deleted.");
        remove(index);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleteConfig({
        isOpen: false,
        id: null,
        index: null,
        title: "",
        isDeleting: false,
      });
    }
  };

  // ── Submit ──────────────────────────────────────────────────
  const onSubmit = async (data) => {
    try {
      const res = await axios.patch(`${API_BASE}/api/about/update`, data, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message || "Updated successfully!");
        reset(res.data.data);
        setLastSaved(new Date());
      }
    } catch (err) {
      const resData = err.response?.data;
      if (Array.isArray(resData?.errors)) {
        resData.errors.forEach((e) => {
          if (!e?.path || !Array.isArray(e.path)) return;
          setError(e.path.join("."), { type: "server", message: e.message });
        });
      }
      toast.error(resData?.message || "Something went wrong.");
    }
  };

  if (isLoading) return <LoadingScreen />;

  // ════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen py-8 text-foreground bg-background">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-7xl mx-auto px-4 md:px-6 space-y-6"
      >
        {/* ── Page Header ────────────────────��─────────────── */}
        <PageHeader title="Bio Management" />

        {/* ── Unsaved changes banner ────────────────────────── */}
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
              <div className="flex items-center gap-2.5">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--chart-3)" }}
                />
                <span
                  className="text-[10px] font-bold uppercase tracking-widest font-mono"
                  style={{ color: "var(--chart-3)" }}
                >
                  Unsaved changes
                </span>
              </div>
              <button
                type="button"
                onClick={() => reset()}
                className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                <LuRotateCcw size={10} /> Discard
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Last saved indicator ──────────────────────────── */}
        {lastSaved && !isDirty && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-1"
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--chart-2)" }}
            />
            <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest">
              Saved at {lastSaved.toLocaleTimeString()}
            </span>
          </motion.div>
        )}

        {/* ── Grid layout ──────────────────────────��───────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* ── Executive Summary (8 cols) ──────────────────── */}
          <SectionCard
            title="Executive Summary"
            icon={FiUser}
            className="md:col-span-8"
          >
            <div className="space-y-4">
              <FormField label="Main Headline" error={errors.title}>
                <input
                  {...register("title")}
                  className={inputCls(!!errors.title)}
                  placeholder="Design. Code. Iterate."
                />
              </FormField>
              <FormField label="Biography Narrative" error={errors.bio}>
                <textarea
                  {...register("bio")}
                  rows={7}
                  className={`${inputCls(!!errors.bio)} resize-none`}
                  placeholder="Describe your journey..."
                />
              </FormField>
            </div>
          </SectionCard>

          {/* ── Quick Stats (4 cols) ────────────────────────── */}
          <SectionCard
            title="Quick Stats"
            icon={FiActivity}
            className="md:col-span-4"
          >
            <div className="space-y-4">
              <FormField label="Experience" error={errors.experienceYears}>
                <div className="relative">
                  <FiClock
                    size={13}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none"
                  />
                  <input
                    {...register("experienceYears")}
                    className={`${inputCls(!!errors.experienceYears)} pl-9`}
                    placeholder="3.5+ Years"
                  />
                </div>
              </FormField>

              <FormField label="Location" error={errors.location}>
                <div className="relative">
                  <FiMapPin
                    size={13}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none"
                  />
                  <input
                    {...register("location")}
                    className={`${inputCls(!!errors.location)} pl-9`}
                    placeholder="Remote / Bangladesh"
                  />
                </div>
              </FormField>

              {/* ✅ FIXED — Availability / freelanceStatus */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 font-mono ml-0.5">
                  Availability
                </label>

                {/* ✅ Hidden input keeps field registered with RHF */}
                <input type="hidden" {...register("freelanceStatus")} />

                {/* ✅ setValue updates RHF state correctly */}
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
                <FieldError error={errors.freelanceStatus} />
              </div>
            </div>
          </SectionCard>

          {/* ── Academic Timeline (12 cols) ─────────────────── */}
          <SectionCard
            title="Academic Timeline"
            icon={FiBookOpen}
            className="md:col-span-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {fields.map((field, index) => (
                  <EducationCard
                    key={field.id}
                    field={field}
                    index={index}
                    register={register}
                    errors={errors}
                    onDelete={initiateDelete}
                  />
                ))}
              </AnimatePresence>

              {/* Add new education card */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  append({
                    courseTitle: "",
                    subject: "",
                    institution: "",
                    description: "",
                    status: "ongoing",
                    duration: { from: "", to: "" },
                  })
                }
                className="min-h-[220px] rounded-2xl border-2 border-dashed border-border
                  flex flex-col items-center justify-center gap-3
                  text-muted-foreground hover:border-primary/50 hover:text-primary
                  hover:bg-primary/5 transition-all duration-200 group"
              >
                <div className="w-11 h-11 rounded-xl bg-secondary border border-border flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                  <FiPlus size={18} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] font-mono">
                  Add Education
                </span>
              </motion.button>
            </div>
          </SectionCard>
        </div>

        {/* ── Footer / Save bar ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 rounded-2xl border border-border bg-card"
        >
          {/* Status indicator */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={isDirty ? { rotate: [0, 15, -15, 0] } : {}}
              transition={{
                duration: 0.5,
                repeat: isDirty ? Infinity : 0,
                repeatDelay: 2,
              }}
            >
              <FiCpu
                size={16}
                className={
                  isDirty ? "text-primary" : "text-muted-foreground/40"
                }
              />
            </motion.div>
            <div>
              <p
                className={`text-[10px] font-black uppercase tracking-widest font-mono ${isDirty ? "text-primary" : "text-muted-foreground/40"}`}
              >
                {isDirty ? "Changes pending" : "Identity synchronized"}
              </p>
              <p className="text-[8px] font-mono text-muted-foreground/30 mt-0.5">
                Protocol: Bio_v2.0
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {isDirty && (
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  type="button"
                  onClick={() => reset()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-secondary
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
              className="relative flex items-center gap-2.5 px-6 py-2.5 rounded-xl
                bg-primary text-primary-foreground text-[10px] font-black uppercase
                tracking-widest font-mono shadow-lg transition-all overflow-hidden
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <LuLoader size={13} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <FiSave size={13} /> Publish Changes
                  </>
                )}
              </span>
            </motion.button>
          </div>
        </motion.div>
      </form>

      {/* ── Delete Modal ─────────────────────────────────────── */}
      <DeleteModal
        isOpen={deleteConfig.isOpen}
        title={deleteConfig.title}
        isDeleting={deleteConfig.isDeleting}
        onClose={() =>
          setDeleteConfig({
            isOpen: false,
            id: null,
            index: null,
            title: "",
            isDeleting: false,
          })
        }
        onConfirm={() => handleDelete(deleteConfig.id, deleteConfig.index)}
      />
    </div>
  );
};

export default UpdateBioForm;
