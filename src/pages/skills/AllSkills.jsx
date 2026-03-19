import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiLayers,
} from "react-icons/fi";
import { FaReact, FaNodeJs } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import DeleteModal from "../../components/shared/DeleteModal";
import PageHeader from "../../components/shared/PageHeader";
import { SkillIconRenderer } from "./AddSkill";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://themiahshohag.vercel.app/";

const SKILL_CATEGORIES = [
  { id: "frontend", label: "Frontend", icon: <FaReact />, color: "#61DAFB" },
  { id: "backend", label: "Backend", icon: <FaNodeJs />, color: "#339933" },
];

// ═══════════════════════════════════════════════════════════════
//  SKILL PILL CARD
// ═══════════════════════════════════════════════════════════════
const SkillCard = ({ skill, index, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.88 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.88 }}
    transition={{
      delay: index * 0.04,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    }}
    className="group flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-card
      cursor-default transition-all duration-200 relative overflow-hidden"
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = `color-mix(in oklch, ${skill.color} 45%, transparent)`;
      e.currentTarget.style.boxShadow = `0 6px 20px color-mix(in oklch, ${skill.color} 18%, transparent)`;
      e.currentTarget.style.background = `color-mix(in oklch, ${skill.color} 6%, var(--card))`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "";
      e.currentTarget.style.boxShadow = "";
      e.currentTarget.style.background = "";
    }}
  >
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
      style={{
        background: `radial-gradient(ellipse at 0% 50%, color-mix(in oklch, ${skill.color} 10%, transparent), transparent 70%)`,
      }}
    />
    <div
      className="relative w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{
        background: `color-mix(in oklch, ${skill.color} 14%, transparent)`,
        border: `1px solid color-mix(in oklch, ${skill.color} 22%, transparent)`,
      }}
    >
      <SkillIconRenderer name={skill.iconName} color={skill.color} size={14} />
    </div>

    <span className="relative flex-1 text-[12px] font-bold tracking-wide text-muted-foreground group-hover:text-foreground transition-colors duration-200 truncate">
      {skill.name}
    </span>

    <div className="relative flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
      <Link
        to={`/admin/skills/edit/${skill._id}`}
        onClick={(e) => e.stopPropagation()}
        className="p-1.5 rounded-lg bg-card border border-border text-muted-foreground
          hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90"
      >
        <FiEdit2 size={11} />
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(skill._id);
        }}
        className="p-1.5 rounded-lg bg-card border border-border text-muted-foreground
          hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all active:scale-90"
      >
        <FiTrash2 size={11} />
      </button>
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
//  SKELETON / EMPTY / STAT
// ═══════════════════════════════════════════════════════════════
const SkeletonCard = ({ i }) => (
  <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-card animate-pulse">
    <div className="w-8 h-8 rounded-xl bg-muted flex-shrink-0" />
    <div className="h-2.5 bg-muted rounded-full flex-1" />
  </div>
);

const EmptyState = ({ hasSearch }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="col-span-full py-16 flex flex-col items-center justify-center gap-4"
  >
    <div className="w-14 h-14 rounded-3xl bg-muted border border-border flex items-center justify-center">
      <FiLayers size={20} className="text-muted-foreground/30" />
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 font-mono">
      {hasSearch ? "No matching skills found" : "No skills yet"}
    </p>
  </motion.div>
);

