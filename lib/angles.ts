export type EmailAngle = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  icon: string;
};

export const EMAIL_ANGLES: EmailAngle[] = [
  {
    id: "problem",
    name: "Problem-aware",
    tagline: "Lead with their pain",
    description:
      "Open by naming a specific pain the prospect's company is likely experiencing. Cite a signal you found. Position your offer as the relief.",
    color: "text-rose-400",
    icon: "AlertCircle",
  },
  {
    id: "curiosity",
    name: "Curiosity gap",
    tagline: "Make them need to reply",
    description:
      "Tease something specific you've noticed or built that's relevant to them, without revealing the full insight. The reply is how they unlock it.",
    color: "text-amber-400",
    icon: "Eye",
  },
  {
    id: "benefit",
    name: "Benefit-led",
    tagline: "Outcome upfront",
    description:
      "Start with a concrete, quantified outcome you can deliver. Back it with a relevant proof point. Make replying the path to that outcome.",
    color: "text-emerald-400",
    icon: "TrendingUp",
  },
  {
    id: "social-proof",
    name: "Social proof",
    tagline: "Borrow trust",
    description:
      "Anchor on a peer company or competitor who's already winning with this. Make the prospect feel they're missing what their reference class has.",
    color: "text-sky-400",
    icon: "Users",
  },
  {
    id: "contrarian",
    name: "Contrarian",
    tagline: "Challenge their default",
    description:
      "Open with a sharp, defensible claim that contradicts how their team likely thinks about the problem. Earn the reply by being interesting.",
    color: "text-violet-400",
    icon: "Zap",
  },
];
