/**
 * Subtle UI sounds (docs/design.md §9, docs/spec.md §10), synthesised with
 * WebAudio so there are no audio files to download. Quiet, short (< 0.4 s),
 * never before the first interaction, never while muted or the tab is hidden.
 */

export type SoundName = "peel" | "slap" | "open" | "close" | "select" | "key" | "found" | "bubble" | "flick";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

export function setSoundMuted(value: boolean) {
  muted = value;
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Resume the audio context on the first real interaction (autoplay rules). */
export function unlockSoundOnFirstGesture() {
  if (typeof window === "undefined") return;
  const unlock = () => {
    if (ctx?.state === "suspended") void ctx.resume();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

function noise(a: AudioContext, seconds: number, decay = 1.5): AudioBufferSourceNode {
  const length = Math.floor(a.sampleRate * seconds);
  const buffer = a.createBuffer(1, length, a.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
  const src = a.createBufferSource();
  src.buffer = buffer;
  return src;
}

function tone(a: AudioContext, type: OscillatorType, from: number, to: number, start: number, dur: number, gain: number) {
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, start);
  osc.frequency.exponentialRampToValueAtTime(to, start + dur);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(gain, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(g).connect(master!);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

export function play(name: SoundName) {
  if (muted || typeof document === "undefined" || document.hidden) return;
  const a = audio();
  if (!a || !master || a.state !== "running") return;
  const t = a.currentTime;

  switch (name) {
    case "peel": {
      const src = noise(a, 0.42, 1.6);
      const filter = a.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 1.2;
      filter.frequency.setValueAtTime(700, t);
      filter.frequency.exponentialRampToValueAtTime(3400, t + 0.38);
      const g = a.createGain();
      g.gain.value = 0.16;
      src.connect(filter).connect(g).connect(master);
      src.start(t);
      break;
    }
    case "slap": {
      tone(a, "sine", 170, 55, t, 0.16, 0.45);
      const click = noise(a, 0.05, 3);
      const hp = a.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 1800;
      const g = a.createGain();
      g.gain.value = 0.12;
      click.connect(hp).connect(g).connect(master);
      click.start(t);
      break;
    }
    case "open":
      tone(a, "sine", 520, 780, t, 0.09, 0.12);
      break;
    case "close":
      tone(a, "sine", 780, 520, t, 0.09, 0.1);
      break;
    case "select":
      tone(a, "triangle", 880, 880, t, 0.07, 0.08);
      tone(a, "triangle", 1320, 1320, t + 0.06, 0.08, 0.07);
      break;
    case "key": {
      const click = noise(a, 0.025, 4);
      const hp = a.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 2200 + Math.random() * 800;
      const g = a.createGain();
      g.gain.value = 0.05;
      click.connect(hp).connect(g).connect(master);
      click.start(t);
      break;
    }
    case "found":
      [523, 659, 784, 1046].forEach((f, i) => tone(a, "triangle", f, f, t + i * 0.08, 0.12, 0.08));
      break;
    case "bubble":
      tone(a, "sine", 280 + Math.random() * 120, 900 + Math.random() * 300, t, 0.12, 0.06);
      break;
    case "flick": {
      // A short paper flutter for a sticker knocked by the cursor.
      const src = noise(a, 0.09, 2.2);
      const filter = a.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 2.5;
      filter.frequency.setValueAtTime(2400 + Math.random() * 600, t);
      filter.frequency.exponentialRampToValueAtTime(1300, t + 0.08);
      const g = a.createGain();
      g.gain.value = 0.07;
      src.connect(filter).connect(g).connect(master);
      src.start(t);
      break;
    }
  }
}
