import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiShield,
  FiLock,
  FiAlertCircle,
} from "react-icons/fi";
import { LuLoader } from "react-icons/lu";
import toast from "react-hot-toast";
import axios from "axios";
import { inputCls } from "../Profile";
import { useAuth } from "../../../contexts/AuthContext";
import { Field } from "../../../components/shared/InputField";
import { updatePasswordSchema } from "../../../validators/auth/authValidations";

const UpdatePasswordForm = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.patch(
        "https://themiahshohag.vercel.app//api/auth/change-password",
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
        { withCredentials: true },
      );

      if (res.data?.success) {
        toast.success(res.data?.message || "Password updated. Logging out...");
        reset();
        setTimeout(() => {
          logout();
          navigate("/auth/signin", { replace: true });
        }, 2000);
      } else {
        toast.error(res.data?.message || "Failed to update password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
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
          Security Protocol
        </span>
        <div className="h-[1px] flex-1 bg-border" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Password */}
        <Field
          label="Current Password"
          required
          error={errors.currentPassword?.message}
        >
          <div className="relative">
            <input
              type={show.current ? "text" : "password"}
              {...register("currentPassword")}
              className={inputCls(!!errors.currentPassword)}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
              className="absolute right-4 top-1/2 -translate-y-1/2
                         text-muted-foreground hover:text-foreground transition-colors"
            >
              {show.current ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </Field>

        {/* New Password */}
        <Field
          label="New Password"
          required
          error={errors.newPassword?.message}
        >
          <div className="relative">
            <input
              type={show.next ? "text" : "password"}
              {...register("newPassword")}
              className={inputCls(!!errors.newPassword)}
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShow((s) => ({ ...s, next: !s.next }))}
              className="absolute right-4 top-1/2 -translate-y-1/2
                         text-muted-foreground hover:text-foreground transition-colors"
            >
              {show.next ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </Field>

        {/* Confirm Password */}
        <Field
          label="Confirm Password"
          required
          error={errors.confirmPassword?.message}
        >
          <div className="relative">
            <input
              type={show.confirm ? "text" : "password"}
              {...register("confirmPassword")}
              className={inputCls(!!errors.confirmPassword)}
              placeholder="Repeat new password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
              className="absolute right-4 top-1/2 -translate-y-1/2
                         text-muted-foreground hover:text-foreground transition-colors"
            >
              {show.confirm ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </Field>

        {/* Tips */}
        <div
          className="rounded-[2rem] bg-secondary/30 border border-border
                        p-6 flex items-start gap-3"
        >
          <FiShield className="text-primary mt-0.5" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest">
              Hardening Tips
            </p>
            <p
              className="text-[10px] leading-relaxed text-muted-foreground
                          mt-2 font-sans"
            >
              Use a unique password with uppercase, lowercase, numbers and
              special characters (@$!%*?&).
            </p>
          </div>
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
            {isDirty ? "Pending Security Update" : "Security Stable"}
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
          {isSubmitting ? <LuLoader className="animate-spin" /> : <FiLock />}
          Update Password
        </button>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-muted-foreground px-1">
        <FiAlertCircle />
        <span>After update, you will be logged out automatically.</span>
      </div>
    </form>
  );
};

export default UpdatePasswordForm;
