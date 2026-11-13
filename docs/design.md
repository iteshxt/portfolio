# Design: iteshxt.me v4

How the site looks, moves, sounds and speaks. Requirements live in [prd.md](./prd.md); implementation lives in [spec.md](./spec.md).

Reference studied: extrafazant.nl. We learned from its discipline (a few signature moves repeated everywhere, big confident type, saturated colour on neutral ground, humour in the copy). We don't copy its layout, nav, transitions or assets.

## 1. Principles

1. **One idea, everywhere.** Two shifts (day = what, night = how). Every page, headline and interaction serves it.
2. **A few signature moves, repeated.** The peel, the slap, the typing headline. Repetition is what makes it recognisable.
3. **Type does the heavy lifting.** Huge, tight, confident headlines. Decoration is secondary.
4. **Saturated colour on neutral ground.** Paper and ink are neutral; colour arrives in bold blocks, never as a pastel wash.
5. **Playful, never confusing.** Every creative control (peel, nav bar, terminal) has an obvious affordance and a plain fallback.
6. **Fast is part of the design.** If an effect costs the frame rate or the load time, it gets simplified.

## 2. Signature moves

### 2.1 The peel (theme toggle)

- The top-right corner of the page is always slightly curled up, showing a sliver of the sticker's back in the owned violet.
- Dragging the corner peels the whole page like a sticker, revealing the other shift underneath. Releasing once the corner has travelled about 35% of the screen diagonal completes the peel; otherwise it springs back. A click or tap completes it automatically.
- Geometry: the fold line is the perpendicular bisector between the corner and the pointer. The top layer is clipped to the far side of the fold, and the peeled part is reflected across the fold to draw the flap (see spec §5.1).
- Flap: the sticker back is solid owned violet in day→night, lavender tint in night→day, with a soft shading gradient near the fold in the real build.
- Duration of the auto-peel: 650 ms, ease `power2.inOut`. Sound: peel (§9).

### 2.2 The slap + peel (page transition)

1. On navigation, a full-screen sticker in owned violet slaps on from the nav bar: scale 0.08 → 1.06 → 1, rotate -14° → 2° → 0°, corners 40 px → 0, 420 ms with a slight overshoot. Sound: slap.
2. The new page mounts underneath.
3. The sticker peels off from the top-right corner (same geometry as §2.1) in about 620 ms, its back in lavender tint. Sound: peel.
4. The new page's headline types its serif line in.

From a star card (home stack or work grid), the card's drawing lifts off its card with a white die-cut edge and a shadow, settles in the centre over the slapping sticker (in place of the destination's name), then flies into the case-study stage as the sticker peels, and fades into the real one.

The same sequence runs as the site intro on first load, starting from a sticker already in place. While it covers the page, the intro sticker shows a loader: the wordmark, a 000→100 counter with a lime progress bar, a rotating "Warming up agents / models / …" line (night: logs / evals / …), and four wordless die-cut shapes (a sunflower burst, a lime blob, a tomato squiggle, a lavender arch) slapping on like a sticker sheet. No words on them: the loader isn't a CV. It runs at least 1.1 s on a first visit (0.35 s on repeat visits in the same tab), finishes once fonts are ready (capped at 1.2 s), fades its content out, then peels. Reduced motion: a 200 ms crossfade, with no slap or peel.

### 2.3 Two-line headlines

- Every page headline is two lines: a bold **sans statement** ("AGENTS") and a **serif line** that twists or completes it ("THAT ACT").
- Don't put the name in headlines. It appears once, in the home kicker; repeating it everywhere reads as noise (Itesh's feedback after seeing it built).
- The serif line types itself in (80 ms per character) and, on the home page, deletes and retypes through the completions (35 ms per character when deleting, 1.7 s pause).
- Each line is fitted to the container width (see spec §5.3), so headlines always span the page.
- Day completions say *what*; night completions say *how* (the table in §11).

### 2.4 "Peel here" hint

On the home hero, a handwritten "peel here" (Caveat) with a squiggly arrow points at the corner. It writes itself in once the intro has peeled (2.2 s), then the arrow nudges towards the corner every few seconds. It's hidden for good once the visitor has peeled (the saved shift sets `data-peeled` on `<html>`). Reduced motion: shown still.

### 2.5 Home hero (2026-11-13)

