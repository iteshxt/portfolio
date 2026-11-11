import { PageShell } from "@/components/shell/PageShell";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { PAGES } from "@/content/pages";

export default function NotFound() {
  return (
    <PageShell copy={PAGES.notFound}>
      <p>
        The model hallucinated this page.{" "}
        <TransitionLink
          href="/"
          transitionLabel="Home"
          className="text-fg underline decoration-violet decoration-2 underline-offset-4"
        >
          Take me home
        </TransitionLink>
      </p>
    </PageShell>
  );
}
