/**
 * Arcee's cat stickers by mood (docs/design.md §8). These are placeholder
 * cats drawn for the site; Itesh's own WhatsApp-style set replaces them by
 * dropping files with the same names into public/stickers/.
 */
export const STICKER_MOODS = ["happy", "smug", "thinking", "shocked", "sleepy", "love", "nope"] as const;
export type StickerMood = (typeof STICKER_MOODS)[number];

export const STICKERS: Record<StickerMood, { src: string; alt: string }> = {
  happy: { src: "/stickers/happy.svg", alt: "A happy cat" },
  smug: { src: "/stickers/smug.svg", alt: "A smug cat" },
  thinking: { src: "/stickers/thinking.svg", alt: "A thinking cat" },
  shocked: { src: "/stickers/shocked.svg", alt: "A shocked cat" },
  sleepy: { src: "/stickers/sleepy.svg", alt: "A sleepy cat" },
  love: { src: "/stickers/love.svg", alt: "A cat with heart eyes" },
  nope: { src: "/stickers/nope.svg", alt: "A cat saying nope" },
};
