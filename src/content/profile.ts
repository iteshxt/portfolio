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
    period: "Aug 2023 – Jun 2027",
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
  {
    name: "Mobile Application Development using Flutter",
    issuer: "Cipher Schools",
    date: "Jul 2025",
    url: "https://www.cipherschools.com/certificate/preview?id=687e15067efd6d5090703c18",
  },
  {
    name: "Cloud Computing",
    issuer: "NPTEL",
    date: "Apr 2025",
    url: "https://archive.nptel.ac.in/noc/Ecertificate/?q=NPTEL25CS11S133730033704237102",
  },
  {
    name: "Computer Communications Specialization",
    issuer: "Coursera",
    date: "Oct 2024",
    url: "https://coursera.org/verify/specialization/JFN3Z245HGHK",
  },
];

export const ACHIEVEMENTS: { title: string; detail: string; url?: string }[] = [
  {
    title: "Co-founder, DiaLabs",
    detail: "An open-source AI/ML organisation releasing free AI products and developer tools.",
    url: "https://github.com/DiaLabs",
  },
  { title: "320+ LeetCode problems", detail: "Consistent practice across DSA and core algorithmic patterns." },
];

/** How he works, each backed by something real in the work. */
export const PRINCIPLES = [
  { line: "Evals before claims.", proof: "Arcee ships against 44 whole-task evals; at Caudal AI Labs the job was evaluating LLM systems." },
  { line: "Write the decision down.", proof: "Arcee's design choices live in numbered decision records, each with what was tried and why." },
  { line: "Small commits, often.", proof: "377 commits in Arcee's first 18 days, every one small enough to read and undo." },
  { line: "Local when it can be.", proof: "Arcee runs fully on Ollama with --core local; DiaChat answers on the visitor's own GPU." },
  { line: "Ship the product around the model.", proof: "PatentIQ is a mentor dashboard, reports and billing, not just a prompt." },
];
