import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FiMail,
  FiTrash2,
  FiSend,
  FiCheckCircle,
  FiClock,
  FiPhone,
  FiUser,
  FiAlertCircle,
  FiRefreshCw,
  FiInbox,
  FiX,
  FiHash,
  FiSearch,
  FiArrowLeft,
  FiChevronRight,
} from "react-icons/fi";
import { RiMailSendLine, RiSpam2Line } from "react-icons/ri";
import { HiOutlineMailOpen } from "react-icons/hi";
import { TbMailFast } from "react-icons/tb";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://themiahshohag.vercel.app/";

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════
const fmt = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const fmtFull = (d) => new Date(d).toLocaleString();
const initials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const AVATAR_VARS = [
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
];

// ═══════════════════════════════════════════════════════════════
//  AVATAR
// ═══════════════════════════════════════════════════════════════
const AvatarCircle = ({ name, index, size = "md" }) => {
  const v = AVATAR_VARS[index % AVATAR_VARS.length];
  const sz =
    size === "sm"
      ? "w-8 h-8 text-[10px]"
      : size === "lg"
        ? "w-11 h-11 text-sm"
        : "w-10 h-10 text-xs";
  return (
    <div
      className={`${sz} rounded-2xl flex items-center justify-center font-black shrink-0`}
      style={{
        background: `color-mix(in oklch, var(${v}) 15%, transparent)`,
        color: `var(${v})`,
        boxShadow: `0 0 0 1px color-mix(in oklch, var(${v}) 20%, transparent)`,
      }}
    >
      {initials(name)}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  STATUS BADGE
// ═══════════════════════════════════════════════════════════════
const StatusBadge = ({ isReplied, size = "sm" }) => (
  <span
    className={`inline-flex items-center gap-1 font-black uppercase tracking-[0.15em] rounded-full border px-2 py-0.5 ${
      size === "xs" ? "text-[8px]" : "text-[9px]"
    }`}
    style={
      isReplied
        ? {
            color: "var(--chart-2)",
            borderColor: "color-mix(in oklch, var(--chart-2) 25%, transparent)",
            backgroundColor:
              "color-mix(in oklch, var(--chart-2) 8%, transparent)",
          }
        : {
            color: "var(--chart-3)",
            borderColor: "color-mix(in oklch, var(--chart-3) 25%, transparent)",
            backgroundColor:
              "color-mix(in oklch, var(--chart-3) 8%, transparent)",
          }
    }
  >
    {isReplied ? (
      <>
        <FiCheckCircle className="size-2" /> Replied
      </>
    ) : (
      <>
        <FiClock className="size-2" /> Pending
      </>
    )}
  </span>
);

// ═══════════════════════════════════════════════════════════════
//  STAT CARD
// ═══════════════════════════════════════════════════════════════
const StatCard = ({ label, value, icon, chartVar, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="bg-card border border-border rounded-2xl p-4 space-y-2"
  >
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center"
      style={{
        color: `var(${chartVar})`,
        background: `color-mix(in oklch, var(${chartVar}) 12%, transparent)`,
        border: `1px solid color-mix(in oklch, var(${chartVar}) 20%, transparent)`,
      }}
    >
      {icon}
    </div>
    <p className="text-2xl font-black tracking-tighter">{value}</p>
    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-muted-foreground/50">
      {label}
    </p>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
//  FILTER PILL
// ═══════════════════════════════════════════════════════════════
const FilterPill = ({ label, count, active, onClick, chartVar }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
    style={
      active
        ? {
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            borderColor: "var(--primary)",
          }
        : chartVar
          ? {
              color: `var(${chartVar})`,
              borderColor: `color-mix(in oklch, var(${chartVar}) 30%, transparent)`,
              backgroundColor: `color-mix(in oklch, var(${chartVar}) 5%, transparent)`,
            }
          : { color: "var(--muted-foreground)", borderColor: "var(--border)" }
    }
  >
    {label}
    <span
      className="px-1.5 py-0.5 rounded-full text-[8px] font-black"
      style={
        active
          ? { background: "rgba(255,255,255,0.2)" }
          : { background: "color-mix(in oklch, currentColor 15%, transparent)" }
      }
    >
      {count}
    </span>
  </button>
);

// ═══════════════════════════════════════════════════════════════
//  MESSAGE LIST ITEM
// ═══════════════════════════════════════════════════════════════
const MessageListItem = ({ msg, index, isActive, onClick }) => (
  <motion.button
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ delay: index * 0.025 }}
    onClick={onClick}
    className={`w-full text-left p-4 border-b border-border/40 transition-all relative group border-l-[3px] ${
      isActive
        ? "bg-primary/5 border-l-primary"
        : "hover:bg-secondary/40 border-l-transparent"
    }`}
  >
    {!msg.isReplied && (
      <span className="absolute top-3.5 right-3.5 flex size-2">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{ background: "var(--chart-3)" }}
        />
        <span
          className="relative inline-flex rounded-full size-2"
          style={{ background: "var(--chart-3)" }}
        />
      </span>
    )}
    <div className="flex items-start gap-3 pr-4">
      <AvatarCircle name={msg.name} index={index} />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={`font-bold text-xs truncate ${isActive ? "text-primary" : "text-foreground"}`}
          >
            {msg.name}
          </p>
          <p className="text-[8px] text-muted-foreground/40 font-bold shrink-0">
            {fmt(msg.createdAt)}
          </p>
        </div>
        <p className="text-[11px] font-semibold text-muted-foreground/70 truncate">
          {msg.subject}
        </p>
        <p className="text-[10px] text-muted-foreground/45 truncate leading-relaxed">
          {msg.message}
        </p>
        <div className="pt-1 flex items-center justify-between">
          <StatusBadge isReplied={msg.isReplied} size="xs" />
          <FiChevronRight className="size-3 text-muted-foreground/20 sm:hidden" />
        </div>
      </div>
    </div>
  </motion.button>
);

// ═══════════════════════════════════════════════════════════════
//  DETAIL PANEL
// ═══════════════════════════════════════════════════════════════
const DetailPanel = ({
  activeMsg,
  messages,
  replyMode,
  setReplyMode,
  replyText,
  setReplyText,
  replyStatus,
  replyError,
  setReplyError,
  handleReply,
  setDeleteId,
  onBack,
}) => (
  <motion.div
    key={activeMsg._id}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    className="flex flex-col h-full min-h-0"
  >
    {/* Top bar */}
    <div className="shrink-0 px-4 sm:px-6 py-4 border-b border-border">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="sm:hidden w-8 h-8 rounded-xl bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-all shrink-0"
          >
            <FiArrowLeft className="size-4" />
          </button>
          <AvatarCircle
            name={activeMsg.name}
            index={messages.findIndex((m) => m._id === activeMsg._id)}
            size="lg"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-sm tracking-tight truncate">
                {activeMsg.name}
              </p>
              <StatusBadge isReplied={activeMsg.isReplied} />
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {activeMsg.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!activeMsg.isReplied && !replyMode && (
            <button
              onClick={() => setReplyMode(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 border border-primary/20 text-primary rounded-xl text-[9px] font-black uppercase tracking-[0.15em] hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
            >
              <RiMailSendLine className="size-3" />
              <span className="hidden sm:inline">Reply</span>
            </button>
          )}
          <button
            onClick={() => setDeleteId(activeMsg._id)}
            className="w-8 h-8 rounded-xl bg-destructive/5 border border-destructive/10 flex items-center justify-center text-destructive/50 hover:bg-destructive/10 hover:text-destructive transition-all active:scale-95"
          >
            <FiTrash2 className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Subject + meta chips */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2">
          <FiHash className="size-3 text-muted-foreground/40 shrink-0" />
          <p className="text-sm font-bold text-foreground/90 truncate">
            {activeMsg.subject}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { icon: <FiUser className="size-2.5" />, val: activeMsg.name },
            { icon: <FiMail className="size-2.5" />, val: activeMsg.email },
            {
              icon: <FiPhone className="size-2.5" />,
              val: activeMsg.phone || "No phone",
            },
            {
              icon: <FiClock className="size-2.5" />,
              val: fmt(activeMsg.createdAt),
            },
          ].map((c, i) => (
            <span
              key={i}
              className="flex items-center gap-1 bg-secondary/50 border border-border rounded-full px-2.5 py-1 text-[9px] font-medium text-muted-foreground"
            >
              {c.icon} {c.val}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Chat thread — scrollable */}
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6 min-h-0">
      {/* Incoming */}
      <div className="flex items-end gap-3 max-w-[90%] sm:max-w-[80%]">
        <AvatarCircle
          name={activeMsg.name}
          index={messages.findIndex((m) => m._id === activeMsg._id)}
          size="sm"
        />
        <div className="space-y-1">
          <div className="bg-card border border-border rounded-3xl rounded-bl-lg px-4 sm:px-5 py-4 shadow-sm">
            <p className="text-sm text-foreground/85 leading-relaxed">
              {activeMsg.message}
            </p>
          </div>
          <p className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-wider ml-1">
            {fmtFull(activeMsg.createdAt)}
          </p>
        </div>
      </div>

      {/* Reply bubble */}
      {activeMsg.isReplied && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end gap-3 max-w-[90%] sm:max-w-[80%] ml-auto flex-row-reverse"
        >
          <div className="w-8 h-8 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center text-xs font-black text-primary shrink-0">
            ME
          </div>
          <div className="space-y-1">
            <div className="bg-primary/10 border border-primary/20 rounded-3xl rounded-br-lg px-4 sm:px-5 py-4">
              <p className="text-sm text-foreground/85 leading-relaxed">
                {activeMsg.reply}
              </p>
            </div>
            <p className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-wider text-right mr-1">
              {fmtFull(activeMsg.replyDate)}
            </p>
          </div>
        </motion.div>
      )}

      {/* Success toast */}
      <AnimatePresence>
        {replyStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 mx-auto max-w-xs"
            style={{
              background:
                "color-mix(in oklch, var(--chart-2) 10%, transparent)",
              border:
                "1px solid color-mix(in oklch, var(--chart-2) 25%, transparent)",
            }}
          >
            <FiCheckCircle
              className="size-4 shrink-0"
              style={{ color: "var(--chart-2)" }}
            />
            <p
              className="text-xs font-bold"
              style={{ color: "var(--chart-2)" }}
            >
              Reply transmitted!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* Reply composer */}
    <AnimatePresence>
      {replyMode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="shrink-0 border-t border-border bg-card/50 backdrop-blur-sm p-3 sm:p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center">
              <RiMailSendLine className="size-3 text-primary" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/50 flex-1">
              Reply to {activeMsg.name}
            </p>
            <button
              onClick={() => {
                setReplyMode(false);
                setReplyText("");
                setReplyError("");
              }}
              className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              <FiX className="size-4" />
            </button>
          </div>

          <div
            className={`rounded-2xl border transition-colors p-3 ${replyError ? "border-destructive/40 bg-destructive/5" : "border-border bg-secondary/20 focus-within:border-primary/40"}`}
          >
            <textarea
              rows={3}
              autoFocus
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => {
                setReplyText(e.target.value);
                setReplyError("");
              }}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/30 resize-none outline-none leading-relaxed"
            />
            <div className="flex items-center justify-between mt-1">
              <AnimatePresence>
                {replyError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 text-destructive text-[10px] font-bold"
                  >
                    <FiAlertCircle className="size-3" /> {replyError}
                  </motion.p>
                )}
              </AnimatePresence>
              <p
                className={`text-[9px] font-bold ml-auto tabular-nums ${replyText.length > 4900 ? "text-destructive" : "text-muted-foreground/30"}`}
              >
                {replyText.length}/5000
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <button
              onClick={handleReply}
              disabled={replyStatus === "loading"}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
            >
              {replyStatus === "loading" ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                  Sending...
                </>
              ) : (
                <>
                  <FiSend className="size-3" /> Send
                </>
              )}
            </button>
            <button
              onClick={() => {
                setReplyMode(false);
                setReplyText("");
                setReplyError("");
              }}
              className="px-4 py-2.5 rounded-2xl bg-secondary/50 border border-border text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] hover:bg-secondary hover:text-foreground transition-all active:scale-95"
            >
              Discard
            </button>
            {replyText.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 ml-auto"
              >
                <div className="flex gap-0.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -3, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      className="w-1 h-1 rounded-full bg-primary/50"
                    />
                  ))}
                </div>
                <p className="text-[9px] text-muted-foreground/40 font-bold">
                  Composing...
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Already replied footer */}
    {activeMsg.isReplied && !replyMode && (
      <div className="shrink-0 border-t border-border px-4 sm:px-6 py-3 flex items-center gap-2">
        <FiCheckCircle
          className="size-3.5 shrink-0"
          style={{ color: "var(--chart-2)" }}
        />
        <p
          className="text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{
            color: "color-mix(in oklch, var(--chart-2) 70%, transparent)",
          }}
        >
          Resolved · {fmt(activeMsg.replyDate)}
        </p>
      </div>
    )}
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════
const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyMode, setReplyMode] = useState(false);
  const [replyStatus, setReplyStatus] = useState("idle");
  const [replyError, setReplyError] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [mobileView, setMobileView] = useState("list");

  const fetchMessages = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/contact`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setMessages(res.data.data);
        setError(null);
      } else setError("Failed to fetch messages.");
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReply = async () => {
    if (!replyText.trim() || replyText.trim().length < 5) {
      setReplyError("Reply must be at least 5 characters.");
      return;
    }
    setReplyStatus("loading");
    setReplyError("");
    try {
      const res = await axios.post(
        `${API_BASE}/api/contact/reply/${selected}`,
        { replyMessage: replyText.trim() },
        { withCredentials: true },
      );
      if (res.data.success) {
        setReplyStatus("success");
        setReplyText("");
        setReplyMode(false);
        fetchMessages(true);
        setTimeout(() => setReplyStatus("idle"), 3000);
      } else {
        setReplyError(res.data.message || "Failed.");
        setReplyStatus("error");
      }
    } catch (err) {
      setReplyError(err.response?.data?.message || "Server error.");
      setReplyStatus("error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/contact/${id}`, {
        withCredentials: true,
      });
      if (selected === id) {
        setSelected(null);
        setMobileView("list");
      }
      setDeleteId(null);
      fetchMessages(true);
    } catch {
      alert("Failed to delete.");
    }
  };

  const selectMessage = (id) => {
    setSelected(id);
    setReplyMode(false);
    setReplyText("");
    setReplyStatus("idle");
    setReplyError("");
    setMobileView("detail");
  };

  const backToList = () => {
    setMobileView("list");
    setSelected(null);
  };

  const filtered = messages
    .filter((m) =>
      filter === "pending"
        ? !m.isReplied
        : filter === "replied"
          ? m.isReplied
          : true,
    )
    .filter(
      (m) =>
        !search.trim() ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.subject.toLowerCase().includes(search.toLowerCase()),
    );

  const activeMsg = messages.find((m) => m._id === selected);
  const pendingCount = messages.filter((m) => !m.isReplied).length;
  const repliedCount = messages.filter((m) => m.isReplied).length;

  // ════════════════════════════════════════════════════════════
  //  ✅ NO h-screen / h-[100dvh] — fills layout slot via h-full
  // ════════════════════════════════════════════════════════════
  return (
    <div className="h-full flex flex-col text-foreground overflow-hidden">
      {/* ── Top nav ─���───────────────────────────────────── */}
      <div className="shrink-0 px-4 sm:px-6 py-4 border-b border-border flex items-center justify-between gap-4 bg-card/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <TbMailFast className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight leading-none">
              Inquiry Inbox
            </h1>
            <p className="text-[10px] text-muted-foreground/50 font-bold uppercase tracking-widest mt-0.5">
              {messages.length} total · {pendingCount} pending
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Filter pills — sm+ only */}
          <div className="hidden sm:flex items-center gap-2">
            <FilterPill
              label="All"
              count={messages.length}
              active={filter === "all"}
              onClick={() => setFilter("all")}
            />
            <FilterPill
              label="Pending"
              count={pendingCount}
              active={filter === "pending"}
              onClick={() => setFilter("pending")}
              chartVar="--chart-3"
            />
            <FilterPill
              label="Replied"
              count={repliedCount}
              active={filter === "replied"}
              onClick={() => setFilter("replied")}
              chartVar="--chart-2"
            />
          </div>
          <button
            onClick={() => fetchMessages(true)}
            disabled={refreshing}
            className="w-9 h-9 rounded-2xl bg-secondary/50 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all active:scale-95 disabled:opacity-50"
          >
            <FiRefreshCw
              className={`size-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* ── Mobile filter bar ────────────────────────────── */}
      <div className="sm:hidden shrink-0 flex items-center gap-2 px-4 py-2 border-b border-border overflow-x-auto [&::-webkit-scrollbar]:hidden">
        <FilterPill
          label="All"
          count={messages.length}
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        <FilterPill
          label="Pending"
          count={pendingCount}
          active={filter === "pending"}
          onClick={() => setFilter("pending")}
          chartVar="--chart-3"
        />
        <FilterPill
          label="Replied"
          count={repliedCount}
          active={filter === "replied"}
          onClick={() => setFilter("replied")}
          chartVar="--chart-2"
        />
      </div>

      {/* ── Body ─────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Stats sidebar — xl+ */}
        <div className="hidden xl:flex w-56 shrink-0 flex-col border-r border-border bg-card/30 p-4 gap-3 overflow-y-auto">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 px-2 mb-1">
            Overview
          </p>
          <StatCard
            label="Total"
            value={messages.length}
            icon={<FiInbox className="size-4" />}
            chartVar="--primary"
            delay={0}
          />
          <StatCard
            label="Pending"
            value={pendingCount}
            icon={<FiClock className="size-4" />}
            chartVar="--chart-3"
            delay={0.07}
          />
          <StatCard
            label="Replied"
            value={repliedCount}
            icon={<FiCheckCircle className="size-4" />}
            chartVar="--chart-2"
            delay={0.14}
          />
          <div className="flex-1" />
          <div className="space-y-2 px-2">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 mb-2">
              Legend
            </p>
            {[
              { chartVar: "--chart-3", label: "Awaiting reply" },
              { chartVar: "--chart-2", label: "Replied" },
            ].map((l, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: `var(${l.chartVar})` }}
                />
                <p className="text-[10px] text-muted-foreground/60">
                  {l.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Message list */}
        <div
          className={`flex flex-col border-r border-border overflow-hidden w-full sm:w-80 lg:w-96 shrink-0 ${mobileView === "detail" ? "hidden sm:flex" : "flex"}`}
        >
          {/* Search */}
          <div className="p-3 border-b border-border shrink-0">
            <div className="flex items-center gap-2 bg-secondary/50 border border-border rounded-2xl px-3 py-2 focus-within:border-primary/40 transition-colors">
              <FiSearch className="size-3.5 text-muted-foreground/50 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages..."
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 outline-none min-w-0"
              />
              <AnimatePresence>
                {search && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearch("")}
                    className="text-muted-foreground/50 hover:text-muted-foreground shrink-0"
                  >
                    <FiX className="size-3" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {loading && (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <FiRefreshCw className="animate-spin text-muted-foreground size-5" />
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">
                  Loading...
                </p>
              </div>
            )}
            {error && !loading && (
              <div className="m-3 flex items-center gap-2 bg-destructive/5 border border-destructive/20 rounded-2xl px-4 py-3">
                <FiAlertCircle className="text-destructive size-4 shrink-0" />
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}
            {!loading && !error && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40 p-8 text-center">
                <FiInbox className="size-8 text-muted-foreground" />
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  {search ? "No results found" : `No ${filter} messages`}
                </p>
              </div>
            )}
            <AnimatePresence>
              {filtered.map((msg, i) => (
                <MessageListItem
                  key={msg._id}
                  msg={msg}
                  index={i}
                  isActive={selected === msg._id}
                  onClick={() => selectMessage(msg._id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Detail col */}
        <div
          className={`flex-1 flex flex-col overflow-hidden min-w-0 min-h-0 ${mobileView === "detail" ? "flex" : "hidden sm:flex"}`}
        >
          <AnimatePresence mode="wait">
            {!activeMsg ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center gap-6 text-center p-8"
              >
                <div className="relative w-28 h-28">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-24 h-24 rounded-[2rem] bg-card border border-border flex items-center justify-center shadow-xl">
                      <HiOutlineMailOpen className="size-10 text-muted-foreground/20" />
                    </div>
                  </motion.div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0"
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 rounded-full bg-primary/40 border border-primary/30" />
                  </motion.div>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm text-foreground/50 tracking-tight">
                    No message selected
                  </p>
                  <p className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.3em] font-bold">
                    <span className="sm:hidden">Tap a message above</span>
                    <span className="hidden sm:inline">
                      Choose from the list
                    </span>
                  </p>
                </div>
              </motion.div>
            ) : (
              <DetailPanel
                activeMsg={activeMsg}
                messages={messages}
                replyMode={replyMode}
                setReplyMode={setReplyMode}
                replyText={replyText}
                setReplyText={setReplyText}
                replyStatus={replyStatus}
                replyError={replyError}
                setReplyError={setReplyError}
                handleReply={handleReply}
                setDeleteId={setDeleteId}
                onBack={backToList}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-md p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 20 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-[2rem] p-8 max-w-xs w-full shadow-2xl relative overflow-hidden"
            >
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl pointer-events-none"
                style={{
                  background:
                    "color-mix(in oklch, var(--destructive) 15%, transparent)",
                }}
              />
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 relative z-10"
                style={{
                  background:
                    "color-mix(in oklch, var(--destructive) 10%, transparent)",
                  border:
                    "1px solid color-mix(in oklch, var(--destructive) 20%, transparent)",
                }}
              >
                <RiSpam2Line className="size-6 text-destructive" />
              </div>
              <h3 className="text-base font-bold text-center tracking-tight mb-2 relative z-10">
                Delete Message?
              </h3>
              <p className="text-xs text-muted-foreground text-center mb-7 leading-relaxed relative z-10">
                This message will be permanently removed.
              </p>
              <div className="flex gap-2 relative z-10">
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-3 rounded-2xl bg-destructive text-destructive-foreground text-[10px] font-black uppercase tracking-[0.2em] hover:opacity-90 transition-all active:scale-95"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 rounded-2xl bg-secondary border border-border text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] hover:text-foreground transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMessages;
