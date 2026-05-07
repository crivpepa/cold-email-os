"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, User } from "lucide-react";
import { useState } from "react";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { cn } from "@/lib/utils";

export type SenderInfo = {
  name: string;
  role: string;
  company: string;
  offer: string;
};

type Props = {
  value: SenderInfo;
  onChange: (next: SenderInfo) => void;
  disabled?: boolean;
};

export function SenderForm({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const set = (k: keyof SenderInfo, v: string) =>
    onChange({ ...value, [k]: v });

  const filledCount = Object.values(value).filter((v) => v.trim().length > 0).length;

  return (
    <div className="rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-4 py-3 text-left",
          "hover:bg-accent/40 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-inset",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center justify-center size-7 rounded-md bg-secondary border border-border/60 shrink-0">
            <User className="size-3.5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">
              About you <span className="text-muted-foreground font-normal">(optional)</span>
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {filledCount > 0
                ? `${filledCount}/4 fields — better personalization`
                : "Skip to use defaults, or add context for sharper emails"}
            </div>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform shrink-0",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 grid gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldGroup label="Your name">
                  <Input
                    value={value.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Alex Chen"
                    disabled={disabled}
                  />
                </FieldGroup>
                <FieldGroup label="Your role">
                  <Input
                    value={value.role}
                    onChange={(e) => set("role", e.target.value)}
                    placeholder="Founder"
                    disabled={disabled}
                  />
                </FieldGroup>
              </div>
              <FieldGroup label="Your company">
                <Input
                  value={value.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder="Acme Inc."
                  disabled={disabled}
                />
              </FieldGroup>
              <FieldGroup label="What you sell or offer">
                <Textarea
                  value={value.offer}
                  onChange={(e) => set("offer", e.target.value)}
                  placeholder="A short description of your product, service or pitch — the sharper the better."
                  rows={3}
                  disabled={disabled}
                />
              </FieldGroup>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
