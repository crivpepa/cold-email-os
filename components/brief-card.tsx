"use client";

import { motion } from "framer-motion";
import { Building2, Sparkles, AlertTriangle, Users, Target } from "lucide-react";

export type Brief = {
  company_name?: string;
  one_liner?: string;
  industry?: string;
  size_signal?: string;
  products?: string[];
  audience?: string;
  recent_signals?: string[];
  likely_pains?: string[];
  best_persona?: string;
  tone_match?: string;
};

type Props = { brief: Brief };

export function BriefCard({ brief }: Props) {
  const recent = brief.recent_signals ?? [];
  const pains = brief.likely_pains ?? [];
  const products = brief.products ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden"
    >
      <div className="p-5 border-b border-border/60">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center size-9 rounded-lg bg-secondary border border-border/60 shrink-0">
            <Building2 className="size-4 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-base font-semibold truncate">
                {brief.company_name ?? "Company"}
              </h2>
              {brief.industry && (
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground bg-secondary border border-border/60 px-1.5 py-0.5 rounded shrink-0">
                  {brief.industry}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {brief.one_liner ?? "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
        <Section
          icon={<Target className="size-3.5" />}
          label="Best persona to email"
          accent="text-emerald-400/90"
        >
          <p className="text-sm leading-relaxed">{brief.best_persona ?? "—"}</p>
          {brief.audience && (
            <p className="text-xs text-muted-foreground mt-1">
              Audience: {brief.audience}
            </p>
          )}
        </Section>

        <Section
          icon={<Sparkles className="size-3.5" />}
          label="Tone to match"
          accent="text-violet-400/90"
        >
          <p className="text-sm leading-relaxed">{brief.tone_match ?? "—"}</p>
          {brief.size_signal && (
            <p className="text-xs text-muted-foreground mt-1">
              Size: {brief.size_signal}
            </p>
          )}
        </Section>
      </div>

      {(recent.length > 0 || pains.length > 0 || products.length > 0) && (
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/60 border-t border-border/60">
          {pains.length > 0 && (
            <Section
              icon={<AlertTriangle className="size-3.5" />}
              label="Likely pains"
              accent="text-rose-400/90"
            >
              <ul className="space-y-1.5">
                {pains.slice(0, 4).map((p, i) => (
                  <li key={i} className="text-sm leading-snug flex gap-2">
                    <span className="text-muted-foreground/60 select-none mt-1.5 size-1 rounded-full bg-rose-400/60 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
          {recent.length > 0 && (
            <Section
              icon={<Users className="size-3.5" />}
              label="Recent signals"
              accent="text-sky-400/90"
            >
              <ul className="space-y-1.5">
                {recent.slice(0, 4).map((s, i) => (
                  <li key={i} className="text-sm leading-snug flex gap-2">
                    <span className="text-muted-foreground/60 select-none mt-1.5 size-1 rounded-full bg-sky-400/60 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      )}

      {products.length > 0 && (
        <div className="px-5 py-3 border-t border-border/60 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground mr-1">
            Products
          </span>
          {products.slice(0, 6).map((p, i) => (
            <span
              key={i}
              className="text-xs bg-secondary border border-border/60 px-2 py-0.5 rounded-md"
            >
              {p}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function Section({
  icon,
  label,
  accent,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5">
      <div className={`flex items-center gap-1.5 mb-2 ${accent ?? "text-muted-foreground"}`}>
        {icon}
        <span className="text-[11px] uppercase tracking-wider font-medium">{label}</span>
      </div>
      {children}
    </div>
  );
}
