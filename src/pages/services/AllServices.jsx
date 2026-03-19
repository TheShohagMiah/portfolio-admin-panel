import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as FiIcons from "react-icons/fi";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiChevronDown,
  FiCpu,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import DeleteModal from "../../components/shared/DeleteModal";
import PageHeader from "../../components/shared/PageHeader";

// ═══════════════════════════════════════════════════════════════
//  ICON RENDERER
// ═══════════════════════════════════════════════════════════════
const IconRenderer = ({ name, className }) => {
  const Icon = FiIcons[name] || FiIcons.FiHelpCircle;
  return <Icon className={className} />;
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
//  SORT TH
// ═══════════════════════════════════════════════════════════════
const SortTh = ({ field, children, onClick, sortBy, order }) => (
  <th className="px-6 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground font-mono">
    <button
      onClick={() => onClick(field)}
      className="flex items-center gap-1.5 hover:text-foreground transition-colors"
    >
      {children}
      <SortIcon field={field} sortBy={sortBy} order={order} />
    </button>
  </th>
);

const PlainTh = ({ children, right, hidden }) => (
  <th
    className={`px-6 py-5 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground font-mono
      ${right ? "text-right" : ""}
      ${hidden ? "hidden md:table-cell" : ""}`}
  >
    {children}
  </th>
);

// ═══════════════════════════════════════════════════════════════
//  SKELETON ROW
// ═══════════════════════════════════════════════════════════════
const SkeletonRow = ({ i }) => (
  <tr>
    {[1, 2, 3, 4, 5].map((c) => (
      <td key={c} className="px-6 py-5">
        <div
          className="h-4 bg-muted animate-pulse rounded-lg"
          style={{
            width: `${55 + Math.random() * 35}%`,
            animationDelay: `${i * 0.06}s`,
          }}
        />
      </td>
    ))}
  </tr>
);

// ═══════════════════════════════════════════════════════════════
//  EMPTY STATE
// ═══════════════════════════════════════════════════════════════
const EmptyState = ({ hasSearch }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="py-20 flex flex-col items-center justify-center gap-4"
  >
    <div className="w-16 h-16 rounded-3xl bg-muted border border-border flex items-center justify-center">
      <FiCpu size={22} className="text-muted-foreground/30" />
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 font-mono">
      {hasSearch ? "No matching services found" : "No services yet"}
    </p>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════════════
const SORT_FIELDS = ["title", "createdAt", "updatedAt"];

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
const AllServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [openDeleteModal, setOpenDeleteModal] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  // ── Fetch ───────────────────────────────────────────────────
  const getAllServices = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        "https://themiahshohag.vercel.app//api/services",
        {
          params: { page, limit, sortBy, order, ...(search && { search }) },
          withCredentials: true,
        },
      );
      if (data.success) {
        setServices(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to load services.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, order, search]);

  useEffect(() => {
    setPage(1);
  }, [search, sortBy, order, limit]);
  useEffect(() => {
    getAllServices();
  }, [getAllServices]);

  // ── Sort ────────────────────────────────────────────────────
  const handleSort = (field) => {
    if (!SORT_FIELDS.includes(field)) return;
    if (sortBy === field) setOrder((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setOrder("desc");
    }
  };

  // ── Delete ──────────────────────────────────────────────────
  const handleDeleteService = async (id) => {
    setOpenDeleteModal(null);
    try {
      const { data } = await axios.delete(
        `https://themiahshohag.vercel.app//api/services/${id}`,
        { withCredentials: true },
      );
      if (data.success) {
        toast.success(data.message);
        getAllServices();
      }
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Failed to delete.");
    }
  };

  // ════════════════════════════════════════════════════════════
  return (
    <section className="py-8 min-h-screen text-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-6">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeader title="Service Inventory" />
          <Link
            to="/admin/services/new"
            className="group flex items-center gap-2.5 px-6 py-3 bg-primary text-primary-foreground
              rounded-2xl text-[10px] font-black uppercase tracking-widest font-mono
              hover:opacity-90 transition-all shadow-lg active:scale-95 w-fit"
          >
            <FiPlus
              size={14}
              className="group-hover:rotate-90 transition-transform duration-200"
            />
            New Service
          </Link>
        </div>

        {/* ── Search + Stats bar ─────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 group">
            <FiSearch
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors"
            />
            <input
              type="text"
              placeholder="Search services..."
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

          {/* Total badge */}
          <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border border-border rounded-2xl">
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground font-mono">
              Total
            </span>
            <span className="text-sm font-black text-foreground font-mono tabular-nums">
              {total}
            </span>
          </div>
        </div>

        {/* ── Table ───────────────────────────────────────────── */}
        <div className="relative bg-card border border-border rounded-3xl overflow-hidden shadow-xl">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* Head */}
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <SortTh
                    field="title"
                    onClick={handleSort}
                    sortBy={sortBy}
                    order={order}
                  >
                    Service
                  </SortTh>
                  <PlainTh hidden>Description</PlainTh>
                  <PlainTh>Tags</PlainTh>
                  <SortTh
                    field="createdAt"
                    onClick={handleSort}
                    sortBy={sortBy}
                    order={order}
                  >
                    Date
                  </SortTh>
                  <PlainTh right>Actions</PlainTh>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-border/40">
                {/* Skeleton */}
                {loading &&
                  Array.from({ length: limit }).map((_, i) => (
                    <SkeletonRow key={i} i={i} />
                  ))}

                {/* Rows */}
                {!loading && (
                  <AnimatePresence mode="popLayout">
                    {services.map((service, i) => (
                      <motion.tr
                        key={service._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ delay: i * 0.04 }}
                        className="group hover:bg-secondary/20 transition-colors duration-150"
                      >
                        {/* Service identity */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {/* Icon box */}
                            <div className="w-11 h-11 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/20 transition-all duration-200 flex-shrink-0">
                              <IconRenderer
                                name={service.icon}
                                className="text-lg"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-sm group-hover:text-primary transition-colors">
                                {service.title}
                              </p>
                              {service.subtitle && (
                                <p className="text-[10px] text-muted-foreground/40 font-mono mt-0.5">
                                  {service.subtitle}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Description */}
                        <td className="px-6 py-4 hidden md:table-cell">
                          <p className="text-xs text-muted-foreground/70 line-clamp-1 max-w-[260px] leading-relaxed">
                            {service.description}
                          </p>
                        </td>

                        {/* Tags */}
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {service.tags?.slice(0, 4).map((tag, ti) => (
                              <span
                                key={ti}
                                className="px-2 py-0.5 rounded-md bg-secondary text-[9px] font-medium text-muted-foreground border border-border uppercase tracking-tighter"
                              >
                                {tag}
                              </span>
                            ))}
                            {service.tags?.length > 4 && (
                              <span className="px-2 py-0.5 rounded-md bg-secondary text-[9px] font-medium text-muted-foreground border border-border">
                                +{service.tags.length - 4}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {new Date(service.createdAt).toLocaleDateString(
                              "en-GB",
                            )}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/admin/services/edit/${service._id}`}
                              className="p-2.5 rounded-xl bg-secondary border border-border text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90"
                            >
                              <FiEdit2 size={13} />
                            </Link>
                            <button
                              onClick={() => setOpenDeleteModal(service._id)}
                              className="p-2.5 rounded-xl bg-secondary border border-border text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all active:scale-90"
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
          {!loading && services.length === 0 && (
            <EmptyState hasSearch={!!search} />
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
              {[5, 10, 20].map((l) => (
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
        title={services.find((s) => s._id === openDeleteModal)?.title}
        onClose={() => setOpenDeleteModal(null)}
        onConfirm={() => handleDeleteService(openDeleteModal)}
      />
    </section>
  );
};

export default AllServices;
