# iteshxt.me v4

Itesh Singh Tomar's portfolio. Itesh has two shifts: **by day** the site shows what he builds, **by night** it shows how it works. You switch shifts by peeling the page off like a sticker, and the navigation is a sentence you finish: "Show me ___".

## Docs

- [docs/prd.md](docs/prd.md): what we're building and why
- [docs/design.md](docs/design.md): how it looks, moves, sounds and speaks
- [docs/spec.md](docs/spec.md): how it's built

## Stack

Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4, GSAP, Lenis, three.js + React Three Fiber, Zustand. Hosted on Vercel.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional until the Arcee chatbot is built
npm run dev
```

Open http://localhost:3000. Add `?shift=night` or `?shift=day` to force a shift.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
