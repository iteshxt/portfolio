@AGENTS.md

# Project notes

- The product, design and technical decisions live in `docs/prd.md`, `docs/design.md` and `docs/spec.md`. Read the relevant one before building a feature, and update it in the same change when a decision changes.
- Next.js here is 16.4 with Cache Components and partial prefetching enabled. Check `node_modules/next/dist/docs/` before using an API you're unsure about.
- Use semantic colour tokens (`bg-bg`, `text-fg`, `text-accent-text`, …) and the `day:` / `night:` variants; never hard-code the palette in components.
- Shift-specific content uses the `day-only` / `night-only` classes (or `<Day>` / `<Night>` once they exist) so both shifts render on the server.
- Respect `prefers-reduced-motion` and the performance budget in `docs/spec.md` §12 for every animation and 3D scene.
