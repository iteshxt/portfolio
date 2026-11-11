import type { Metadata } from "next";
import { PageShell } from "@/components/shell/PageShell";
import { PAGES } from "@/content/pages";

export const metadata: Metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <PageShell copy={PAGES.work}>
      <p>The archive is being stickered up. Every project lands here soon.</p>
    </PageShell>
  );
}