No giant cycling headline and no day/night copy. A small serif "Hi, I'm Itesh." then one medium statement, "I build agents, train models and ship products.", where the three nouns are tilted, flickable word stickers (violet, lime, sunflower). Below: the "right now" line, "See the work" / "Ask Arcee", the latest push and the scroll hint. The loader's four die-cut shapes stay stuck around the edges once it peels (slap in, then drift; hidden on phones). The "peel here" hint rests after a peel for the rest of the visit and returns on the next one.

### 2.6 Peel to reveal (replaces day/night content, 2026-11-13)

The day/night content split is being retired page by page: light and dark become a plain theme switched by the peel corner, with the same text in both. "How it works" now hides under small stickers instead: on each home star card, a sticker in the project's colours ("Peel for how it works") peels off on click or tap to show the how (approach summary and stack), with "Stick it back" to cover it again (`components/ui/PeelReveal`). Home sections use `SectionTitle`: a serif italic kicker over one sentence-case line with one word sticker. Hero stickers are field-themed (terminal, braces, neural net, chip, git branch, sparkle); the loader keeps its abstract shapes. The "peel here" hint always shows.

### 2.7–2.12 Home page, round of 2026-11-13

- **2.7 Status pill:** a fixed top-centre sticker pill with the current section ("03 · Selected work / 07", from `[data-section]`, picked by scroll position) and a violet line filling with page scroll.
- **2.8 "Where to?" navigator:** the pill carries a tiny sticker stack and "Where to?" (no underscore). Opening fans out die-cut page stickers from the pill, each in its page's colour (stars in their brand colours), tilted, over a sticker search field; typing filters, Enter goes, anything else asks Arcee.
- **2.9 Star posters:** each star project is a big die-cut poster in its app's colours (artwork large, name huge, peel sticker for how it works). "Selected work" pins while scroll slides the posters sideways (`PinnedTrack`); phones and reduced motion stack them.
- **2.10 More projects:** a filterable index (category chips, one link row per project); on desktop a tilted preview sticker trails the cursor.
- **2.11 DiaLabs:** the violet band grows from an inset rounded sticker to full width on scroll (`GrowIn`); releases are peelable stickers (name and kind; what it is and links underneath).
- **2.12 Footer:** a sticker sheet on a cutting mat: wordmark sticker, link stickers, the latest push as a torn receipt, a peel tab back to the top.
- **Hero type:** letters in the headline swell (weight up, width down) towards the cursor.
- **Buttons:** `.btn` sticker buttons (ink, paper, lime, violet), magnetic towards the cursor. Scrollbar: rounded violet strip.
- **Motion:** headings rise from a blur and their word stickers slap on; rows and sticker groups stagger; hero parallax; a sticker cursor with labels. All rest for reduced motion.

### 2.13 Arcee, full page (2026-11-13)

`/arcee` is itself the conversation (the same one as the floating panel, via a shared chat instance): a slim "Ask Arcee" intro with its animated ring, messages flowing down a faded mat, and a sticky message box docked above the navigator. Arcee's opening postcard holds what it knows, questions to try and a P.S. on leaving a message. Arcee uses the site's colours (violet, paper), not the Arcee project's amber. Tilts are reserved for accents: heading word stickers, the footer wordmark, the peel hint, the stamp, the loader.

### 2.14 Night

The die-cut edge is a token (`--die`): white by day, a soft translucent white at night (also applied to `border-white`). At night, bright tiles become dark tinted tiles with coloured names (`night:` variants; covers that hide content use opaque color-mix tints), the DiaLabs band turns deep violet, the contact block a dark surface, and posters are toned down slightly. Heading word stickers stay bright as accents.

### 2.15 Round of 2026-11-13, evening

