"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 100, damping: 18, mass: 0.8 }}
      className="text-center mb-14 md:mb-20"
    >
      {/* Decorative top element */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-border text-xs text-gray-500 uppercase tracking-[0.2em] font-medium mb-6"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: "0.3s" }} />
      </motion.div>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
        {title}
      </h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Animated gradient line */}
      <div className="flex items-center justify-center mt-6">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 96 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          className="heading-gradient-line h-[2px]"
        />
      </div>
    </motion.div>
  );
}
