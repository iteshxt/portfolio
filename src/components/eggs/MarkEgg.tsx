"use client";

import { useEffect } from "react";
import { markEgg } from "@/lib/eggs";

/** Records that a page-shaped egg (the 404) was found. Renders nothing. */
export function MarkEgg({ id }: { id: string }) {
  useEffect(() => markEgg(id), [id]);
  return null;
}
