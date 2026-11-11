import type { Metadata } from "next";
import { PageShell } from "@/components/shell/PageShell";
import { PAGES } from "@/content/pages";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PageShell copy={PAGES.about}>
      <p>This page is being assembled from commit messages and chai.</p>
    </PageShell>
  );
}
