// Lists every stamp in the visitors' passport with its hide link, for when a stamp's email never
// arrived (docs/design.md §2.18). Reads the same Upstash Redis as the site.
// Run: npm run visitors   (uses .env.local; set UPSTASH_REDIS_REST_URL/TOKEN or KV_REST_API_URL/TOKEN
// and VISITOR_HIDE_SECRET or RESEND_API_KEY to the production values to see production's stamps)
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

const root = fileURLToPath(new URL("..", import.meta.url));
const jiti = createJiti(import.meta.url, { alias: { "@": `${root}src` } });
const { hasStorage, listVisitors } = await jiti.import("../src/lib/visitors/store.ts");
const { hideLink } = await jiti.import("../src/lib/email/visitor-email.ts");

if (!hasStorage()) {
  console.log("No Upstash Redis configured, so there's no passport to read (the site keeps stamps in memory without it).");
  process.exit(0);
}
const { entries, total } = await listVisitors(1000);
console.log(`${total} stamp${total === 1 ? "" : "s"} in the passport, newest first:\n`);
for (const e of entries) {
  console.log(`No. ${String(e.n).padStart(4, "0")}  ${e.name}${e.line ? `  “${e.line}”` : ""}  (${e.cat})`);
  console.log(`  hide: ${hideLink(e) ?? "no hide link (set VISITOR_HIDE_SECRET or RESEND_API_KEY)"}\n`);
}
