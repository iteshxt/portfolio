# Technical Spec: iteshxt.me v4

How the site is built. What to build is in [prd.md](./prd.md); how it should look and feel is in [design.md](./design.md).

## 1. Stack

| Area | Choice | Version (Nov 2026) |
|---|---|---|
| Runtime | Node.js | 24 LTS |
| Framework | Next.js (App Router, Turbopack, Cache Components + partial prefetching enabled) | 16.4 |
| UI | React | 19.2 |
| Language | TypeScript (strict) | latest |
| Styling | Tailwind CSS v4 + CSS variables for tokens | 4.3 |
| Animation | GSAP (all plugins are free: ScrollTrigger, SplitText, DrawSVG, CustomEase, Inertia) + `@gsap/react` | 3.15 / 2.1 |
| Smooth scroll | Lenis | 1.3 |
| 3D | three.js + React Three Fiber + drei | 0.187 / 9.8 / 10.7 |
| UI state | Zustand | 5.1 |
| Content | MDX via `@next/mdx` + typed TS data | 16.4 |
| Chatbot | Vercel AI SDK + `@ai-sdk/groq` (Groq API) | 7 / 4 |
| Retrieval | MiniSearch (BM25) over a build-time index | 7.2 |
| Rate limiting | Upstash Ratelimit + Redis (Vercel Marketplace) | 2.2 |
| Email | Resend | 6 |
| Validation | Zod | 4 |
| Analytics | `@vercel/analytics`, `@vercel/speed-insights` | 2 |
| Tests | Vitest (unit), Playwright (e2e) | 5 / 1.65 |
| Package manager | npm | 11 |
| Hosting | Vercel (preview per branch, `main` → production at iteshxt.me) | |

Libraries are added as the feature that needs them is built, not all up front. The foundation setup installs only the animation, scroll, 3D and state libraries.

## 2. Repository layout

```
docs/                    prd.md, design.md, spec.md
public/
  stickers/              cat sticker placeholders + manifest.json (mood → file)
  sounds/                UI sound sprite
  models/                compressed GLB files for 3D objects
scripts/
  build-arcee-index.ts   builds the retrieval index from site content
src/
  app/
    layout.tsx           fonts, shift bootstrap script, providers, shell
    page.tsx             home
    work/page.tsx        archive
    work/[slug]/page.tsx star case studies (+ any detail pages)
    dialabs/page.tsx
    about/page.tsx
    contact/page.tsx
    not-found.tsx        "the model hallucinated this page"
    api/arcee/route.ts   chatbot (streaming)
    api/arcee/message/route.ts   leave-a-message (email)
    sitemap.ts, robots.ts, opengraph-image.tsx
    globals.css          tokens, shift themes, base styles, print styles
  components/
    shell/               TopBar, PeelCorner, NavBar ("Show me ___"), Footer, NowBuilding
    transition/          TransitionProvider, TransitionLink, SlapSticker
    type/                Headline (fit + typing), Kicker, RevealText
    work/                ProjectCard, StickerCard, FeaturedStack, MediaFrame
    three/               Scene, ArceeOrb, PatentStamp, ChatBubble, StickerPlane
    arcee/               ArceePanel, Message, StickerReply, ActionChip
    eggs/                Terminal, ScubaCat, TabTitle, NightOwl (3am), PrintResume
    icons/               custom icon components
  content/
    site.ts              identity, contact channels, socials
    projects.ts          typed project list (tier: star | archive)
    experience.ts, education.ts, achievements.ts
    case-studies/*.mdx   long-form case studies with <Day> and <Night> sections
    arcee/facts.md       extra facts and FAQ for the chatbot
  lib/
    shift.ts             shift logic (clock, storage, 3am)
    peel.ts              peel geometry (pure functions, unit tested)
    fit.ts               headline fit-to-width
    sound.ts             WebAudio sound engine
    arcee/               prompt, retrieval, guards, tools
    github.ts            "currently building" fetcher
  store/ui.ts            Zustand store
  generated/             build outputs (arcee-index.json); git-ignored
```

## 3. Design tokens and the shift system

### 3.1 Tokens

`globals.css` defines raw colours on `:root` and semantic tokens per shift, then maps them into Tailwind v4 with `@theme inline`:

