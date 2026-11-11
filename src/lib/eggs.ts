import { play } from "./sound";
import { useUI } from "@/store/ui";

/** Celebrates an easter egg once per visit: a chime and a toast. */
export function foundEgg(key: string, title: string, body?: string) {
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
