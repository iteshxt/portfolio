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
      searchOptions: { boost: { title: 2 }, fuzzy: 0.3, prefix: true, combineWith: "OR" },
    });
    index.addAll(corpus);
  }
  return { index, byId };
}

/** Always sent: who Itesh is and the site's pages, so short or misspelled questions still land. */
const CORE = ["about-itesh", "site-map"];

/**
 * Top chunks for the latest question (most of the slots), topped up from the
 * recent turns so follow-ups keep their context, always led by the core chunks.
 */
export function retrieve(question: string, earlier = "", k = 7): Chunk[] {
  const { index, byId } = getIndex();
  const core = CORE.map((id) => byId.get(id)).filter((c): c is Chunk => Boolean(c));
  const seen = new Set(CORE);
  const pick = (query: string, n: number) =>
    query.trim()
      ? index
          .search(query)
          .map((r) => byId.get(String(r.id)))
          .filter((c): c is Chunk => Boolean(c) && !seen.has(c!.id))
          .slice(0, n)
          .map((c) => (seen.add(c.id), c))
      : [];
  const now = pick(question, k - 2);
  const before = pick(`${earlier} ${question}`, k - now.length);
  return [...core, ...now, ...before];
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
