# iteshxt.me v4

Itesh Singh Tomar's portfolio. It has two shifts: **by day** the site shows what he builds, **by night** it shows how it works. You switch shifts by peeling the page's corner off like a sticker, and the navigation is a sentence you finish: "Show me ___".

## Docs

- [docs/prd.md](docs/prd.md): what we're building and why
- [docs/design.md](docs/design.md): how it looks, moves, sounds and speaks
- [docs/spec.md](docs/spec.md): how it's built

## What's inside

- **Signature moves:** the peel theme toggle (drag or click the top-right corner), slap-and-peel page transitions, typing two-line headlines, the "Show me ___" nav bar
- **Pages:** home, work (3 star case studies + an archive), DiaLabs, about, contact, 404
- **3D:** procedural React Three Fiber objects on each case study (lazy-loaded, 2D fallback)
- **Arcee:** the site's chatbot (Groq + retrieval over the site's content, guardrails, can navigate, take messages and reply with cat stickers)
- **Easter eggs:** press `~`, try the Konami code, print any page, visit at 3am…
- **Sound:** subtle synthesized UI sounds with a remembered mute toggle

## Stack

Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4, GSAP, Lenis, three.js + React Three Fiber, Zustand, Vercel AI SDK. Hosted on Vercel.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Add `?shift=night` or `?shift=day` to force a shift.

### Environment

See `.env.example`. Everything runs without keys; these switch features on:

| Variable | What it does |
|---|---|
| `GROQ_API_KEY` | Arcee answers (otherwise it says it's offline) |
| `ARCEE_MOCK=1` | Arcee uses a local stand-in model, for development without a key |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Production rate limits for Arcee (in-memory fallback locally) |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL` | Emails messages left with Arcee |
| `GITHUB_TOKEN` | Optional, higher rate limit for the footer's "currently building" feed |

### Cat stickers

Arcee's stickers are placeholders in `public/stickers/` (`happy`, `smug`, `thinking`, `shocked`, `sleepy`, `love`, `nope`). Replace them with files of the same names. If they're PNG or WebP, update the extensions in `src/lib/arcee/stickers.ts`.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | Unit tests (Vitest) |
| `npm run e2e` | End-to-end + accessibility tests (Playwright, uses your installed Chrome; run `npm run build` first) |

CI (`.github/workflows/ci.yml`) runs all of these on every push and pull request.
