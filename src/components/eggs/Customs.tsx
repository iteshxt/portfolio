"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { OpenArceeButton } from "@/components/arcee/OpenArceeButton";
import { ArrowRight, Spark } from "@/components/icons";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { formatVisitDate, PassportStamp, visitorNo } from "@/components/visitors/PassportStamp";
import { STICKER_MOODS, STICKERS, type StickerMood } from "@/lib/arcee/stickers";
import { cn } from "@/lib/cn";
import { markEgg } from "@/lib/eggs";
import { play } from "@/lib/sound";
import { LINE_MAX, NAME_MAX, type SignResponse, type VisitorEntry } from "@/lib/visitors/types";

const VALID = /^[a-z0-9]{4,8}$/;
const SIGNED_KEY = "visitor-stamp";
const REASONS = ["came for the cats", "hiring, maybe", "just looking around", "a friend sent me", "here for Arcee"];

/** Is a stored value really a stamp? (Old shapes, hand edits or junk would crash the card.) */
function isEntry(v: unknown): v is VisitorEntry {
  if (!v || typeof v !== "object") return false;
  const e = v as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    /^[A-Za-z0-9_-]{8,64}$/.test(e.id) &&
    Number.isInteger(e.n) &&
    (e.n as number) > 0 &&
    typeof e.name === "string" &&
    e.name.length > 0 &&
    typeof e.line === "string" &&
    (STICKER_MOODS as readonly string[]).includes(e.cat as string) &&
    (e.d === undefined || (typeof e.d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(e.d))) &&
    (e.tm === undefined || (typeof e.tm === "string" && /^\d{2}:\d{2}$/.test(e.tm)))
  );
}

/** Today on the visitor's own calendar, "YYYY-MM-DD" (the server keeps it if it's within a day of its own). */
function localDate(): string {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}
const noSubscribe = () => () => {};
const pad2 = (n: number) => String(n).padStart(2, "0");
/** The visitor's clock, "HH:MM". */
function localTime(): string {
  const t = new Date();
  return `${pad2(t.getHours())}:${pad2(t.getMinutes())}`;
}
/** This moment on the visitor's own clock, with its offset ("2026-11-17T22:14:05+05:30"): the server keeps their date and time from it. */
function localMoment(): string {
  const t = new Date();
  const off = -t.getTimezoneOffset();
  const a = Math.abs(off);
  return `${localDate()}T${localTime()}:${pad2(t.getSeconds())}${off >= 0 ? "+" : "-"}${pad2(Math.floor(a / 60))}:${pad2(a % 60)}`;
}

/** This phone's stamp, if it already signed the passport (kept in this browser only). */
function readSigned(): VisitorEntry | null {
  try {
    const raw = localStorage.getItem(SIGNED_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (isEntry(value)) return value;
    localStorage.removeItem(SIGNED_KEY);
    return null;
  } catch {
    return null;
  }
}
const subscribeSigned = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
let signedCache: { raw: string | null; entry: VisitorEntry | null } = { raw: null, entry: null };
function signedSnapshot(): VisitorEntry | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(SIGNED_KEY);
  } catch {
    // no storage
  }
  if (raw !== signedCache.raw) signedCache = { raw, entry: readSigned() };
  return signedCache.entry;
}

/**
 * The phone side of the scan egg (docs/design.md §2.17, §2.18): an arrival card at customs.
 * The scan is logged straight away (the screen that showed the code reacts). The card says
 * how many visitors came before, the number this visitor would get and the date and time; then
 * they can sign the visitors' passport: a name, a reason for visit, and the cat that looks
 * most like them as their passport photo. Their stamp prints itself as they type (a light
 * draft), and submitting thumps it in, numbered and dated, while their name prints on the
 * desktop's manifest. One stamp per phone.
 *
 * `total` and `next` come from the passport on the server (next is 0 when it couldn't be read).
 */
