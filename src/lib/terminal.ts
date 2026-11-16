import { EDUCATION, EXPERIENCE } from "@/content/profile";
import { ARCHIVE_PROJECTS, STAR_PROJECTS } from "@/content/projects";
import { SITE } from "@/content/site";
import type { Shift } from "./shift";

/**
 * The hidden terminal's commands (docs/prd.md §6.5, docs/spec.md §9).
 * Pure: takes the input and some context, returns lines to print and an
 * optional action for the UI to perform.
 */

export type TermLine = { text: string; tone?: "muted" | "accent" | "error" | "success" };

export type TermAction =
  | { type: "navigate"; href: string; label: string }
  | { type: "external"; href: string }
  | { type: "shift"; value: Shift }
  | { type: "sound"; muted: boolean }
  | { type: "clear" }
  | { type: "close" }
  | { type: "print" }
  | { type: "scuba" };

export type TermResult = { lines: TermLine[]; action?: TermAction; delay?: number };

export type TermContext = {
  shift: Shift;
  date: Date;
  now?: { repo: string; message: string } | null;
};

const PAGES: Record<string, { href: string; label: string }> = {
  home: { href: "/", label: "Home" },
  work: { href: "/work", label: "Work" },
  about: { href: "/about", label: "About" },
  contact: { href: "/contact", label: "Contact" },
  dialabs: { href: "/dialabs", label: "DiaLabs" },
  arcee: { href: "/work/arcee", label: "Arcee" },
  patentiq: { href: "/work/patentiq", label: "PatentIQ" },
  diachat: { href: "/work/diachat", label: "DiaChat" },
};

const LINKS: Record<string, string> = {
  github: SITE.socials.github,
  linkedin: SITE.socials.linkedin,
  x: SITE.socials.x,
};

export const OPEN_TARGETS = [...Object.keys(PAGES), ...Object.keys(LINKS)];
export const COMMANDS = ["help", "whoami", "ls", "open", "cat", "print", "now", "theme", "sound", "date", "echo", "clear", "exit"];

const line = (text: string, tone?: TermLine["tone"]): TermLine => ({ text, tone });

function help(): TermLine[] {
  return [
    line("commands", "accent"),
    line("  whoami            who is this guy"),
    line("  ls [projects]     look around"),
    line("  open <name>       go somewhere: arcee, work, contact, github…"),
    line("  cat resume        the short version"),
    line("  print             the printable version"),
    line("  now               what he's pushing right now"),
    line("  theme light|dark  switch the theme (peeling is more fun)"),
    line("  sound on|off      ui sounds"),
    line("  date              what time is it, really"),
    line("  clear · exit"),
    line("there are a few more. you'll find them.", "muted"),
  ];
}

function resume(): TermLine[] {
  return [
    line(`${SITE.name} · ${SITE.role}`, "accent"),
    line(SITE.email, "muted"),
    line(""),
    line("experience", "accent"),
    ...EXPERIENCE.map((e) => line(`  ${e.company} · ${e.role} · ${e.period}`)),
    line("star projects", "accent"),
    ...STAR_PROJECTS.map((p) => line(`  ${p.name}: ${p.day}`)),
    line("education", "accent"),
    line(`  ${EDUCATION[0].school} · ${EDUCATION[0].detail} · ${EDUCATION[0].score}`),
    line(""),
    line("tip: `print` gives you a clean one-page version.", "muted"),
  ];
}

