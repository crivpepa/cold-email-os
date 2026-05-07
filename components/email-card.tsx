"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Send,
  AlertCircle,
  Eye,
  TrendingUp,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./button";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  problem: AlertCircle,
  curiosity: Eye,
  benefit: TrendingUp,
  "social-proof": Users,
  contrarian: Zap,
};

const ACCENTS: Record<string, string> = {
  problem: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  curiosity: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  benefit: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "social-proof": "text-sky-400 bg-sky-400/10 border-sky-400/20",
  contrarian: "text-violet-400 bg-violet-400/10 border-violet-400/20",
};

export type EmailState = {
  id: string;
  name: string;
  tagline: string;
  subject?: string;
  body?: string;
  cta?: string;
  status: "pending" | "loading" | "ready" | "error";
};

type Props = {
  email: EmailState;
  index: number;
};

export function EmailCard({ email, index }: Props) {
  const [copied, setCopied] = useState(false);
  const Icon = ICONS[email.id] ?? AlertCircle;
  const accent = ACCENTS[email.id] ?? "text-foreground bg-secondary border-border";

  const fullText = email.subject
    ? `Subject: ${email.subject}\n\n${email.body ?? ""}`
    : email.body ?? "";

  const handleCopy = async () => {
    if (!email.body) return;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not copy");
    }
  };

  const handleSend = () => {
    if (!email.subject || !email.body) return;
    const mailto = `mailto:?subject=${encodeURIComponent(
      email.subject
    )}&body=${encodeURIComponent(email.body)}`;
    window.open(mailto, "_blank");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className="group rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden hover:border-border transition-colors"
    >
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              "flex items-center justify-center size-7 rounded-md border",
              accent
            )}
          >
            <Icon className="size-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{email.name}</div>
            <div className="text-[11px] text-muted-foreground truncate">
              {email.tagline}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {email.status === "ready" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 px-2.5 gap-1.5 text-xs"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSend}
                className="h-8 px-2.5 gap-1.5 text-xs"
              >
                <Send className="size-3.5" />
                Send
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {email.status === "pending" && (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground/70 flex items-center gap-2"
            >
              <span className="size-1.5 rounded-full bg-muted-foreground/40" />
              Waiting…
            </motion.div>
          )}

          {email.status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <SkeletonLine width="40%" />
              <div className="space-y-2 pt-1">
                <SkeletonLine width="92%" />
                <SkeletonLine width="86%" />
                <SkeletonLine width="78%" />
                <SkeletonLine width="64%" />
              </div>
            </motion.div>
          )}

          {email.status === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-3"
            >
              <div className="flex items-baseline gap-2 pb-2 border-b border-border/40">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium shrink-0">
                  Subject
                </span>
                <span className="text-sm font-medium text-balance">
                  {email.subject}
                </span>
              </div>
              <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {email.body}
              </div>
              {email.cta && (
                <div className="pt-2 mt-1 border-t border-border/40">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    CTA
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{email.cta}</p>
                </div>
              )}
            </motion.div>
          )}

          {email.status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-destructive/80 flex items-center gap-2"
            >
              <AlertCircle className="size-4" />
              Could not generate this variant
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function SkeletonLine({ width }: { width: string }) {
  return (
    <div
      className="h-3 rounded animate-shimmer"
      style={{
        width,
        background:
          "linear-gradient(90deg, hsl(var(--secondary)) 0%, hsl(var(--accent)) 50%, hsl(var(--secondary)) 100%)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}