export function Customs({ code, total, next }: { code: string; total: number; next: number }) {
  const valid = VALID.test(code);
  const [scan, setScan] = useState<"checking" | "cleared" | "offline">(valid ? "checking" : "offline");
  const saved = useSyncExternalStore(subscribeSigned, signedSnapshot, () => null);
  const today = useSyncExternalStore(noSubscribe, localDate, () => "");
  // The clock the preview stamp prints, kept current while the card is open.
  const [clock, setClock] = useState("");
  useEffect(() => {
    const tick = () => setClock(localTime());
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);
  const [stamped, setStamped] = useState<VisitorEntry | null>(null);
  const [skipped, setSkipped] = useState(false);
  const [name, setName] = useState("");
  const [line, setLine] = useState("");
  const [cat, setCat] = useState<StickerMood | null>(null);
  const [trap, setTrap] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  /** Which field the error is about (the API's errors are about the whole card). */
  const [errorField, setErrorField] = useState<"name" | "cat" | "card" | null>(null);
  const stampedRef = useRef<HTMLHeadingElement>(null);
  const ids = { name: useId(), line: useId(), note: useId(), err: useId() };
  const formRef = useRef<HTMLFormElement>(null);
  const fail = (field: "name" | "cat" | "card", message: string) => {
    setErrorField(field);
    setError(message);
    // Take the visitor to what needs fixing (the error is announced through aria-describedby).
    if (field === "name") document.getElementById(ids.name)?.focus();
    if (field === "cat") formRef.current?.querySelector<HTMLInputElement>('input[name="cat"]')?.focus();
  };
  const clearError = () => {
    setError("");
    setErrorField(null);
  };
  const placeholder = REASONS[code.charCodeAt(0) % REASONS.length] ?? REASONS[0];

  useEffect(() => {
    if (!valid) return;
    markEgg("barcode");
    let cancelled = false;
    fetch("/api/scan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) })
      .then((r) => {
        if (cancelled) return;
        play("found");
        setScan(r.ok ? "cleared" : "offline");
      })
      .catch(() => !cancelled && setScan("offline"));
    return () => {
      cancelled = true;
    };
  }, [code, valid]);

  async function sign(e: FormEvent) {
    e.preventDefault();
    if (sending) return;
    if (!name.trim()) return fail("name", "Your name goes on the stamp. Add one first.");
    if (!cat) return fail("cat", "Pick a cat for your passport photo first.");
    setSending(true);
    clearError();
    try {
      const res = await fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name, line, cat, at: localMoment(), date: localDate(), website: trap }),
      });
      const body = (await res.json().catch(() => null)) as SignResponse | null;
      if (body && body.ok) {
        try {
          localStorage.setItem(SIGNED_KEY, JSON.stringify(body.entry));
        } catch {
          // Without storage, they can still see their stamp now.
        }
        setStamped(body.entry);
        play("found");
      } else {
        fail("card", body?.message ?? "The stamp didn't take. Try again in a moment.");
      }
    } catch {
      fail("card", "Couldn't reach the passport office. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  // The form is gone once stamped: take focus to the stamp's heading so it isn't lost on <body>.
  useEffect(() => {
    if (stamped) stampedRef.current?.focus();
  }, [stamped]);

  const mine = stamped ?? saved;
  // The count from the server doesn't include a stamp made on this page just now.
  const count = total + (stamped ? 1 : 0);
  const number = mine ? mine.n : next;
  const rows: [string, ReactNode][] = [
    ["Visitors so far", count > 0 ? count.toLocaleString("en-US") : "none yet"],
    [
      mine ? "Your number" : "You'd be",
      number > 0 ? (
        <>
          {visitorNo(number)}
          {!mine && <span className="text-fg-muted"> · if you sign</span>}
        </>
      ) : (
        "your own number, once you sign"
      ),
    ],
    ["Arrived", (mine ? [formatVisitDate(mine.d), mine.tm] : [formatVisitDate(today), clock]).filter(Boolean).join(", ") || "today"],
    ["Via", "the manifest on the Work page"],
  ];
  const open = !mine && !skipped && scan !== "offline";

  return (
    <main className="faded-mat px-gutter flex flex-1 flex-col items-center pt-28 pb-36">
      <h1 data-animate="rise" className="font-hand text-[clamp(24px,5vw,32px)] text-accent-text">
        beep. you scanned the manifest.
      </h1>

      <div className="customs-form relative mt-6 w-full max-w-[520px] overflow-hidden rounded-[10px] bg-surface font-mono text-[14px]">
        <div className="flex items-center justify-between bg-ink px-5 py-3 text-[12px] tracking-[0.2em] text-paper uppercase">
          <span>{mine ? "Arrival · cleared" : "Arrival card"}</span>
          <span>iteshxt.me</span>
        </div>
        <dl className="divide-y divide-dashed divide-line px-5">
          {rows.map(([k, v], i) => (
            <div key={k} data-animate="row" style={{ "--d": `${120 + i * 90}ms` } as CSSProperties} className="flex items-baseline justify-between gap-4 py-3">
              <dt className="text-[11px] tracking-[0.18em] text-fg-muted uppercase">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
        </dl>

        {(mine || open) && (
          // Their stamp: a light draft that prints itself as they fill the card in, then thumped in for real.
          <div className="relative border-t-2 border-dashed border-line px-5 pt-5 pb-6">
            {/* The heading and CLEARED share a row, so the stamp never lands on the card's rows or the heading. */}
            <div className="flex min-h-9 items-center justify-between gap-3">
              <h2 ref={stampedRef} tabIndex={-1} className="text-[12px] tracking-[0.16em] text-fg-muted uppercase outline-none">
                {stamped ? "Stamped. Welcome in." : mine ? "Welcome back" : "Your stamp"}
              </h2>
              {mine ? (
                <span
                  aria-hidden="true"
                  className="customs-stamp shrink-0 rounded-[8px] border-[3px] px-2.5 py-0.5 text-[17px] font-bold tracking-[0.16em] sm:text-[20px]"
                >
                  CLEARED
                </span>
              ) : (
                <span aria-hidden="true" className="font-hand text-[18px] text-fg-muted">
                  prints as you fill it in
                </span>
              )}
            </div>
            <div aria-hidden="true" className="passport-paper mt-4 flex min-h-[236px] items-center justify-center rounded-[8px] px-3 py-6">
              {mine ? (
                <PassportStamp key={mine.id} entry={mine} className={stamped ? "visa-stamp-thump" : undefined} />
              ) : (
                <PassportStamp
                  entry={{
                    n: next,
                    name: name.trim(),
                    line: line.trim(),
                    cat: cat ?? undefined,
                    d: today || undefined,
                    tm: clock || undefined,
                  }}
                  draft
                />
              )}
            </div>
            {mine && (
              <p className="mt-4 font-sans text-[15px] leading-relaxed">
                You&apos;re visitor <strong>{visitorNo(mine.n)}</strong> in the visitors&apos; passport
                {stamped ? ", and your name just printed on the screen you scanned from." : "."}
              </p>
            )}
          </div>
        )}
        {!mine && (skipped || scan === "offline") && (
          <div className="flex items-center justify-between gap-4 border-t-2 border-dashed border-line px-5 py-4">
            <p className="text-[12px] leading-relaxed text-fg-muted">
              {scan === "offline"
                ? "The post office is closed right now, so the other screen won't notice and the passport can't take new stamps. You still count."
                : "Cleared. Look at the screen you scanned from: you're on the manifest."}
            </p>
            {/* Beside the message, clear of the card's rows. */}
            {scan === "cleared" && (
              <span
                aria-hidden="true"
                className="customs-stamp my-2 shrink-0 rounded-[8px] border-[3px] px-2.5 py-0.5 text-[17px] font-bold tracking-[0.16em] sm:text-[20px]"
              >
                CLEARED
              </span>
            )}
          </div>
        )}
        {open && (
          <form ref={formRef} onSubmit={sign} noValidate className="border-t-2 border-dashed border-line px-5 pt-5 pb-6 font-sans">
            <p className="font-mono text-[12px] tracking-[0.16em] text-fg-muted uppercase">Sign the visitors&apos; passport</p>
            <div className="mt-4 flex flex-col gap-4">
              <div>
                <label htmlFor={ids.name} className="arrival-label">
                  Name
                </label>
                <input
                  id={ids.name}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errorField === "name") clearError();
                  }}
                  maxLength={NAME_MAX}
                  autoComplete="nickname"
                  required
                  aria-invalid={errorField === "name" || undefined}
                  aria-describedby={errorField === "name" ? ids.err : undefined}
                  className="arrival-input"
                  placeholder="what should the stamp say?"
                />
              </div>
              <div>
                <label htmlFor={ids.line} className="arrival-label">
                  Reason for visit <span className="text-fg-muted">(optional)</span>
                </label>
                <input
                  id={ids.line}
                  value={line}
                  onChange={(e) => setLine(e.target.value)}
                  maxLength={LINE_MAX}
                  autoComplete="off"
                  className="arrival-input"
                  placeholder={placeholder}
                />
              </div>
              <fieldset aria-describedby={errorField === "cat" ? ids.err : undefined}>
                <legend className="arrival-label">Passport photo: the cat that looks most like you</legend>
                <div className="mt-2 grid grid-cols-5 gap-2 sm:grid-cols-9">
                  {STICKER_MOODS.map((m) => (
                    <label key={m} className={cn("arrival-cat", cat === m && "arrival-cat-on")}>
                      <input
                        type="radio"
                        name="cat"
                        value={m}
                        checked={cat === m}
                        onChange={() => {
                          setCat(m);
                          if (errorField === "cat") clearError();
                        }}
                        className="sr-only"
                      />
                      <picture className="contents">
                        <img src={STICKERS[m].still} alt={STICKERS[m].alt} width={56} height={56} className="size-full object-cover" />
                      </picture>
                    </label>
                  ))}
                </div>
              </fieldset>
              {/* Bots fill every field; people never see this one. */}
              <div className="arrival-trap" aria-hidden="true">
                <label>
                  Website
                  <input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
                </label>
              </div>
            </div>
            {error && (
              <p id={ids.err} role="alert" className="mt-4 text-[14px] text-danger">
                {error}
              </p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button type="submit" disabled={sending || scan === "checking"} aria-describedby={ids.note} className="btn btn-violet disabled:opacity-60">
                {sending ? "Stamping…" : "Stamp my passport"}
              </button>
              <button type="button" onClick={() => setSkipped(true)} className="font-hand text-[20px] text-fg-muted underline-offset-4 hover:underline">
                just passing through
              </button>
            </div>
            <p id={ids.note} className="mt-3 text-[13px] leading-relaxed text-fg-muted">
              Your name, reason, cat and the date and time go in the public visitors&apos; passport, and nothing else about you. A scrambled network
              address is kept for a day to stop spam.
            </p>
          </form>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {stamped ? `Stamped. You're visitor ${visitorNo(stamped.n)}.` : scan === "cleared" ? "Cleared by customs." : ""}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {mine && (
          // A full page load, not a client-side hop: the router may hold a copy of the passport from before this stamp.
          <a href={`/visitors?you=${encodeURIComponent(mine.id)}`} className="btn btn-ink">
            See your stamp in the passport
            <ArrowRight />
          </a>
        )}
        {!mine && (
          <TransitionLink href="/visitors" transitionLabel="Visitors" className="btn btn-paper">
            See the passport
          </TransitionLink>
        )}
        <OpenArceeButton seed="I just scanned the manifest. What should I look at?" className="btn btn-lime">
          <Spark />
          Ask Arcee
        </OpenArceeButton>
        <TransitionLink href="/work" transitionLabel="Work" className="btn btn-paper">
          The rest of the shipment
        </TransitionLink>
      </div>
    </main>
  );
}
