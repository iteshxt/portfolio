# Design: iteshxt.me v7

How the site looks, moves, sounds and speaks. Requirements live in [prd.md](./prd.md); implementation lives in [spec.md](./spec.md).

The home page (finished 2026-11-14) is the reference for every other page. When a page is redesigned, it borrows the pieces below rather than inventing new ones. Reference studied early on: extrafazant.nl (discipline, big type, saturated colour on neutral ground, humour). We don't copy its layout, nav, transitions or assets.

## 1. Principles

1. **Stickers on a cutting mat.** The whole site is a sheet of die-cut stickers: white die-cut edges, soft shadows, bold flat colour, laid on paper with a faint mat grid. Every new element should look like it could be peeled off.
2. **Motion first, but calm.** It should feel like an interactive piece (reveals, slaps, peels, parallax, a sticker cursor), not a static page. Fast still matters: lazy-load heavy bits, keep 60 fps. There is no strict JS budget; don't drop motion to save kilobytes.
3. **Tilts are accents, not the rule.** Heading word stickers, the footer wordmark, handwritten notes, the Arcee stamp and the loader may tilt. Rows, cards, buttons, pills and the status bar sit straight.
4. **Real artefacts over decoration.** Project artwork, live links, the latest commit. No AI-looking clip-art, no placeholder illustrations.
5. **No CV dump.** No degrees, LeetCode counts, "open to roles", location, local time or colophon anywhere.
6. **The name appears once.** "Hi, I'm Itesh." on the home hero; never in headlines or the nav.
7. **Playful, never confusing.** Every creative control (peel, navigator, terminal) has an obvious affordance and a plain fallback.

## 2. Signature moves

### 2.1 The peel corner (theme toggle)

- The top-right corner is always slightly curled, showing a sliver of violet sticker back. Dragging peels the whole page like a sticker to reveal the other theme; past ~35% of the diagonal it completes, otherwise it springs back. A click or tap completes it. Geometry: the fold is the perpendicular bisector between corner and pointer (spec §5.1). 650 ms, `power2.inOut`, peel sound.
- Light and dark are a plain theme now: the same content in both (the old day = what / night = how split is retired; remove leftover shift copy as each page is redone).
- On the home hero a handwritten "peel here" (Caveat) with a squiggly arrow points at the corner; it writes itself in after the intro and nudges now and then. Always shown on home.

### 2.2 Intro loader and page transitions

- **Loader:** a violet sticker covers the screen with the "itesh" wordmark top-left, wordless die-cut shapes (burst, blob, squiggle, arch, sparkle, zigzag, capsule) landing at random spots, a rotating "Warming up agents / models / products / evals / a lab" line and a 000→100 counter with a bar. No corner texts. Then it peels off from the top-right.
- **Page transition (slap + peel):** a full-screen violet sticker slaps on from the navigator (scale 0.08 → 1.06 → 1, rotate -14° → 2° → 0°), the new page mounts underneath, the sticker peels off (~620 ms). While covered it shows small "Going to *Page*" (serif italic) above a big centred counter in the site's display sans, a lime bar and three random stickers. From a star poster, the project's artwork lifts off with a die-cut edge and flies into the case-study stage instead.
- Reduced motion: a 200 ms crossfade.

### 2.3 Section titles

Sections use `SectionTitle`: a small serif italic kicker ("Selected work") over one sentence-case line in the display sans with **one** word sticker in it ("Three I'm most *proud* of."). Headings rise from a blur and their word sticker slaps on. This replaces the old uppercase two-line fitted headlines; redo page headlines in this style.

### 2.4 The lifted sheet (home hero)

The hero sits on a rounded paper sheet lifted off the page: a cutting-mat grid that fades towards its edges (`.faded-mat` idea), one soft low violet glow, and a folded bottom-right corner (the flap). The hero's content is clipped along the same fold (`.hero-peel`), so it peels away with the sheet as you scroll (the curl grows with scroll). No paper grain (tried, removed). Content parallaxes and fades on scroll.

