import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiShield, FiArrowRight, FiRefreshCw } from "react-icons/fi";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

const OtpVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(59);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Grab email from navigation state if available
  const email = location.state?.email || "your email";

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(data)) return;

    const pasteData = data.split("");
    const newOtp = [
      ...pasteData,
      ...new Array(6 - pasteData.length).fill(""),
    ].slice(0, 6);
    setOtp(newOtp);

    const lastIdx = Math.min(pasteData.length, 5);
    inputRefs.current[lastIdx].focus();
  };

  const handleResend = async () => {
    try {
      await axios.post(
        "https://themiahshohag.vercel.app//api/auth/resend-otp",
        { email },
        { withCredentials: true },
      );
      setTimer(59);
      toast.success("New code sent!");
    } catch (error) {
      toast.error("Failed to resend code");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const otpCode = otp.join("");
    try {
      const response = await axios.post(
        "https://themiahshohag.vercel.app//api/auth/verify-account",
        { otp: otpCode, email },
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success("Account Verified!");
        setTimeout(() => navigate("/auth/signin"), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 selection:bg-primary selection:text-black">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/[0.02] border border-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <FiShield size={32} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
            Verify Identity
          </h2>
          <p className="text-sm text-gray-400">
            Enter the 6-digit code sent to <br />
            <span className="text-primary font-medium">{email}</span>
          </p>
        </div>

        <div className="flex justify-between gap-2 mb-8" onPaste={handlePaste}>
          {otp.map((data, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={data}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-full h-14 text-center text-xl font-bold bg-white/5 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-xl outline-none transition-all text-white"
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleSubmit}
          disabled={otp.join("").length < 6 || loading}
          className="w-full bg-primary text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 uppercase text-xs tracking-widest"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <>
              Verify Account <FiArrowRight />
            </>
          )}
        </motion.button>

        <div className="mt-8 text-center">
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className="text-xs font-bold uppercase tracking-widest text-primary disabled:text-gray-600 flex items-center justify-center gap-2 mx-auto transition-colors"
          >
            <FiRefreshCw className={timer === 0 ? "animate-spin" : ""} />
            {timer > 0 ? `Resend code in ${timer}s` : "Resend OTP Now"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpVerification;