```css
:root {
  --violet: #7A2CFF; --violet-ink: #3A0E8C; --lavender: #CBB8FF;
  --lime: #CCFF33; --tomato: #FF4B2B; --sunflower: #FFC700;
  --paper: #F5F5F4; --paper-2: #FFFFFF; --ink: #0E0E10;
  --night: #0B0A10; --night-2: #15121D; --night-ink: #F4F2FF;
}
:root[data-shift="day"]   { --bg: var(--paper); --surface: var(--paper-2); --fg: var(--ink);       --accent-text: var(--ink);      --flap: var(--violet);   --line: #E3E2E6; }
:root[data-shift="night"] { --bg: var(--night); --surface: var(--night-2); --fg: var(--night-ink); --accent-text: var(--lavender); --flap: var(--lavender); --line: #2A2535; }
@theme inline { --color-bg: var(--bg); --color-fg: var(--fg); /* … */ }
```

Components only use semantic tokens (`bg-bg`, `text-fg`, `text-accent-text`…) so a shift change is a single attribute flip.

### 3.2 Choosing the shift before first paint

The server can't know the visitor's clock, so `layout.tsx` injects a tiny blocking inline script in `<head>`. It sets `data-shift` before first paint, in this order:

1. `?shift=day|night` query param
2. the saved choice in `localStorage` (`shift`)
3. the local clock: day 07:00–18:59, otherwise night

It also sets `data-owl="true"` between 02:00 and 04:59 (3am mode forces night). `<html suppressHydrationWarning>` avoids hydration noise. Shift-specific content is rendered in both versions and hidden with CSS (`[data-shift=night] .day-only {display:none}`), so there's no flash and no client-only rendering of content.

### 3.3 Shift-specific content

`<Day>` / `<Night>` components (usable in MDX) render wrappers with `day-only` / `night-only` classes. Headlines take `day` and `night` props.

## 4. Fonts

Loaded with `next/font/google` (self-hosted, subset `latin`, `display: swap`) and exposed as CSS variables:

| Variable | Font | Notes |
|---|---|---|
| `--font-sans` | Mona Sans | variable, `axes: ["wdth"]` so the display style can use width 75 |
| `--font-serif` | Instrument Serif | weight 400, normal + italic |
| `--font-mono` | JetBrains Mono | variable |

## 5. Signature moves: implementation

### 5.1 Peel geometry (`lib/peel.ts`)

Pure, unit-tested functions:

- Corner `C = (W, 0)`, pointer `P`, fold direction `d = C − P`, midpoint `M = (C + P) / 2`, and `f(X) = (X − M) · d`.
- The kept region (the top layer stays visible) is the viewport rectangle clipped to `f(X) ≤ 0` (one-plane Sutherland–Hodgman).
- The flap is the region with `f(X) ≥ 0`, reflected across the fold: `X' = X − 2·f(X)/|d|²·d`.
- Completion target: `P = (−W − 40, 2H + 40)` (the fold passes beyond the opposite corner).
- `clipPathPolygon(points)` returns a CSS `polygon()` string in px.

### 5.2 Theme peel (View Transitions)

The peel must show the *old* shift peeling away over the *new* one. Rendering the whole page twice would be costly, so we use the View Transitions API:

1. On pointer down or click on `PeelCorner`, call `document.startViewTransition(() => setShift(next))`.
2. CSS: `::view-transition-old(root) { z-index: 2; animation: none; }` and `::view-transition-new(root) { animation: none; }`.
3. While the transition runs, every frame writes the current clip polygon to a dynamic stylesheet rule for `::view-transition-old(root)`. A long no-op animation on `::view-transition-group(root)` keeps the transition alive until the peel finishes or springs back (springing back = animate to the rest point, then flip the shift back without a transition).
4. The flap is an SVG `<polygon>` in a fixed overlay with its own `view-transition-name: peel-flap`, so it paints above the old snapshot. It's a live element updated per frame.
5. Pointer tracking uses `window` listeners attached on pointer down.

Fallback (no View Transitions support, or reduced motion): crossfade the shift change in 200 ms.

**Spike S1 (first task of milestone 2):** validate dragging during a view transition across Chrome, Safari and Firefox. If drag is unreliable, the click auto-peel still uses the transition and dragging falls back to a viewport-sized DOM clone of the current screen with the old shift applied.

