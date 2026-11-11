import type { StarSlug } from "./pages";

/**
 * Star project case studies (docs/prd.md §7.2). Day = what it does, night =
 * how it works. Facts come from the repos (READMEs, roadmaps, decision
 * records, eval reports), the CV and Itesh's confirmations. Typed content
 * instead of MDX because every case study shares one structure.
 */

export type CaseStudy = {
  slug: StarSlug;
  name: string;
  role: string;
  timeline: string;
  status: string;
  summary: { day: string; night: string };
  stats: { value: string; label: string }[];
  day: {
    intro: string;
    points: { title: string; body: string }[];
  };
  night: {
    intro: string;
    pipeline: { step: string; body: string }[];
    decisions: { title: string; body: string }[];
  };
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
    status: "Early development · v0.4 pre-releases",
    summary: {
      day: "A desktop agent for Ubuntu. Say or type what you want, and it plans the request, does it with your apps, and tells you what happened.",
      night: "Not a prompt with tools bolted on: a harness. A planner for long requests, a step loop that calls one tool at a time, and guards around every action.",
    },
    stats: [
      { value: "43/44", label: "whole-task evals passed on local models" },
      { value: "377", label: "commits in its first 17 days, all solo" },
      { value: "<100ms", label: "kill switch, measured at its phase gate" },
      { value: "8", label: "local voices, wake word trained to his voice" },
    ],
    day: {
      intro: "“How much disk space do I have?” “Rename these photos.” “Remind me at six.” Arcee takes requests like these and carries them out on your own desktop.",
      points: [
        { title: "Talk or type", body: "A wake word trained to your voice, local speech recognition, and spoken replies in eight voices." },
        { title: "Uses your computer like you do", body: "Shell, files, your signed-in Chrome, desktop apps through the accessibility tree, mail, calendar, music, reminders and WhatsApp." },
        { title: "Asks before it touches anything", body: "Read-only actions run at once. Anything that changes files asks first. Destructive commands like rm -rf and sudo are refused outright." },
        { title: "Any model, any role", body: "Groq's gpt-oss models by default, or everything on your machine with local models through Ollama." },
      ],
    },
    night: {
      intro: "Every request flows through the same loop, and every step is logged with secrets redacted.",
      pipeline: [
        { step: "Hear", body: "Wake word, then a local transcript with sherpa-onnx." },
        { step: "Plan", body: "Long requests get a plan first; short ones go straight to the loop." },
        { step: "Act", body: "A step loop calls one tool at a time and reads the result back. An escalation ladder hands hard steps to a stronger model." },
        { step: "Guard", body: "Permission tiers, a shell allowlist and never-list, a bubblewrap sandbox for scripts, and web content treated as untrusted." },
        { step: "Remember", body: "Facts plus day and week summaries in SQLite, so last week's context is still there." },
        { step: "Report", body: "A spoken or written answer, with the full history available from the CLI." },
      ],
      decisions: [
        { title: "Local-first models", body: "The core is built to run on a laptop GPU; cloud models are an option, not a requirement." },
        { title: "Plan only long requests", body: "Planning costs a model call, so it only happens when the request needs one." },
        { title: "Groq by default, local when the day runs out", body: "gpt-oss-20b for most steps, 120b for harder ones, and an automatic fallback to local models when the free quota is spent." },
        { title: "Chrome through an extension", body: "A small extension lets Arcee read and act in your real, signed-in browser. Clicking Send, Delete or Pay always asks first." },
      ],
    },
    progress: {
      title: "Built in gated phases",
      caption: "Each phase has a measurable gate it must pass before it counts as done.",
      rows: [
        { label: "Core loop", state: "done", note: "Valid action on the first try >90% with a 1.7B local model" },
        { label: "Browser and desktop", state: "doing", note: "Fill a web form and rename a file through the GUI, zero screenshots" },
        { label: "Wayland capture and input", state: "done", note: "Clicks within 5 px, kill switch under 100 ms" },
        { label: "Daemon, extension, app", state: "doing", note: "Fresh account: install, set up, first task in under 10 minutes" },
        { label: "Memory and voice", state: "doing", note: "Wake to transcript under 1.5 s; a week-old fact recalled" },
        { label: "Packaging and release", state: "next", note: "75% eval pass on the local preset; 20 outside testers" },
      ],
    },
    next: "patentiq",
  },

  patentiq: {
    slug: "patentiq",
    name: "PatentIQ",
    role: "Co-built at DiaLabs (about 60% of the commits)",
    timeline: "May 2026",
    status: "Beta · live",
    summary: {
      day: "Universities want students to file patents, but most drafts need work first. PatentIQ reads a draft and scores it the way a reviewer would.",
      night: "Context first: the model never grades a draft until the facts it depends on, the patents it cites, have been checked against live databases.",
    },
    stats: [
      { value: "11", label: "weighted dimensions in the rubric" },
      { value: "100", label: "point score for every draft" },
      { value: "3", label: "stage pipeline: verify, evaluate, report" },
      { value: "15", label: "integrity points computed by formula, not the model" },
    ],
    day: {
      intro: "Upload a patent draft and get back a score, a breakdown, and what to fix before filing.",
      points: [
        { title: "Any draft, even scanned", body: "PDFs are parsed, and scanned pages go through OCR." },
        { title: "A score out of 100", body: "Eleven weighted dimensions, from novelty and inventive step to claims and commercial potential, plus strengths, weaknesses and a refined inventive concept." },
        { title: "Citations get checked", body: "Every patent the draft cites is looked up in live patent databases, and plagiarism is scanned too." },
        { title: "Built for mentors", body: "Mentors sign in to review their students' submissions and reports." },
      ],
    },
    night: {
      intro: "A deterministic stage runs before the generative one, so the AI's reasoning is grounded in verified patent data.",
      pipeline: [
        { step: "Extract", body: "Patent IDs are pulled from the draft with regex and text patterns." },
        { step: "Verify", body: "Each ID is validated against live patent databases through SerpAPI, giving a ground-truth list." },
        { step: "Evaluate", body: "Gemini scores the draft with that context, returning structured JSON that's sanitised before use." },
        { step: "Persist", body: "The report lands in Cloudflare D1, files in R2, with every stage written to an audit log." },
      ],
      decisions: [
        { title: "Edge router, heavy service", body: "A Cloudflare Worker handles routing, auth and storage; a separate Express service does the slow work: PDF parsing, OCR and LLM calls." },
        { title: "Deterministic before generative", body: "Grounding the model in verified citations first brought the hallucination rate near zero." },
        { title: "Integrity by formula", body: "Research Integrity is worth 15 points and is computed from citation checks, not the model's opinion." },
        { title: "A canary in the PDF", body: "A prompt-injection canary catches drafts that try to sneak instructions to the evaluator." },
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
    role: "Built at DiaLabs (34 of 36 commits)",
    timeline: "2025 – 2026",
    status: "Live",
    summary: {
      day: "A companion for Gen Z that talks like a friend and keeps your secrets. Literally: the model runs in your browser, so conversations never leave your device.",
      night: "Fine-tune small, ship to the edge: a Gemma-3 1B model tuned on conversational data, compiled for the browser, running on your GPU.",
    },
    stats: [
      { value: "1B", label: "parameter Gemma 3, fine-tuned" },
      { value: "~40", label: "tokens per second, streamed" },
      { value: "0", label: "servers running the model" },
      { value: "100%", label: "of conversations stay on your device" },
    ],
    day: {
      intro: "Open it, pick a look, start talking. Nothing you say gets sent to a model server.",
      points: [
        { title: "Private by design", body: "Conversations are stored in your browser, not on a server." },
        { title: "Fast", body: "GPU-accelerated with WebGPU, with a CPU fallback when WebGPU isn't there." },
        { title: "Yours", body: "Themes, fonts and colours, plus auto-saved chat history." },
        { title: "Talks back", body: "Optional text-to-speech for spoken replies." },
      ],
    },
    night: {
      intro: "The pipeline goes from data to a model your browser can run.",
      pipeline: [
        { step: "Data", body: "A curated conversational dataset for supportive, Gen Z-style chat." },
        { step: "Fine-tune", body: "Gemma-3 1B Instruct, fine-tuned with PyTorch and Unsloth." },
        { step: "Compile", body: "Packaged for in-browser inference with MLC-LLM and WebAssembly." },
        { step: "Serve", body: "WebLLM runs it on WebGPU at around 40 tokens per second; Transformers.js covers CPUs." },
        { step: "Store", body: "Chats persist in IndexedDB; Firebase Google sign-in when you want it." },
      ],
      decisions: [
        { title: "On-device over an API", body: "No inference bill and no conversation data leaving the device." },
        { title: "1B, on purpose", body: "Small enough to download and run on an ordinary laptop GPU, tuned enough to feel like a person." },
        { title: "Always a fallback", body: "If WebGPU isn't available, a CPU path keeps the conversation going." },
      ],
    },
    next: "arcee",
  },
};
