import MiniSearch from "minisearch";
import { buildCorpus, type Chunk } from "./corpus";

/**
 * BM25 retrieval over the corpus (docs/spec.md §8.3). The corpus is tiny
 * (tens of chunks), so the index is built once per server instance, in memory.
 */
let index: MiniSearch<Chunk> | null = null;
let byId: Map<string, Chunk> | null = null;

function getIndex() {
  if (!index || !byId) {
    const corpus = buildCorpus();
    byId = new Map(corpus.map((c) => [c.id, c]));
    index = new MiniSearch<Chunk>({
      fields: ["title", "text"],
      storeFields: ["id"],
      searchOptions: { boost: { title: 2 }, fuzzy: 0.2, prefix: true, combineWith: "OR" },
    });
    index.addAll(corpus);
  }
  return { index, byId };
}

/** Top chunks for a query, always led by the "who Itesh is" chunk. */
export function retrieve(query: string, k = 6): Chunk[] {
  const { index, byId } = getIndex();
  const about = byId.get("about-itesh");
  const hits = index
    .search(query)
    .map((r) => byId.get(String(r.id)))
    .filter((c): c is Chunk => Boolean(c) && c!.id !== "about-itesh")
    .slice(0, k);
  return about ? [about, ...hits] : hits;
}

/** The pages Arcee's navigate tool may open. */
export const NAVIGABLE: Record<string, string> = {
  "/": "Home",
  "/work": "Work",
  "/work/arcee": "Arcee",
  "/work/patentiq": "PatentIQ",
  "/work/diachat": "DiaChat",
  "/dialabs": "DiaLabs",
  "/about": "About",
  "/contact": "Contact",
};
