import { PageShell } from "@/components/shell/PageShell";
import { HOME } from "@/content/pages";

/**
 * Home, milestone 2: the cycling "Itesh ___" hero. Star projects, archive,
 * DiaLabs and the rest of the home sections arrive in milestone 3.
 */
export default function Home() {
  return (
    <PageShell copy={HOME} cycle>
      <p>
        iteshxt.me v4 is under construction. Open the <span className="text-fg">Itesh ___</span> bar below, or peel
        the corner to switch shifts.
      </p>
    </PageShell>
  );
}
