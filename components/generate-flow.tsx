"use client";

import { useState, useRef, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Globe, Loader2, RotateCw, Square } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./button";
import { Input } from "./input";
import { SenderForm, type SenderInfo } from "./sender-form";
import { BriefCard, type Brief } from "./brief-card";
import { EmailCard, type EmailState } from "./email-card";
import { EmptyState } from "./empty-state";
import { EMAIL_ANGLES } from "@/lib/angles";

type Phase = "idle" | "researching" | "writing" | "done" | "error";

const initialEmails = (): EmailState[] =>
  EMAIL_ANGLES.map((a) => ({
    id: a.id,
    name: a.name,
    tagline: a.tagline,
    status: "pending",
  }));

export function GenerateFlow() {
  const [url, setUrl] = useState("");
  const [sender, setSender] = useState<SenderInfo>({
    name: "",
    role: "",
    company: "",
    offer: "",
  });
  const [phase, setPhase] = useState<Phase>("idle");
  const [brief, setBrief] = useState<Brief | null>(null);
  const [emails, setEmails] = useState<EmailState[]>(initialEmails());
  const [statusMsg, setStatusMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const abortRef = useRef<AbortController | null>(null);

  const isBusy = phase === "researching" || phase === "writing";

  const reset = () => {
    setBrief(null);
    setEmails(initialEmails());
    setStatusMsg("");
    setErrorMsg("");
  };

  const stop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setPhase("idle");
    setStatusMsg("");
    toast.info("Stopped");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isBusy) return;

    reset();
    setPhase("researching");
    setStatusMsg("Investigating company");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, sender }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const raw of events) {
          if (!raw.trim()) continue;
          const lines = raw.split("\n");
          let event = "message";
          let dataStr = "";
          for (const line of lines) {
            if (line.startsWith("event:")) event = line.slice(6).trim();
            else if (line.startsWith("data:")) dataStr += line.slice(5).trim();
          }
          if (!dataStr) continue;
          let data: unknown;
          try {
            data = JSON.parse(dataStr);
          } catch {
            continue;
          }
          handleEvent(event, data);
        }
      }
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") return;
      const m = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(m);
      setPhase("error");
      toast.error("Generation failed", { description: m });
    } finally {
      abortRef.current = null;
    }
  };

  const handleEvent = (event: string, data: unknown) => {
    switch (event) {
      case "status": {
        const d = data as { phase?: string; message?: string };
        if (d.message) setStatusMsg(d.message);
        if (d.phase === "researching") setPhase("researching");
        break;
      }
      case "brief": {
        setBrief(data as Brief);
        setPhase("writing");
        setStatusMsg("Writing variants");
        break;
      }
      case "email_start": {
        const d = data as { id: string };
        setEmails((prev) =>
          prev.map((e) => (e.id === d.id ? { ...e, status: "loading" } : e))
        );
        break;
      }
      case "email": {
        const d = data as EmailState & { id: string };
        setEmails((prev) =>
          prev.map((e) =>
            e.id === d.id
              ? {
                  ...e,
                  subject: d.subject,
                  body: d.body,
                  cta: d.cta,
                  status: "ready",
                }
              : e
          )
        );
        break;
      }
      case "email_error": {
        const d = data as { id: string };
        setEmails((prev) =>
          prev.map((e) => (e.id === d.id ? { ...e, status: "error" } : e))
        );
        break;
      }
      case "done": {
        setPhase("done");
        setStatusMsg("");
        toast.success("All five emails ready");
        break;
      }
      case "error": {
        const d = data as { message?: string };
        const m = d.message || "Unknown error";
        setErrorMsg(m);
        setPhase("error");
        toast.error("Generation failed", { description: m });
        break;
      }
    }
  };

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const showResults = phase !== "idle" && (brief || emails.some((e) => e.status !== "pending"));

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="space-y-3">
        <div className="relative group">
          <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="vercel.com — paste any company URL"
            className="pl-10 pr-32 h-14 text-base"
            disabled={isBusy}
            autoFocus
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {isBusy ? (
              <Button type="button" variant="secondary" onClick={stop} className="h-10 gap-1.5">
                <Square className="size-3.5 fill-current" />
                Stop
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!url.trim()}
                className="h-10 gap-1.5"
              >
                {phase === "done" || phase === "error" ? (
                  <>
                    <RotateCw className="size-3.5" />
                    Regenerate
                  </>
                ) : (
                  <>
                    Generate
                    <ArrowRight className="size-3.5" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <SenderForm value={sender} onChange={setSender} disabled={isBusy} />
      </form>

      <AnimatePresence mode="wait">
        {isBusy && (
          <motion.div
            key="status"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Loader2 className="size-3.5 animate-spin" />
            <span className="shimmer-text">{statusMsg || "Working"}</span>
          </motion.div>
        )}

        {phase === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive/90"
          >
            <div className="font-medium mb-1">Generation failed</div>
            <div className="text-destructive/70 text-xs">{errorMsg}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showResults && phase === "idle" && <EmptyState />}

      <AnimatePresence>
        {brief && (
          <motion.div
            key="brief"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <BriefCard brief={brief} />
          </motion.div>
        )}
      </AnimatePresence>

      {showResults && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Five variants
            </h2>
            <span className="text-xs text-muted-foreground">
              {emails.filter((e) => e.status === "ready").length} / {emails.length} ready
            </span>
          </div>
          <div className="grid gap-3">
            {emails.map((email, i) => (
              <EmailCard key={email.id} email={email} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