export function runCommand(raw: string, ctx: TermContext): TermResult {
  const input = raw.trim();
  if (!input) return { lines: [] };
  const [first, ...rest] = input.split(/\s+/);
  const cmd = first.toLowerCase();
  const arg = rest.join(" ").toLowerCase();

  switch (cmd) {
    case "help":
    case "?":
      return { lines: help() };

    case "whoami":
      return {
        lines: [
          line(SITE.name, "accent"),
          line(`${SITE.role}.`),
          line("co-founder @ DiaLabs · 320+ leetcode · b.tech cse @ lpu"),
          ...(ctx.now ? [line(`currently: ${ctx.now.message} (${ctx.now.repo})`, "muted")] : []),
        ],
      };

    case "ls":
      if (!arg) return { lines: [line("about/  contact/  dialabs/  projects/  resume.txt  secrets/")] };
      if (arg.startsWith("projects")) {
        return {
          lines: [
            ...STAR_PROJECTS.map((p) => line(`★ ${p.slug}`, "accent")),
            line(ARCHIVE_PROJECTS.map((p) => p.slug).join("  ")),
          ],
        };
      }
      if (arg.startsWith("secrets")) return { lines: [line("ls: secrets: permission denied (nice try)", "error")] };
      return { lines: [line(`ls: ${arg}: nothing interesting here`, "muted")] };

    case "cat":
      if (arg === "resume" || arg === "resume.txt") return { lines: resume() };
      if (arg.startsWith("secrets")) return { lines: [line("cat: secrets: permission denied. still.", "error")] };
      return { lines: [line(arg ? `cat: ${arg}: no such file` : "cat: cat what? try `cat resume`", "error")] };

    case "print":
      return { lines: [line("opening the print dialog: one page, no fluff…", "muted")], action: { type: "print" }, delay: 400 };

    case "open": {
      if (!arg) return { lines: [line(`usage: open <${OPEN_TARGETS.join("|")}>`, "muted")] };
      if (PAGES[arg]) return { lines: [line(`opening ${PAGES[arg].label}…`, "muted")], action: { type: "navigate", ...PAGES[arg] }, delay: 300 };
      if (LINKS[arg]) return { lines: [line(`opening ${arg} in a new tab…`, "muted")], action: { type: "external", href: LINKS[arg] } };
      return { lines: [line(`open: ${arg}: not found. try one of: ${OPEN_TARGETS.join(", ")}`, "error")] };
    }

    case "now":
      return {
        lines: ctx.now
          ? [line(`${ctx.now.repo}: ${ctx.now.message}`, "accent")]
          : [line("nothing pushed lately. suspicious.", "muted")],
      };

    case "theme":
    case "shift": {
      // light/dark, or the old day/night (the "shift" command still works).
      const want = arg === "light" || arg === "day" ? "day" : arg === "dark" || arg === "night" ? "night" : null;
      if (!want) return { lines: [line("usage: theme light|dark", "muted")] };
      const label = want === "day" ? "light" : "dark";
      if (want === ctx.shift) return { lines: [line(`already ${label}.`, "muted")] };
      return { lines: [line(`going ${label}…`, "success")], action: { type: "shift", value: want } };
    }

    case "sound":
      if (arg !== "on" && arg !== "off") return { lines: [line("usage: sound on|off", "muted")] };
      return { lines: [line(`sound ${arg}.`, "success")], action: { type: "sound", muted: arg === "off" } };

    case "date": {
      const h = ctx.date.getHours();
      const hh = String(h).padStart(2, "0");
      const mm = String(ctx.date.getMinutes()).padStart(2, "0");
      return {
        lines: [
          line(`${ctx.date.toDateString()} ${hh}:${mm}`),
          line(h >= 2 && h < 5 ? "it's 3am-ish. why are you awake? same." : `the site's in ${ctx.shift === "day" ? "light" : "dark"} mode.`, "muted"),
        ],
      };
    }

    case "echo":
      return { lines: [line(rest.join(" "))] };

    case "clear":
      return { lines: [], action: { type: "clear" } };

    case "exit":
    case "quit":
      return { lines: [line("bye.", "muted")], action: { type: "close" }, delay: 250 };

    case "sudo":
      if (arg === "hire itesh") {
        return {
          lines: [
            line("[sudo] password for recruiter: ********", "muted"),
            line("access granted. excellent decision.", "success"),
            line("opening contact…", "muted"),
          ],
          action: { type: "navigate", href: "/contact", label: "Contact" },
          delay: 1200,
        };
      }
      return { lines: [line("sudo: nice try. this incident will be reported (to nobody).", "error")] };

    case "rm":
      if (rest.some((r) => r.startsWith("-") && r.includes("r"))) {
        return { lines: [line("rm: nice try. permission denied, forever.", "error")] };
      }
      return { lines: [line("rm: missing operand. and missing courage.", "error")] };

    case "scuba":
    case "cat-in-a-mask":
      return { lines: [line("deploying scuba cat…", "success")], action: { type: "scuba" } };

    default:
      return { lines: [line(`command not found: ${first}. try \`help\`.`, "error")] };
  }
}

/** Tab completion for the first word, or for `open`/`ls` arguments. */
export function complete(raw: string): string | null {
  const parts = raw.trimStart().split(/\s+/);
  if (parts.length === 1) {
    const match = COMMANDS.filter((c) => c.startsWith(parts[0].toLowerCase()));
    return match.length === 1 ? `${match[0]} ` : null;
  }
  const [cmd, arg = ""] = parts;
  const pool = cmd === "open" ? OPEN_TARGETS : cmd === "ls" ? ["projects", "secrets"] : cmd === "cat" ? ["resume"] : cmd === "theme" || cmd === "shift" ? ["light", "dark"] : cmd === "sound" ? ["on", "off"] : [];
  const match = pool.filter((t) => t.startsWith(arg.toLowerCase()));
  return match.length === 1 ? `${cmd} ${match[0]}` : null;
}
