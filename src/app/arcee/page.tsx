import type { Metadata } from "next";
import { SectionTitle } from "@/components/type/SectionTitle";
import { Sticker } from "@/components/ui/Sticker";
import { pageMetadata } from "@/lib/metadata";
import { ArceePage } from "./ArceePage";

export const metadata: Metadata = pageMetadata({
  title: "Ask Arcee",
  description: "Chat with Arcee, the site's guide: ask about Itesh Singh Tomar's projects, experience and DiaLabs, or leave him a message.",
  path: "/arcee",
});

export default function ArceeRoute() {
  return (
    <main className="flex-1">
      <section data-section="Ask Arcee" className="px-gutter pt-28 pb-[clamp(64px,8vw,120px)]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10">
          <SectionTitle kicker="Arcee, the site's guide">
            Ask me anything about the{" "}
            <Sticker size="word" tone="lime" tilt={-2}>
              work
            </Sticker>
            .
          </SectionTitle>
          <ArceePage />
        </div>
      </section>
    </main>
  );
}
