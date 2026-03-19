import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FiAlertCircle, FiPlus, FiTrash2, FiLink } from "react-icons/fi";
import { LuLoader } from "react-icons/lu";
import toast from "react-hot-toast";
import axios from "axios";
import { inputCls } from "../Profile";
import { getPlatformMeta, PLATFORMS } from "../constants/platforms";

const SocialLinksForm = ({ user, onLinksChange }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    watch,
  } = useForm({
    defaultValues: {
      socialLinks: user?.socialLinks?.length
        ? user.socialLinks
        : [{ platform: "github", url: "", label: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "socialLinks",
  });
  const watchedLinks = watch("socialLinks");

  useEffect(() => {
    onLinksChange?.(watchedLinks);
  }, [watchedLinks]);

  const onSubmit = async (data) => {
    try {
      const filtered = data.socialLinks.filter((l) => l.url?.trim());
      const res = await axios.post(
        "https://themiahshohag.vercel.app//api/social-links",
        { socialLinks: filtered },
        { withCredentials: true },
      );
      if (res.data?.success) {
        toast.success(res.data?.message || "Social links updated!");
      } else {
        toast.error(res.data?.message || "Failed to update social links");
      }
    } catch (error) {
      toast.error(error.res?.data?.message || "Update failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 bg-card p-10 rounded-[3rem] border border-border shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-2">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.3em]
                         text-muted-foreground"
        >
          Social Presence
        </span>
        <div className="h-[1px] flex-1 bg-border" />
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {fields.map((field, index) => {
          const currentPlatform = watchedLinks?.[index]?.platform || "other";
          const meta = getPlatformMeta(currentPlatform);
          const PlatformIcon = meta.Icon;
          const hasUrlError = errors?.socialLinks?.[index]?.url;

          return (
            <div
              key={field.id}
              className="grid grid-cols-[auto_1fr_1fr_auto] gap-3 items-start
                         p-4 rounded-2xl border border-border bg-secondary/30
                         hover:border-primary/20 transition-colors"
            >
              {/* Icon badge */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center
                           flex-shrink-0 mt-0.5 border transition-all duration-300"
                style={{
                  background: meta.color + "18",
                  borderColor: meta.color + "40",
                  color: meta.color,
                }}
              >
                <PlatformIcon size={16} />
              </div>

              {/* Platform select */}
              <div className="space-y-1">
                <label
                  className="text-[10px] font-bold uppercase
                                  tracking-widest text-muted-foreground"
                >
                  Platform
                </label>
                <select
                  {...register(`socialLinks.${index}.platform`)}
                  className={`${inputCls(false)} appearance-none cursor-pointer`}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* URL input */}
              <div className="space-y-1">
                <label
                  className="text-[10px] font-bold uppercase
                                  tracking-widest text-muted-foreground"
                >
                  URL <span className="text-destructive">*</span>
                </label>
                <input
                  type="url"
                  placeholder={meta.placeholder}
                  className={inputCls(!!hasUrlError)}
                  {...register(`socialLinks.${index}.url`, {
                    validate: (v) => {
                      if (!v?.trim()) return true;
                      return (
                        /^https?:\/\/.+/.test(v) ||
                        /^mailto:.+/.test(v) ||
                        "Enter a valid URL"
                      );
                    },
                  })}
                />
                {hasUrlError && (
                  <p className="text-[10px] text-destructive ml-1">
                    {hasUrlError.message}
                  </p>
                )}
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                className="w-10 h-10 mt-6 flex-shrink-0 rounded-xl border
                           border-border flex items-center justify-center
                           text-muted-foreground transition-all
                           hover:border-destructive/50 hover:bg-destructive/10
                           hover:text-destructive disabled:opacity-30
                           disabled:cursor-not-allowed"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add row */}
      <button
        type="button"
        onClick={() => append({ platform: "other", url: "", label: "" })}
        className="w-full flex items-center justify-center gap-3 py-3.5
                   rounded-2xl border-2 border-dashed border-border text-xs
                   font-bold uppercase tracking-widest text-muted-foreground
                   hover:border-primary/40 hover:text-primary hover:bg-primary/5
                   transition-all duration-200"
      >
        <FiPlus size={15} />
        Add Another Link
      </button>

      {/* Quick-pick chips */}
      <div className="space-y-3">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.3em]
                      text-muted-foreground px-1"
        >
          Quick Add
        </p>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.filter((p) => p.value !== "other").map((p) => {
            const Icon = p.Icon;
            const isInUse = watchedLinks?.some(
              (l) => l.platform === p.value && l.url?.trim(),
            );
            return (
              <button
                key={p.value}
                type="button"
                onClick={() =>
                  append({ platform: p.value, url: "", label: "" })
                }
                disabled={isInUse}
                title={isInUse ? `${p.label} already added` : `Add ${p.label}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border
                           border-border bg-secondary text-xs font-semibold
                           text-muted-foreground transition-all hover:scale-105
                           disabled:opacity-30 disabled:cursor-not-allowed
                           disabled:hover:scale-100"
                onMouseEnter={(e) => {
                  if (!isInUse) {
                    e.currentTarget.style.borderColor = p.color + "60";
                    e.currentTarget.style.color = p.color;
                    e.currentTarget.style.background = p.color + "12";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.color = "";
                  e.currentTarget.style.background = "";
                }}
              >
                <Icon size={13} />
                {p.label}
                {isInUse && <span className="text-[10px] opacity-60">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              isDirty ? "bg-chart-3 animate-pulse" : "bg-chart-2"
            }`}
          />
          <span
            className="text-[10px] font-mono uppercase tracking-tighter
                           text-muted-foreground"
          >
            {isDirty ? "Unsaved Changes" : "Links Synced"}
          </span>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-3 px-8 py-3.5 bg-primary
                     text-primary-foreground rounded-2xl text-xs font-bold
                     uppercase tracking-widest hover:opacity-90 transition-all
                     shadow-xl shadow-primary/10 disabled:opacity-50
                     disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <LuLoader className="animate-spin" />
          ) : (
            <FiLink size={14} />
          )}
          Save Links
        </button>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-muted-foreground px-1">
        <FiAlertCircle size={11} />
        <span>Empty URL rows are automatically ignored on save.</span>
      </div>
    </form>
  );
};

export default SocialLinksForm;
