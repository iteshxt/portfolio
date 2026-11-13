# Product Requirements: iteshxt.me v4

| | |
|---|---|
| Owner | Itesh Singh Tomar ([@iteshxt](https://github.com/iteshxt)) |
| Domain | iteshxt.me (Vercel) |
| Status | Planning complete, build starting |
| Last updated | 2026-11-11 |
| Companion docs | [design.md](./design.md) (how it looks, moves and sounds), [spec.md](./spec.md) (how it's built) |

## 1. Vision

A portfolio that feels like a one-of-a-kind experience, not a template. Visitors should leave knowing three things: what Itesh builds, how he thinks, and that he's fun to work with.

The site is built around one idea: **Itesh has two shifts.**

- **By day** the site shows *what* he builds: products, outcomes, people using them.
- **By night** it shows *how* it works: architecture, trade-offs, evals, the 3am debugging.

Visitors switch shifts by peeling the page off like a sticker. Headlines are short, punchy two-line statements. The name appears once (the home page), not in every headline, because repeating it reads as noise. The navigation is a sentence the visitor finishes: **"Show me ___"**.

## 2. Audience

Anyone can land here. The site must work for all of them without a separate mode:

| Visitor | What they want | What they must get within 30 seconds |
|---|---|---|
| Recruiter / hiring manager | Can he do the job? | Role (ML engineer + full stack), star projects, experience, a way to contact or download the resume |
| Founder / client | Can he build my thing? | Shipped products with real users (Sutr), range, contact |
| Developer / peer | Is he actually good? | Night-shift depth: architecture, decisions, code links |
| Curious visitor | Is this fun? | Personality, easter eggs, Arcee the chatbot |

## 3. Goals and success measures

| Goal | Measure |
|---|---|
| Memorable | Visitors share or mention the site; average session over 2 minutes |
| Clear despite the creativity | A first-time visitor can name one star project and find contact without help |
| Converts | Messages through Arcee or email; resume downloads/prints; LinkedIn clicks |
| Fast | Lighthouse performance ≥ 90 on mobile; LCP < 2.5 s on a mid-range phone over 4G |
| Accessible | Fully usable by keyboard and with reduced motion; WCAG 2.2 AA contrast for text |

## 4. Scope

### In scope (v1)

1. Day/night "two shifts" experience with the peel toggle (§6.1)
2. "Show me ___" navigation bar (§6.2)
3. Sticker slap + peel page transition (§6.3)
4. Home (§7.1)
5. Star project case studies: **Arcee → PatentIQ → DiaChat**, in that order (§7.2)
6. Work archive with every other project, lighter treatment (§7.3)
7. DiaLabs chapter (§7.4)
8. About: experience, education, achievements, certificates (§7.5)
9. Contact (§7.6)
10. Arcee chatbot: RAG + guardrails + Groq, third person, cat-sticker replies, can navigate the site and take messages (§6.4)
11. Easter eggs: scuba cat, hidden terminal, tab title, 3am mode, print-to-resume, 404 page, live "currently building" feed (§6.5)
12. Subtle UI sound design with a mute toggle (§6.6)
13. Custom icon set
14. SEO, Open Graph images, analytics

### Out of scope (v1)

- Logo design. Postponed until the site exists; a text wordmark placeholder is used meanwhile.
- A blog
- Multiple languages (English only)
- A CMS (content lives in the repository)
- A mascot (explicitly not wanted)
- A voice for the chatbot

### Later (v2 ideas)

- Logo and a matching favicon/OG system
- Real cat sticker set replacing placeholders (supplied by Itesh)
- Stylised photo of Itesh (supplied later)
- Sticker collection (visitors collect stickers by finding easter eggs)
- A "now playing" widget

## 5. Content inventory

Source of truth: Itesh's CV (Nov 2026), GitHub profile `iteshxt`, and the `DiaLabs` organisation.

### 5.1 Positioning

ML engineer and full-stack developer. Fine-tunes and deploys LLMs (including on-device/in-browser), builds agent systems, and ships production web products. Co-founder of DiaLabs. B.Tech CSE at Lovely Professional University (2023–present, CGPA 8.53). Based in Delhi.

### 5.2 Star projects (deepest treatment, in this order)

| # | Project | Day (what) | Night (how) | Links |
|---|---|---|---|---|
| 1 | **Arcee**: Itesh's magnum opus | A model-agnostic desktop agent for Ubuntu (GNOME/Wayland). You talk or type, it plans the request, carries it out with tools (shell, files, browser, desktop GUI, web, mail, calendar, music, reminders…) and reports back. Wake word, eight local voices. | Planner/executor loop, escalation ladder across models (Groq gpt-oss by default, local Ollama fallback), safety tiers and guards (confirm before change, refuse destructive commands), sandboxed shell, untrusted-content handling, SQLite memory with day/week summaries, eval suite, phase gates and decision records | github.com/iteshxt/arcee-agent |
| 2 | **PatentIQ** | AI-powered university patent screener | Citation-first pipeline that verifies citations against external sources before Gemini inference (near-zero hallucination); grading across 11 weighted IP dimensions with structured JSON output; a PDF prompt-injection canary | patentiq.dialabs.tech |
| 3 | **DiaChat** | A privacy-first Gen Z AI companion that runs on your device | Gemma-3 1B fine-tuned with PyTorch + Unsloth on a curated conversational dataset (~40 tokens/s); in-browser inference with WebLLM/MLC on WebGPU, CPU fallback via Transformers.js. *Model confirmed by Itesh on 2026-11-12 (the public repo's config shows a Llama-3.2-1B build).* | chat.dialabs.tech, github.com/DiaLabs/dia-chat |

Content still needed from Itesh: PatentIQ's story and screenshots (the repo README is empty); an Arcee screen recording or real task log for a replay; DiaChat screenshots.

### 5.3 Other projects (archive, lighter treatment)

From a full audit of all 49 repos in `iteshxt` and `DiaLabs` (Nov 2026). Facts come from the repos, not from marketing copy. The list lives in `src/content/projects.ts`.

- **In the archive (19):** Sutr Clothing (store + admin), Bloom (web + app + backend), Cadence, Stryde, InvestWise, Dia Moderator, FitCheckr, UniBites (the one fork included, by Itesh's choice: 13 of its 15 commits are his), HiClippy, FairShare, CineFlex, CampusQuest, Dr. Swatantra AI (the voice backends Itesh wrote), PEP Timetable, Velo Rapido, Cooksy, LPU Wi-Fi Auto Login, Open in Antigravity, Scuba Cat.
- **DiaLabs page:** PatentIQ, DiaChat, dia-convo-v1.2c (Qwen2.5 7B fine-tune), Stryde, Dia Moderator, the DiaLabs website. Team-only releases (dataset, watermark detector, voice assistant) are credited to the team in one line.
- **Left out:** forks (register, is-a.bot, alok-misra, the Devanagari syllabifier), practice repos (neetcode-250, jenkins-demo), the portfolio and profile repos, empty or code-less repos (One-Auction, dia-fake-detector), small exercises (florist landing page, Sootra prototype), and repos with no commits by Itesh (pii-redaction-tool, watermark-detector, Dia-Assistant).
- **Copy rules from the audit:** Dia Moderator is Node/React (not Python/JWT/MERN as the old site says); FitCheckr has no Chrome extension in the repo; the LPU Wi-Fi copy leaves out the CAPTCHA claim; CineFlex is described as a browser with local watchlists.

### 5.4 Experience

- **Caudal AI Labs**, AI Systems Evaluation Intern (Jul 2026 – Sep 2026): evaluated LLM systems for accuracy, originality, quality and instruction compliance; engineered prompt-driven evaluation workflows; documented edge cases and failure patterns.
- **Sutr Clothing**, Full Stack Developer (Apr 2025 – Nov 2025): production workflows for 500+ monthly customers; Razorpay payment verification and Ekart logistics integration; 500 ms cart sync, reusable React components, validation-driven UI testing.

### 5.5 Achievements and certificates

- Co-founder, DiaLabs: open-source AI/ML organisation releasing free AI products and developer tools
- 320+ problems solved on LeetCode
- Mobile Application Development using Flutter (Cipher Schools, Jul 2025)
- Cloud Computing (NPTEL, Apr 2025)
- Computer Communications Specialization (Coursera, Oct 2024)

### 5.6 Education

- Lovely Professional University: B.Tech CSE, Aug 2023 – present, CGPA 8.53
- Kiddys Corner Hr Sec School, Gwalior: Intermediate, 78%
- Amar Public School, Gwalior: Matriculation, 90%

### 5.7 Contact channels

Email (iteshxt@gmail.com), LinkedIn (/in/iteshxt), GitHub (iteshxt), X (@iteshxt), resume (print view and PDF), and a message through Arcee. The phone number stays off the site unless Itesh asks for it.

## 6. Feature requirements

Priority: **P0** = must ship in v1, **P1** = should ship in v1, **P2** = nice to have.

### 6.1 Two shifts: day/night (P0)

- Day = light theme focused on *what*; night = dark theme focused on *how*. Every page has content for both shifts; star projects must be fully readable in either.
- First visit: the shift follows the **visitor's local clock** (day 07:00–18:59, night 19:00–06:59). After that, the visitor's choice is remembered.
- Switching shifts = **peeling** the top-right corner of the page (drag or click). It must also be operable by keyboard and announced to screen readers.
- The URL doesn't change between shifts. A `?shift=night` query param can deep-link a shift.

### 6.2 "Show me ___" navigation bar (P0)

- One persistent pill reading "Show me ___" (bottom centre on all screen sizes).
- Opening it shows completions the visitor picks from, each mapping to a page, e.g. "Show me **the desktop agent**" → Arcee, "Show me **how to say hi**" → Contact. The prompt is shown once; options don't repeat it.
- Typing filters the suggestions. Unmatched text is handed to Arcee (§6.4) as a question.
- Keyboard: `/` or `⌘K`/`Ctrl+K` opens it; arrow keys move; Enter selects; Esc closes.
- Completions differ by shift (day: what; night: how) but always reach the same pages.

### 6.3 Peel page transition (P0)

- Changing page: a sticker in the owned colour slaps onto the screen from the nav bar, then peels away to reveal the new page, whose headline types itself in.
- It's the same gesture used on first load (the intro).
- Must not block navigation for more than about 900 ms. Reduced motion → a short crossfade.

### 6.4 Arcee chatbot (P0)

The name only; it's a separate thing from the Arcee agent project.

- Speaks about Itesh in **third person** ("Itesh built Sutr…"). English only. Humour with attitude, never rude.
- Answers only about Itesh, his work, skills, availability and this site, using retrieval over the site's own content (RAG). Politely refuses anything else, and refuses jailbreak attempts.
- Replies may include one **cat sticker** chosen by mood (placeholders until Itesh supplies the WhatsApp-style cat set).
- Can **navigate**: "show me his ML work" → opens the right page or section.
- Can **take a message**: collects name, contact and message, confirms, then sends it to Itesh by email.
- Rate limited per visitor. No voice.
- If the model or API is unavailable, Arcee says so gracefully and offers the email link.

### 6.5 Easter eggs (P1)

| Egg | Trigger | Behaviour |
|---|---|---|
| Scuba cat | Konami code (↑↑↓↓←→←→BA) | A scuba-diving cat swims across the screen (a nod to his scuba-cat Plymouth theme) |
| Hidden terminal | `~` / backtick key, or `terminal` in the nav bar | A terminal overlay with commands like `help`, `whoami`, `ls projects`, `cat resume`, `sudo hire itesh`, `shift night`, `rm -rf /` (refused with attitude), `exit` |
| Tab title | Visitor switches tabs | The title changes to something like "come back (╥﹏╥)" and resets on return |
| 3am mode | Visitor's local time is 02:00–04:59 | Night shift forced on with a note: "why are you awake? same." and a few extra jokes |
| Print to resume | Printing any page | Prints a clean, one-page resume instead of the site |
| 404 | Unknown URL | "The model hallucinated this page." with a way back |
| Currently building | Always visible in the footer/terminal | Latest public push from GitHub: repo, commit message, time ago |

### 6.6 Sound (P1)

- Subtle UI sounds: peel, slap, nav open/close, sticker hover, terminal keys.
- A mute toggle is always reachable; the choice is remembered. No sound before the first user interaction.

### 6.7 Projects as objects (P1)

- Each star project has its own 3D object (e.g. Arcee's woven-ring orb, PatentIQ's rubber stamp, DiaChat's squishy speech bubble) that reacts to hover and becomes the hero of its case study.
- Archive projects appear as die-cut stickers/cards with lighter interactions.

## 7. Pages

### 7.1 Home

Intro loader + peel → hero cycling through two-line statements ("AGENTS / that act"), with a one-line "right now" summary, "See the work" / "Ask Arcee" buttons, the latest GitHub push and a handwritten "peel here" pointing at the corner → short who-he-is statement → star projects (Arcee first), each with its real artwork animated → archive teaser (every sticker links to the live project or its code) → DiaLabs teaser → experience snapshot → contact CTA → footer with the "currently building" feed.

No CV material on the home page (decided 2026-11-13): no degree, scores, availability badge, location or local time anywhere on the site. Background lives on the about page and in the print resume.

### 7.2 Star case studies (`/work/arcee`, `/work/patentiq`, `/work/diachat`)

Each has a hero with its object, a day story (problem → what it does → who uses it → results), a night story (architecture, key decisions, trade-offs, evals, what's next), media, links, and a next-project peel.

### 7.3 Work archive (`/work`)

Every other project, sortable/filterable by type (AI, web, mobile, tools). Each one gets a short day/night blurb and links. Only a few get their own detail page.

### 7.4 DiaLabs (`/dialabs`)

What DiaLabs is, Itesh's role as co-founder, the projects, models and datasets it released.

### 7.5 About (`/about`)

Who Itesh is, experience timeline, education, achievements, certificates, how he works (night side), and the stylised photo when supplied.

### 7.6 Contact (`/contact`)

Big CTA, channels, "leave Arcee a message", and the resume.

## 8. Non-functional requirements

- **Performance:** LCP < 2.5 s and CLS < 0.05 on mobile; initial JS under about 180 KB gzipped (the 3D bundles load lazily); 3D is reduced or swapped for 2D on low-power and small devices; 60 fps animations on mid-range laptops.
- **Accessibility:** WCAG 2.2 AA text contrast; keyboard and screen-reader support for the nav, peel toggle, chatbot and terminal; `prefers-reduced-motion` respected everywhere; touch targets ≥ 44 px.
- **SEO:** server-rendered content, per-page metadata, generated OG images, sitemap, robots, JSON-LD `Person`.
- **Privacy:** no third-party tracking beyond Vercel Analytics; chatbot logs keep no personal data beyond what's needed for rate limiting; messages are only emailed to Itesh.
- **Reliability:** the site works fully when Groq or GitHub are down (Arcee and the live feed fail gracefully).
- **Browsers:** last two versions of Chrome, Safari, Firefox and Edge; iOS Safari 17+.

## 9. Milestones

1. **Foundation:** Next.js app, tokens, fonts, theme (shift) system, layout shell
2. **Signature moves:** peel toggle, peel page transition, "Show me ___" nav, headline typing
3. **Pages + content:** home, work archive, about, contact, DiaLabs
4. **Star case studies:** Arcee, PatentIQ, DiaChat, with their 3D objects
5. **Arcee chatbot:** RAG, guardrails, navigation, messages, stickers
6. **Easter eggs + sound**
7. **Polish:** performance, accessibility, SEO, mobile pass, launch on iteshxt.me

## 10. Open questions

- Resolved: sound is on by default (it can only start after the first interaction anyway), with a mute toggle in the top bar that's remembered.


Resolved on 2026-11-12: DiaChat uses a Gemma-3 1B fine-tune; Sutr's number is the CV's (500+ monthly customers); UniBites is in the archive, the alok-misra site is not.

- Final project list and order for the archive.
- Whether a phone number or a scheduling link should appear on the contact page.
- Whether the current iteshxt.me repository (`iteshxt/portfolio`) is replaced by this one, or this becomes a new repository.
