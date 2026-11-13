import type { StarSlug } from "./pages";

/**
 * Star project case studies (docs/prd.md §7.2, docs/design.md §2.11). Facts come
 * from the repos (READMEs, roadmaps, decision records, eval reports, source),
 * checked on 2026-11-14 — no invented metrics. Typed content instead of MDX
 * because every case study shares one structure; the optional blocks render
 * only when a project has them.
 */

export type CaseStudy = {
  slug: StarSlug;
  name: string;
  role: string;
  timeline: string;
  status: string;
  summary: { day: string; night: string };
  /** Key numbers; not shown on the page, but Arcee (the chatbot) knows them. */
  stats: { value: string; label: string }[];
  day: {
    intro: string;
    points: { title: string; body: string }[];
  };
  /** Real tasks it's tested on, by name. */
  tested?: { caption: string; items: string[] };
  night: {
    intro: string;
    pipeline: { step: string; body: string }[];
    decisions: { title: string; body: string }[];
  };
  /** Safety rules, plus anything it refuses outright. */
  guards?: { caption: string; rules: { title: string; body: string }[]; refused?: string[] };
  /** Optional extra block: a scored breakdown (PatentIQ) or a progress list (Arcee). */
  breakdown?: { title: string; caption: string; rows: { label: string; value: number; max: number; note?: string }[] };
  progress?: { title: string; caption: string; rows: { label: string; state: "done" | "doing" | "next"; note: string }[] };
  next: StarSlug;
};

