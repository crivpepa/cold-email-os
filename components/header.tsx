"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function Header() {
  return (
    <header className="relative pt-16 pb-10 md:pt-24 md:pb-14 text-center overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 grid-bg pointer-events-none opacity-60"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -translate-x-1/2 size-[640px] glow-orb pointer-events-none"
      />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 bg-card/40 backdrop-blur-sm text-xs text-muted-foreground mb-6"
        >
          <span className="relative flex size-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full size-1.5 bg-emerald-400" />
          </span>
          AI cold outreach, in 10 seconds
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-4xl md:text-6xl font-semibold tracking-tight text-balance"
          style={{ letterSpacing: "-0.03em" }}
        >
          Cold emails that don't <em className="not-italic shimmer-text">sound cold</em>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed text-balance"
        >
          Paste a company URL. We research the company, find the angles that
          land, and write five emails — each one different.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"
        >
          <Sparkles className="size-3.5" />
          <span>Powered by Claude</span>
          <span className="mx-1.5 text-border">•</span>
          <span>No signup required</span>
        </motion.div>
      </div>
    </header>
  );
}
