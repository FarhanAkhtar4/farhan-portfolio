"use client";

import { motion } from "framer-motion";

interface SectionRevealProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export default function SectionReveal({ children, id, className }: SectionRevealProps) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
