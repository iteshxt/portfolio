/**
 * Placeholder home for the foundation milestone. The real home (peel intro,
 * typing "Itesh ___" headline, star projects) arrives in milestones 2–3.
 */
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-[clamp(16px,4vw,48px)] py-24 text-center">
      <p className="font-serif text-[clamp(18px,1.8vw,24px)] text-fg-muted">
        <span className="day-only">By day: what he builds</span>
        <span className="night-only">By night: how it works</span>
      </p>

      <h1 className="flex flex-col items-center">
        <span className="display-sans text-[clamp(64px,16vw,240px)]">Itesh</span>
        <span className="display-serif text-[clamp(44px,11vw,170px)] text-accent-text">
          <span className="day-only">builds this</span>
          <span className="night-only">is wiring this up</span>
        </span>
      </h1>

      <p className="max-w-md text-fg-muted">
        iteshxt.me v4 is under construction. Same human, new shifts.
      </p>
    </main>
  );
}
