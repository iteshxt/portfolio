import { ACHIEVEMENTS, CERTIFICATES, EDUCATION, EXPERIENCE, SKILLS } from "@/content/profile";
import { ARCHIVE_PROJECTS, STAR_PROJECTS } from "@/content/projects";
import { SITE } from "@/content/site";

const SELECTED = ["sutr", "bloom", "cadence", "stryde", "investwise", "dia-moderator"];

/**
 * Print to resume (docs/prd.md §6.5): printing any page swaps the site for
 * this one-page A4 resume, built from the same content files. Hidden on screen.
 */
export function PrintResume() {
  const selected = ARCHIVE_PROJECTS.filter((p) => SELECTED.includes(p.slug));
  return (
    <div data-print-resume="" className="print-resume hidden">
      <header className="pr-header">
        <h1>{SITE.name}</h1>
        <p className="pr-role">{SITE.role}</p>
        <p className="pr-contact">
          {SITE.email} · linkedin.com/in/iteshxt · github.com/iteshxt · iteshxt.me · {SITE.location}
        </p>
      </header>

      <section>
        <h2>Experience</h2>
        {EXPERIENCE.map((e) => (
          <div key={e.company} className="pr-item">
            <p className="pr-line">
              <strong>{e.company}</strong> · {e.role}
              <span>{e.period}</span>
            </p>
            <ul>
              {[...e.day.slice(0, 1), ...e.night].map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2>Star projects</h2>
        {STAR_PROJECTS.map((p) => (
          <div key={p.slug} className="pr-item">
            <p className="pr-line">
              <strong>{p.name}</strong> · {p.stack.slice(0, 4).join(", ")}
              <span>{p.year}</span>
            </p>
            <ul>
              <li>{p.day}</li>
              <li>{p.night}</li>
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2>Selected projects</h2>
        <ul className="pr-compact">
          {selected.map((p) => (
            <li key={p.slug}>
              <strong>{p.name}</strong>: {p.day}
            </li>
          ))}
        </ul>
      </section>

      <div className="pr-columns">
        <section>
          <h2>Skills</h2>
          {SKILLS.map((g) => (
            <p key={g.group} className="pr-skill">
              <strong>{g.group}:</strong> {g.items.join(", ")}
            </p>
          ))}
        </section>
        <section>
          <h2>Education</h2>
          {EDUCATION.slice(0, 1).map((e) => (
            <p key={e.school} className="pr-skill">
              <strong>{e.school}</strong>, {e.detail}, {e.period} · {e.score}
            </p>
          ))}
          <h2>Achievements</h2>
          {ACHIEVEMENTS.map((a) => (
            <p key={a.title} className="pr-skill">
              <strong>{a.title}</strong>: {a.detail}
            </p>
          ))}
          <p className="pr-skill">
            <strong>Certificates:</strong> {CERTIFICATES.map((c) => `${c.name} (${c.issuer})`).join("; ")}
          </p>
        </section>
      </div>

      <p className="pr-foot">Printed from iteshxt.me, where there&apos;s a night shift too.</p>
    </div>
  );
}
