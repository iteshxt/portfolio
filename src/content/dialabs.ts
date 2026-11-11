/**
 * DiaLabs releases Itesh worked on (docs/prd.md §7.4), from the DiaLabs
 * GitHub organisation (audited Nov 2026). Team-only releases are credited in
 * TEAM_NOTE rather than listed as his work.
 */

export type Release = {
  name: string;
  kind: "App" | "Model" | "Tool" | "Bot" | "Site";
  day: string;
  night: string;
  links: { label: string; href: string }[];
};

export const DIALABS_URL = "https://github.com/DiaLabs";

export const RELEASES: Release[] = [
  {
    name: "PatentIQ",
    kind: "App",
    day: "Scores student patent drafts on an 11-part, 100-point rubric.",
    night: "Next.js → Cloudflare Worker (D1, R2) → Express service for OCR, SerpAPI checks and Gemini.",
    links: [
      { label: "Live", href: "https://patentiq.dialabs.tech/" },
      { label: "Code", href: "https://github.com/DiaLabs/PatentIQ" },
    ],
  },
  {
    name: "DiaChat",
    kind: "App",
    day: "A private Gen Z AI companion that runs in your browser.",
    night: "A Gemma-3 1B fine-tune served in-browser with WebLLM on WebGPU, CPU fallback included.",
    links: [
      { label: "Live", href: "https://chat.dialabs.tech/" },
      { label: "Code", href: "https://github.com/DiaLabs/dia-chat" },
    ],
  },
  {
    name: "dia-convo-v1.2c",
    kind: "Model",
    day: "A conversational model tuned for supportive, therapy-style chat.",
    night: "Qwen2.5 7B Instruct fine-tuned on a therapy dataset, published 4-bit on Hugging Face.",
    links: [
      { label: "Hugging Face", href: "https://huggingface.co/petrioteer/dia-convo-v1.2c" },
      { label: "Code", href: "https://github.com/DiaLabs/dia-convo-v1.2c" },
    ],
  },
  {
    name: "Stryde",
    kind: "Tool",
    day: "Drop in a football clip, get possession, heatmaps and team stats.",
    night: "YOLO11 runs on your device via ONNX Runtime Web; the video never leaves the browser.",
    links: [
      { label: "Live", href: "https://stryde.dialabs.tech" },
      { label: "Code", href: "https://github.com/DiaLabs/Stryde" },
    ],
  },
  {
    name: "Dia Moderator",
    kind: "Bot",
    day: "One dashboard for moderation bots on Discord, WhatsApp and Telegram.",
    night: "Express runs three bots: profanity and spam warnings, Gemini summaries, WhatsApp QR login.",
    links: [
      { label: "Live", href: "https://diamod.vercel.app" },
      { label: "Code", href: "https://github.com/DiaLabs/dia-mod" },
    ],
  },
  {
    name: "DiaLabs website",
    kind: "Site",
    day: "The lab's home on the web, in a retro-brutalist style.",
    night: "Next.js App Router with shadcn/ui and Tailwind; designed by Itesh.",
    links: [
      { label: "Live", href: "https://dialabs-home.vercel.app" },
      { label: "Code", href: "https://github.com/DiaLabs/dialabs-home" },
    ],
  },
];

export const TEAM_NOTE =
  "The rest of the team also shipped a 27k-pair conversation dataset, a watermark detector and a voice assistant.";
