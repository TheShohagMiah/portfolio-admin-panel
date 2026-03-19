import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiLinkedin,
  FiMessageSquare,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

const Contact = () => {
  // ── Form State ────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // ── Variants ──────────────────────────────────────────────────────────────
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const contactItems = [
    {
      icon: <FiMail />,
      label: "Secure Email",
      value: "hello@shohag.me",
      href: "mailto:hello@shohag.me",
    },
    {
      icon: <FiPhone />,
      label: "Direct Signal",
      value: "+357 00 000 000",
      href: "https://wa.me/yourlink",
    },
    {
      icon: <FiMapPin />,
      label: "Base of Operations",
      value: "Nicosia, Cyprus",
      href: "#",
    },
  ];

  // ── Input change handler ──────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on type
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ── Submit handler ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else if (res.status === 422 && data.errors) {
        // ── Zod validation errors ────────────────────────────────
        const mapped = {};
        data.errors.forEach(({ field, message }) => {
          mapped[field] = message;
        });
        setFieldErrors(mapped);
        setStatus("idle");
      } else {
        setErrorMsg(data.message || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection.");
      setStatus("error");
    }
  };

  // ── Shared input className ────────────────────────────────────────────────
  const inputCls = (field) =>
    `w-full bg-secondary/50 border rounded-2xl py-4 px-6 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:ring-4 focus:ring-[color:var(--brand-muted)] ${
      fieldErrors[field]
        ? "border-red-500/50 focus:border-red-500"
        : "border-border focus:border-[var(--brand-border)]"
    }`;

  return (
    <section
      id="contact"
      className="py-24 relative overflow-hidden bg-background text-foreground transition-colors duration-500"
    >
      {/* ── Ambient Glows ────────────────────────────────────────────── */}
      <div
        className="absolute top-1/4 -right-20 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: "var(--brand-glow)", opacity: 0.6 }}
      />
      <div
        className="absolute bottom-0 -left-20 w-[300px] h-[300px] rounded-full blur-[100px] pointer-events-none"
        style={{ backgroundColor: "var(--brand-glow)", opacity: 0.4 }}
      />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="h-[2px] w-12"
              style={{
                background: "var(--brand)",
                boxShadow: "0 0 15px var(--brand-glow)",
              }}
            />
            <span
              className="font-bold uppercase tracking-[0.4em] text-[10px]"
              style={{ color: "var(--brand)" }}
            >
              Collaboration Portal
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold text-foreground tracking-tighter leading-[1.1]">
            Let's build something <br />
            <span
              className="italic font-serif"
              style={{ color: "var(--brand)" }}
            >
              extraordinary.
            </span>
          </h2>

          <p className="mt-8 text-muted-foreground max-w-xl text-lg leading-relaxed">
            I'm currently accepting new projects and consulting engagements. If
            you have a vision, let's turn it into a digital reality.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* ── Form Terminal ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 bg-card border border-border p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden"
          >
            {/* Decorative bg icon */}
            <FiMessageSquare
              className="absolute -top-10 -right-10 rotate-12 pointer-events-none"
              size={300}
              style={{ color: "var(--brand)", opacity: 0.03 }}
            />

            {/* ── Success State ── */}
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center text-center py-16 gap-6 relative z-10"
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--brand-muted)" }}
                  >
                    <FiCheckCircle
                      size={36}
                      style={{ color: "var(--brand)" }}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight mb-2">
                      Signal Dispatched!
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-xs">
                      Your message has been received. I'll get back to you
                      shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] border border-border px-6 py-3 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                // ── Form ──────────────────────────────────────────────────
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-8 relative z-10"
                >
                  {/* Name + Email */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                        Identity
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className={inputCls("name")}
                      />
                      {fieldErrors.name && (
                        <p className="text-red-500 text-[11px] ml-1 flex items-center gap-1">
                          <FiAlertCircle className="size-3" />
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                        Electronic Mail
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="name@provider.com"
                        className={inputCls("email")}
                      />
                      {fieldErrors.email && (
                        <p className="text-red-500 text-[11px] ml-1 flex items-center gap-1">
                          <FiAlertCircle className="size-3" />
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone + Subject */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                        Signal Channel{" "}
                        <span className="opacity-40 normal-case tracking-normal">
                          (optional)
                        </span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                        className={inputCls("phone")}
                      />
                      {fieldErrors.phone && (
                        <p className="text-red-500 text-[11px] ml-1 flex items-center gap-1">
                          <FiAlertCircle className="size-3" />
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                        Mission Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="Project inquiry, collab..."
                        className={inputCls("subject")}
                      />
                      {fieldErrors.subject && (
                        <p className="text-red-500 text-[11px] ml-1 flex items-center gap-1">
                          <FiAlertCircle className="size-3" />
                          {fieldErrors.subject}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                      The Brief
                    </label>
                    <textarea
                      rows="5"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Outline your project goals, scope, and timeline..."
                      className={`${inputCls("message")} resize-none`}
                    />
                    {fieldErrors.message && (
                      <p className="text-red-500 text-[11px] ml-1 flex items-center gap-1">
                        <FiAlertCircle className="size-3" />
                        {fieldErrors.message}
                      </p>
                    )}
                  </div>

                  {/* ── Global Error ── */}
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 bg-red-500/5 border border-red-500/20 rounded-2xl px-5 py-4"
                    >
                      <FiAlertCircle className="text-red-500 shrink-0" />
                      <p className="text-sm text-red-500">{errorMsg}</p>
                    </motion.div>
                  )}

                  {/* ── Submit Button ── */}
                  <motion.button
                    type="submit"
                    disabled={status === "loading"}
                    whileHover={
                      status !== "loading" ? { scale: 1.02, x: 5 } : {}
                    }
                    whileTap={status !== "loading" ? { scale: 0.98 } : {}}
                    className="group w-full md:w-auto flex items-center justify-center gap-4 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "var(--brand)",
                      color: "var(--brand-foreground)",
                      boxShadow: "0 8px 32px var(--brand-glow)",
                    }}
                  >
                    {status === "loading" ? (
                      <>
                        <FiLoader className="animate-spin" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        Dispatch Signal
                        <FiSend className="text-lg transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Contact Channels ──────────────────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-12 lg:pl-10"
          >
            <div className="space-y-6">
              <h3
                className="text-[10px] font-black uppercase tracking-[0.3em]"
                style={{ color: "var(--brand)" }}
              >
                Primary Contact
              </h3>

              <div className="space-y-4">
                {contactItems.map((item, i) => (
                  // ✅ Fix 3: hover handled only on parent <a>, no inner p hover
                  <motion.a
                    key={i}
                    variants={itemVariants}
                    href={item.href}
                    className="flex items-center gap-6 p-6 rounded-[2rem] border border-border bg-card transition-all group shadow-sm hover:border-[var(--brand-border)] hover:bg-[var(--brand-muted)]"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 group-hover:rotate-3 transition-transform shrink-0"
                      style={{
                        backgroundColor: "var(--brand-muted)",
                        color: "var(--brand)",
                      }}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">
                        {item.label}
                      </p>
                      {/* ✅ Fix 4: removed broken --hover-color, use group-hover Tailwind */}
                      <p className="text-sm font-bold text-foreground group-hover:text-[var(--brand)] transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* ── LinkedIn Card ─────────────────────────────────────────── */}
            <motion.div
              variants={itemVariants}
              className="group relative p-10 rounded-[2.5rem] bg-foreground text-background overflow-hidden shadow-2xl"
            >
              <FiLinkedin
                size={180}
                className="absolute -right-10 -bottom-10 opacity-[0.05] group-hover:rotate-12 transition-transform duration-700"
              />

              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2.5 bg-background text-foreground rounded-xl">
                  <FiLinkedin className="text-lg" />
                </div>
                <h4 className="font-black uppercase text-[10px] tracking-[0.3em] opacity-50">
                  Network Pulse
                </h4>
              </div>

              <p className="text-xl font-serif italic font-bold leading-tight mb-8 relative z-10">
                "Connecting with visionaries and sharing insights on the future
                of digital architecture."
              </p>

              <a
                href="#"
                className="group/btn relative flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg hover:opacity-90"
                style={{
                  backgroundColor: "var(--brand)",
                  color: "var(--brand-foreground)",
                }}
              >
                LinkedIn Profile
                <FiArrowRight className="transition-transform group-hover/btn:translate-x-2" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
