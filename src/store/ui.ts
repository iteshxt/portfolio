import { create } from "zustand";
import { SHIFT_STORAGE_KEY, type Shift } from "@/lib/shift";
import { setSoundMuted } from "@/lib/sound";

/**
 * Page transition phases (docs/spec.md §5.3):
 * covering → the slap sticker is landing; covered → the screen is hidden and
 * the route can change; revealing → the sticker is peeling away; idle → done.
 * Every full page load starts "covered" because the intro peel reveals it.
 */
export type TransitionPhase = "idle" | "covering" | "covered" | "revealing";

export type Toast = { id: number; title: string; body?: string };

const MUTED_KEY = "muted";

type UIState = {
  shift: Shift;
  transitionPhase: TransitionPhase;
  navOpen: boolean;
  terminalOpen: boolean;
  /** Arcee chat panel, plus a question to send as soon as it opens. */
  arceeOpen: boolean;
  arceeSeed: string | null;
  /** Heavy overlays load on first use, then stay mounted to keep their state. */
  arceeMounted: boolean;
  terminalMounted: boolean;
  muted: boolean;
  toasts: Toast[];
  openArcee: (seed?: string) => void;
  closeArcee: () => void;
  takeArceeSeed: () => string | null;
  setShift: (shift: Shift, options?: { persist?: boolean }) => void;
  syncShiftFromDom: () => void;
  setTransitionPhase: (phase: TransitionPhase) => void;
  setNavOpen: (open: boolean) => void;
  setTerminalOpen: (open: boolean) => void;
  setMuted: (muted: boolean) => void;
  hydrateMuted: () => void;
  pushToast: (title: string, body?: string) => void;
  dismissToast: (id: number) => void;
};

export function applyShiftToDom(shift: Shift) {
  document.documentElement.dataset.shift = shift;
}

let toastId = 0;

export const useUI = create<UIState>((set, get) => ({
  shift: "day",
  transitionPhase: "covered",
  navOpen: false,
  terminalOpen: false,
  arceeOpen: false,
  arceeSeed: null,
  arceeMounted: false,
  terminalMounted: false,
  muted: false,
  toasts: [],
  openArcee: (seed) => set({ arceeOpen: true, arceeMounted: true, arceeSeed: seed?.trim() || null, navOpen: false }),
  closeArcee: () => set({ arceeOpen: false }),
  takeArceeSeed: () => {
    const seed = get().arceeSeed;
    if (seed) set({ arceeSeed: null });
    return seed;
  },
  setShift: (shift, options) => {
    applyShiftToDom(shift);
    if (options?.persist !== false) {
      try {
        localStorage.setItem(SHIFT_STORAGE_KEY, shift);
      } catch {
        // Storage can be unavailable (private mode); the shift still applies.
      }
    }
    set({ shift });
  },
  syncShiftFromDom: () => {
    const shift = document.documentElement.dataset.shift === "night" ? "night" : "day";
    set({ shift });
  },
  setTransitionPhase: (transitionPhase) => set({ transitionPhase }),
  setNavOpen: (navOpen) => set({ navOpen }),
  setTerminalOpen: (terminalOpen) => set(terminalOpen ? { terminalOpen, terminalMounted: true } : { terminalOpen }),
  setMuted: (muted) => {
    setSoundMuted(muted);
    try {
      localStorage.setItem(MUTED_KEY, muted ? "1" : "0");
    } catch {
      // Ignore storage errors; the choice still applies for this visit.
    }
    set({ muted });
  },
  hydrateMuted: () => {
    let muted = false;
    try {
      muted = localStorage.getItem(MUTED_KEY) === "1";
    } catch {
      muted = false;
    }
    setSoundMuted(muted);
    set({ muted });
  },
  pushToast: (title, body) => {
    const id = ++toastId;
    set({ toasts: [...get().toasts, { id, title, body }].slice(-3) });
    window.setTimeout(() => get().dismissToast(id), 6000);
  },
  dismissToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

export const otherShift = (shift: Shift): Shift => (shift === "day" ? "night" : "day");
