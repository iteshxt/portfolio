import { scrollToElement } from "@/lib/motion";

/** Glides to a project on the shelf and makes its tile flash, so the eye lands on it. */
export function jumpToProject(slug: string) {
  const el = document.getElementById(`p-${slug}`);
  if (!el) return;
  scrollToElement(el, -110);
  el.removeAttribute("data-flash");
  // Restart the flash even if it was just shown.
  void el.offsetWidth;
  el.setAttribute("data-flash", "");
  window.setTimeout(() => el.removeAttribute("data-flash"), 2600);
}