const StatCard = ({ label, value, chartVar, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="relative bg-card border border-border rounded-2xl p-4 space-y-1 overflow-hidden"
  >
    <div
      className="absolute top-0 left-0 right-0 h-[1px]"
      style={{
        background: `linear-gradient(90deg, transparent, var(${chartVar}), transparent)`,
      }}
    />
    <p className="text-2xl font-black tracking-tighter text-foreground">
      {value}
    </p>
    <p
      className="text-[9px] font-black uppercase tracking-[0.25em] font-mono"
      style={{ color: `var(${chartVar})` }}
    >
      {label}
    </p>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
//  CATEGORY SECTION
// ═══════════════════════════════════════════════════════════════
const CategorySection = ({ category, skills, loading, limit, onDelete }) => {
  const cat = SKILL_CATEGORIES.find((c) => c.id === category);
  const catColor = cat?.color || "var(--brand)";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `color-mix(in oklch, ${catColor} 15%, transparent)`,
            border: `1px solid color-mix(in oklch, ${catColor} 25%, transparent)`,
            color: catColor,
          }}
        >
          {cat?.icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 font-mono">
          {cat?.label}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
        {!loading && (
          <span
            className="text-[9px] font-black font-mono tabular-nums px-2 py-0.5 rounded-full"
            style={{
              background: `color-mix(in oklch, ${catColor} 12%, transparent)`,
              color: catColor,
              border: `1px solid color-mix(in oklch, ${catColor} 20%, transparent)`,
            }}
          >
            {skills.length}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
        {loading ? (
          Array.from({ length: Math.ceil(limit / 2) }).map((_, i) => (
            <SkeletonCard key={i} i={i} />
          ))
        ) : (
          <AnimatePresence mode="popLayout">
            {skills.length > 0 ? (
              skills.map((skill, i) => (
                <SkillCard
                  key={skill._id}
                  skill={skill}
                  index={i}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState hasSearch={false} />
              </div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════
const AllSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  // ✅ Separate counters from API — not derived from paginated slice
  const [frontendTotal, setFrontendTotal] = useState(0);
  const [backendTotal, setBackendTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("order");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // ── Fetch counts once (no filter) for stat cards ─────────
  const fetchCounts = useCallback(async () => {
    try {
      const [fe, be] = await Promise.all([
        axios.get(`${API_BASE}/api/skills`, {
          params: { category: "frontend", limit: 1, page: 1 },
          withCredentials: true,
        }),
        axios.get(`${API_BASE}/api/skills`, {
          params: { category: "backend", limit: 1, page: 1 },
          withCredentials: true,
        }),
      ]);
      if (fe.data.success) setFrontendTotal(fe.data.total ?? 0);
      if (be.data.success) setBackendTotal(be.data.total ?? 0);
    } catch {
      /* counts are non-critical */
    }
  }, []);

  // ── Fetch paginated skills ────────────────────────────────
  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/api/skills`, {
        params: {
          page,
          limit,
          sortBy,
          order,
          ...(search && { search }),
          ...(activeCategory !== "all" && { category: activeCategory }),
        },
        withCredentials: true,
      });
      if (data.success) {
        setSkills(data.data);
        setTotal(data.total ?? data.count ?? data.data.length);
        setTotalPages(data.totalPages ?? 1);
      }
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to load skills.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, order, search, activeCategory]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);
  useEffect(() => {
    setPage(1);
  }, [search, activeCategory, sortBy, order, limit]);
  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setOpenDeleteModal(null);
    try {
      const { data } = await axios.delete(`${API_BASE}/api/skills/${id}`, {
        withCredentials: true,
      });
      if (data.success) {
        toast.success(data.message);
        fetchSkills();
        fetchCounts(); // ✅ refresh stat counters after delete
      }
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to delete.");
    }
  };

  // ── Derived from paginated slice (for grouped view only) ──
  const frontendSkills = skills.filter((s) => s.category === "frontend");
  const backendSkills = skills.filter((s) => s.category === "backend");

  // ════════════════════════════════════════════════════════════
  return (
    <section className="py-8 min-h-screen text-foreground bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeader title="Skill Vault" />
          <Link
            to="/admin/skills/new"
            className="group flex items-center gap-2.5 px-6 py-3 bg-primary text-primary-foreground
              rounded-2xl text-[10px] font-black uppercase tracking-widest font-mono
              hover:opacity-90 transition-all shadow-lg active:scale-95 w-fit"
          >
            <FiPlus
              size={14}
              className="group-hover:rotate-90 transition-transform duration-200"
            />
            Add Skill
          </Link>
        </div>

        {/* ── Stats — use API totals, not slice ───────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard
            label="Total Skills"
            value={frontendTotal + backendTotal}
            chartVar="--primary"
            delay={0}
          />
          <StatCard
            label="Frontend"
            value={frontendTotal}
            chartVar="--chart-1"
            delay={0.05}
          />
          <StatCard
            label="Backend"
            value={backendTotal}
            chartVar="--chart-2"
            delay={0.1}
          />
        </div>

        {/* ── Search + Filter bar ─────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <FiSearch
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors"
            />
            <input
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-2xl py-3 pl-11 pr-10 text-sm
                text-foreground placeholder:text-muted-foreground/40
                focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
            />
            <AnimatePresence>
              {search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground"
                >
                  <FiX size={13} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: "all", label: "All" },
              {
                id: "frontend",
                label: "Frontend",
                icon: <FaReact size={11} />,
              },
              { id: "backend", label: "Backend", icon: <FaNodeJs size={11} /> },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest font-mono transition-all duration-200"
                  style={
                    isActive
                      ? {
                          background: "var(--brand)",
                          borderColor: "var(--brand)",
                          color: "var(--brand-fg, #fff)",
                        }
                      : {
                          background: "var(--card)",
                          borderColor: "var(--border)",
                          color: "var(--muted-foreground)",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.borderColor = "var(--brand-border)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  {cat.icon}
                  {cat.label}
                </motion.button>
              );
            })}
          </div>

          <button
            onClick={() => {
              setSortBy("order");
              setOrder((p) => (p === "asc" ? "desc" : "asc"));
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-border bg-card text-[10px] font-black uppercase tracking-widest font-mono text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            Order {order === "asc" ? "↑" : "↓"}
          </button>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/50 border border-border rounded-2xl">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground font-mono">
              Total
            </span>
            <span className="text-sm font-black text-foreground font-mono tabular-nums">
              {total}
            </span>
          </div>
        </div>

        {/* ── Skill Wall ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative bg-card border border-border rounded-3xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="p-6 space-y-10">
            {activeCategory !== "all" || search ? (
              <div className="space-y-4">
                {activeCategory !== "all" && (
                  <div className="flex items-center gap-3 mb-2">
                    <motion.span
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="block h-[2px] w-8 origin-left"
                      style={{ background: "var(--brand)" }}
                    />
                    <span
                      className="text-[10px] font-black uppercase tracking-[0.3em] font-mono"
                      style={{ color: "var(--brand)" }}
                    >
                      {
                        SKILL_CATEGORIES.find((c) => c.id === activeCategory)
                          ?.label
                      }{" "}
                      Skills
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
                  {loading ? (
                    Array.from({ length: limit }).map((_, i) => (
                      <SkeletonCard key={i} i={i} />
                    ))
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {skills.length > 0 ? (
                        skills.map((skill, i) => (
                          <SkillCard
                            key={skill._id}
                            skill={skill}
                            index={i}
                            onDelete={(id) => setOpenDeleteModal(id)}
                          />
                        ))
                      ) : (
                        <EmptyState hasSearch={!!search} />
                      )}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            ) : (
              <>
                <CategorySection
                  category="frontend"
                  skills={frontendSkills}
                  loading={loading}
                  limit={limit}
                  onDelete={(id) => setOpenDeleteModal(id)}
                />
                <CategorySection
                  category="backend"
                  skills={backendSkills}
                  loading={loading}
                  limit={limit}
                  onDelete={(id) => setOpenDeleteModal(id)}
                />
                {!loading && skills.length === 0 && (
                  <EmptyState hasSearch={false} />
                )}
              </>
            )}
          </div>
        </motion.div>

        {/* ── Pagination ──────────────────────────────────── */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 rounded-2xl border border-border bg-card"
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground font-mono">
                Per page
              </span>
              {[20, 40, 60].map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLimit(l);
                    setPage(1);
                  }}
                  className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all ${
                    limit === l
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest">
              Page {page} of {totalPages} · {total} skills
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2.5 rounded-xl bg-secondary border border-border disabled:opacity-30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <FiChevronLeft size={13} />
              </button>
              {Array.from(
                { length: Math.min(totalPages, 7) },
                (_, i) => i + 1,
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold border transition-all ${
                    page === p
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2.5 rounded-xl bg-secondary border border-border disabled:opacity-30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <FiChevronRight size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <DeleteModal
        isOpen={!!openDeleteModal}
        title={skills.find((s) => s._id === openDeleteModal)?.name}
        onClose={() => setOpenDeleteModal(null)}
        onConfirm={() => handleDelete(openDeleteModal)}
      />
    </section>
  );
};

export default AllSkills;
