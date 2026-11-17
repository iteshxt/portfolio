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
- The pill itself becomes the field: "Where to? Or ask me anything…", with the Arcee stamp at its end. Typing filters; Enter goes; anything that isn't a page goes to Arcee ("terminal" opens the terminal). "/" or ⌘K toggles, Esc closes. On touch screens opening it doesn't focus the field (no surprise keyboard): focus goes to its close button and the keyboard comes up when the field is tapped; with a fine pointer, or when opened by shortcut, the field is focused.
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
- **Footer:** compact, on a faded mat: the wordmark (sticker "i" + tesh) on a tilted ink sticker, then "*Ships, mostly on time.*" (no name: the badge already says it), link stickers (straight), the latest push as a torn receipt, "© {year} iteshxt" and back to top. No colophon.

### 2.8 Arcee

`/arcee` is the conversation told as a **comic strip** (2026-11-16; shared conversation with the floating panel, `ArceeComic`). **Masthead:** a mascot cat that changes with the conversation's mood, "Vol. 1 · The site's guide", "ASK ARCEE" in heavy condensed caps with a lime offset, a sunflower burst "Answers in cats!" and an "Issue No." box that counts your questions. **Panels:** ink borders, an offset comic shadow, a corner of halftone, a mono panel number, and a sunflower narration caption ("A question lands.", "Moments later…", "Plot twist:"…). **Cast:** your line is a lavender speech bubble with a "You" tag whose tail points off-panel; Arcee is always one of his cat stickers (never the agent ring): the mood the model picked, else one read from the tone (`lib/arcee/tone.ts`: shush for secrets, crying for sorry, sus for injections, judging for nosy questions, stressed, fighting, derp, otherwise hype), on a halftone aura in the mood's colour with a sound effect in outlined comic lettering (WOW!, SHHH!, HMM…, POW!, EEK!, SUS…), and the answer in a paper speech bubble with an "Arcee" tag and a tail at the cat. While it thinks: the judging cat bobs beside a thought cloud. Panels alternate sides (cat left, then right); on phones they stack, cat above a full-width bubble whose tail points up. **Cover panel (01):** the hype cat says hi; what it knows; "your lines" as tappable lavender speech bubbles; the P.S. about messages as a caption. **Your turn:** the next dashed panel holds your line as a lavender bubble with "Send it"; after you send, the page follows the answer so that panel stays just above the navigator, until you scroll up yourself; a "Your turn ↓" sticker appears when it's off screen. A reply's re-said answer after a tool call is hidden (both views). **Accessibility:** an ordered list of panels with headings ("Panel 2: you asked …"), `aria-busy` while answering, a polite live region ("Arcee is thinking…", then the finished reply once), cat alt text that names the mood, decorative SFX and narration hidden from screen readers, a visible label and Enter/Shift+Enter hint, 3px violet focus rings, still frames and no pop-ins under reduced motion.

- **The pop-up (2026-11-14):** a die-cut sheet that slaps up out of the "Where to?" pill (scale from the bottom centre, slap ease) and drops back into it. Paper header with Arcee's ring as a little postage stamp, "Arcee" in the display sans, a live dot and "The site's guide · answers in cats", round sticker buttons for full page and close. Opening: "Hey, I'm Arcee." / "Ask me anything about Itesh." and the suggestions as slightly tilted coloured sticker chips. While it thinks, a thinking-cat sticker bobs with a handwritten "thinking…". Cat stickers float in the corner of a reply. The composer is an ink pill like the navigator's field, with a round lime send button (a stop square while it answers).
### 2.9 Every page is its own piece