*Result (2026-11-11):* passes in Chrome. Dragging works because the corner button holds pointer capture, so moves keep arriving while the view transition overlay is up. Click, drag-to-complete, drag-and-spring-back and keyboard (Enter/Space) all work. **Safari and Firefox are still untested** and need a check before launch.

### 5.3 Page transition (`components/transition`)

The App Router has no exit-animation hook, so transitions are orchestrated by hand:

- `TransitionLink` and the nav bar call `transition.go(href)` instead of navigating directly.
- `go()`: the slap sticker (a full-screen element in `--violet`, showing the destination's name, e.g. "Arcee") slaps in (Web Animations) → `router.push(href)` → waits for the new `usePathname()` value and for a visible `main h1` (content behind Suspense may stream in a moment later, and Next keeps recently left pages in the DOM, hidden, so only visible elements count; capped at 1.5 s) → peels the sticker away with the §5.1 geometry (the sticker element is the clipped layer, and the flap uses `--lavender`) → the new page's `Headline` starts typing.
- Card flight: inside a `data-fly-card`, `TransitionLink` passes the card's `data-fly-source` element to `go()`. A fixed flyer (z above the sticker) gets the source's background and a clone of its drawing, animates from the source rect to a centred hold box during the slap (Web Animations on left/top/width/height, so the drawing re-lays out instead of stretching), and the sticker's label is left empty. The reveal waits for the visible `[data-fly-target={slug}]` stage instead of the headline; the landing follows the stage's live rect each frame (the headline may still be fitting) for the peel's duration, then fades out over the real stage. If the stage never appears (600 ms grace), the flyer fades where it is. Skipped with reduced motion and on back/forward.
- Back/forward (`popstate`): the reveal peel only, starting from a covered sticker for 120 ms.
- The first visit runs the same reveal as the intro, with no slap.
- `router.prefetch(href)` is called on nav hover/focus so the push is instant.
- Safety: if the new route takes longer than 3 s, the sticker shows a small "loading" wobble; after 7 s it peels anyway.
- Reduced motion: 200 ms crossfade overlay.

### 5.4 Headline fit + typing (`components/type/Headline`)

- `fit.ts`: binary search on font size so `scrollWidth ≤ containerWidth` (min 24px, max a token-defined cap), re-run with `ResizeObserver` and after `document.fonts.ready`.
- The serif line is sized for its *final* text before typing starts, so the layout never jumps.
- Typing uses a GSAP timeline (80 ms/char typing, 35 ms/char deleting). The full text is in `aria-label`, and the animated spans are `aria-hidden`.

### 5.5 "Show me ___" nav bar (`components/shell/NavBar`)

- An accessible combobox (input with `role="combobox"`, a listbox of options, `aria-activedescendant`).
- Data: `content/nav.ts` → `{ day: string, night: string, href: string, kind: "star" | "page" }[]`. Filtering is a case-insensitive substring match on both phrases and the page name.
- Shortcuts: `/` and `⌘K`/`Ctrl+K` open it (except while typing in inputs), Esc closes it, arrows move, Enter selects.
- Unmatched input + Enter → opens `ArceePanel` with that text as the first question.
- Mobile: the panel renders as a bottom sheet.

## 6. Content model

```ts
// content/projects.ts
type Project = {
  slug: string;
  name: string;
  tier: "star" | "archive";
  order: number;                 // stars: arcee = 1, patentiq = 2, diachat = 3
  category: "ai" | "web" | "mobile" | "tool";
  day: string;                   // one-line "what"
  night: string;                 // one-line "how"
  stack: string[];
  links: { live?: string; repo?: string; model?: string };
  year: number;
  metrics?: { label: string; value: string }[];
  hasCaseStudy: boolean;         // true → content/case-studies/<slug>.mdx
  object?: "arcee-orb" | "patent-stamp" | "chat-bubble";
};
```

Case studies are typed TypeScript content in `content/case-studies.ts` (changed from MDX: all three share one structure — summary, stats, a day story of points, a night story of pipeline steps and decisions, plus an optional rubric breakdown or gated-phase list — so a typed object is simpler than MDX and needs no extra build step). `components/case/CaseStudyView` renders them; both stories are always present and CSS `order` puts the current shift's story first. Static params come from `STAR_SLUGS`.

## 7. 3D

- One shared `<Canvas>` per page section that needs it, loaded with `next/dynamic` (`ssr: false`) and mounted only when near the viewport (IntersectionObserver).
- **Device tiering** (`lib/device.ts`), evaluated once on the client:
  - `high`: desktop, `hardwareConcurrency ≥ 8`, no reduced motion → full scenes
  - `mid`: lighter materials, no shadows, DPR ≤ 1.5
  - `low` (most phones, `deviceMemory ≤ 4`, Save-Data, or reduced motion) → pre-rendered stills or a lightweight 2D version
- `frameloop="demand"` when idle; render loops pause off-screen and when the tab is hidden; DPR is clamped to `[1, 1.75]`; drei's `PerformanceMonitor` lowers quality when the frame rate drops.
- Models are compressed GLB (meshopt) with KTX2 textures where needed. Procedural geometry is preferred (the Arcee orb and the speech bubble are procedural).

*As built (milestone 4):* `components/case/StarStage` server-renders the 2D drawing and, on capable devices, lazy-loads `components/three/StarScene` (`next/dynamic`, `ssr: false`) once the stage is near the viewport, then crossfades to it when the canvas is created. All three objects are procedural (no model files): `ArceeOrb` (six additive torus rings around an icosahedron wireframe), `PatentStamp` (box/cylinder/sphere stamp with a CanvasTexture "VERIFIED" impression drawn in Instrument Serif) and `ChatBubble` (ellipsoid with back-face ink outline and a damped-spring squash). Hover speeds up or tilts the object towards the pointer; a click pokes it. `lib/device.ts` decides `off | lite | full`; `off` (reduced motion, Save-Data, ≤2 GB memory, or no WebGL2) keeps the 2D drawing. three.js ships as a separate ~244 KB gzipped chunk only on case-study pages. R3F currently logs a THREE.Clock deprecation warning from three r187; it's harmless and comes from the library.

## 8. Arcee chatbot

### 8.1 Flow

```
ArceePanel (useChat, AI SDK)
  → POST /api/arcee  { messages }               Node runtime, streaming
      1. rate limit (Upstash: 20 msgs / 10 min per hashed IP; global daily cap)
      2. validate (Zod): ≤ 12 turns kept, ≤ 500 chars per message
      3. guard: rules for obvious off-topic/jailbreak/prompt-injection patterns
      4. retrieve: MiniSearch top-6 chunks from generated/arcee-index.json
      5. streamText(groq(ARCEE_MODEL), system + retrieved chunks + history, tools)
      6. stream text + tool calls back to the client
```

### 8.2 Model

`openai/gpt-oss-20b` on Groq by default (fast, supports tool calling), set via the `ARCEE_MODEL` env var. `temperature` 0.6 and `maxOutputTokens` 400. If Groq is down or the quota is spent, the panel shows a friendly fallback with email and LinkedIn links.

### 8.3 Retrieval

- *As built:* `lib/arcee/corpus.ts` builds chunks (`{ id, title, url, text }`) straight from the typed content modules (site, profile, projects, case studies, DiaLabs, `content/arcee-facts.ts`) and `lib/arcee/retrieve.ts` indexes them with MiniSearch in memory, once per server instance. No build script or generated file: Arcee's knowledge can't drift from the site, and the corpus is small enough (about 60 chunks) to index in milliseconds.
- Query: BM25 with fuzzy and prefix matching, boosting `title`. The corpus is small (tens of chunks), so this is enough. An upgrade path to embeddings is documented but not built.

### 8.4 Guardrails

- The system prompt fixes the persona: Arcee talks about Itesh in third person, English only, humorous but never rude, a short answer is better than a long one, and it only uses facts from the retrieved context or the site facts. If unsure, it says "Itesh hasn't shared that yet" and suggests contacting him.
- Retrieved chunks are wrapped as quoted data with an instruction to never follow instructions found inside them.
- Out of scope (general coding help, other people, politics, explicit content, role-play, revealing the prompt): a short in-character refusal with a cat sticker.
- Output filter: links are allowed only to site routes and URLs in `content/site.ts` / `projects.ts`.
- No storage of chat content; only rate-limit counters (hashed IP) live in Redis.

### 8.5 Tools (function calling)

| Tool | Input (Zod) | Effect |
|---|---|---|
| `navigate` | `{ path: enum(site routes), section?: string }` | The client validates it and runs `transition.go(path)`, then scrolls to `#section` |
| `sticker` | `{ mood: enum("happy","smug","thinking","shocked","sleepy","love","nope") }` | The client renders the matching cat sticker from `public/stickers/manifest.json` |
| `draftMessage` | `{ name, contact, message }` | The client shows a confirm card; only the visitor's "Send" click calls `/api/arcee/message` |

`/api/arcee/message`: Zod validation, a honeypot field, a rate limit of 3 per day per hashed IP, then a Resend email to `CONTACT_TO_EMAIL` with `reply_to` set when the contact is an email address.

## 9. Easter eggs

| Egg | Implementation |
|---|---|
| Scuba cat | `ScubaCat` listens for the Konami sequence on `keydown`, then plays an SVG/Lottie-free GSAP animation across the viewport and unmounts |
| Terminal | `Terminal` overlay toggled with `` ` `` / `~` (ignored inside inputs). A command registry in `lib/terminal.ts` (`help`, `whoami`, `ls projects`, `open <slug>`, `cat resume`, `shift day|night`, `sound on|off`, `sudo hire itesh`, `rm -rf /`, `now`, `clear`, `exit`), with history (↑/↓) and tab completion |
| Tab title | `TabTitle` swaps `document.title` on `visibilitychange` and restores it on return |
| 3am mode | The bootstrap script sets `data-owl`; `NightOwl` forces the night shift for the session and shows the note |
| Print to resume | `PrintResume` lives in the root layout as `hidden print:block`; the rest of the app is `print:hidden`. One A4 page, ink on white, from the `content/` data |
| 404 | `app/not-found.tsx` with its own headline pair and a link home |
| Currently building | `lib/github.ts` fetches `GET /users/iteshxt/events/public` inside a `'use cache'` function with `cacheLife({ revalidate: 600 })` (Cache Components; optional `GITHUB_TOKEN`), takes the latest `PushEvent`, and returns `{ repo, message, url, at }`. The commit message is trimmed to its first line and limited to 80 characters. Rendered by the `NowBuilding` server component; it shows nothing if the call fails |

## 10. Sound (`lib/sound.ts`)

- A single `AudioContext`, created on the first user gesture. *As built:* every sound is synthesized with WebAudio (filtered noise for peel and key clicks, pitch-swept oscillators for slap, nav open/close, select, bubbles, and a little arpeggio for found eggs), so there are no audio files to download. Sound is on by default and the mute choice is remembered (`localStorage`).
- `play(name, { volume })` with a master gain around 0.4; `muted` lives in the Zustand store and is saved to `localStorage`.
- Never plays when `muted`, when the tab is hidden, or before the first interaction.

## 11. SEO, metadata, analytics

- The metadata API per route; `metadataBase` comes from `NEXT_PUBLIC_SITE_URL`.
- OG images through `next/og` (`opengraph-image.tsx`) per route using the headline pair and the brand colours.
- `sitemap.ts`, `robots.ts`, JSON-LD `Person` + `WebSite` in the root layout.
- `@vercel/analytics` and `@vercel/speed-insights` in the root layout. Custom events: nav open, page via nav, peel, Arcee message sent, resume printed, egg found.

## 12. Performance budget

| Metric | Budget |
|---|---|
| LCP (mobile, 4G) | < 2.5 s |
| CLS | < 0.05 |
| INP | < 200 ms |
| Initial JS (gzipped, excluding lazy 3D) | < 200 KB total, of which our app code < 40 KB (React/Next runtime is ~160 KB) |
| Lighthouse performance (mobile) | ≥ 90 |
| Fonts | 3 families, subset latin, preload the display fonts only |

*Measured 2026-11-12, after the milestone 7 pass and the extras:* 199 KB gzipped on the home page (197 KB before the extras; the scribbles, flickable stickers and card flight add 2.3 KB), of which ~160 KB is the React/Next runtime and the rest our code. That leaves under 1 KB of headroom: anything new on the home page needs to load on demand or pay for itself. The chat (AI SDK + corpus), terminal and scuba cat load on first use; GSAP loads after first paint for the line reveals; three.js loads only on case studies. (Before the pass it was ~345 KB once Arcee landed.) *Re-measured 2026-11-13:* the intro loader and the fuller home hero bring it to 199.7 KB (+0.8 KB: the intro counter logic and the Delhi clock). The loader markup is a Server Component passed into `TransitionProvider` as `intro`, so it ships no JS. *After merging that into v7 (2026-11-13):* 200.2 KB, so Lenis now loads on demand right after hydration (the intro covers the screen meanwhile): home 194.9 KB, work 197.9 KB, about 195.5 KB, contact 195.7 KB. On Vercel, Web Analytics and Speed Insights add their small loaders on top.

Techniques: Server Components by default (only interactive pieces are client components), GSAP plugins registered lazily per feature, 3D lazy-loaded with tiering, `next/image` with AVIF, and no layout-shifting typing (§5.4).

## 13. Environment variables

| Name | Used by | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | metadata, OG | yes (prod) |
| `GROQ_API_KEY` | Arcee | yes for Arcee |
| `ARCEE_MODEL` | Arcee (default `openai/gpt-oss-20b`) | no |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (or `KV_REST_API_URL`, `KV_REST_API_TOKEN` from Vercel's Marketplace integration) | rate limits | yes for Arcee in prod |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL` | leave-a-message | yes for messages |
| `GITHUB_TOKEN` | currently building (higher rate limit) | no |

Local values go in `.env.local` (git-ignored). `.env.example` documents them.

## 14. Quality

- **Unit (Vitest):** peel geometry, fit, shift selection (clock / storage / query / 3am), terminal commands, nav filtering, retrieval, guard rules, GitHub event parsing.
- **E2E (Playwright):** nav bar keyboard flow, page transition reaches the right route, peel toggles the shift and persists it, print emulation shows the resume, 404, and Arcee with a mocked API (navigate + message confirm).
- **Accessibility:** axe checks in Playwright on every page, in both shifts.
- **CI (GitHub Actions):** lint, typecheck (`next typegen` first, so route types like `PageProps` exist on a fresh checkout), unit, e2e, build, on every PR and every push to `main` or a `v*` branch.
- **Git:** `main` is always deployable; feature branches `feat/<area>-<thing>`; Conventional Commits.

## 15. Build order

1. Foundation: app scaffold, tokens, fonts, shift bootstrap, shell layout ✓
2. Signature moves: Spike S1 → peel toggle → page transition → nav bar → headline ✓ (stub pages for every route; sound comes in milestone 6)
3. Content + pages: content files, home, work, about, DiaLabs, contact, 404 ✓ (footer feed, smooth scroll and reveals included)
4. Star case studies + 3D objects ✓ (home and work cards keep the 2D drawings for performance; the drawing flies from its card into the case-study stage, §5.3)
5. Arcee chatbot ✓ built and tested end to end with a stand-in model (`ARCEE_MOCK=1`): chat panel, retrieval, guardrails, rate limits, navigate/sticker/draftMessage tools, leave-a-message email. Live answers need `GROQ_API_KEY`; Spike S2 (tool-calling reliability of `gpt-oss-20b`) runs once the key is in. Placeholder cat stickers live in `public/stickers/` until Itesh's set replaces them (same file names).
6. Easter eggs + sound ✓ (built before 5 because it needs no keys: terminal, scuba cat, tab title, 3am note, print-to-resume, toasts, synthesized UI sounds with a mute toggle)
7. Polish ✓ (extras: scribble underlines, flickable stickers, card-to-stage flight): on-demand loading (JS budget met), share images, sitemap, robots, manifest, JSON-LD, per-page metadata, error page, Vercel Analytics, Playwright e2e + axe (no violations, day and night, desktop and phone), Firefox render check, CI. Left for launch: Safari/WebKit testing (not available on this Linux machine), the Groq/Upstash/Resend keys, and deploying from `iteshxt/portfolio`.

## 16. Risks

| Risk | Mitigation |
|---|---|
| Dragging during a view transition misbehaves in some browsers | Spike S1, with the DOM-clone fallback (§5.2) |
| 3D hurts mobile performance | Device tiering, stills on low tier, budgets checked in CI |
| Groq quota or outage | Global daily cap, graceful fallback, model set by env |
| Prompt injection or abuse of Arcee | Scope prompt, guard rules, tool allowlist, link filter, rate limits |
| GitHub API rate limit | 10-minute cache lifetime, optional token, silent failure |
