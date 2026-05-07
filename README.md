# Cold Email OS

> AI cold outreach in 10 seconds. Paste a URL — get five emails, each with a different angle.

## What it does

1. You paste a company URL.
2. Claude researches the company via web search — products, recent news, audience, likely pains, tone.
3. Five distinct emails are generated streaming live, each with a different psychological angle:
   - **Problem-aware** — lead with their pain
   - **Curiosity gap** — make them need to reply
   - **Benefit-led** — outcome upfront
   - **Social proof** — borrow trust
   - **Contrarian** — challenge their default

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide icons
- Sonner toasts
- `@anthropic-ai/sdk` with web_search tool + SSE streaming

## Run locally

```bash
pnpm install   # or npm / yarn / bun
cp .env.example .env.local
# add your ANTHROPIC_API_KEY to .env.local
pnpm dev
```

Open `http://localhost:3000`.

## Deploy

1. Push to GitHub.
2. Import to Vercel.
3. Add `ANTHROPIC_API_KEY` env var.
4. Ship.

The `/api/generate` route streams Server-Sent Events. It uses Node runtime
(`runtime = "nodejs"`) to support the Anthropic SDK's `web_search` tool.

## Architecture

```
app/
  api/generate/route.ts   ← SSE stream: research → 5 emails
  page.tsx                ← single-page UI
  layout.tsx
  globals.css
components/
  header.tsx              ← hero + animated grid bg
  generate-flow.tsx       ← form + SSE consumer
  sender-form.tsx         ← optional sender context
  brief-card.tsx          ← AI research output
  email-card.tsx          ← per-variant card with copy/send
  empty-state.tsx
  toaster.tsx
  button.tsx, input.tsx, textarea.tsx
lib/
  angles.ts               ← the 5 strategic email angles
  utils.ts                ← cn()
```

## Cost per generation

~$0.01–0.03 in Claude API costs (research turn + 5 short writes).

## License

MIT.
