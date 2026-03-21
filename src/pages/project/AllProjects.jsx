import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiGlobe,
  FiFilter,
  FiGithub,
  FiChevronUp,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiLayers,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";
import DeleteModal from "../../components/shared/DeleteModal";
import PageHeader from "../../components/shared/PageHeader";
import {
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
} from "../../../constants/projectConstants";

const API_BASE = import.meta.env.VITE_API_URL;

// ═══════════════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════════════
const CATEGORIES = PROJECT_CATEGORIES;
const STATUSES = PROJECT_STATUSES;
const SORT_FIELDS = [
  { label: "Date Created", value: "createdAt" },
  { label: "Date Updated", value: "updatedAt" },
  { label: "Title", value: "title" },
  { label: "Order", value: "order" },
];

// ═══════════════════════════════════════════════════════════════
//  STATUS CONFIG — only CSS vars, no hardcoded colors
// ═══════════════════════════════════════════════════════════════
const STATUS_CONFIG = {
  published: { chartVar: "--chart-2", label: "Published", pulse: true },
  draft: { chartVar: "--chart-3", label: "Draft", pulse: false },
  pending: { chartVar: "--chart-1", label: "Pending", pulse: false },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? {
    chartVar: "--muted-foreground",
    label: status,
    pulse: false,
  };
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border"
      style={{
        color: `var(${cfg.chartVar})`,
        borderColor: `color-mix(in oklch, var(${cfg.chartVar}) 25%, transparent)`,
        backgroundColor: `color-mix(in oklch, var(${cfg.chartVar}) 8%, transparent)`,
      }}
    >
      <motion.span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: `var(${cfg.chartVar})` }}
        animate={cfg.pulse ? { opacity: [1, 0.3, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      {cfg.label}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  SORT ICON
// ═══════════════════════════════════════════════════════════════
const SortIcon = ({ field, sortBy, order }) => {
  if (sortBy !== field) return <FiChevronUp className="opacity-20" size={11} />;
  return order === "asc" ? (
    <FiChevronUp size={11} className="text-primary" />
  ) : (
    <FiChevronDown size={11} className="text-primary" />
  );
};

// ═══════════════════════════════════════════════════════════════
//  FILTER SELECT — reusable
// ═══════════════════════════════════════════════════════════════
const FilterSelect = ({ label, value, onChange, options, placeholder }) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 font-mono">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground
        focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o} className="capitalize">
          {o}
        </option>
      ))}
    </select>
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  EMPTY STATE
// ═══════════════════════════════════════════════════════════════
const EmptyState = ({ hasFilters }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="py-20 flex flex-col items-center justify-center gap-4"
  >
    <div className="w-16 h-16 rounded-3xl bg-muted border border-border flex items-center justify-center">
      <FiLayers size={24} className="text-muted-foreground/30" />
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 font-mono">
      {hasFilters ? "No matching records found" : "Vault is empty"}
    </p>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
//  LOADING SKELETON ROW
// ═══════════════════════════════════════════════════════════════
const SkeletonRow = ({ i }) => (
  <tr>
    {[1, 2, 3, 4, 5, 6].map((c) => (
      <td key={c} className="px-6 py-5">
        <div
          className="h-4 bg-muted animate-pulse rounded-lg"
          style={{
            width: `${60 + Math.random() * 30}%`,
            animationDelay: `${i * 0.05}s`,
          }}
        />
      </td>
    ))}
  </tr>
);

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  // ── Fetch ───────────────────────────────────────────────────
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        sortBy,
        order,
        ...(search && { search }),
        ...(category && { category }),
        ...(status && { status }),
        ...(technologies && { technologies }),
      };
      const { data } = await axios.get(`${API_BASE}/api/projects`, {
        params,
        withCredentials: true,
      });
      if (data.success) {
        setProjects(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, [search, category, status, technologies, sortBy, order, page, limit]);

  useEffect(() => {
    setPage(1);
  }, [search, category, status, technologies, sortBy, order]);
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ── Sort ────────────────────────────────────────────────────
  const handleSort = (field) => {
    if (sortBy === field) setOrder((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setOrder("desc");
    }
  };

  // ── Reset ───────────────────────────────────────────────────
  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setStatus("");
    setTechnologies("");
    setSortBy("createdAt");
    setOrder("desc");
    setPage(1);
  };

  // ── Delete ──────────────────────────────────────────────────
  const handleDeleteProject = async (id) => {
    setOpenDeleteModal(null);
    try {
      const { data } = await axios.delete(`${API_BASE}/api/projects/${id}`, {
        withCredentials: true,
      });
      if (data.success) {
        toast.success(data.message);
        fetchProjects();
      }
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to delete.");
    }
  };

  const activeFilterCount = [category, status, technologies].filter(
    Boolean,
  ).length;
  const hasFilters = !!(search || activeFilterCount);

  // ── Sortable TH ─────────────────────────────────────────────
  const SortTh = ({ field, children }) => (
    <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground font-mono">
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
      >
        {children}
        <SortIcon field={field} sortBy={sortBy} order={order} />
      </button>
    </th>
  );

  const PlainTh = ({ children, right }) => (
    <th
      className={`px-6 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground font-mono ${right ? "text-right" : ""}`}
    >
      {children}
    </th>
  );

  // ════════════════════════════════════════════════════════════
  return (
    <section className="py-8 min-h-screen text-foreground">
      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-6">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeader title="Project Vault" />
          <Link
            to="/admin/projects/new"
            className="group flex items-center gap-2.5 px-6 py-3 bg-primary text-primary-foreground
              rounded-2xl text-[10px] font-black uppercase tracking-widest font-mono
              hover:opacity-90 transition-all shadow-lg active:scale-95 w-fit"
          >
            <FiPlus
              size={15}
              className="group-hover:rotate-90 transition-transform duration-200"
            />
            New Project
          </Link>
        </div>

        {/* ── Search + Filter bar ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 group">
            <FiSearch
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors"
            />
            <input
              type="text"
              placeholder="Search projects..."
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

          {/* Right action group */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilter((v) => !v)}
              className={`relative flex items-center gap-2 px-4 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest font-mono transition-all ${
                showFilter
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              <FiFilter size={13} />
              Filters
              {activeFilterCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground
                    rounded-full text-[8px] font-black flex items-center justify-center ring-2 ring-background"
                >
                  {activeFilterCount}
                </motion.span>
              )}
            </button>

            {/* Total badge */}
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border border-border rounded-2xl">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground font-mono">
                Total
              </span>
              <span className="text-sm font-black text-foreground font-mono tabular-nums">
                {total}
              </span>
            </div>

            {/* Reset */}
            <AnimatePresence>
              {hasFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest font-mono
                    text-destructive border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-all"
                >
                  <FiX size={12} /> Reset
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Filter Panel ────────────────────────────────────── */}
        <AnimatePresence>
          {showFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="relative bg-card border border-border rounded-2xl p-5 overflow-hidden">
                {/* Top accent */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FilterSelect
                    label="Category"
                    value={category}
                    onChange={setCategory}
                    options={CATEGORIES}
                    placeholder="All Categories"
                  />
                  <FilterSelect
                    label="Status"
                    value={status}
                    onChange={setStatus}
                    options={STATUSES}
                    placeholder="All Statuses"
                  />
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 font-mono">
                      Technology
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. react, node"
                      value={technologies}
                      onChange={(e) => setTechnologies(e.target.value)}
                      className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground
                        placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50
                        focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Table ───────────────────────────────────────────── */}
        <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
          {/* Top accent */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* Head */}
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <SortTh field="title">Project</SortTh>
                  <PlainTh>Stack</PlainTh>
                  <PlainTh>Links</PlainTh>
                  <PlainTh>Status</PlainTh>
                  <SortTh field="createdAt">Date</SortTh>
                  <PlainTh right>Actions</PlainTh>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-border/40">
                {/* Skeleton loading */}
                {loading &&
                  Array.from({ length: limit }).map((_, i) => (
                    <SkeletonRow key={i} i={i} />
                  ))}

                {/* Rows */}
                {!loading && (
                  <AnimatePresence mode="popLayout">
                    {projects.map((project, i) => (
                      <motion.tr
                        key={project._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ delay: i * 0.04 }}
                        className="group hover:bg-secondary/20 transition-colors duration-150"
                      >
                        {/* Identity */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-10 rounded-xl bg-muted overflow-hidden border border-border flex-shrink-0">
                              <img
                                src={project.image?.url}
                                alt={project.title}
                                className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-bold tracking-tight group-hover:text-primary transition-colors">
                                {project.title}
                              </p>
                              <p className="text-[10px] text-muted-foreground/40 font-mono mt-0.5">
                                /{project?.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Tech Stack */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {project?.technologies.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 rounded-md bg-secondary text-[9px] font-medium text-muted-foreground border border-border"
                              >
                                {tag}
                              </span>
                            ))}
                            {project?.technologies.length > 4 && (
                              <span className="px-2 py-0.5 rounded-md bg-secondary text-[9px] font-medium text-muted-foreground border border-border">
                                +{project.technologies.length - 4}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Links */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <a
                              href={project?.liveLink}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors w-fit"
                            >
                              <FiGlobe size={11} /> Live
                            </a>
                            <a
                              href={project?.githubRepo}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50 hover:text-foreground transition-colors w-fit"
                            >
                              <FiGithub size={11} /> Source
                            </a>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <StatusBadge status={project.status} />
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {new Date(project.createdAt).toLocaleDateString(
                              "en-GB",
                            )}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/projects/edit/${project._id}`}
                              className="p-2.5 rounded-xl bg-secondary border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90"
                            >
                              <FiEdit2 size={13} />
                            </Link>
                            <button
                              onClick={() => setOpenDeleteModal(project._id)}
                              className="p-2.5 rounded-xl bg-secondary border border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all active:scale-90"
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {!loading && projects.length === 0 && (
            <EmptyState hasFilters={hasFilters} />
          )}
        </div>

        {/* ── Pagination ──────────────────────────────────────── */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4
              px-4 py-3 rounded-2xl border border-border bg-card"
          >
            {/* Per page */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground font-mono">
                Per page
              </span>
              {[6, 10, 20].map((l) => (
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

            {/* Page info */}
            <span className="text-[9px] font-mono text-muted-foreground/40 uppercase tracking-widest">
              Page {page} of {totalPages} · {total} results
            </span>

            {/* Page buttons */}
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2.5 rounded-xl bg-secondary border border-border disabled:opacity-30
                  hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <FiChevronLeft size={13} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
                className="p-2.5 rounded-xl bg-secondary border border-border disabled:opacity-30
                  hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <FiChevronRight size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={!!openDeleteModal}
        title={projects.find((p) => p._id === openDeleteModal)?.title}
        onClose={() => setOpenDeleteModal(null)}
        onConfirm={() => handleDeleteProject(openDeleteModal)}
      />
    </section>
  );
};

export default AllProjects;