Hero copy: "Hi, I'm Itesh." (serif) → "I build *agents*, train *models* and ship *products*." (word stickers in violet, lime, sunflower; letters swell towards the cursor) → one "Right now: …" line → "See the work" (ink) + "Ask Arcee" (lime) → latest push (bottom-right) and "Scroll for the good stuff" (bottom-left).

### 2.5 The "Where to?" navigator

- Closed: an ink pill bottom-centre in the `.btn` style (white die-cut edge, sans "Where to?", a tiny three-sticker stack that fans on hover).
- Open: the pages fan out of the pill on two semicircles as word stickers like the hero's: star projects (Arcee, PatentIQ, DiaChat) on the inner ring in their own app colours, the other pages (Work, DiaLabs, About, Chat, Contact, Home) on the outer ring in the hero tones. Each carries a small → so it reads as a link; each tilts only slightly with its angle; the chosen one slides further out along its angle. A handwritten "pick a page" note with an arrow sits beside the fan. Hovering a sticker shows a one-line hint by the cursor ("the human", "the lab"…).
- The page behind fades a little and blurs slightly (no halo shape).
- The pill itself becomes the field: "Where to? Or ask me anything…", with the Arcee stamp at its end. Typing filters; Enter goes; anything that isn't a page goes to Arcee ("terminal" opens the terminal). "/" or ⌘K toggles, Esc closes.
- Phones: the same stickers in a wrapped cloud above the field.
- Tried and dropped: playing cards, a full-screen sheet, tilted coloured nav stickers, a separate search box.

### 2.6 Peel to reveal

Detail that used to live in the night shift hides under small stickers now: e.g. on each star poster, a sticker in the project's colours ("Peel for how it works") peels off to show the approach and stack, with "Stick it back" (`components/ui/PeelReveal`). Use the same move on other pages for "how" detail.

### 2.7 Home page sections (as built)

- **Status pill:** fixed top-centre straight pill: a progress ring, the current section name (from `[data-section]`) and clickable section dots.
- **In short:** a serif kicker and one large statement that reveals word by word.
- **Selected work:** each star project is a big die-cut poster in its app's colours (artwork large, name huge, peel sticker for how it works). Desktop pins the section and scroll slides the posters sideways (`PinnedTrack`); phones get a swipeable snap carousel of compact posters (art on top, stack chips hidden).
- **More projects:** a wall of project tiles with category filter chips, each tile with Live and GitHub links; phones show four before "Show all".
- **DiaLabs:** a violet band that grows from an inset rounded sticker to full width on scroll (`GrowIn`); releases are peelable stickers.
- **Experience:** rows with a link to the full story.
- **Contact:** ink block (dark surface at night): "Got something *worth building*?", copy-email button, "Or leave Arcee a message", channel rows with scribble underlines.
- **Footer:** compact, on a faded mat: the "itesh" wordmark sticker (tilted), link stickers (straight), the latest push as a torn receipt, "© {year} iteshxt" and back to top. No colophon.

### 2.8 Arcee

`/arcee` is the conversation itself (shared chat instance with the floating panel): a slim intro with Arcee's animated ring, messages on a faded mat, a sticky composer above the navigator. Arcee's opening postcard holds what it knows, questions to try and a P.S. about leaving a message. Arcee uses the site's colours (violet, paper, ink), not the Arcee project's amber. The Arcee stamp (animated ring on ink) is its avatar everywhere.

## 3. Colour

### 3.1 Palette

