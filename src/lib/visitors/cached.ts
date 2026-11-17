import { cacheLife, cacheTag } from "next/cache";
import { listVisitors } from "./store";
import { VISITORS_TAG, type VisitorList } from "./types";

/**
 * The passport's stamps for /visitors (docs/design.md §2.18). Cached and tagged so the
 * page can prerender; signing or hiding a stamp calls revalidateTag(VISITORS_TAG) and the
 * next visit sees it. The short "minutes" life is a safety net for the in-memory store.
 * A failed read is cached for seconds only (one cacheLife per branch, as the docs allow),
 * so a Redis blip doesn't freeze an empty passport into the shell. On that fallback `next`
 * is 0, meaning unknown: the pages hide the next visitor number then.
 */
export async function cachedVisitors(): Promise<VisitorList> {
  "use cache";
  cacheTag(VISITORS_TAG);
  try {
    const result = await listVisitors();
    cacheLife("minutes");
    return result;
  } catch {
    cacheLife("seconds");
    return { entries: [], total: 0, next: 0 };
  }
}
