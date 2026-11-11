import type { Metadata } from "next";
import { PageShell } from "@/components/shell/PageShell";
import { PAGES } from "@/content/pages";

export const metadata: Metadata = { title: "DiaLabs" };

export default function DiaLabsPage() {
  return (
    <PageShell copy={PAGES.dialabs}>
      <p>The DiaLabs chapter is still in the oven.</p>
    </PageShell>
  );
}
