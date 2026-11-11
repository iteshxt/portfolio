import type { Metadata } from "next";
import { PageShell } from "@/components/shell/PageShell";
import { PAGES } from "@/content/pages";
import { SITE } from "@/content/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PageShell copy={PAGES.contact}>
      <p>
        Until Arcee learns to take messages, email works:{" "}
        <a href={`mailto:${SITE.email}`} className="text-fg underline decoration-violet decoration-2 underline-offset-4">
          {SITE.email}
        </a>
      </p>
    </PageShell>
  );
}
