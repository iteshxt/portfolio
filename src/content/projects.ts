/**
 * Projects (docs/spec.md §6). Stars get case studies; everything else lives
 * in the archive with a one-line day (what) and night (how) description.
 * Facts come from the GitHub repos, the CV and iteshxt.me — no invented metrics.
 */

export type StarBrand = "arcee" | "patentiq" | "diachat";

export type ProjectCategory = "ai" | "web" | "mobile" | "tool";

export type Project = {
  slug: string;
  name: string;
  tier: "star" | "archive";
  category: ProjectCategory;
  year: string;
  day: string;
  night: string;
  stack: string[];
  links: { live?: string; repo?: string; extra?: { label: string; href: string }[] };
  /** Star projects only: frame colour and running order. */
  /** Star projects: whose app colours to use (lib/brand.ts). */
  brand?: StarBrand;
  order?: number;
};

export const STAR_PROJECTS: Project[] = [
  {
    slug: "arcee",
    name: "Arcee",
    tier: "star",
    order: 1,
    brand: "arcee",
    category: "ai",
    year: "2026",
    day: "A desktop agent you talk or type to. It plans the request, uses your apps and reports back.",
    night: "Planner/executor loop with safety tiers, a sandboxed shell and an escalation ladder from Groq to local models.",
    stack: ["Python", "GTK", "Groq", "Ollama", "Wayland"],
    links: { repo: "https://github.com/iteshxt/arcee-agent" },
  },
  {
    slug: "patentiq",
    name: "PatentIQ",
    tier: "star",
    order: 2,
    brand: "patentiq",
    category: "ai",
    year: "2026",
    day: "Scores student patent drafts on an 11-part, 100-point rubric before anyone files them.",
    night: "Cited patents are checked against live patent search (Serper) before the model grades the draft; a Cloudflare Worker in front, an Express service behind.",
    stack: ["Next.js", "Cloudflare Workers", "Express", "Gemma", "Serper"],
    links: {
      live: "https://patentiq.dialabs.tech",
      repo: "https://github.com/DiaLabs/PatentIQ",
      extra: [{ label: "Evaluator", href: "https://github.com/DiaLabs/dia-evaluator" }],
    },
  },
  {
    slug: "diachat",
    name: "DiaChat",
    tier: "star",
    order: 3,
    brand: "diachat",
    category: "ai",
    year: "2025–2026",
    day: "A private Gen Z AI companion that runs entirely in your browser.",
    // Model confirmed by Itesh (2026-11-12): a Gemma-3 1B fine-tune.
    night: "Gemma-3 1B fine-tuned with PyTorch and Unsloth, running in your tab on WebGPU via WebLLM.",
    stack: ["PyTorch", "Unsloth", "Gemma-3 1B", "WebLLM", "WebGPU"],
    links: { live: "https://chat.dialabs.tech", repo: "https://github.com/DiaLabs/dia-chat" },
  },
];

/**
 * From the GitHub audit (Nov 2026; docs/prd.md §5.3). Left out: forks
 * (UniBites is the one fork Itesh asked to include), practice repos, and
 * repos with no commits by him (pii-redaction-tool, watermark-detector,
 * Dia-Assistant).
 */
