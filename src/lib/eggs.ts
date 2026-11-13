import { play } from "./sound";
import { useUI } from "@/store/ui";

const FOUND_KEY = "eggs-found";

/** The eggs this visitor has found on their own (kept in this browser, for /easter-eggs). */
export function foundEggs(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FOUND_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

/** Quietly records a found egg, and tells an open /easter-eggs page. */
export function markEgg(key: string) {
  try {
    const found = new Set(foundEggs());
    if (found.has(key)) return;
    found.add(key);
    localStorage.setItem(FOUND_KEY, JSON.stringify([...found]));
  } catch {
    // Without storage there's nothing to remember. Fine.
  }
  window.dispatchEvent(new CustomEvent("egg:found", { detail: key }));
}

/** Celebrates an easter egg once per visit: a chime and a toast. */
export function foundEgg(key: string, title: string, body?: string) {
  markEgg(key);
  const storageKey = `egg:${key}`;
  try {
    if (sessionStorage.getItem(storageKey)) return;
    sessionStorage.setItem(storageKey, "1");
  } catch {
    // Without storage, celebrate every time. That's fine too.
  }
  play("found");
  useUI.getState().pushToast(title, body);
}
