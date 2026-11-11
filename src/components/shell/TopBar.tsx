import { TransitionLink } from "@/components/transition/TransitionLink";

/** Minimal top bar: the wordmark placeholder (the logo comes after the site, see docs/prd.md §4). */
export function TopBar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between px-[clamp(16px,4vw,48px)] pt-5">
      <TransitionLink
        href="/"
        transitionLabel="Home"
        aria-label="Home"
        className="pointer-events-auto font-serif text-[28px] italic leading-none"
      >
        itesh
      </TransitionLink>
    </header>
  );
}
