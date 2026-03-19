import React from "react";
import { useForm } from "react-hook-form";
import { FiSave } from "react-icons/fi";
import { LuLoader } from "react-icons/lu";
import toast from "react-hot-toast";
import axios from "axios";
import { inputCls } from "../Profile";
import { Field } from "../../../components/shared/InputField";

const ProfileForm = ({ user, isEditing }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    defaultValues: {
      name: user?.fullName || "",
      email: user?.email || "",
      location: user?.location || "",
      role: user?.role || "",
      bio: user?.bio || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.put(
        "https://themiahshohag.vercel.app//api/me/profile",
        data,
        { withCredentials: true },
      );
      if (res.data?.success) {
        toast.success(res.data?.message || "Profile updated successfully");
      } else {
        toast.error(res.data?.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
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
          Identity Matrix
        </span>
        <div className="h-[1px] flex-1 bg-border" />
      </div>

      {/* Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Full Name" required error={errors.name?.message}>
          <input
            disabled={!isEditing}
            {...register("name", { required: "Name is required" })}
            className={`${inputCls(!!errors.name)} ${!isEditing ? "opacity-70" : ""}`}
            placeholder="Your name"
          />
        </Field>

        <Field label="Email Address" required error={errors.email?.message}>
          <input
            disabled={!isEditing}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email",
              },
            })}
            className={`${inputCls(!!errors.email)} ${!isEditing ? "opacity-70" : ""}`}
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Location" error={errors.location?.message}>
          <input
            disabled={!isEditing}
            {...register("location")}
            className={`${inputCls(!!errors.location)} ${!isEditing ? "opacity-70" : ""}`}
            placeholder="City, Country"
          />
        </Field>

        <Field label="Role">
          <input
            disabled
            {...register("role")}
            className="w-full bg-secondary/30 border border-border rounded-2xl
                       py-3 px-4 text-sm text-muted-foreground cursor-not-allowed"
          />
        </Field>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <div className="flex justify-between items-end px-1">
          <label
            className="text-[10px] font-bold uppercase tracking-widest
                            text-muted-foreground"
          >
            Professional Bio
          </label>
          <span className="text-[10px] font-mono text-muted-foreground">
            Max 300
          </span>
        </div>
        <textarea
          disabled={!isEditing}
          rows={4}
          {...register("bio", { maxLength: 300 })}
          className={`${inputCls(!!errors.bio)} resize-none font-sans
            ${!isEditing ? "opacity-70" : ""}`}
          placeholder="Write a short professional bio..."
        />
        {errors.bio && (
          <p className="text-[10px] text-destructive mt-1 ml-1">
            Bio too long (max 300 characters)
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="pt-8 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              isEditing && isDirty ? "bg-chart-3 animate-pulse" : "bg-chart-2"
            }`}
          />
          <span
            className="text-[10px] font-mono uppercase tracking-tighter
                           text-muted-foreground"
          >
            {isEditing && isDirty ? "Unsaved Changes" : "State Synced"}
          </span>
        </div>
        <button
          disabled={!isEditing || isSubmitting}
          className="flex items-center gap-3 px-8 py-3.5 bg-primary
                     text-primary-foreground rounded-2xl text-xs font-bold
                     uppercase tracking-widest hover:opacity-90 transition-all
                     shadow-xl shadow-primary/10 disabled:opacity-50
                     disabled:cursor-not-allowed"
        >
          {isSubmitting ? <LuLoader className="animate-spin" /> : <FiSave />}
          Save Profile
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
