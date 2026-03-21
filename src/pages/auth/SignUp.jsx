import React, { useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiGithub,
  FiChrome,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { Field } from "../../components/shared/InputField";
import SocialButton from "../../components/shared/SocialButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validators/auth/authValidations";
import { useAuth } from "../../contexts/AuthContext";
import { FcGoogle } from "react-icons/fc";

export const inputCls = (hasError) =>
  `w-full px-4 py-3 rounded-xl text-sm transition-all duration-200
   bg-gray-100 border border-gray-200 text-gray-900 placeholder:text-gray-400
   dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-gray-500
   focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
   ${hasError ? "border-red-500 ring-red-500/10" : "hover:border-primary/30"}`;

// ✅ Fixed: forwardRef so react-hook-form's ref reaches the real <input>
const PasswordInput = forwardRef(
  ({ hasError, label = "Toggle password visibility", ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div className="relative">
        <input
          ref={ref}
          {...props}
          type={show ? "text" : "password"}
          className={`${inputCls(hasError)} pr-11`}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
          aria-label={label}
        >
          {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

const SignUp = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [apiError, setApiError] = useState("");
  const [successBanner, setSuccessBanner] = useState(false);
  const { registration } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  // ✅ Fixed: only navigate on success, show error on failure
  const onSubmit = async (data) => {
    setApiError("");
    const result = await registration(data);
    if (result?.success) {
      setSuccessBanner(true);
      setTimeout(() => {
        navigate("/auth/verify-account", { state: { email: data.email } });
      }, 1200);
      reset();
    } else {
      setApiError(result?.msg || "Registration failed. Please try again.");
    }
  };

  const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-300
                 bg-white text-gray-900 dark:bg-[#050505] dark:text-white overflow-hidden"
    >
      {/* Decorative background glow */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 z-0 transition-opacity duration-500 opacity-20 dark:opacity-40"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.15), transparent 40%)`,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid lg:grid-cols-5 gap-4 relative z-10"
      >
        {/* LEFT BRANDING */}
        <div className="lg:col-span-2 bg-white border border-gray-200 shadow-2xl dark:bg-white/[0.02] dark:border-white/5 dark:backdrop-blur-2xl rounded-[2.5rem] p-10 flex flex-col justify-between overflow-hidden">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[10px] font-black tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-8">
              CREATE ACCOUNT
            </div>
            <h1 className="text-5xl font-bold tracking-tighter leading-[1.1]">
              Design <br />
              <span className="text-primary italic font-serif">
                the future
              </span>{" "}
              <br />
              with us.
            </h1>
            <p className="mt-6 text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-[280px]">
              Join 10k+ developers building high-performance web applications.
            </p>
          </div>
          <div className="mt-12 flex items-center gap-3 text-[10px] font-black text-gray-400 tracking-widest uppercase">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEM STATUS: OPERATIONAL
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="lg:col-span-3 bg-white border border-gray-200 shadow-2xl dark:bg-white/[0.02] dark:border-white/5 dark:backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[10px] font-black tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-6">
              WELCOME
            </div>
            <h2 className="text-4xl font-bold tracking-tighter italic font-serif">
              Sign Up
            </h2>
          </div>

          {/* Error / Success banners */}
          <AnimatePresence>
            {apiError && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200 p-4">
                  <FiAlertCircle className="mt-0.5 shrink-0" />
                  <p className="text-sm">{apiError}</p>
                </div>
              </motion.div>
            )}

            {successBanner && (
              <motion.div
                key="success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200 p-4 text-sm">
                  OTP sent to your email. Redirecting…
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-6">
              <Field
                label="Full Name"
                required
                error={errors.fullName?.message}
              >
                <input
                  {...register("fullName")}
                  placeholder="Shohag Miah"
                  className={inputCls(!!errors.fullName)}
                />
              </Field>
              <Field label="Email" required error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="hello@shohag.dev"
                  className={inputCls(!!errors.email)}
                />
              </Field>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Password" required error={errors.password?.message}>
                <PasswordInput
                  {...register("password")}
                  hasError={!!errors.password}
                  placeholder="••••••••"
                />
              </Field>
              <Field
                label="Confirm Password"
                required
                error={errors.confirmPassword?.message}
              >
                {/* ✅ Fixed: removed duplicate inline validate — Zod handles this */}
                <PasswordInput
                  {...register("confirmPassword")}
                  hasError={!!errors.confirmPassword}
                  placeholder="••••••••"
                />
              </Field>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isSubmitting}
              type="submit"
              className="relative w-full overflow-hidden flex items-center justify-center gap-2.5
                  py-3.5 rounded-xl bg-primary text-primary-foreground
                  text-[10px] font-black uppercase tracking-widest font-mono
                  shadow-lg transition-all duration-200 disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <FiArrowRight />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-white/5" />
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]">
              <span className="bg-white dark:bg-[#050505] px-4 text-gray-400">
                Quick Connect
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SocialButton icon={<FcGoogle />} label="Google" />
            <SocialButton icon={<FiGithub />} label="GitHub" />
          </div>

          <p className="mt-10 text-center text-gray-500 text-xs font-medium">
            Already have an account?{" "}
            <Link
              to="/auth/signin"
              className="text-gray-900 dark:text-white font-bold hover:text-primary transition-colors underline-offset-4 underline decoration-current/10"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