| Token | Hex | Use |
|---|---|---|
| `violet` (owned) | `#7A2CFF` | Signature: peel back, transition sticker, DiaLabs band, key accents |
| `violet-ink` | `#3A0E8C` | Text on violet tints |
| `lavender` | `#CBB8FF` | Support tint, night accents |
| `lime` | `#CCFF33` | Accent stickers, "live", progress bars |
| `tomato` | `#FF4B2B` | Accent stickers |
| `sunflower` | `#FFC700` | Accent stickers |
| `paper` / `paper-2` | `#F5F5F4` / `#FFFFFF` | Light background / raised surfaces |
| `ink` | `#0E0E10` | Light text, ink buttons and blocks |
| `night` / `night-2` | `#0B0A10` / `#15121D` | Dark background / raised surfaces |
| `night-ink` | `#F4F2FF` | Dark text |
| `line` | `#E3E2E6` / `#2A2535` | Hairlines, mat grid |

Text on accent fills: violet → white, lime → `#2B3600`, sunflower → `#4A3A00`, tomato → `#2A0700`, lavender → `violet-ink`.

### 3.2 Star project colours

Each star project wears its own app's colours in both themes (tokens `--arcee`, `--arcee-deep`, `--patentiq`, `--diachat`; classes in `lib/brand.ts`): Arcee amber (#FF8C1A) on its warm near-black (#1C1108), PatentIQ indigo (#452CF9), DiaChat amber (#FFB000). Only for the projects themselves (posters, nav stickers, case studies), never for site chrome.

### 3.3 Rules

- Use semantic tokens (`bg-bg`, `text-fg`, `bg-surface`, `text-accent-text`…) and `day:` / `night:` variants; never hard-code the palette in components.
- Colour comes in solid blocks: stickers, buttons, posters, full-bleed bands. Gradients only for soft glows and fades.
- One or two accents beside violet per viewport section.
- Violet text only at headline sizes on paper; lavender for coloured text at night.

### 3.4 Night

Night must feel calm. The die-cut edge is a token (`--die`): white by day, soft translucent white at night (also applied to `border-white`). Bright tiles become dark tinted tiles with coloured names; covers that hide content use opaque `color-mix` tints (never translucent over text); the DiaLabs band turns deep violet; the contact block a dark surface; posters are toned down slightly. Heading word stickers stay bright as accents. Ink buttons invert to light.

## 4. Typography

All free, self-hosted through `next/font`.

| Role | Font | Settings |
|---|---|---|
| Display sans | **Mona Sans** | weight 600, width 82, tracking -0.04em, sentence case (hero, section titles, word stickers, transition counter) |
| Serif | **Instrument Serif** | italic for kickers, "Hi, I'm Itesh.", "Going to …", the wordmark |
| Body / UI | **Mona Sans** | width 100, weight 400 / 500 / 600 |
| Code | **JetBrains Mono** | latest push, terminal |
| Handwriting | **Caveat** | only for notes like "peel here" and "pick a page" |

Sizes: hero statement clamp(38px, 5vw, 76px); section titles clamp(32px, 4.4vw, 64px)-ish; kicker clamp(18px, 1.8vw, 24px); body 16–19px; meta 13–15px; never below 12px. Keep page text light: short lines, few words, no descriptions where a name and a cursor hint will do.

## 5. Layout

- Max width 1440 px, side gutters `px-gutter` (clamp(16px, 4vw, 48px)).
- Generous vertical rhythm: sections clamp(64px, 10vw, 140px) top and bottom; less on phones.
- Radii: 12 px (word stickers), 16–20 px (tiles, posters, panels), pills for buttons and bars.
- Faded mats (`.faded-mat`): a grid that fades out at the edges, used behind the hero, footer and /arcee; reuse it for page intros.
- Fixed chrome: wordmark top-left, status pill top-centre, sound toggle and peel corner top-right, navigator bottom-centre. Leave ~90 px clear at the bottom of pages for the navigator.

## 6. Motion

Lenis smooth scroll (lazy-loaded); MotionLayer handles the rest without GSAP on first load.

