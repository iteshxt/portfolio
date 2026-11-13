import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Postcard } from "@/components/contact/Postcard";
import { Stamps } from "@/components/contact/Stamps";
import { Sticker } from "@/components/ui/Sticker";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with Itesh Singh Tomar for roles, collaborations or a project that needs both a model and a product around it.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="flex-1">
      <section data-section="Contact" className="px-gutter pt-28 pb-[clamp(96px,10vw,150px)] md:pt-36">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-[clamp(32px,5vw,60px)] flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
            <div>
              <p data-animate="rise" className="font-serif text-[clamp(20px,1.9vw,28px)] text-fg-muted italic">
                Contact
              </p>
              <h1
                data-animate="rise"
                style={{ "--d": "80ms" } as CSSProperties}
                className="mt-3 text-[clamp(44px,6.4vw,100px)] leading-[1.02] font-semibold tracking-[-0.045em] [font-variation-settings:'wdth'_80]"
              >
                Write me a{" "}
                <Sticker size="word" tone="tomato" tilt={-3}>
                  postcard
                </Sticker>
                .
              </h1>
            </div>
            <p data-animate="rise" style={{ "--d": "160ms" } as CSSProperties} className="max-w-[34ch] text-[clamp(16px,1.3vw,19px)] leading-[1.5] text-fg-muted md:text-right">
              Roles, collaborations, or a project that needs both a model and a product around it.
            </p>
          </div>

          <div className="grid items-start gap-[clamp(32px,4vw,56px)] lg:grid-cols-[1.45fr_0.75fr]">
            <div data-animate="rise" style={{ "--d": "200ms" } as CSSProperties}>
              <Postcard />
            </div>
            <div className="flex flex-col gap-4">
              <p className="font-serif text-[clamp(20px,1.8vw,24px)] text-fg-muted italic">Or pick a stamp</p>
              <Stamps />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
