import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiX, FiCheck } from "react-icons/fi";
import { PLATFORMS, socialIconMap } from "../../utils/socialIconMap";

const SocialLinkForm = ({
  editData,
  onClose,
  onSubmit: onFormSubmit,
  isSubmitting,
}) => {
  const isEdit = Boolean(editData);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      platform: "GitHub",
      url: "",
      label: "",
      order: 0,
      isActive: true,
      color: "",
    },
  });

  // Edit mode → form fill করো
  useEffect(() => {
    if (editData) reset({ ...editData, color: editData.color || "" });
  }, [editData, reset]);

  const watchPlatform = watch("platform");
  const watchColor = watch("color");
  const watchIsActive = watch("isActive");

  const meta = socialIconMap[watchPlatform];
  const PreviewIcon = meta?.Icon;
  const previewColor = watchColor || meta?.color || "#7c3aed";

  const onSubmit = (data) =>
    onFormSubmit({
      ...data,
      order: Number(data.order),
      label: data.label.trim() || data.platform,
      color: data.color.trim() || undefined,
      isActive: Boolean(data.isActive),
    });

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                 bg-slate-900/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal Box */}
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh]
                      overflow-y-auto shadow-2xl"
      >
        {/* ── HEADER ── */}
        <div
          className="sticky top-0 z-10 bg-white flex items-center
                        justify-between px-6 py-5 border-b border-slate-100
                        rounded-t-2xl"
        >
          <div className="flex items-center gap-3">
            {/* Icon Preview */}
            <span
              className="w-11 h-11 rounded-xl flex items-center justify-center
                         flex-shrink-0 transition-all duration-300"
              style={{
                background: `${previewColor}20`,
                border: `2px solid ${previewColor}50`,
                color: previewColor,
              }}
            >
              {PreviewIcon && <PreviewIcon size={20} />}
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isEdit ? "✏️ Edit Link" : "➕ Add New Link"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEdit
                  ? `Editing: ${editData?.platform}`
                  : "Fill in the details below"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50
                       flex items-center justify-center text-slate-500
                       hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <FiX size={17} />
          </button>
        </div>

        {/* ── FORM BODY ── */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-5">
          {/* Platform Picker */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Platform <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {PLATFORMS.map(({ name, Icon, color }) => {
                const selected = watchPlatform === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() =>
                      setValue("platform", name, { shouldDirty: true })
                    }
                    title={name}
                    className="flex flex-col items-center gap-1 py-2.5 px-1
                               rounded-xl border-2 cursor-pointer
                               transition-all duration-150 hover:scale-105"
                    style={{
                      borderColor: selected ? color : "#e2e8f0",
                      background: selected ? `${color}14` : "#f8fafc",
                      color: selected ? color : "#94a3b8",
                      transform: selected ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    <Icon size={20} />
                    <span className="text-[10px] font-semibold leading-none">
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
            <input
              type="hidden"
              {...register("platform", { required: true })}
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder={
                watchPlatform === "Email"
                  ? "mailto:you@example.com"
                  : `https://${watchPlatform?.toLowerCase()}.com/yourprofile`
              }
              className={`w-full px-4 py-2.5 rounded-xl border-2 text-sm
                          text-slate-800 outline-none transition-colors
                          placeholder:text-slate-300 focus:border-violet-500
                          ${errors.url ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"}`}
              {...register("url", {
                required: "URL is required",
                validate: (v) =>
                  /^https?:\/\/.+/.test(v) || /^mailto:.+@.+\..+/.test(v)
                    ? true
                    : "Enter a valid URL (https://...) or mailto:...",
              })}
            />
            {errors.url && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                ⚠️ {errors.url.message}
              </p>
            )}
          </div>

          {/* Label + Order */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Custom Label
              </label>
              <input
                type="text"
                placeholder={watchPlatform}
                className={`w-full px-4 py-2.5 rounded-xl border-2 text-sm
                            text-slate-800 outline-none transition-colors
                            placeholder:text-slate-300 focus:border-violet-500
                            ${errors.label ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                {...register("label", {
                  maxLength: { value: 30, message: "Max 30 chars" },
                })}
              />
              {errors.label && (
                <p className="mt-1.5 text-xs text-red-500">
                  ⚠️ {errors.label.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                className={`w-full px-4 py-2.5 rounded-xl border-2 text-sm
                            text-slate-800 outline-none transition-colors
                            focus:border-violet-500
                            ${errors.order ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                {...register("order", {
                  min: { value: 0, message: "Min 0" },
                  max: { value: 99, message: "Max 99" },
                })}
              />
              {errors.order && (
                <p className="mt-1.5 text-xs text-red-500">
                  ⚠️ {errors.order.message}
                </p>
              )}
            </div>
          </div>

          {/* Color + Visibility */}
          <div className="grid grid-cols-2 gap-4">
            {/* Color Picker */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Custom Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={previewColor}
                  onChange={(e) =>
                    setValue("color", e.target.value, { shouldDirty: true })
                  }
                  className="w-11 h-11 rounded-xl border-2 border-slate-200
                             cursor-pointer p-0.5 bg-white flex-shrink-0"
                />
                <input
                  type="text"
                  placeholder="#7c3aed"
                  className={`flex-1 px-3 py-2.5 rounded-xl border-2 text-sm
                              text-slate-800 outline-none transition-colors
                              font-mono focus:border-violet-500
                              ${errors.color ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                  {...register("color", {
                    pattern: {
                      value: /^(#([0-9A-F]{3}){1,2})?$/i,
                      message: "Valid hex only (e.g. #7c3aed)",
                    },
                  })}
                />
              </div>
              {errors.color && (
                <p className="mt-1.5 text-xs text-red-500">
                  ⚠️ {errors.color.message}
                </p>
              )}
            </div>

            {/* Visibility Toggle */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Visibility
              </label>
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() =>
                    setValue("isActive", !watchIsActive, { shouldDirty: true })
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors
                              duration-300 flex-shrink-0
                              ${watchIsActive ? "bg-violet-600" : "bg-slate-300"}`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full
                                shadow-md transition-all duration-300
                                ${watchIsActive ? "left-6" : "left-0.5"}`}
                  />
                </button>
                <input type="hidden" {...register("isActive")} />
                <span
                  className={`text-sm font-semibold transition-colors
                              ${watchIsActive ? "text-green-600" : "text-slate-400"}`}
                >
                  {watchIsActive ? "✅ Active" : "🙈 Hidden"}
                </span>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-100">
            <p
              className="text-[11px] font-bold text-slate-400 uppercase
                          tracking-widest mb-3"
            >
              Live Preview
            </p>
            <div className="flex items-center gap-3">
              <a
                href={watch("url") || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-11 h-11 rounded-xl flex items-center justify-center
                            flex-shrink-0 transition-opacity
                            ${watchIsActive ? "opacity-100" : "opacity-40"}`}
                style={{
                  background: `${previewColor}18`,
                  border: `1.5px solid ${previewColor}45`,
                  color: previewColor,
                }}
              >
                {PreviewIcon && <PreviewIcon size={20} />}
              </a>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-800 truncate">
                  {watch("label") || watchPlatform}
                </p>
                <p className="text-xs text-slate-400 font-mono truncate">
                  {watch("url") || "No URL entered yet"}
                </p>
              </div>
              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full flex-shrink-0
                            ${
                              watchIsActive
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
              >
                {watchIsActive ? "● Active" : "● Hidden"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 border-slate-200 bg-white
                         text-slate-600 text-sm font-semibold
                         hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || (!isDirty && isEdit)}
              className="flex-[2] py-3 rounded-xl text-white text-sm font-semibold
                         flex items-center justify-center gap-2
                         bg-gradient-to-r from-violet-600 to-violet-700
                         hover:from-violet-700 hover:to-violet-800
                         disabled:opacity-60 disabled:cursor-not-allowed
                         transition-all shadow-md shadow-violet-200"
            >
              {isSubmitting ? (
                <>
                  <span
                    className="w-4 h-4 border-2 border-white/30 border-t-white
                                   rounded-full animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <FiCheck size={16} />
                  {isEdit ? "Update Link" : "Add Link"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocialLinkForm;
