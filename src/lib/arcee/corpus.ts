import { ARCEE_FACTS } from "@/content/arcee-facts";
import { CASE_STUDIES } from "@/content/case-studies";
import { DIALABS_URL, RELEASES, TEAM_NOTE } from "@/content/dialabs";
import { ACHIEVEMENTS, CERTIFICATES, EDUCATION, EXPERIENCE, SKILLS } from "@/content/profile";
import { ARCHIVE_PROJECTS, STAR_PROJECTS, type Project } from "@/content/projects";
import { SITE } from "@/content/site";

/**
 * Arcee's knowledge: chunks built straight from the site's content files
 * (docs/spec.md §8.3), so what Arcee knows always matches what the site says.
 */
export type Chunk = { id: string; title: string; url: string; text: string };

function links(p: Project): string {
  const out = [p.links.live && `live: ${p.links.live}`, p.links.repo && `code: ${p.links.repo}`, ...(p.links.extra ?? []).map((l) => `${l.label}: ${l.href}`)];
  return out.filter(Boolean).join("; ");
}

export function buildCorpus(): Chunk[] {
  const chunks: Chunk[] = [];

  chunks.push({
    id: "about-itesh",
    title: "Who Itesh is",
    url: "/about",
    text: `${SITE.name} is an ${SITE.role} based in ${SITE.location}. He fine-tunes models, builds agents and ships products. He co-founded DiaLabs, an open-source AI/ML organisation. He studies B.Tech Computer Science at Lovely Professional University (CGPA 8.53). Email: ${SITE.email}.`,
  });

  for (const e of EXPERIENCE) {
    chunks.push({
      id: `exp-${e.company.toLowerCase().replace(/\W+/g, "-")}`,
      title: `${e.company}: ${e.role}`,
      url: "/about",
      text: `${e.role} at ${e.company} (${e.period}). ${[...e.day, ...e.night].join(" ")}`,
    });
  }

  chunks.push({
    id: "education",
    title: "Education",
    url: "/about",
    text: EDUCATION.map((e) => `${e.detail} at ${e.school}, ${e.place} (${e.period}), ${e.score}.`).join(" "),
  });

  chunks.push({
    id: "skills",
    title: "Skills and tools",
    url: "/about",
    text: SKILLS.map((g) => `${g.group}: ${g.items.join(", ")}.`).join(" "),
  });

  chunks.push({
    id: "achievements",
    title: "Achievements and certificates",
    url: "/about",
    text: [...ACHIEVEMENTS.map((a) => `${a.title}: ${a.detail}`), ...CERTIFICATES.map((c) => `Certificate: ${c.name} (${c.issuer}, ${c.date}).`)].join(" "),
  });

  for (const p of STAR_PROJECTS) {
    const cs = CASE_STUDIES[p.slug as keyof typeof CASE_STUDIES];
    const url = `/work/${p.slug}`;
    chunks.push({
      id: `star-${p.slug}`,
      title: `${p.name} (star project ${p.order})`,
      url,
      text: `${p.name} is one of Itesh's three star projects. ${p.day} How it works: ${p.night} Stack: ${p.stack.join(", ")}. ${cs ? `Role: ${cs.role}. When: ${cs.timeline}. Status: ${cs.status}. ${cs.stats.map((s) => `${s.value} ${s.label}`).join("; ")}.` : ""} Links: ${links(p)}.`,
    });
    if (!cs) continue;
    chunks.push({
      id: `star-${p.slug}-what`,
      title: `${p.name}: what it does`,
      url,
      text: `${cs.summary.day} ${cs.day.intro} ${cs.day.points.map((pt) => `${pt.title}: ${pt.body}`).join(" ")}`,
    });
    chunks.push({
      id: `star-${p.slug}-how`,
      title: `${p.name}: how it works`,
      url,
      text: `${cs.summary.night} ${cs.night.intro} ${cs.night.pipeline.map((s) => `${s.step}: ${s.body}`).join(" ")}`,
    });
    chunks.push({
      id: `star-${p.slug}-decisions`,
      title: `${p.name}: key decisions`,
      url,
      text: cs.night.decisions.map((d) => `${d.title}: ${d.body}`).join(" "),
    });
    if (cs.breakdown) {
      chunks.push({
        id: `star-${p.slug}-rubric`,
        title: `${p.name}: ${cs.breakdown.title}`,
        url,
        text: `${cs.breakdown.caption} ${cs.breakdown.rows.map((r) => `${r.label}: ${r.value} points`).join("; ")}.`,
      });
    }
    if (cs.progress) {
      chunks.push({
        id: `star-${p.slug}-phases`,
        title: `${p.name}: ${cs.progress.title}`,
        url,
        text: `${cs.progress.caption} ${cs.progress.rows.map((r) => `${r.label} (${r.state === "done" ? "gate passed" : r.state === "doing" ? "in progress" : "next"}): ${r.note}`).join("; ")}.`,
      });
    }
  }

  for (const p of ARCHIVE_PROJECTS) {
    chunks.push({
      id: `project-${p.slug}`,
      title: p.name,
      url: "/work",
      text: `${p.name} (${p.category}, ${p.year}): ${p.day} How it works: ${p.night} Stack: ${p.stack.join(", ")}. Links: ${links(p)}.`,
    });
  }

  chunks.push({
    id: "dialabs",
    title: "DiaLabs",
    url: "/dialabs",
    text: `Itesh co-founded DiaLabs (${DIALABS_URL}), an open-source AI/ML organisation that releases free AI products and developer tools. Releases he worked on: ${RELEASES.map((r) => `${r.name} (${r.kind}): ${r.day}`).join(" ")} ${TEAM_NOTE}`,
  });

  ARCEE_FACTS.forEach((f, i) => chunks.push({ id: `fact-${i}`, title: f.title, url: "/", text: f.text }));

  return chunks;
}

/** Every URL the content mentions: the only links Arcee may show. */
export function allowedUrls(): Set<string> {
  const urls = new Set<string>([
    "https://iteshxt.me",
    SITE.socials.github,
    SITE.socials.linkedin,
    SITE.socials.x,
    DIALABS_URL,
  ]);
  for (const p of [...STAR_PROJECTS, ...ARCHIVE_PROJECTS]) {
    if (p.links.live) urls.add(p.links.live);
    if (p.links.repo) urls.add(p.links.repo);
    p.links.extra?.forEach((l) => urls.add(l.href));
  }
  RELEASES.forEach((r) => r.links.forEach((l) => urls.add(l.href)));
  return urls;
}
