/** Small browser helpers shared by the signature moves. Client-only. */

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function supportsViewTransitions(): boolean {
  return typeof document !== "undefined" && typeof document.startViewTransition === "function";
}

/** True when the keyboard event comes from a field the visitor is typing in. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

type Scroller = { scrollTo: (target: HTMLElement | number, options?: { offset?: number; duration?: number }) => void };
let scroller: Scroller | null = null;

/** SmoothScroll registers its Lenis instance here so others can scroll through it. */
export function setScroller(next: Scroller | null) {
  scroller = next;
}

/** Smoothly scrolls an element to the top of the viewport (through Lenis when it's running). */
export function scrollToElement(el: HTMLElement, offset = 0) {
  if (scroller) scroller.scrollTo(el, { offset, duration: 1.1 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/** Smoothly scrolls back to the top of the page. */
export function scrollToTop() {
  if (scroller) scroller.scrollTo(0, { duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}