| Pattern | Spec |
|---|---|
| Reveals | `[data-animate]`: rise from a slight blur, staggered by `--d`; word stickers slap in (`slap-in`) |
| Text reveal | `RevealText`: words light up with scroll |
| Parallax | `[data-parallax]` (+ `data-parallax-fade`), only after scroll starts |
| Peel curl on scroll | `[data-curl]` sets `--curl` |
| Buttons | `.btn` sticker buttons (ink, paper, lime, violet), magnetic towards the cursor; hover lifts, press slaps down |
| Sticker flick | Word stickers respond to cursor velocity with a damped spring (±22° max), fine pointers only |
| Scribble underline | Hand-drawn scribbles wipe in under text links (`Scribble`) |
| Custom cursor | Replaces the system cursor on fine pointers: a violet sticker arrow with labels from `[data-cursor]` ("View", "Live", "Code", page hints) |
| Grow-in bands | `GrowIn`: a band grows from inset sticker to full width |
| Pinned sideways track | `PinnedTrack` for galleries on desktop |
| Easings | `--ease-expo-out` (reveals, UI), `--ease-slap` = cubic-bezier(.2,.9,.3,1.2), `power2.inOut` (peels) |

Reduced motion: no smooth scroll, parallax, curl or flicks; reveals show at once; peels and slaps become crossfades; animated artwork shows a still frame.

## 7. Project artwork

No 3D (three.js was removed). Each star project shows its real artwork, all CSS: Arcee the particle-ring animation from the Arcee app (animated WebP, still frame for reduced motion); PatentIQ its document-and-brain mark with a lime scan and circuit nodes lighting in turn; DiaChat its preloader on a loop (bubble, heart, beat). Case-study stages use the same artwork.

## 8. Stickers, icons, photo

- **Die-cut stickers:** white (`--die`) border, flat colour, soft shadow, optional slight tilt when an accent. Word stickers: `Sticker size="word"`; chips: `Sticker`.
- **Wordless shapes** (`ui/Shape`): burst, blob, squiggle, arch, sparkle, zigzag, capsule. For loaders and transitions only; don't scatter them as decoration on content.
- **Cat stickers** in Arcee's replies, chosen by mood.
- **Icons:** our own 24 px set, 2 px rounded strokes.
- **Photo of Itesh** (later): a die-cut sticker, placed like a polaroid.
- **Logo:** postponed; "itesh" in Instrument Serif italic meanwhile.

## 9. Sound

Short (under 400 ms), quiet: `peel`, `slap`, `open` / `close`, `select`, sticker flutter, terminal keys, success. Mute toggle in the top bar, remembered. Nothing plays before the first interaction.

## 10. Voice and tone

Funny with attitude, confident without bragging, short sentences, English only. Arcee talks about Itesh in the third person. Less text is better: a name and a hint beat a paragraph.

Microcopy:
- 404: "The model hallucinated this page."
- Tab title away: "come back (╥﹏╥)"
- Arcee off-topic: "I only gossip about Itesh. Ask me what he's built."
- Terminal `rm -rf /`: "nice try. permission denied, forever."

## 11. Responsive and mobile

- Full personality on phones. Pinned/sideways sections become snap carousels or stacks; hover effects become tap versions or are skipped; the custom cursor is off.
- The navigator stays bottom-centre in the thumb zone.
- Peel corner hit area at least 44 × 44 px.
- Test widths: 360, 390, 768, 1024, 1440, 1920.

## 12. Accessibility in design

- Visible focus ring: 2 px violet + 2 px offset (lavender at night).
- Every creative control has a labelled equivalent: the peel corner is a button; the navigator is a combobox with a listbox of options.
- Decorative motion and shapes are `aria-hidden`; never rely on colour alone.
- Respect `prefers-reduced-motion` everywhere.

## 13. Pages still to redesign in this language

Work, the three case studies, About, DiaLabs, Contact (and 404). For each: a hero on a faded mat with a `SectionTitle`-style heading (one word sticker), content as straight die-cut tiles/posters, peel-to-reveal for technical detail, real artwork and links, no leftover day/night copy, and the shared motion patterns above.
