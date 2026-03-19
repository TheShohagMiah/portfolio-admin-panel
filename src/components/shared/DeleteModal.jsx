import React from "react";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
const DeleteModal = ({ isOpen, onClose, onConfirm, title }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/10 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-card border border-destructive/20 rounded-[2rem] p-8 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
                <FiTrash2 size={28} />
              </div>

              <h3 className="text-xl font-bold tracking-tight">
                Confirm Deletion
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to remove{" "}
                <span className="text-foreground font-semibold">"{title}"</span>
                ? This action is permanent and cannot be undone within the
                System Core.
              </p>

              <div className="flex gap-3 w-full mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="flex-1 px-6 py-3 rounded-xl bg-destructive text-destructive-foreground hover:opacity-90 text-xs font-bold uppercase tracking-widest shadow-lg shadow-destructive/20 transition-all"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
