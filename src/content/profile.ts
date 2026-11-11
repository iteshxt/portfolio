/**
 * Experience, education, skills and achievements, from Itesh's CV
 * (Nov 2026) — docs/prd.md §5.4–5.6. Day = what, night = how.
 */

export type Experience = {
  company: string;
  role: string;
  period: string;
  link?: string;
  day: string[];
  night: string[];
};

export const EXPERIENCE: Experience[] = [
  {
    company: "Caudal AI Labs",
    role: "AI Systems Evaluation Intern",
    period: "Jul 2026 – Sep 2026",
    day: [
      "Evaluated LLM systems for accuracy, originality, quality and instruction compliance.",
      "Documented model behaviour, edge cases and failure patterns for quality assurance.",
    ],
    night: [
      "Engineered prompt-driven evaluation workflows with structured testing and analytical review.",
      "Turned inconsistencies and failure modes into feedback for iterative model improvement.",
    ],
  },
  {
    company: "Sutr Clothing",
    role: "Full Stack Developer",
    period: "Apr 2025 – Nov 2025",
    link: "https://sutr.store",
    day: [
      "Built production web workflows serving 500+ monthly customers.",
      "Improved customer and admin workflows across payments, cart and fulfilment.",
    ],
    night: [
      "Integrated Razorpay payment verification and Ekart logistics APIs with error handling across order and delivery flows.",
      "500 ms cart sync, reusable React components and validation-driven UI testing.",
    ],
  },
];

export type Education = { school: string; detail: string; period: string; place: string; score: string };

export const EDUCATION: Education[] = [
  {
    school: "Lovely Professional University",
    detail: "B.Tech, Computer Science & Engineering",
    period: "Aug 2023 – present",
    place: "Phagwara, Punjab",
    score: "CGPA 8.53",
  },
  {
    school: "Kiddys Corner Hr Sec School",
    detail: "Intermediate",
    period: "Apr 2021 – Mar 2022",
    place: "Gwalior, Madhya Pradesh",
    score: "78%",
  },
  {
    school: "Amar Public School",
    detail: "Matriculation",
    period: "Apr 2019 – Mar 2020",
    place: "Gwalior, Madhya Pradesh",
    score: "90%",
  },
];

export const SKILLS: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript"] },
  { group: "AI", items: ["PyTorch", "LLMs", "Fine-tuning", "RAG", "On-device inference"] },
  { group: "Web", items: ["Next.js", "React", "Node.js", "Express", "Tailwind CSS", "REST APIs"] },
  { group: "Data and tools", items: ["MongoDB", "MySQL", "Firebase", "Docker", "Git", "Linux"] },
];

export type Certificate = { name: string; issuer: string; date: string; url?: string };

export const CERTIFICATES: Certificate[] = [
  { name: "Mobile Application Development using Flutter", issuer: "Cipher Schools", date: "Jul 2025" },
  { name: "Cloud Computing", issuer: "NPTEL", date: "Apr 2025" },
  { name: "Computer Communications Specialization", issuer: "Coursera", date: "Oct 2024" },
];

export const ACHIEVEMENTS: { title: string; detail: string; url?: string }[] = [
  {
    title: "Co-founder, DiaLabs",
    detail: "An open-source AI/ML organisation releasing free AI products and developer tools.",
    url: "https://github.com/DiaLabs",
  },
  { title: "320+ LeetCode problems", detail: "Consistent practice across DSA and core algorithmic patterns." },
];
