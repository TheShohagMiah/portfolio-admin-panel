import React, { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiSave,
  FiX,
  FiUploadCloud,
  FiGithub,
  FiExternalLink,
  FiCode,
  FiInfo,
  FiLayers,
  FiLink,
} from "react-icons/fi";
import { LuHeading2, LuLoader, LuRotateCcw } from "react-icons/lu";
import axios from "axios";
import { toast } from "react-hot-toast";
import PageHeader from "../../components/shared/PageHeader";
import RichTextEditor from "../../components/shared/RichTextEditor"; // ✅ Reusable

// ═══════════════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════════════
const API_BASE = import.meta.env.VITE_API_URL; // ✅ Fixed — no fallback needed
const CATEGORIES = ["Full Stack", "Frontend", "Backend"];
const STATUSES = ["published", "pending", "draft"];

// ═══════════════════════════════════════════════════════════════
//  SLUG HELPER
// ═══════════════════════════════════════════════════════════════
const toSlug = (title = "") =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

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
//  IMAGE UPLOAD ZONE
// ═══════════════════════════════════════════════════════════════
const ImageUploadZone = ({ preview, onFileChange, onClear, fileInputRef }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="relative rounded-2xl border border-border bg-card overflow-hidden"
  >
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border bg-secondary/30">
      <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
        <FiUploadCloud size={14} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground font-mono">
        Project Thumbnail
      </span>
      {preview && (
        <span
          className="ml-auto text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border font-mono"
          style={{
            color: "var(--chart-2)",
            borderColor: "color-mix(in oklch, var(--chart-2) 25%, transparent)",
            backgroundColor: "color-mix(in oklch, var(--chart-2) 8%, transparent)",
          }}
        >
          Uploaded
        </span>
      )}
    </div>

    <div className="p-6">
      <label className="group relative block rounded-xl border-2 border-dashed border-border hover:border-primary/40 transition-all cursor-pointer overflow-hidden min-h-[220px]">
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.preventDefault();
                  onClear();
                }}
                className="p-3 bg-destructive text-destructive-foreground rounded-xl shadow-xl"
              >
                <FiX size={18} />
              </motion.button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[220px] gap-3 p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <FiUploadCloud size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Drop your thumbnail
              </p>
              <p className="text-[10px] text-muted-foreground/50 font-mono mt-1">
                1200 × 630 recommended · Max 2MB
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={onFileChange}
              accept="image/*"
              ref={fileInputRef}
            />
          </div>
        )}
      </label>
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const AddProject = () => {
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      category: "",
      status: "",
      githubRepo: "",
      liveLink: "",
      technologies: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "technologies",
  });

  const watchedTitle = watch("title");

  // Auto-generate slug
  useEffect(() => {
    setValue("slug", toSlug(watchedTitle));
  }, [watchedTitle, setValue]);

  // ── Image handler ─────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setPreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Reset ─────────────────────────────────────────────────
  const handleReset = () => {
    reset();
    clearImage();
  };

  // ── Submit ────────────────────────────────────────────────
  const onSubmit = async (data) => {
    try {
      const slug = toSlug(data.title);
      const technologies = data.technologies
        .map((t) => t.value)
        .filter(Boolean);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", slug);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("status", data.status);
      formData.append("githubRepo", data.githubRepo);
      formData.append("liveLink", data.liveLink);
      technologies.forEach((tech) => formData.append("technologies[]", tech));
      if (imageFile) formData.append("image", imageFile);

      const res = await axios.post(`${API_BASE}/api/projects`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        handleReset();
      }
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Something went wrong.");
    }
  };

  // ════════════════════════════════════════════════════════════
  return (
    <section className="py-8 min-h-screen text-foreground bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-6">
        {/* ── Page Header ──────────────────────────────────── */}
        <PageHeader title="Add New Project" />

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* ── Thumbnail Upload ─────────────────────────── */}
          <ImageUploadZone
            preview={preview}
            onFileChange={handleImageChange}
            onClear={clearImage}
            fileInputRef={fileInputRef}
          />

          {/* ── Identity & Path ──────────────────────────── */}
          <SectionCard icon={FiInfo} title="Identity & Path" tag="Required">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Project Title" required error={errors.title?.message}>
                <input
                  {...register("title", { required: "Title is required" })}
                  placeholder="e.g. Quantum Analytics Suite"
                  className={inputCls(!!errors.title)}
                />
              </FormField>

              <FormField label="Slug (Auto-generated)">
                <div className="relative">
                  <input
                    {...register("slug")}
                    readOnly
                    className={`${inputCls(false)} text-muted-foreground/60 cursor-not-allowed italic`}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[8px] font-black font-mono uppercase tracking-widest text-muted-foreground/30 bg-muted px-1.5 py-0.5 rounded">
                    Auto
                  </span>
                </div>
              </FormField>
            </div>
          </SectionCard>

          {/* ── Classification ───────────────────────────── */}
          <SectionCard icon={FiLayers} title="Classification" tag="Required">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Category" required error={errors.category?.message}>
                <div className="relative">
                  <select
                    {...register("category", { required: "Please select a category" })}
                    className={`${inputCls(!!errors.category)} appearance-none cursor-pointer pr-9`}
                  >
                    <option value="" disabled>Select category...</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <LuHeading2 size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none" />
                </div>
              </FormField>

              <FormField label="Status" required error={errors.status?.message}>
                <div className="relative">
                  <select
                    {...register("status", { required: "Please select a status" })}
                    className={`${inputCls(!!errors.status)} appearance-none cursor-pointer pr-9`}
                  >
                    <option value="" disabled>Select status...</option>
                    {STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                  <LuHeading2 size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none" />
                </div>
              </FormField>
            </div>
          </SectionCard>

          {/* ── Description ── ✅ Using reusable RichTextEditor */}
          <SectionCard icon={FiCode} title="Project Description" tag="Required">
            <FormField label="Description" required error={errors.description?.message}>
              <Controller
                name="description"
                control={control}
                rules={{
                  required: "Description is required",
                  validate: (val) =>
                    (val && val !== "<p></p>") || "Description is required",
                }}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    hasError={!!errors.description}
                    placeholder="Describe your project in detail..."
                    minHeight="160px"
                  />
                )}
              />
            </FormField>
          </SectionCard>

          {/* ── Technologies ─────────────────────────────── */}
          <SectionCard icon={FiLayers} title="Technologies" tag="Required">
            <div className="flex flex-wrap gap-2 p-5 bg-secondary/30 rounded-xl border border-border">
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
                        errors.technologies?.[index]?.value
                          ? "border-destructive/50"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <input
                        {...register(`technologies.${index}.value`, { required: "Required" })}
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
                    {errors.technologies?.[index]?.value && (
                      <span className="text-[9px] text-destructive mt-1 ml-1 font-mono">
                        {errors.technologies[index].value.message}
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
                <FiPlus size={13} /> Add Tech
              </motion.button>
            </div>
          </SectionCard>

          {/* ── Source & Live ────────────────────────────── */}
          <SectionCard icon={FiExternalLink} title="Source & Live" tag="Required">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField label="Repository Link" required error={errors.githubRepo?.message}>
                <div className="relative">
                  <FiGithub size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none" />
                  <input
                    {...register("githubRepo", { required: "GitHub link is required" })}
                    placeholder="github.com/username/repo"
                    className={`${inputCls(!!errors.githubRepo)} pl-9`}
                  />
                </div>
              </FormField>

              <FormField label="Live URL" required error={errors.liveLink?.message}>
                <div className="relative">
                  <FiLink size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none" />
                  <input
                    {...register("liveLink", { required: "Live link is required" })}
                    placeholder="project-demo.vercel.app"
                    className={`${inputCls(!!errors.liveLink)} pl-9`}
                  />
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
                style={{ background: isDirty ? "var(--chart-3)" : "var(--chart-2)" }}
              />
              <span className="text-[9px] font-black uppercase tracking-widest font-mono text-muted-foreground/50">
                {isDirty ? "Payload modified" : "System ready"}
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
                    onClick={handleReset}
                    disabled={isSubmitting}
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
                    <><LuLoader size={13} className="animate-spin" /> Deploying...</>
                  ) : (
                    <><FiSave size={13} /> Deploy Project</>
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

export default AddProject;
