import { revalidateTag } from "next/cache";
import { hideVisitor } from "@/lib/visitors/store";
import { VISITORS_TAG } from "@/lib/visitors/types";
import { verifyHideToken } from "@/lib/visitors/hide-token";

/**
 * The hide button on /visitors/hide (docs/design.md §2.18). POST only: mail scanners
 * pre-fetch the emailed GET link, so only a real press of the button hides a stamp.
 * The signed token is the permission; the stamp is kept aside in the store, not deleted.
 */
export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const id = form?.get("id");
  const t = form?.get("t");
  if (typeof id !== "string" || typeof t !== "string" || !verifyHideToken(id, t)) {
    return Response.redirect(new URL("/visitors/hide?invalid=1", req.url), 303);
  }
  await hideVisitor(id);
  revalidateTag(VISITORS_TAG, { expire: 0 });
  return Response.redirect(new URL("/visitors/hide?done=1", req.url), 303);
}