- **Hero peel:** the hero section is clipped along the sheet's fold (`.hero-peel`), so its content peels away with the sheet, and the folded flap lies over it. The sheet has a light paper grain.
- **Loader:** no corner texts; eight wordless shapes land at random spots (an inline script sets `--isN*` variables on `<html>` before first paint), the "Warming up …" word keeps rotating.
- **Page transitions:** the violet sticker shows "Going to" + the page name bottom-left, a 000→100% counter bottom-right that reaches 100 as it peels, a lime bar, and three random stickers. Not shown during the intro.
- **Navigator (decided):** a hand of portrait playing cards, one per page: the name in two corners like a real card, and a picture in the middle (the star projects' real artwork in their colours, a die-cut shape for the other pages). No descriptions on the cards. The full-screen sheet was tried and removed.
- **Phones:** star posters become a swipeable snap carousel of compact posters; More projects shows four before "Show all".

## 3. Colour

### 3.1 Palette

| Token | Hex | Use |
|---|---|---|
| `violet` (owned) | `#7A2CFF` (electric violet) | Signature colour: the peel back, the slap sticker, nav pill, key buttons, star tags, highlights |
| `violet-ink` | `#3A0E8C` | Text on violet tints, pressed states |
| `lavender` | `#CBB8FF` | Support tint: night accents, the flap back on night→day, quiet fills |
| `lime` | `#CCFF33` | Accent: stickers, terminal prompt, "new" or "live" markers |
| `tomato` | `#FF4B2B` | Accent: frames, warnings with attitude, hover hits |
| `sunflower` | `#FFC700` | Accent: stickers, frames, highlights |
| `paper` | `#F5F5F4` | Day background |
| `paper-2` | `#FFFFFF` | Day raised surfaces |
| `ink` | `#0E0E10` | Day text |
| `night` | `#0B0A10` | Night background |
| `night-2` | `#15121D` | Night raised surfaces |
| `night-ink` | `#F4F2FF` | Night text |
| `line-day` / `line-night` | `#E3E2E6` / `#2A2535` | Hairlines |

Electric violet is the default. Ultraviolet `#5A2BFF` and grape pop `#A032FF` stay as fallbacks if it doesn't hold up on real screens.

### 3.4 Star project colours

Each star project uses its own app's colours in both themes (tokens `--arcee`, `--arcee-deep`, `--patentiq`, `--diachat`; classes in `lib/brand.ts`): Arcee is an amber (#FF8C1A) frame around its warm near-black (#1C1108), PatentIQ its logo indigo (#452CF9), DiaChat its amber (#FFB000). Share images use the darker shades for headline text.

### 3.2 Rules

- Paper and ink are neutral. No tinted backgrounds.
- Colour comes in solid blocks: thick frames around media (12–16 px), full-bleed sections, stickers, buttons. No gradients in UI chrome (the 3D scenes may use lighting gradients).
- At most one accent beside violet in any one viewport section.
- Text contrast: body text is always `ink` on paper or `night-ink` on night. Violet is used for text only at headline sizes (≥ 32 px) on paper; on night, use `lavender` for coloured text.
- Text on accent fills uses that accent's darkest partner: violet → white, lime → `#2B3600`, sunflower → `#4A3A00`, tomato → white at ≥ 18 px only.

### 3.3 Shifts

| | Day | Night |
|---|---|---|
| Background | paper | night |
| Headline colour | ink (serif line ink) | night-ink (serif line lavender) |
| Mood | Bright, product, outcomes | Focused, technical, glowing accents |
| Extra details | Stickers, coloured frames | Terminal snippets, commit messages, diagrams, lime prompt colour |
| Peel flap | violet | lavender |

## 4. Typography

All free (Google Fonts), self-hosted through `next/font`.

| Role | Font | Settings |
|---|---|---|
| Display sans | **Mona Sans** | width 75, weight 820, tracking -0.035em, line-height 0.86, uppercase |
| Display serif | **Instrument Serif** | regular (italic for emphasis), tracking -0.02em, line-height 0.9, uppercase in headlines |
| Body / UI | **Mona Sans** | width 100, weight 400 / 500 / 600 |
| Code / terminal | **JetBrains Mono** | 400 / 500 |
| Handwriting | **Caveat** | 600, only for the home page's "peel here" hint; not preloaded |

### Scale (fluid, clamp-based)

| Token | Size | Use |
|---|---|---|
| `display` | fitted to width, max ≈ 18 vw | Page headlines |
| `h1` | clamp(40px, 6vw, 88px) | Section headlines (same sans + serif pairing) |
| `h2` | clamp(28px, 3.6vw, 48px) | Sub-sections |
| `kicker` | clamp(18px, 1.8vw, 24px) | Serif line above headlines ("By day: what he builds") |
| `body-l` | 20px / 1.5 | Intros |
| `body` | 17px / 1.6 | Default copy |
| `small` | 14px / 1.5 | Meta, captions |
| `micro` | 12px / 1.4 | Tags (sentence case, never below 12px) |

Rules: headlines are uppercase; everything else is sentence case. Body line length is 55–75 characters. Never use more than one serif line per headline.

## 5. Layout

- 12-column grid, max width 1440 px, side gutters clamp(16px, 4vw, 48px), column gap 24 px.
- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192.
- Radii: 6 px (controls), 16 px (cards, panels), 999 px (pills). Media frames are square-cornered with thick colour borders.
- Sections alternate paper and full-bleed colour or night blocks to create rhythm.
- Mobile first: one column under 768 px. Headlines still fit the width. Interactions become tap-first (§12).

## 6. Motion

Libraries: GSAP (ScrollTrigger, SplitText, DrawSVG, CustomEase, Inertia), Lenis smooth scroll.

| Pattern | Spec |
|---|---|
| Text reveal | Lines are masked, rising from `yPercent: 120` → 0, `expo.out`, 1.0 s, stagger 0.08 s |
| Headline typing | §2.3 |
| Scroll reveal (blocks) | y 40 → 0, opacity 0 → 1, `power3.out`, 0.8 s, starting at 85% of the viewport |
| Hover underline | A hand-drawn scribble draws under links (0 → 100%, 0.55 s, `expo.out`), with a different scribble each time; our own set of 6 scribbles. *As built:* SVG paths wiped in left to right by a `clip-path: inset()` transition (no DrawSVG; a `pathLength` dash trick leaked a stub in Chrome with non-scaling strokes), violet by day, lavender by night, lime on violet. Used on footer links, the contact CTA and channels, and "Try it live" |
| Sticker flick | Stickers respond to cursor velocity with inertia: they spin and drift, then settle. *As built:* a hand-rolled damped spring (no Inertia plugin); the spin is the cross product of where the cursor hit and how fast it was moving, capped at ±22°. Fine pointers only |
| Media frames | Slight rotation (-4° to 6°), parallax ±40 px on scroll |
| Featured stack | Star project cards stacked in 3D; scrolling drops the top card away to reveal the next |
| Nav bar open | Panel rises 12 px + fades in, 220 ms, `power3.out`; options stagger 30 ms |
| Page transition | §2.2 |
| Easings | `expo.out` (reveals), `power3.out` (UI), `power2.inOut` (peels), custom `slap` = cubic-bezier(.2,.9,.3,1.2) |

Reduced motion (`prefers-reduced-motion: reduce`): no smooth scroll, no parallax, no typing (completions shown instantly), peels and slaps become crossfades, 3D is replaced by still renders.

## 7. 3D

- **Art direction:** soft, toy-like "clay" objects with subtle rim light. Violet key light by day, lavender and lime accents by night. No photoreal.
- **Objects:**
  - Arcee: woven amber rings around a geodesic wireframe orb (its own identity, only on its pages)
  - PatentIQ: a rubber stamp that stamps "VERIFIED"
  - DiaChat: a squishy speech bubble with a wobbly jelly body
  - Archive: die-cut stickers as flat 3D cards that bend slightly when grabbed
- Objects react to the cursor (look-at, squish, wobble) and scroll. On a case study, the object flies from its card to the hero during the transition.
- *As built (2026-11-13):* cards and the stage's 2D layer show each project's real artwork instead of placeholder drawings. Arcee: the particle-ring animation from the Arcee app (`wave-active-dark.webp`, animated WebP, with a still frame for reduced motion). PatentIQ: its document-and-brain mark (from the PatentIQ repo) as a CSS mask, with a lime scan passing over the strokes, the circuit nodes lighting in turn and the glow pulse from its own loader. DiaChat: its preloader on a loop (bubble draws, heart draws and fills, beats, fades), white with a soft shadow on sunflower. All CSS; no JavaScript. The case-study stage shows the same artwork; the 3D objects and three.js were removed (2026-11-13).
- Built with three.js through React Three Fiber; see spec §7 for performance rules.

## 8. Stickers, icons, photo

- **Stickers:** die-cut style: a 5–6 px white border around the artwork, slight rotation, very soft shadow. Used for decoration, archive projects, achievements (LeetCode 320+, certificates) and Arcee's chat replies.
- **Cat stickers:** WhatsApp-style cats chosen by mood (happy, smug, thinking, shocked, sleepy, love, nope). Placeholders until Itesh supplies the set; each sticker maps to a mood tag.
- **Custom icons:** our own set on a 24 px grid, 2 px rounded strokes with an optional violet fill accent, slightly playful (a little wobble on corners). First set: arrow, arrow-up-right, close, menu, search, sun-peel (theme), sound-on, sound-off, mail, linkedin, github, x, resume, external, play, pause, terminal, chat, sticker, star, cat.
- **Photo of Itesh** (supplied later): cut out as a die-cut sticker, duotone in violet + ink with a fine halftone, placed tilted like a polaroid.
- **Logo:** postponed. Placeholder: "itesh" set in Instrument Serif italic.

## 9. Sound

- Subtle and short (under 400 ms), mixed quietly (peak around -18 dBFS).
- Set: `peel` (paper rip, rising band-pass), `slap` (soft low thump), `nav-open` / `nav-close` (soft pop), `tick` (typing), `sticker` (tiny squeak on flick; *as built:* a short paper flutter, only on a real knock, at most once per 260 ms), `terminal-key`, `success` (message sent).
- A mute toggle sits in the top bar; the setting is remembered. Nothing plays before the first interaction.

## 10. Components

| Component | Notes |
|---|---|
| Top bar | Logo placeholder (left), sound toggle, peel corner (right). Very minimal; real navigation lives in the nav bar |
| "Show me ___" nav bar | Bottom-centre violet pill, white text. The prompt appears once (pill and input label), never repeated on each option. Opens upward into a panel (paper-2 / night-2) with input + completion list; star items carry a violet "star" tag. Unmatched input shows an Arcee row |
| Peel corner | 34 px curl at rest, grows on hover |
| Headline | Fitted sans line + typing serif line + optional kicker |
| Button | Pill with a label and a square arrow cap in an accent colour; the scribble underline for text links |
| Media frame | Thick accent border, tilt, parallax |
| Project sticker card | Die-cut card: title, one-line day blurb, tags, flick-able |
| Arcee panel | Chat panel that grows from the nav bar; Arcee's messages are on the left with a cat sticker slot, visitor messages on the right; inline action chips ("Open Arcee case study", "Leave a message") |
| Terminal | Full-width overlay in night colours, JetBrains Mono, lime prompt `itesh@shift:~$` |
| Footer | Big contact CTA, channels, "currently building" live line, © and a hint ("psst, try ~") |

## 11. Voice and tone

Funny with attitude, confident without bragging, short sentences, English only. Third person when Arcee talks about Itesh.

| Context | Day (what) | Night (how) |
|---|---|---|
| Home (cycling) | Agents / that act · Products / people pay for · Models, / fine-tuned · A lab / called DiaLabs | Logs, / read twice · Evals / for everything · Bugs, / fixed at 3am · Docs / that exist |
| Arcee case | "An agent / for your desktop" | "Plans, guards, / then acts" |
| PatentIQ | "Patents, / screened by AI" | "Citations first, / then Gemini" |
| DiaChat | "A companion / in your browser" | "Gemma 3, live / on WebGPU" |
| Work | "Real products, / real users" | "Payments, logistics, / retries" |
| DiaLabs | "DiaLabs, / co-founded" | "Open models, / open data" |
| About | "The human / behind it" | "Evals, edge cases, / failure modes" |
| Contact | "Say / hello" | "Leave Arcee / a message" |
| Nav ("Show me ___") | the desktop agent · the patent screener · the AI companion · real products · the lab · the human · how to say hi | how the agent thinks · the citation pipeline · the WebGPU bits · the payment flows · the open models · the edge cases · the inbox |

Microcopy examples:
- 404: "The model hallucinated this page."
- Tab title away: "come back (╥﹏╥)"
- 3am: "why are you awake? same."
- Arcee refusing off-topic: "I only gossip about Itesh. Ask me what he's built."
- Terminal `rm -rf /`: "nice try. permission denied, forever."

## 12. Responsive and mobile

- Full personality on phones; the 3D is lighter (pre-rendered or simplified objects, no post-processing).
- The nav bar sits at the bottom in the thumb zone; its panel becomes a bottom sheet.
- Peel: tap the corner to flip; dragging still works. The corner hit area is at least 44 × 44 px.
- Hover-only effects (scribble, image trail, sticker flick) are replaced with tap or scroll versions or skipped.
- Test widths: 360, 390, 768, 1024, 1440, 1920.

## 13. Accessibility in design

- Visible focus ring: 2 px violet + 2 px offset on paper, lavender on night.
- Every creative control has a labelled button equivalent: the peel corner is a button "Switch to night shift"; the nav bar is a combobox.
- Typing headlines expose the full text to assistive technology immediately (`aria-label`), and the animation is decorative.
- Never rely on colour alone; star projects also carry a "star" label.
