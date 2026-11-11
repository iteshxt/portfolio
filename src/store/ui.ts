import { create } from "zustand";
import { SHIFT_STORAGE_KEY, type Shift } from "@/lib/shift";

/**
 * Page transition phases (docs/spec.md §5.3):
 * covering → the slap sticker is landing; covered → the screen is hidden and
 * the route can change; revealing → the sticker is peeling away; idle → done.
 * Every full page load starts "covered" because the intro peel reveals it.
 */
export type TransitionPhase = "idle" | "covering" | "covered" | "revealing";

type UIState = {
  shift: Shift;
  transitionPhase: TransitionPhase;
  navOpen: boolean;
  setShift: (shift: Shift, options?: { persist?: boolean }) => void;
  syncShiftFromDom: () => void;
  setTransitionPhase: (phase: TransitionPhase) => void;
  setNavOpen: (open: boolean) => void;
};

export function applyShiftToDom(shift: Shift) {
  document.documentElement.dataset.shift = shift;
}

export const useUI = create<UIState>((set) => ({
  shift: "day",
  transitionPhase: "covered",
  navOpen: false,
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
}));

export const otherShift = (shift: Shift): Shift => (shift === "day" ? "night" : "day");
