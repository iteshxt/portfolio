/**
 * One scroll loop for every scroll-driven effect (parallax, the hero curl, the pinned
 * track, grow-ins, the notebook, the progress ring, the top bar). Client-only.
 *
 * Each effect registers a `read` (measure: scrollY, rects) and a `write` (set styles).
 * Per frame, all reads run first, then all writes, so the browser lays out once instead
 * of once per effect. The loop runs inside Lenis's own frame when it's driving (desktop),
 * so effects move in the same frame as the page, and straight from the browser's scroll
 * event otherwise (touch), with no extra animation-frame hop. At most once per frame.
 */

export type ScrollJob = { read?: () => void; write?: () => void };

const jobs = new Set<ScrollJob>();
let ranThisFrame = false;
let listening = false;

function resetFrame() {
  ranThisFrame = false;
}

/** Runs every job now (once per frame). Lenis calls this from its scroll event. */
export function runScrollFrame() {
  if (ranThisFrame || jobs.size === 0) return;
  ranThisFrame = true;
  requestAnimationFrame(resetFrame);
  for (const job of jobs) job.read?.();
  for (const job of jobs) job.write?.();
}

function onResize() {
  ranThisFrame = false;
  runScrollFrame();
}

function listen() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("scroll", runScrollFrame, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
}

/** Registers a job; returns the unsubscribe. Call `job.read` + `job.write` yourself for a first paint if needed. */
export function onScrollFrame(job: ScrollJob): () => void {
  jobs.add(job);
  listen();
  return () => {
    jobs.delete(job);
  };
}
