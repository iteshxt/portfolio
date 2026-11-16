import type { Metadata } from "next";
import { Suspense } from "react";
import { Customs } from "@/components/eggs/Customs";

export const metadata: Metadata = {
  title: "Customs",
  description: "You scanned the shipping manifest.",
  robots: { index: false, follow: false },
};

/** Where the manifest barcode leads (docs/design.md §2.17). */
export default function ScanPage({ params }: PageProps<"/s/[code]">) {
  return (
    <Suspense fallback={<main className="flex-1" />}>
      <ScanBody params={params} />
    </Suspense>
  );
}

async function ScanBody({ params }: { params: PageProps<"/s/[code]">["params"] }) {
  const { code } = await params;
  return <Customs code={code.toLowerCase()} />;
}
