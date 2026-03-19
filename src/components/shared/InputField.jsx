import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

const fieldItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};
export const Field = ({
  label,
  hint,
  error,
  required,
  children,
  fieldItem,
}) => (
  <motion.div className="space-y-2">
    <div className="flex items-baseline justify-between">
      <label className="text-xs font-medium text-foreground uppercase tracking-widest">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {hint && (
        <span className="text-xs text-muted-foreground font-mono">{hint}</span>
      )}
    </div>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="flex items-center gap-1.5 text-xs text-destructive font-medium"
        >
          <FiAlertCircle size={12} />
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);
