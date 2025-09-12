"use client";
import { motion } from "framer-motion";

export default function HeroOrbs() {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl"
        animate={{ x: [0, 20, -20, 0], y: [0, -10, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -right-24 h-80 w-80 rounded-full bg-brand/10 blur-3xl"
        animate={{ x: [0, -30, 15, 0], y: [0, 10, -20, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
    </>
  );
}

