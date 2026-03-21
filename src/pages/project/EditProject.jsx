import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  FiArrowLeft,
} from "react-icons/fi";
import { LuLoader } from "react-icons/lu";
import { Field } from "../../components/shared/InputField";
import axios from "axios";
import { toast } from "react-hot-toast";
import RichTextEditor from "../../components/Editor";

const API_BASE = import.meta.env.VITE_API_URL;

/* ─── Shared Styling ─────────────────────────────────────────── */
const inputCls = (hasError) =>
  `w-full px-4 py-3 rounded-2xl bg-secondary border text-sm text-foreground
   placeholder:text-muted-foreground focus:outline-none focus:ring-2 
   focus:ring-primary/20 focus:border-primary transition-all duration-200
   ${hasError ? "border-destructive/50" : "border-border hover:border-primary/30"}`;

const CATEGORIES = ["Full Stack", "Frontend", "Backend"];
const STATUS = ["published", "pending", "draft"];

/* ─── Slug helper ────────────────────────────────────────────── */
const toSlug = (title = "") =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

/* ─── Section Header ─────────────────────────────────────────── */
const SectionHeader = ({ icon, label }) => (
  <div className="flex items-center gap-3 border-b border-border pb-4">
    {icon}
    <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
      {label}
    </h2>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════════ */
const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fetching, setFetching] = useState(true);
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
      status: "draft",
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

  useEffect(() => {
    setValue("slug", toSlug(watchedTitle));
  }, [watchedTitle, setValue]);

  // ── Fetch existing project ────────────────────────────────────
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/projects/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          const p = res.data.data;
          reset({
            title: p.title || "",
            slug: p.slug || "",
            description: p.description || "",
            category: p.category || "",
            status: p.status || "draft",
            githubRepo: p.githubRepo || "",
            liveLink: p.liveLink || "",
            technologies: (p.technologies || []).map((t) => ({ value: t })),
          });
          setPreview(p.image?.url || null);
        }
      } catch (err) {
        console.error(
          "Fetch project error:",
          err.response?.data || err.message,
        );
        toast.error(err.response?.data?.message || "Could not load project.");
        navigate("/admin/projects");
      } finally {
        setFetching(false);
      }
    };
    fetchProject();
  }, [id, navigate, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

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

      const res = await axios.patch(
        `${API_BASE}/api/projects/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      if (res.data.success) {
        toast.success("Project updated successfully!");
        navigate("/admin/projects");
      }
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Something went wrong.");
    }
  };

  // ── Loading State ─────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground font-mono text-xs tracking-[0.3em] animate-pulse uppercase">
          Accessing vault...
        </p>
      </div>
    );
  }

  return (
    <section className="py-12 min-h-screen text-foreground selection:bg-primary/30">
      <div className="max-w-4xl mx-auto px-6">
        {/* ── Header ──────────────────────────────────────────── */}
        <header className="mb-12">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-all text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Vault
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-[2px] w-8 bg-primary" />
            <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px]">
              Archive Modification
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Modify{" "}
            <span className="text-primary italic font-serif">Entry.</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-sm max-w-md leading-relaxed">
            Update your vault record. Changes are committed directly to the
            database on save.
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">
          {/* ── Thumbnail Upload ─────────────────────────────── */}
          <div className="group relative border-2 border-dashed border-border rounded-[2.5rem] p-4 bg-card hover:bg-secondary/50 hover:border-primary/50 transition-all cursor-pointer">
            <div className="flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden rounded-[2rem]">
              {preview ? (
                <>
                  <img
                    src={preview}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <label className="p-4 bg-primary text-primary-foreground rounded-full shadow-xl hover:scale-110 transition-transform cursor-pointer">
                      <FiUploadCloud size={20} />
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                        ref={fileInputRef}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setImageFile(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="p-4 bg-destructive text-destructive-foreground rounded-full shadow-xl hover:scale-110 transition-transform"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer flex flex-col items-center text-center p-8">
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:rotate-12 transition-transform">
                    <FiUploadCloud size={40} />
                  </div>
                  <span className="text-lg font-bold">Drop your thumbnail</span>
                  <span className="text-muted-foreground text-xs mt-2 font-mono">
                    1200 x 630 recommended · Max 2MB
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                    ref={fileInputRef}
                  />
                </label>
              )}
            </div>
          </div>

          {/* ── Main Card ────────────────────────────────────── */}
          <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <FiCode size={120} />
            </div>

            {/* Section: Identity & Path */}
            <div className="space-y-8 relative z-10">
              <SectionHeader
                icon={<FiInfo className="text-primary" />}
                label="Identity & Path"
              />
              <div className="grid sm:grid-cols-2 gap-8">
                <Field
                  label="Project Title"
                  required
                  error={errors.title?.message}
                >
                  <input
                    {...register("title", { required: "Title is required" })}
                    placeholder="e.g. Quantum Analytics Suite"
                    className={inputCls(!!errors.title)}
                  />
                </Field>

                <Field label="Slug" error={errors.slug?.message}>
                  <div className="relative">
                    <input
                      {...register("slug")}
                      readOnly
                      className={`${inputCls(!!errors.slug)} bg-secondary/50 text-muted-foreground cursor-not-allowed italic`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-mono opacity-40 uppercase">
                      Auto
                    </span>
                  </div>
                </Field>
              </div>
            </div>

            {/* Section: Classification */}
            <div className="space-y-8 relative z-10">
              <SectionHeader
                icon={<FiLayers className="text-primary" />}
                label="Classification"
              />
              <div className="grid sm:grid-cols-2 gap-8">
                <Field
                  label="Category"
                  required
                  error={errors.category?.message}
                >
                  <select
                    {...register("category", {
                      required: "Please select a category",
                    })}
                    className={`${inputCls(!!errors.category)} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>
                      Select a category...
                    </option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Status" required error={errors.status?.message}>
                  <select
                    {...register("status", {
                      required: "Please select a status",
                    })}
                    className={`${inputCls(!!errors.status)} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>
                      Select a status...
                    </option>
                    {STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            {/* Section: Description ── ✅ Reusable RichTextEditor */}
            <Field
              label="Project Description"
              required
              error={errors.description?.message}
            >
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
                    minHeight="200px"
                  />
                )}
              />
            </Field>

            {/* Section: Technologies */}
            <Field
              label="Technologies"
              hint="List all technologies used in this project."
              required
            >
              <div className="flex flex-wrap gap-3 p-6 bg-secondary/30 rounded-[2rem] border border-border shadow-inner">
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
                        className={`flex items-center bg-card rounded-xl px-4 py-2 border transition-colors shadow-sm
                          ${
                            errors.technologies?.[index]?.value
                              ? "border-destructive/50"
                              : "border-border hover:border-primary/50"
                          }`}
                      >
                        <input
                          {...register(`technologies.${index}.value`, {
                            required: "Required",
                          })}
                          placeholder="e.g. React"
                          className="bg-transparent text-xs font-medium focus:outline-none w-24"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="ml-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <FiX size={14} />
                        </button>
                      </div>
                      {errors.technologies?.[index]?.value && (
                        <span className="text-[10px] text-destructive mt-1 ml-1">
                          {errors.technologies[index].value.message}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() => append({ value: "" })}
                  className="group flex items-center gap-2 px-5 py-2 rounded-xl border-2 border-dashed border-primary/20 text-primary text-xs font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-95"
                >
                  <FiPlus size={16} /> ADD TECH
                </button>
              </div>
            </Field>

            {/* Section: Source & Live */}
            <div className="space-y-8">
              <SectionHeader
                icon={<FiExternalLink className="text-primary" />}
                label="Source & Live"
              />
              <div className="grid sm:grid-cols-2 gap-8">
                <Field
                  label="Repository Link"
                  error={errors.githubRepo?.message}
                >
                  <div className="relative">
                    <FiGithub className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      {...register("githubRepo", {
                        required: "GitHub repository link is required",
                      })}
                      placeholder="github.com/username/repo"
                      className={`${inputCls(!!errors.githubRepo)} pl-12`}
                    />
                  </div>
                </Field>

                <Field label="Live URL" error={errors.liveLink?.message}>
                  <div className="relative">
                    <FiExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      {...register("liveLink", {
                        required: "Project live link is required",
                      })}
                      placeholder="project-demo.vercel.app"
                      className={`${inputCls(!!errors.liveLink)} pl-12`}
                    />
                  </div>
                </Field>
              </div>
            </div>

            {/* Footer: Control Strip */}
            <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    isDirty ? "bg-chart-3 animate-pulse" : "bg-primary"
                  }`}
                />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {isDirty ? "Unsaved Changes" : "In Sync"}
                </p>
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none px-8 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all disabled:opacity-0"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 rounded-2xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <LuLoader className="animate-spin text-lg" />
                  ) : (
                    <FiSave className="text-lg" />
                  )}
                  Update
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditProject;
