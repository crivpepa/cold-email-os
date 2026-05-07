"use client";

import { motion } from "framer-motion";
import { AlertCircle, Eye, TrendingUp, Users, Zap } from "lucide-react";

const ANGLES = [
  { name: "Problem-aware", tagline: "Lead with their pain", Icon: AlertCircle, color: "text-rose-400 border-rose-400/20 bg-rose-400/5" },
  { name: "Curiosity gap", tagline: "Make them need to reply", Icon: Eye, color: "text-amber-400 border-amber-400/20 bg-amber-400/5" },
  { name: "Benefit-led", tagline: "Outcome upfront", Icon: TrendingUp, color: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5" },
  { name: "Social proof", tagline: "Borrow trust", Icon: Users, color: "text-sky-400 border-sky-400/20 bg-sky-400/5" },
  { name: "Contrarian", tagline: "Challenge the default", Icon: Zap, color: "text-violet-400 border-violet-400/20 bg-violet-400/5" },
];

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-muted-foreground">
          You'll get five distinct angles
        </h3>
        <span className="text-xs text-muted-foreground">
          Each tested against a different psychological hook
        </span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
        {ANGLES.map((a, i) => (
          <motion.div
            key={a.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.04, duration: 0.4 }}
            className={`rounded-lg border p-3.5 ${a.color} hover:scale-[1.02] transition-transform`}
          >
            <a.Icon className="size-4 mb-2.5" />
            <div className="text-sm font-medium text-foreground/90">{a.name}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {a.tagline}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