export const CASE_STUDIES: Record<StarSlug, CaseStudy> = {
  arcee: {
    slug: "arcee",
    name: "Arcee",
    role: "Solo: design, code and evals",
    timeline: "Oct 2026 – now",
    status: "Early development · v0.4.1",
    summary: {
      day: "A desktop agent for Ubuntu. Say or type what you want, and it plans the request, does it with your apps, and tells you what happened.",
      night: "Not a prompt with tools bolted on: a harness. A planner for long requests, a step loop that calls one tool at a time, and guards around every action.",
    },
    stats: [
      { value: "43/44", label: "whole-task evals passed on local models, median 2 steps and 11.4 s" },
      { value: "110", label: "tools: files, shell, browser, desktop, mail, calendar and more" },
      { value: "4–6 ms", label: "for the kill switch to stop everything, measured over 10 tries" },
      { value: "1,143", label: "unit tests, and 377 commits in its first 18 days, solo" },
    ],
    day: {
      intro: "“How much free disk space do I have?” “Move the installers in Downloads to the trash.” “Turn the volume down to 30.” Arcee carries requests like these out on your own desktop, printing every step as it goes.",
      points: [
        { title: "Talk or type", body: "A wake word trained from three samples of your voice, transcripts from Groq Whisper, and spoken replies through Kitten TTS. Or just type: arcee-cli run \"…\"." },
        { title: "Uses your computer like you do", body: "Files and the shell, your real signed-in Chrome, desktop apps through the accessibility tree, plus mail, calendar, reminders, music and WhatsApp." },
        { title: "Asks before it touches anything", body: "Reading is automatic. Anything that changes files stops at “Allow? [y/N]”. Commands like rm -rf and sudo are refused outright." },
        { title: "Any model, any role", body: "By default gpt-oss-20b, qwen3.8-27b and gpt-oss-120b on Groq, rotated within each one's free budget. Pass --core local and everything stays on your machine through Ollama." },
      ],
    },
    tested: {
      caption: "Some of the 44 whole-task evals, by name. Each runs in a throwaway home folder.",
      items: ["trash-installers", "rename-photo", "volume-to-30", "dnd-an-hour", "timer-10-min", "time-in-tokyo", "dollars-to-rupees", "sensex", "drive-to-chandigarh", "news-isro", "injection-in-file", "rm-becomes-trash"],
    },
    night: {
      intro: "Every request flows through the same loop, and every step is logged with secrets redacted.",
      pipeline: [
        { step: "Hear", body: "sherpa-onnx keyword spotting and Silero VAD wake it; Groq Whisper writes the transcript." },
        { step: "Plan", body: "Long requests get a plan first; short ones go straight to the loop." },
        { step: "Act", body: "A step loop calls one tool at a time and reads the result back. Hard steps climb a ladder to a stronger model." },
        { step: "See", body: "With no accessibility tree to read, a vision model picks cells on an 8×6 grid of the screen, then a zoomed 6×6, to find what to click." },
        { step: "Guard", body: "Every action passes a policy tier and the shell classifier; web and file content is marked untrusted." },
        { step: "Remember", body: "SQLite with full-text search. Recall weighs 60% match, 25% recency (14-day half-life) and 15% importance." },
        { step: "Report", body: "A spoken or written answer, with the full run in arcee-cli history." },
      ],
      decisions: [
        { title: "Groq by default, local on request", body: "The default core runs on Groq, rotating models by each one's budget (8,000 tokens a minute, 200,000 a day). --core local keeps every request on the laptop." },
        { title: "Context beat a bigger model", body: "A small local model went from 3/8 to 7/8 on the same cases with better context alone, so the harness feeds context before it reaches for size." },
        { title: "Plan only long requests", body: "Planning costs a model call, so it only happens when the request needs one." },
        { title: "Chrome through an extension", body: "A small extension lets Arcee read and act in your real, signed-in browser instead of a fresh headless one." },
      ],
    },
    guards: {
      caption: "Three tiers: auto, confirm and never. The never-list holds even when a command hides behind ;, && or $(…).",
      rules: [
        { title: "Confirm before changes", body: "Anything that writes, moves or deletes waits for a yes. Deleting goes to the trash, not rm." },
        { title: "Untrusted text can't steer it", body: "If a web page or file contains instruction-like phrases, the next action needs your confirmation, whatever its tier." },
        { title: "Risky clicks ask first", body: "Buttons named delete, send or pay always ask before Arcee clicks them." },
      ],
      refused: ["sudo", "su", "pkexec", "dd", "fdisk", "mkfs", "shred", "shutdown", "reboot", "passwd", "useradd", "iptables", "ufw", "writes to /etc and /usr"],
    },
    progress: {
      title: "Built in gated phases",
      caption: "Each phase has a measurable gate it must pass before it counts as done.",
      rows: [
        { label: "Core loop", state: "done", note: "100% valid first replies (108/108) and 15/15 whole tasks on a 1.7B local model" },
        { label: "Wayland capture and input", state: "done", note: "Largest miss 1.41 px over 60 clicks; the kill switch stops in 4–6 ms" },
        { label: "Browser and desktop", state: "doing", note: "Fill a web form and rename a file through the GUI, with zero screenshots" },
        { label: "Daemon, extension, app", state: "doing", note: "A fresh install to its first task in under 10 minutes" },
        { label: "Memory and voice", state: "doing", note: "Wake to transcript under 1.5 s with his own voice; a week-old fact recalled" },
        { label: "Packaging and release", state: "next", note: "75% on the local evals (it's at 98%) and 20 outside testers for v1.0" },
      ],
    },
    next: "patentiq",
  },

  patentiq: {
    slug: "patentiq",
    name: "PatentIQ",
    role: "Co-built at DiaLabs (144 of 244 commits)",
    timeline: "May 2026",
    status: "Beta · live",
    summary: {
      day: "Universities want students to file patents, but most drafts need work first. PatentIQ reads a draft and scores it the way a reviewer would.",
      night: "Context first: the patents a draft cites are checked against live databases before the model grades a word of it.",
    },
    stats: [
      { value: "11", label: "weighted dimensions in the rubric" },
      { value: "100", label: "point score for every draft, with a verdict" },
      { value: "±15", label: "points for research integrity, from verified citations" },
      { value: "59%", label: "of the commits across the app and the evaluator are his" },
    ],
    day: {
      intro: "A mentor sets up a group, students upload their drafts, and each one comes back scored with what to fix before filing.",
      points: [
        { title: "No account for students", body: "Mentors create groups and share a public link; students submit through it without signing up." },
        { title: "A score out of 100", body: "Eleven weighted dimensions, from inventive step and novelty to claims and commercial potential, plus strengths, weaknesses and a refined inventive concept." },
        { title: "Citations and copying, checked", body: "Every patent a draft cites is looked up in live patent search, and the text goes through a plagiarism scan." },
        { title: "Built for mentors", body: "A dashboard with analytics, every submission, a live view of the pipeline, retries, Excel export and PDF reports." },
      ],
    },
    night: {
      intro: "A deterministic stage runs before the generative one, so the model reasons from verified patents, not from memory.",
      pipeline: [
        { step: "Extract", body: "Patent IDs are pulled from the draft with regex and text patterns." },
        { step: "Verify", body: "Each ID is looked up in live patent search (Serper), giving a ground-truth list of valid and invalid citations." },
        { step: "Evaluate", body: "The PDF and that list go to the model (Gemma by default), which returns structured JSON, sanitised before use." },
        { step: "Check", body: "Copyleaks scans for plagiarism, and the evaluator looks for its own canary phrase." },
        { step: "Persist", body: "Reports land in Cloudflare D1, files in R2; pipeline logs, a dead-letter table and retry counts record every stage." },
      ],
      decisions: [
        { title: "Edge router, heavy service", body: "A Cloudflare Worker handles routing, auth and storage; an Express service on Render does the slow work: PDFs and model calls." },
        { title: "Deterministic before generative", body: "The citation check runs first, so the model is grounded in which patents actually exist before it judges anything." },
        { title: "Integrity as a formula", body: "+3 for each valid patent cited, up to +15, and −5 for each invalid one, applied by the model alongside a verdict from Excellent to Fraudulent." },
        { title: "A canary in the report", body: "Each PDF report hides an invisible line. Paste it into an AI to rewrite the draft and the phrase comes back: the resubmission scores 0 and is rejected in code." },
      ],
    },
    breakdown: {
      title: "The rubric",
      caption: "Every draft is scored on the same 100 points.",
      rows: [
        { label: "Inventive step", value: 20, max: 20 },
        { label: "Novelty potential", value: 15, max: 20 },
        { label: "Research integrity", value: 15, max: 20, note: "formula" },
        { label: "Technical disclosure", value: 10, max: 20 },
        { label: "Patentability strength", value: 10, max: 20 },
        { label: "Problem relevance", value: 5, max: 20 },
        { label: "Claim readiness", value: 5, max: 20 },
        { label: "Prior-art differentiation", value: 5, max: 20 },
        { label: "Commercial potential", value: 5, max: 20 },
        { label: "Prototype readiness", value: 5, max: 20 },
        { label: "Drafting quality", value: 5, max: 20 },
      ],
    },
    next: "diachat",
  },

  diachat: {
    slug: "diachat",
    name: "DiaChat",
    role: "Built at DiaLabs (34 of 37 commits)",
    timeline: "2025 – 2026",
    status: "Live",
    summary: {
      day: "A companion for Gen Z that talks like a friend. The model runs in your browser on your own GPU, and your chats are saved on your device.",
      night: "Ship a small model to the edge: a 1B chat model running in the tab through WebLLM on WebGPU, with a Transformers.js path for machines without it.",
    },
    stats: [
      { value: "1B", label: "parameter model, running in your tab" },
      { value: "~730 MB", label: "download, then it runs on your GPU" },
      { value: "10", label: "mood strategies, each with its own trigger words" },
      { value: "2", label: "runtimes: WebGPU, with a CPU fallback" },
    ],
    day: {
      intro: "Open it, pick a look, start talking. The replies come from a model running on your own machine.",
      points: [
        { title: "Your chats stay with you", body: "Conversations are stored in your browser's IndexedDB, not on a server." },
        { title: "Reads the room", body: "Ten mood strategies, picked by trigger words, change how it answers when you're low, stressed or just bored." },
        { title: "Start before you sign in", body: "“Ghost Chat” lets you talk before anything is saved; Google sign-in when you want to keep it." },
        { title: "Yours", body: "Themes, fonts and colours, plus auto-saved chat history." },
      ],
    },
    night: {
      intro: "The interesting part is getting a chat model to load and answer inside an ordinary browser tab.",
      pipeline: [
        { step: "Pick", body: "?cpu=true wins, then your saved setting, then whether navigator.gpu offers an adapter." },
        { step: "Load", body: "A 4-bit, ~730 MB build of the 1B model downloads to the browser; loading text never names the model." },
        { step: "Chat", body: "WebLLM streams replies on WebGPU; Transformers.js covers machines without it." },
        { step: "Summarise", body: "Every 10 messages a larger hosted model condenses the last ten, so the small one keeps the thread of a long chat." },
        { step: "Store", body: "IndexedDB keeps users, chats, messages and summaries; Firebase handles Google sign-in." },
      ],
      decisions: [
        { title: "On-device over an API", body: "No inference bill, and the conversation itself is answered on the visitor's own machine." },
        { title: "1B, on purpose", body: "Small enough to download and run on an ordinary laptop GPU, big enough to hold a friendly conversation." },
        { title: "Always a fallback", body: "If WebGPU isn't available, a CPU path keeps the conversation going." },
        { title: "A bigger model for memory", body: "Summaries and chat titles come from a larger hosted model, the trade that keeps long chats coherent on a 1B." },
      ],
    },
    next: "arcee",
  },
};
