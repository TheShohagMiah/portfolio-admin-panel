import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiGithub,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LuLoader } from "react-icons/lu";
import { useAuth } from "../../contexts/AuthContext";
import { loginSchema } from "../../validators/auth/authValidations";
import SocialButton from "../../components/shared/SocialButton";

// ═══════════════════════════════════���═══════════════════════════
//  INPUT CLASS — uses CSS vars, no hardcoded colors
// ═══════════════════════════════════════════════════════════════
const inputCls = (hasError = false) =>
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
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-[10px] text-destructive ml-1 font-mono"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  const from = location.state?.from?.pathname || "/admin/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  // ── Redirect if already logged in ───────────────────────────
  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  // ── Submit ───────────────────────────────────────────────────
  const onSubmit = async (data) => {
    setFormError("");
    const result = await login(data);
    if (result?.success) {
      navigate(from, { replace: true });
    } else {
      setFormError(result?.message || "Invalid email or password.");
    }
  };

  // ════════════════════════════════════════════════════════════
  return (
    <div
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
      className="min-h-screen w-full flex items-center justify-center p-4 bg-background text-foreground overflow-hidden"
    >
      {/* ── Dynamic cursor glow ──────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px,
              color-mix(in oklch, var(--brand, var(--primary)) 12%, transparent),
              transparent 40%)`,
          }}
        />
      </div>

      {/* ── Ambient glows ────────────────────────────────────── */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[120px] opacity-[0.06] pointer-events-none"
        style={{ background: "var(--brand, var(--primary))" }}
      />
      <div
        className="fixed bottom-0 right-0 w-[300px] h-[300px] rounded-full blur-[100px] opacity-[0.04] pointer-events-none"
        style={{ background: "var(--brand, var(--primary))" }}
      />

      {/* ── Card ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="relative bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="p-8 md:p-10">
            {/* ── Header ───────────────────────────────────── */}
            <div className="text-center mb-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary mb-5">
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--chart-2)" }}
                />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground font-mono">
                  Welcome Back
                </span>
              </div>

              <h1 className="text-4xl font-bold tracking-tighter italic font-serif text-foreground">
                Sign In
              </h1>
              <p className="text-[11px] text-muted-foreground/50 font-mono uppercase tracking-widest mt-2">
                Access your portfolio dashboard
              </p>
            </div>

            {/* ── Form error banner ────────────────────────── */}
            <AnimatePresence>
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="mb-5 overflow-hidden"
                >
                  <div
                    className="flex items-start gap-2.5 rounded-xl p-3.5 border text-sm"
                    style={{
                      borderColor:
                        "color-mix(in oklch, var(--destructive) 30%, transparent)",
                      backgroundColor:
                        "color-mix(in oklch, var(--destructive) 8%,  transparent)",
                      color: "var(--destructive)",
                    }}
                  >
                    <FiAlertCircle size={15} className="mt-0.5 shrink-0" />
                    <p className="text-[11px] font-mono">{formError}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Form ─────────────────────────────────────── */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              {/* Email */}
              <FormField label="Email Address" error={errors.email?.message}>
                <div className="relative">
                  <FiMail
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none"
                  />
                  <input
                    {...register("email")}
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    className={`${inputCls(!!errors.email)} pl-10`}
                  />
                </div>
              </FormField>

              {/* Password */}
              <FormField label="Password" error={errors.password?.message}>
                <div className="relative">
                  <FiLock
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 pointer-events-none"
                  />
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`${inputCls(!!errors.password)} pl-10 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff size={15} />
                    ) : (
                      <FiEye size={15} />
                    )}
                  </button>
                </div>
              </FormField>

              {/* Forgot password link */}
              <div className="flex justify-end">
                <Link
                  to="/auth/forgot-password"
                  className="text-[9px] font-bold uppercase tracking-widest font-mono text-muted-foreground/40 hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.01 } : {}}
                whileTap={!isSubmitting ? { scale: 0.99 } : {}}
                className="relative w-full overflow-hidden flex items-center justify-center gap-2.5
                  py-3.5 rounded-xl bg-primary text-primary-foreground
                  text-[10px] font-black uppercase tracking-widest font-mono
                  shadow-lg transition-all duration-200 disabled:opacity-50 mt-2"
              >
                {/* Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <LuLoader size={13} className="animate-spin" />{" "}
                      Verifying...
                    </>
                  ) : (
                    <>
                      Access Account <FiArrowRight size={13} />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            {/* ── Divider ──────────────────────────────────── */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-card text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 font-mono">
                  Quick Connect
                </span>
              </div>
            </div>

            {/* ── Social buttons ────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
              <SocialButton icon={<FcGoogle />} label="Google" />
              <SocialButton icon={<FiGithub />} label="GitHub" />
            </div>

            {/* ── Footer link ───────────────────────────────── */}
            <p className="mt-8 text-center text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
              New here?{" "}
              <Link
                to="/auth/signup"
                className="text-foreground font-black hover:text-primary transition-colors underline underline-offset-4 decoration-border"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