The home page stays one of a kind: its lifted sheet, scroll peel, reactive headline, pinned posters and hand-drawn hero bits are not reused elsewhere. Each inner page gets its own concept built from its content, and shares only the global language: colours and tokens, fonts, `.btn` buttons, die-cut stickers and word stickers, `SectionTitle`, filter chips, the cursor labels, the navigator and transitions, the faded mat and the contact block. (Tried and reverted 2026-11-14: giving /work the home hero's sheet and the home posters.)

### 2.10 Work page (2026-11-14): the shipping manifest

- **Hero:** on a faded mat. Left: serif "Work", then "*22* things, built and *shipped*." where the number is a lime word sticker that counts up from 00 (`CountUp`), a one-line lead, and "Open the case files" (ink) / "Browse the shelf" (paper), which glide down. Right: a torn till receipt, tilted a touch, the **shipping manifest**: every project as a numbered line (name, star for case studies, kind · year), "TOTAL SHIPPED", a barcode and "thanks for scrolling". It prints in from the top, then rolls upwards like a till roll (paused on hover; scrollable for reduced motion). Star lines open their case study; the rest glide to their tile on the shelf, which flashes a violet ring.
- **Case files:** "Three with the *full story*." Each star project is a folder: a tab in its app's colours ("CASE 01") on a white die-cut body, artwork on one side in brand colours and the what, an "Under the hood" note (shown openly here), the stack and "Open the case file" on the other. Sides alternate; the tab and body lift on hover. The artwork still flies into the case study.
- **The shelf:** "The rest, *all shipped*." Plain paper tiles, each tagged with a sticker for its kind (AI lavender, Web lime, Mobile sunflower, Tools tomato), year, one line, stack chips and Live / GitHub links; kind chips filter.
- **Ending:** no contact block (that belongs to the home page). Below a dashed tear line, "That's the lot" → "Curious about *one*?" with "Ask Arcee about it" (lime) and "The person behind them" (paper, to About).

### 2.11 Case studies (2026-11-14): the case file, opened

The folder from the work page, open, in the project's own colours (each page wears its brand; site chrome stays the same).
- **The opened file:** a "CASE 01 / 03" tab on a big brand-coloured sheet that unfolds from the top on arrival; "All work" back link. Left: year, the name huge, the plain summary, and an index card clipped on at a slight angle (role, when, links) with the status stamped on in red like a rubber stamp (it thumps in). Right: the project's artwork (the stage the work-page artwork flies into).
- **What it does:** "In plain *words*." with the intro pinned on the left while the numbered points scroll on the right.
- **How it works:** "Under the *hood*." then the technical summary revealing word by word, then the pipeline: numbered dots in the brand colour joined by a line that fills as you scroll (scroll-driven; vertical on phones).
- **Decisions that mattered:** notes taped into the file (sunflower, lavender, lime, paper), slightly askew, with a strip of tape each; tinted at night.
- **Exhibit A:** PatentIQ's rubric as bars that fill in; Arcee's gated phases as rows with stamps (gate passed, in progress, next).
- **Next file:** the next project's tab and sheet in its colours, "Open it →"; its artwork flies into the next page. No contact block.
- **Concrete over vague (2026-11-14):** each file shows what the project really is, from the repos: the real eval tasks it's tested on (mono chips with ticks, after the pipeline); **The rules** ("What it *won't* do": Arcee's never-list as struck-through red stamps, plus its guard rules); gate rows with measured results. Dropped: stat cards with dots, "The kit", "On the bench next", "From the work log" (the numbers stay in the data for Arcee the chatbot). Optional blocks render only when a project has them.
- **Ending:** under the next file, the same "Still curious?" block as the work page (`CuriousEnd`): "Ask anything about *Name*." with "Ask Arcee about it" and "The person behind it".
- **Getting there:** from a card in the project's colours (work-page file, home poster, next file), the transition is seamless: no slap, no peel, no white frame or tilt. The card's coloured panel opens out to fill the screen (one clip), the artwork floats on it, then the colour fades into the page as the artwork glides into the stage. Other routes into a case study use the slap in the project's colours. On the work page the case files stack as you scroll (tablet up).

### 2.12 About (2026-11-14): the laptop lid

- **Hero:** serif "About", "Most of me fits on a *laptop lid*." and a one-line lead. Below it, a dark aluminium lid with an embossed "itesh", covered in die-cut stickers, every one of them true: the three star projects' artwork as round stickers, DiaLabs (with the lab's robot-head mark, from its site icon), Ubuntu, Python, TS, PyTorch, Next.js, Caudal (with Caudal's own bullseye mark, from its site icon), Sutr, "evals before claims", "local-first" and three cats (happy: Arcee replies in cats; thinking: its seven moods; sleepy: the 3am mode). They slap on as the lid scrolls in, tilt as stuck, and react to the cursor (flick). Pointing at or tapping one shows its story on a dashed label under the lid, with a link where it fits (case file, the lab, the store, Arcee). Tablet up: hand-placed; phones: a wrapped pile, and tapping scrolls the label into view.
- **How I work:** "A few *house rules*." Five big statements that reveal word by word, each with a mono footnote of real proof from the work.
- **Shipped for others:** "Who I've *worked* for." Each job as a staff badge: "I worked for" and the company on a coloured band, then as (role), when, what was shipped and a link. Each hangs straight from a single printed strap (the company's name running down it) ending in a metal clip. Scrolling in, the strap drops first, the clip snaps on, then the badge falls onto it and swings to rest. (Tried and reverted: two curly ribbons from left and right.)
- **The fine print:** small type below a dashed line: the degree (no scores, no places) and certificates. Kept quiet on purpose: background, not a CV.
- **Ending:** "Still curious?" "Ask the *chatbot* about me." with Ask Arcee and Say hi.

### 2.13 DiaLabs (2026-11-14): the lab notebook

- **Hero:** serif "DiaLabs · co-founded", "A lab that works in the *open*.", one line ("Every release starts as a question"), "Open the notebook" (ink, glides down) and "Visit dialabs.tech" (paper). Beside it, the lab's own robot mark (from its site icon) as a big violet die-cut sticker: its eyes follow the cursor, it blinks every few seconds, the antenna light pulses lime; tilted, it rocks the other way on hover. A handwritten "it's watching you" points at it, and a black `dialabs.tech` URL sticker (lime mono) is stuck on its edge, linking to the lab's website.
- **The notebook:** "Every release was a *question*." From tablet width up it is a real book: the section pins and the notebook lies open, one experiment per spread (number, kind, name and question on the left page; method, result, stamp and links on the right, with a red margin line by the spine). Scrolling turns the right-hand page over the spine in 3D to the next spread, tied to scroll (75vh per turn, eased, a shade sweeping across the turning page), with a "Page 02 / 06" counter. Phones get it as one long graph-paper sheet. Each release is a numbered experiment (EXP 01…): a kind sticker, the name, the question it set out to answer in serif italic ("Can a browser turn a football clip into match stats without uploading it?"), then Method, Result, a green rubber stamp (Live, Live · beta, On Hugging Face) and its links. Below: "Also from the lab, by the rest of the team" as chips (credited, not claimed).
- **Ending:** "Next experiment": "Everything here is *open*." with "Visit the lab" (dialabs.tech), "Read the code" (GitHub) and "Ask Arcee about the lab". The home teaser links dialabs.tech too, and Arcee knows the address.

### 2.14 Contact (2026-11-14): write me a postcard

- **Hero:** serif "Contact", "Write me a *postcard*." and one line on what to write about.
- **The postcard:** a real postcard, tilted a touch. Left half: "Your message" written on ruled lines in handwriting (Caveat). Right half: a faint ITESH AIRMAIL postmark with wavy lines, a perforated violet "itesh · first class" stamp, and the address lines in handwriting: "To Itesh", "From", "Reply to". "Send it" posts to the leave-a-message endpoint (`via: "postcard"`, subject "A postcard from …"; honeypot and rate limit as for Arcee). On success a red SENT · ITESHXT.ME postmark thumps onto the stamp, the card slides off into the post, and "Delivered. Got it. I'll write back to …" appears with "Write another" (a blank card). Errors say so plainly and offer the email address.
- **Or pick a stamp:** the other ways in as perforated postage stamps (dotted mask edges, an inner frame), slightly askew, flicking when knocked: Airmail (the email address, tap to copy), LinkedIn, GitHub, X, and Express: Arcee (opens the chat to leave a message).
- No ending block: the contact page is the end; the footer follows.

### 2.15 404 (2026-11-14): the peeled sticker

- On a faded mat: serif "404", "The model *hallucinated* this page."
- Below it, where the page was: an empty dashed die-cut outline with a speckle of leftover adhesive and "this page used to be here". The violet "404" sticker that sat in it lifts and peels off, landing askew below and to the side with its corner curled to show the lavender back (lands closer on phones; shown already peeled for reduced motion).
- "Did you mean…": the pages as die-cut stickers with a model's misplaced confidence (Home 97%, Work 91%, About 88%, DiaLabs 84%, Contact 79%), then "Take me home" and "Ask Arcee instead".

### 2.16 /easter-eggs (2026-11-14): the egg carton

Not in the navigator, the sitemap or search (noindex). The only way in is a whisper in the footer's bottom row: a faint handwritten "psst… psst… psst…" with squiggly arrows and a tiny sunflower egg, which darkens, nudges and wobbles on hover (cursor: "shh…").
- **Hero:** handwritten "psst… you made it", "The secret *eggs*.", "Eight things hidden around this site. Couldn't find them all? Crack one open and try it right here."
- **The carton:** a cardboard egg carton (a die-cut tray with eight cups and a "GRADE A · 8 EGGS · HAND-HIDDEN" label) holding eight dyed, sticker-patterned eggs (zigzags, dots, stripes, stars), each a die-cut SVG egg that wobbles on hover. Cracking one pops its cap off along a zigzag crack (a yolk-yellow inside shows) and a torn, lined slip slides out below (scrolled into view): "Egg 03 of 08", the name, "How to find it" with keycaps, and "Try it", which really triggers it: opens the terminal, sends the scuba cat, flips the tab title, switches to 3am night with its toast, opens print, goes to a hallucinated address, or shows the live latest push.
- **Found stamps:** eggs found on your own (kept in this browser; `markEgg` in lib/eggs) wear a green "FOUND" stamp, live, with "Found on your own: N of 8" below.

### 2.17 The manifest barcode (2026-11-16; a QR code for a day, the barcode again since 2026-11-17): you, shipped

The bottom of the Work page's shipping manifest carries a real Code 128 barcode (`lib/code128.ts`), the manifest's main mark: black on white in both themes, with a 10-module quiet zone either side, drawn as one SVG across the label's full width (it borrows some of the receipt's margin) whenever that gives each module 2 screen pixels or more. Below that, on a 1x desktop screen, it shrinks to exactly 1 screen pixel per module, because fractional modules under 2 pixels round unevenly (some bars a pixel fat, others thin) and stop decoding. The manifest's 1.5° tilt and the receipt's torn-edge mask make the browser resample the bars anyway, so the bars' edges go soft, but scanning along the tilt still reads. With the production address (242 modules) that's 242 px on a 1x screen, about 1.67 CSS px per module on any other desktop, and about 1.41 on a 390 px phone (342 px of label, 2.8 to 4.2 device px per module), so a phone is the weaker screen to scan from. It reads `iteshxt.me/s/<code>` (no protocol: fewer characters keep the bars wide enough to scan off a screen), a 4-character code made once per tab, and that address is printed under it like a real label. Google Lens, Android cameras and barcode apps read it; iPhone's built-in camera only opens QR codes, so the printed address is a link too (also for anyone without a second phone). A handwritten "scan me" sits above the barcode's right end, and once the barcode is on screen it drops in, writes itself and its curly arrow, then nudges down at the bars, like "peel here" on the home hero; it never covers a bar or the quiet zone. Scanning opens the arrival card (§2.18): the scan is logged at once, and at the same moment the desktop's manifest (polling every 2.5 s while the barcode is on screen, then every 4 s for the name, for up to 15 minutes) prints "23 · You ★ · just now" in lime, TOTAL SHIPPED ticks to 23, a red SCANNED stamp thumps on under the printed address (never over the bars), the scuba cat swims past and the egg toast appears. When the visitor signs the passport, "You" re-prints as their name. The receipt ends "thanks for scrolling · the visitors' passport". The two screens meet through `/api/scan`. It's egg 9 in the carton ("You, shipped").

### 2.18 The visitors' passport (2026-11-17, book and dated stamps the same evening)

**The arrival card (`/s/<code>`, on the phone):** "beep. you scanned the manifest." over a plain customs form, with no jokes in the rows: Visitors so far (the real count), You'd be (the number the next stamp gets, "No. 0012 · if you sign"; "Your number" once stamped), Arrived (today, on the visitor's own calendar), Via (the manifest on the Work page). Below the rows, "Your stamp": their stamp on passport paper, printing itself in light ink as they fill the card in ("Your name" and an empty photo frame stand in until they type and pick). Then "Sign the visitors' passport": Name (up to 24 characters), Reason for visit (optional, up to 80; the placeholder suggests one), and "Passport photo: the cat that looks most like you" (Arcee's nine cats as stills, a violet ring on the chosen one), a hidden honeypot, "Stamp my passport", or "just passing through" to skip. A note says what's public: name, reason, cat and the date, nothing else; a scrambled network address is kept for a day to stop spam. Signing thumps the same stamp in for real ("Stamped. Welcome in.", CLEARED beside it), says their visitor number, and offers "See your stamp in the passport"; the phone remembers it, so a return visit shows "Welcome back" and the stamp instead of a new card (one stamp per phone; the server allows one per network and code, three per network and 40 in all, per day, where a network is the IPv4 address or the IPv6 /64).

**Moderation:** stamps publish at once. Each one emails Itesh with a hide link; the email cap and the stamp cap are both 40 a day, so every stamp has one. `npm run visitors` lists every stamp with its hide link too (point it at production's Redis and secrets), for a stamp whose email never arrived.

**The stamp (`PassportStamp`):** a rubber-stamp impression in one ink (violet, red, green, navy or brown, all readable on the paper), worn by a grain mask at its own offset, multiplied onto the paper, tilted. Shape, ink, tilt and wear come from the visitor number alone, so the arrival card's preview is the stamp that lands. Four shapes: a round entry stamp with "VISITOR No. 0142 · ITESHXT.ME" over the top of the rim and "★ 17 NOV 2026 ★" round the bottom; a double-ruled rectangle and a dashed-rule ticket with "ARRIVED · No. 0142" on top and "17 NOV 2026 · iteshxt.me" below; an oval with "ARRIVED · No. 0142" and the date under it. Inside: the cat they picked, printed in grey like a passport photo, the name in heavy condensed caps (stepping down for long names), and their line in serif italic. Stamps from before dates existed say CLEARED where the date goes.

**The passport (`/visitors`, unlisted, not indexed):** "Proof you were [here]." (the word is a red rubber stamp that thumps on), a line on how to get a stamp, "Get your stamp" and a tally ("11 stamps so far · newest No. 0011, Aisha"). Below it, the book. It starts closed: a deep violet board with gold foil ("VISITORS' PASSPORT", a cat crest, iteshxt.me, the chip symbol) and "scroll to open it". Scrolling swings the cover open on its spine onto the inside cover (the crest and a bearer's request: let them scroll freely, "without let or hindrance", with every snack and cat they need; "Not valid for travel. Valid for scrolling.") and the data page (a cat photo, Type P · Visitors, Holder: everyone who scanned the manifest, the stamp count, the latest arrival with their date, how to get a stamp, and two machine-readable lines at the foot). Then the book slides sideways spread by spread as you scroll, holding each spread for a moment: visa pages filled from the first stamp like a real passport, two stamps to a page (four to a spread; one page at a time on phones), the crest faint in the middle and the page number at the foot, a dashed "your stamp here" in the next free spot and blank pages after it. Under the book: where you are ("Spread 2 of 5"), and ←, → and Newest buttons. Arriving from the arrival card (`?you=<id>`) turns the book to your stamp, thumps it in and writes "that's you!" beside it. Paper and cover keep their colours in both themes. Reduced motion: the same pages in a row that scrolls sideways, with the buttons, no cover.

**Rules:** the date is the only time kept or shown (a calendar date, never a clock time); no place, no IP. Names and lines are length-limited, links and contact details are refused, a word filter (English and Hinglish) keeps it friendly, and signing needs a scan in the last hour. Every new stamp is emailed to Itesh (at most 40 a day) with a hide link; the link opens a confirmation page (mail scanners pre-open links, so a plain link never hides anything) whose button removes the stamp. Persistence needs Upstash Redis on Vercel (in memory otherwise, for local development).

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

## 8. Stickers, icons, logo

- **Die-cut stickers:** white (`--die`) border, flat colour, soft shadow, optional slight tilt when an accent. Word stickers: `Sticker size="word"`; chips: `Sticker`.
- **Wordless shapes** (`ui/Shape`): burst, blob, squiggle, arch, sparkle, zigzag, capsule. For loaders and transitions only; don't scatter them as decoration on content.
- **Cat stickers:** Itesh's own animated cats (public/stickers/cats, 160px WebP with a still frame each), nine moods: hype, judging, shush, crying, sobbing, fighting, derp, stressed, sus. Arcee picks one by mood; three sit on the About lid. Send more and add a line to `lib/arcee/stickers.ts`.
- **Icons:** our own 24 px set, 2 px rounded strokes.
- **No photo of Itesh** (dropped 2026-11-16).
- **Name and titles (2026-11-16):** the site says "Itesh Tomar" (`SITE.display`), never the long name and role. Home title and share cards: "Itesh Tomar — ships, mostly on time" (`SITE.tagline`); inner pages: "Work · Itesh Tomar". The full name stays only in the printed resume, structured data and Arcee's knowledge.
- **Logo (2026-11-16):** the two-sticker "i": a lime pill stem and a violet dot, each with a white die-cut border, the stem tilted 6°, and the dot's lower-right edge peeling back (light violet flap). Wordmark = the sticker i + "tesh" in Instrument Serif italic (`ui/LogoMark` → `Wordmark`, top bar; the violet intro uses the white line version). Favicon and Apple icon put the mark on an ink rounded square. **Line version** (`LogoMark variant="line"`, `public/logo-line.svg`, `public/icon-mono.svg`) for one-colour uses: the printed resume and the monochrome manifest icon.
- **Scuba cat:** his own transparent scuba sticker (`stickers/cats/scuba.webp`, from his scuba.gif: 200 px + edge, all 53 frames evenly timed at 83 ms, ~195 KB, with the white die-cut edge and shadow baked into the frames so no CSS filters run; decoded at idle before it's needed; still frame for reduced motion), upright, never tilted: a school of 8 (random rows, sizes from 0.75× to 1.35× a sticker, speeds, about a third swimming the other way) for the Konami code, `scuba` and the barcode egg; reduced motion keeps one calm cat.

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

Done: Work (§2.10), case studies (§2.11), About (§2.12), DiaLabs (§2.13), Contact (§2.14), 404 (§2.15). Every page is done; new pages follow the same rule. For each: its own concept and hero drawn from that page's content (§2.9), built from the shared language, with real artwork and links, peel-to-reveal or similar for technical detail, and no leftover day/night copy.