export const ARCHIVE_PROJECTS: Project[] = [
  {
    slug: "sutr",
    name: "Sutr Clothing",
    tier: "archive",
    category: "web",
    year: "2025–2026",
    day: "The online store for the Sutr Clothing brand, plus its admin dashboard.",
    night: "Next.js API routes on MongoDB; Razorpay checkout, Ekart shipping API, Cloudinary.",
    stack: ["Next.js", "MongoDB", "Firebase Auth", "Razorpay", "Cloudinary"],
    links: {
      live: "https://sutr.store/",
      repo: "https://github.com/iteshxt/sutr.store",
      extra: [
        { label: "Admin", href: "https://admin.sutr.store/" },
        { label: "Admin code", href: "https://github.com/iteshxt/sutr.store-admin" },
      ],
    },
  },
  {
    slug: "bloom",
    name: "Bloom",
    tier: "archive",
    category: "web",
    year: "2026",
    day: "A two-player LeetCode streak tracker where partners keep each other going.",
    night: "Next.js PWA on Supabase (RLS, pg_cron), LeetCode GraphQL checks, web push.",
    stack: ["Next.js", "Supabase", "React Native", "TanStack Query", "Web Push"],
    links: {
      live: "https://bloom.iteshxt.me",
      repo: "https://github.com/iteshxt/bloom-web",
      extra: [
        { label: "App code", href: "https://github.com/iteshxt/bloom-app" },
        { label: "Backend", href: "https://github.com/iteshxt/bloom-backend" },
      ],
    },
  },
  {
    slug: "cadence",
    name: "Cadence",
    tier: "archive",
    category: "web",
    year: "2026",
    day: "Schedule bulk emails from your Gmail accounts at a safe sending pace.",
    night: "A BullMQ delayed job per email, Redis Lua rate slots per sender, Postgres guard.",
    stack: ["Next.js", "Express", "BullMQ", "PostgreSQL", "Gmail API"],
    links: { live: "https://cadence-mail.vercel.app", repo: "https://github.com/iteshxt/cadence" },
  },
  {
    slug: "stryde",
    name: "Stryde",
    tier: "archive",
    category: "ai",
    year: "2026",
    day: "Drop in a football clip, get possession, heatmaps and team stats.",
    night: "YOLO11 runs in the browser via ONNX Runtime Web; tracking and homography, no upload.",
    stack: ["Next.js", "ONNX Runtime Web", "YOLO11", "Zustand"],
    links: { live: "https://stryde.dialabs.tech", repo: "https://github.com/DiaLabs/Stryde" },
  },
  {
    slug: "investwise",
    name: "InvestWise",
    tier: "archive",
    category: "ai",
    year: "2026",
    day: "AI-written research briefs on stocks from live market data and news.",
    night: "Yahoo Finance collectors feed five parallel LLM agents and a CIO node, streamed over SSE.",
    stack: ["Next.js", "TypeScript", "yahoo-finance2", "gpt-oss-20b", "SSE"],
    links: { live: "https://investwise-beta.vercel.app", repo: "https://github.com/iteshxt/InvestWise" },
  },
  {
    slug: "dia-moderator",
    name: "Dia Moderator",
    tier: "archive",
    category: "ai",
    year: "2025",
    day: "One dashboard for moderation bots on Discord, WhatsApp and Telegram.",
    night: "Express runs three bots: profanity and spam warnings, Gemini summaries, WhatsApp QR login.",
    stack: ["Node.js", "Express", "React", "discord.js", "Gemini"],
    links: { live: "https://diamod.vercel.app", repo: "https://github.com/DiaLabs/dia-mod" },
  },
  {
    slug: "fitcheckr",
    name: "FitCheckr",
    tier: "archive",
    category: "ai",
    year: "2025–2026",
    day: "Upload your photo and a garment to preview how it looks on you.",
    night: "A Next.js API route sends both images to Gemini's image model through @google/genai.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Gemini"],
    links: { live: "https://fitcheckr.vercel.app", repo: "https://github.com/iteshxt/fitcheckr" },
  },
  {
    slug: "unibites",
    name: "UniBites",
    tier: "archive",
    category: "mobile",
    year: "2025–2026",
    day: "Order campus food ahead and skip the canteen queue.",
    night: "Flutter + Riverpod over MongoDB; guest carts merge on sign-in; orders poll every 3s.",
    stack: ["Flutter", "Riverpod", "Firebase Auth", "MongoDB", "go_router"],
    links: {
      repo: "https://github.com/iteshxt/UniBites",
      extra: [{ label: "Releases", href: "https://github.com/iteshxt/UniBites/releases" }],
    },
  },
  {
    slug: "hiclippy",
    name: "HiClippy",
    tier: "archive",
    category: "web",
    year: "2026",
    day: "Share text, images and files with a 4-digit code. No account needed.",
    night: "Express + Multer API; MongoDB TTL indexes expire clips; Nginx and Docker Compose.",
    stack: ["React", "Vite", "Express", "MongoDB", "Docker"],
    links: { live: "https://hiclippy.vercel.app", repo: "https://github.com/iteshxt/hiclippy" },
  },
  {
    slug: "fairshare",
    name: "FairShare",
    tier: "archive",
    category: "web",
    year: "2026",
    day: "A shared expense tracker that imports CSVs and shows who owes whom.",
    night: "Two-stage CSV import into staging tables, 12+ anomaly checks, greedy debt settling.",
    stack: ["Next.js", "Supabase", "NextAuth.js", "Tailwind CSS"],
    links: { live: "https://fairshare-eta-taupe.vercel.app", repo: "https://github.com/iteshxt/FairShare" },
  },
  {
    slug: "cineflex",
    name: "CineFlex",
    tier: "archive",
    category: "web",
    year: "2026",
    day: "A movie and series browser with watchlists that stay on your device.",
    night: "Next.js 16 fetches TMDB on the server; lists and progress live in a local-only PWA.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "TMDB API"],
    links: { live: "https://cineflex-app-beta.vercel.app", repo: "https://github.com/iteshxt/cineflex-app" },
  },
  {
    slug: "campus-quest",
    name: "CampusQuest",
    tier: "archive",
    category: "ai",
    year: "2026",
    day: "Campus scavenger hunts where an AI checks your photo proof.",
    night: "React SPA and a Laravel API; a Node service grades photos with a Gemma model; Supabase.",
    stack: ["React", "Laravel", "Node.js", "Gemma", "Supabase"],
    links: { live: "https://campus-quest-frontend.vercel.app", repo: "https://github.com/iteshxt/campus-quest" },
  },
  {
    slug: "swatantra-ai",
    name: "Dr. Swatantra AI",
    tier: "archive",
    category: "ai",
    year: "2025",
    day: "The real-time voice behind an Android wellness app's AI guide.",
    night: "Flask WebSockets and a Vercel TypeScript API on Gemini's native-audio models.",
    stack: ["Flask", "WebSockets", "TypeScript", "Gemini Live API"],
    links: {
      repo: "https://github.com/iteshxt/swatantra.ai",
      extra: [{ label: "Vercel API", href: "https://github.com/iteshxt/kalpvraksha-ai" }],
    },
  },
  {
    slug: "pep-timetable",
    name: "PEP Timetable",
    tier: "archive",
    category: "web",
    year: "2026",
    day: "An installable timetable that shows the current class and compares two schedules.",
    night: "Next.js reads a timetable JSON; a service worker handles offline and class reminders.",
    stack: ["Next.js", "TypeScript", "Service Worker"],
    links: { live: "https://pep-timetable.vercel.app", repo: "https://github.com/iteshxt/pep-timetable" },
  },
  {
    slug: "velo-rapido",
    name: "Velo Rapido",
    tier: "archive",
    category: "web",
    year: "2025",
    day: "A bike rental site to browse, book and pay, with an admin panel.",
    night: "Plain PHP pages on a six-table MySQL schema; admin for fleet, maintenance and damage.",
    stack: ["PHP", "MySQL", "Tailwind CSS", "JavaScript"],
    links: { live: "https://velorapido.wuaze.com/", repo: "https://github.com/iteshxt/velo-rapido" },
  },
  {
    slug: "cooksy",
    name: "Cooksy",
    tier: "archive",
    category: "web",
    year: "2025",
    day: "A recipe finder to browse, search and save meals from around the world.",
    night: "A React SPA on TheMealDB API; favourites kept in localStorage.",
    stack: ["React", "React Router", "TheMealDB API"],
    links: { live: "https://cooksy-recipes.vercel.app", repo: "https://github.com/iteshxt/cooksy" },
  },
  {
    slug: "lpu-wifi-auto-login",
    name: "LPU Wi-Fi Auto Login",
    tier: "archive",
    category: "tool",
    year: "2023–2026",
    day: "A Chrome extension that logs you into the LPU campus Wi-Fi by itself.",
    night: "A Manifest V3 background worker checks connectivity and submits the portal login.",
    stack: ["JavaScript", "Chrome Extension (MV3)"],
    links: { repo: "https://github.com/iteshxt/lpu-wifi-auto-login" },
  },
  {
    slug: "nautilus-antigravity",
    name: "Open in Antigravity",
    tier: "archive",
    category: "tool",
    year: "2026",
    day: "Adds “Open in Antigravity” to the GNOME Files right-click menu.",
    night: "A Python Nautilus.MenuProvider extension with a one-line installer.",
    stack: ["Python", "nautilus-python"],
    links: { repo: "https://github.com/iteshxt/nautilus-antigravity" },
  },
  {
    slug: "scuba-cat",
    name: "Scuba Cat",
    tier: "archive",
    category: "tool",
    year: "2026",
    day: "A scuba-diving cat as your Linux boot animation. Important work.",
    night: "A Plymouth theme script that plays a 115-frame PNG animation at boot.",
    stack: ["Plymouth", "Linux"],
    links: { repo: "https://github.com/iteshxt/scuba-cat" },
  },
];

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  ai: "AI",
  web: "Web",
  mobile: "Mobile",
  tool: "Tools",
};
