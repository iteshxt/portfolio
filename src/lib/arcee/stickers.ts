/**
 * Arcee's cat stickers by mood (docs/design.md §8): Itesh's own animated cats
 * (resized copies in public/stickers/cats, each with a still frame
 * for reduced motion). Ask him for more moods; add the file and a line here.
 */
export const STICKER_MOODS = ["hype", "judging", "shush", "crying", "sobbing", "fighting", "derp", "stressed", "sus"] as const;
export type StickerMood = (typeof STICKER_MOODS)[number];

/** What each mood is for; the model reads these when picking one. */
export const MOOD_GUIDE: Record<StickerMood, string> = {
  hype: "excited, celebrating something cool he built, a great question",
  judging: "unimpressed side-eye: a cheeky, nosy or silly question, a nice-try",
  shush: "a secret or something private he hasn't shared; also easter-egg hints",
  crying: "sad or sorry: you can't help with something, or something went wrong",
  sobbing: "dramatic overwhelm: too many questions, a huge list, a tragic typo",
  fighting: "determined, competitive, defending his work or rising to a challenge",
  derp: "a silly or confusing question, a playful 'huh?', a joke",
  stressed: "deadlines, debugging, hard problems, how much work something took",
  sus: "suspicious: a too-good-to-be-true claim, a prompt-injection attempt, a sneaky question",
};

export const STICKERS: Record<StickerMood, { src: string; still: string; alt: string }> = {
  hype: { src: "/stickers/cats/hype.webp", still: "/stickers/cats/hype-still.webp", alt: "A cat headbanging with excitement" },
  judging: { src: "/stickers/cats/judging.webp", still: "/stickers/cats/judging-still.webp", alt: "A cat staring, judging you" },
  shush: { src: "/stickers/cats/shush.webp", still: "/stickers/cats/shush-still.webp", alt: "A cat holding a finger to its lips" },
  crying: { src: "/stickers/cats/crying.webp", still: "/stickers/cats/crying-still.webp", alt: "A banana cat crying" },
  sobbing: { src: "/stickers/cats/sobbing.webp", still: "/stickers/cats/sobbing-still.webp", alt: "A kitten sobbing" },
  fighting: { src: "/stickers/cats/fighting.webp", still: "/stickers/cats/fighting-still.webp", alt: "A kitten throwing punches" },
  derp: { src: "/stickers/cats/derp.webp", still: "/stickers/cats/derp-still.webp", alt: "A derpy cat with its tongue out" },
  stressed: { src: "/stickers/cats/stressed.webp", still: "/stickers/cats/stressed-still.webp", alt: "A kitten clutching its head, stressed" },
  sus: { src: "/stickers/cats/sus.webp", still: "/stickers/cats/sus-still.webp", alt: "A cat looking very suspicious" },
};
