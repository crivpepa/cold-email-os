import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { z } from "zod";
import { EMAIL_ANGLES } from "@/lib/angles";

export const runtime = "nodejs";
export const maxDuration = 60;

const RequestSchema = z.object({
  url: z.string().min(1),
  sender: z
    .object({
      name: z.string().max(100).optional().default(""),
      role: z.string().max(150).optional().default(""),
      company: z.string().max(150).optional().default(""),
      offer: z.string().max(500).optional().default(""),
    })
    .optional()
    .default({ name: "", role: "", company: "", offer: "" }),
});

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function send(
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
  event: string,
  data: unknown
) {
  controller.enqueue(
    encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
  );
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Server is missing ANTHROPIC_API_KEY." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Invalid request shape.", issues: parsed.error.issues }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { url: rawUrl, sender } = parsed.data;
  const url = normalizeUrl(rawUrl);
  if (!url) {
    return new Response(JSON.stringify({ error: "URL is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const close = () => {
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      try {
        send(controller, encoder, "status", { phase: "researching", message: "Investigating company" });

        const researchPrompt = `You are researching the company at ${url} to write personalized cold outreach.

Visit the URL via your web tools and produce a tight, actionable brief. Be specific — names, numbers, products, recent moves. No generic filler.

Return ONLY valid JSON matching this exact shape (no markdown, no commentary):
{
  "company_name": string,
  "one_liner": string,
  "industry": string,
  "size_signal": string,
  "products": string[],
  "audience": string,
  "recent_signals": string[],
  "likely_pains": string[],
  "best_persona": string,
  "tone_match": string
}

recent_signals = recent news, hiring, launches, funding, blog posts (max 4).
likely_pains = real problems someone in best_persona role likely has right now (max 4).
tone_match = how their existing copy sounds — terse, playful, technical, corporate, etc.`;

        const research = await client.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 2000,
          tools: [
            {
              type: "web_search_20250305",
              name: "web_search",
              max_uses: 4,
            } as unknown as Anthropic.Messages.Tool,
          ],
          messages: [{ role: "user", content: researchPrompt }],
        });

        const researchText = research.content
          .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
          .map((b) => b.text)
          .join("\n")
          .trim();

        let brief: Record<string, unknown> = {};
        const jsonMatch = researchText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            brief = JSON.parse(jsonMatch[0]);
          } catch {
            brief = { company_name: url, one_liner: researchText.slice(0, 200) };
          }
        } else {
          brief = { company_name: url, one_liner: "Research unavailable" };
        }

        send(controller, encoder, "brief", brief);

        const senderBlock = `Sender:
- Name: ${sender.name || "(not provided — sign as 'Your name')"}
- Role: ${sender.role || "(not provided)"}
- Company: ${sender.company || "(not provided)"}
- Offer / what they sell: ${sender.offer || "(not provided — infer something useful from the brief)"}`;

        for (const angle of EMAIL_ANGLES) {
          send(controller, encoder, "email_start", {
            id: angle.id,
            name: angle.name,
            tagline: angle.tagline,
          });

          const emailPrompt = `You are writing ONE cold email to a prospect at ${
            (brief as { company_name?: string }).company_name ?? url
          }.

Brief on the prospect company:
${JSON.stringify(brief, null, 2)}

${senderBlock}

Strategic angle: "${angle.name}" — ${angle.description}

Hard rules:
- 60 to 90 words MAX in the body. Shorter is better.
- Subject line under 7 words. Lowercase if it suits the tone. No clickbait, no emojis.
- Reference at least one specific signal from the brief (a product, a recent move, a person). Generic = failure.
- One clear CTA. Either a soft question or a specific 15-min ask. Pick one.
- Match their tone (${(brief as { tone_match?: string }).tone_match ?? "professional and direct"}).
- No "I hope this email finds you well." No "I came across your website." No "circle back."
- Sign with the sender's name and company if provided. Otherwise close with "— Your name".

Return ONLY this exact JSON, no markdown, no commentary:
{"subject": "...", "body": "...", "cta": "..."}

The "cta" field is a one-line summary of what reply you're asking for — separate from the body.`;

          const emailRes = await client.messages.create({
            model: "claude-sonnet-4-6",
            max_tokens: 700,
            messages: [{ role: "user", content: emailPrompt }],
          });

          const emailText = emailRes.content
            .filter((b): b is Anthropic.Messages.TextBlock => b.type === "text")
            .map((b) => b.text)
            .join("\n")
            .trim();

          let emailJson: { subject?: string; body?: string; cta?: string } = {};
          const m = emailText.match(/\{[\s\S]*\}/);
          if (m) {
            try {
              emailJson = JSON.parse(m[0]);
            } catch {
              emailJson = { subject: "Could not parse", body: emailText, cta: "" };
            }
          } else {
            emailJson = { subject: "Could not parse", body: emailText, cta: "" };
          }

          send(controller, encoder, "email", {
            id: angle.id,
            name: angle.name,
            tagline: angle.tagline,
            subject: emailJson.subject ?? "",
            body: emailJson.body ?? "",
            cta: emailJson.cta ?? "",
          });
        }

        send(controller, encoder, "done", { ok: true });
        close();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error during generation.";
        send(controller, encoder, "error", { message });
        close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
