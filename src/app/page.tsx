import { PageShell } from "@/components/shell/PageShell";
import { HOME } from "@/content/pages";

/**
 * Home, milestone 2: the cycling hero. Star projects, archive, DiaLabs and
 * the rest of the home sections arrive in milestone 3.
 */
export default function Home() {
  return (
    <PageShell copy={HOME} cycle>
      <p>
        iteshxt.me v4 is under construction. Use the <span className="text-fg">Show me ___</span> bar below, or peel
        the corner to switch shifts.
      </p>
    </PageShell>
  );
}
