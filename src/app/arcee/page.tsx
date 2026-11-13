import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { ArceePage } from "./ArceePage";

export const metadata: Metadata = pageMetadata({
  title: "Ask Arcee",
  description: "Chat with Arcee, the site's guide: ask about Itesh Singh Tomar's projects, experience and DiaLabs, or leave him a message.",
  path: "/arcee",
});

export default function ArceeRoute() {
  return (
    <main className="faded-mat flex-1">
      <section data-section="Ask Arcee" className="px-gutter min-h-[100svh] pt-28 pb-[120px]">
        <ArceePage />
      </section>
    </main>
  );
}
