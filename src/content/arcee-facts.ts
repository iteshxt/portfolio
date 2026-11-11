/**
 * Extra facts for Arcee, the site's chatbot (docs/spec.md §8.3), beyond what
 * the project and profile content already says. Only things Itesh has stated
 * or that the repos show. Anything not here or in the content is "not shared".
 */
export const ARCEE_FACTS: { title: string; text: string }[] = [
  {
    title: "Contacting Itesh",
    text: "The best way to reach Itesh is email at iteshxt@gmail.com. He's also on LinkedIn (linkedin.com/in/iteshxt), GitHub (github.com/iteshxt) and X (@iteshxt). Visitors can also leave a message through Arcee, which emails it to him. For availability, roles or rates, ask him directly.",
  },
  {
    title: "About this website",
    text: "iteshxt.me is built with Next.js, React, TypeScript, Tailwind CSS, GSAP and three.js, and hosted on Vercel. It has two shifts: by day it shows what Itesh builds, by night it shows how it works. You switch shifts by peeling the top-right corner of the page like a sticker. It has a few easter eggs, including a hidden terminal (press ~).",
  },
  {
    title: "Small tools with personality",
    text: "Itesh also builds small tools for himself: a Chrome extension that logs into the LPU campus Wi-Fi automatically, a GNOME Files right-click entry for opening folders in Antigravity, and a scuba-diving cat boot animation for Linux.",
  },
  {
    title: "Aliases",
    text: "Itesh sometimes publishes as 'petrioteer', for example the dia-convo-v1.2c model on Hugging Face.",
  },
];
