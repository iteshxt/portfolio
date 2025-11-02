import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact - Itesh Tomar',
  description: 'Get in touch with me for freelance projects, collaborations, or opportunities. I\'m always interested in hearing about new ideas and working on exciting projects.',
  path: '/contact',
  keywords: [
    "Itesh Tomar",
    "iteshxt",
    "Itesh Singh Tomar",
    "Software Engineer",
    "Itesh Tomar LPU",
    "Itesh Noida",
    "Itesh CSE",
    "Itesh Tomar Portfolio",
    "Itesh Tomar Projects",
    "Itesh Tomar Blog",
    "Itesh Tomar Experience",
    "Itesh Tomar AI",
    "Itesh Tomar Machine Learning",
    "Itesh Tomar Next.js",
    "Itesh Tomar React",
    "Itesh Tomar Node.js",
    "Itesh Tomar TypeScript",
    "Itesh Singh Tomar Portfolio",
    "Itesh Singh Tomar Projects",
    "Itesh Singh Tomar Blog",
    "Itesh Singh Tomar Experience",
    "Itesh Singh Tomar AI",
    "Itesh Singh Tomar Machine Learning",
    "Itesh Singh Tomar Next.js",
    "Itesh Singh Tomar React",
    "Itesh Singh Tomar Node.js",
    "Itesh Singh Tomar TypeScript", 
    "Itesh linkedin",
    "Itesh github",
    "Itesh twitter",
    "Itesh developer",
    "Itesh programmer",
    "Itesh web developer",
    "Itesh full-stack developer",
    "Itesh AI engineer",
    "Itesh ML engineer",
    "Itesh software developer",
    "Itesh tech blog",
    "Itesh coding",
    "Itesh open source",
    "Itesh freelance developer",
    "Itesh portfolio website",
    "Itesh personal website",
    "iteshxt portfolio",
    "iteshxt projects",
    "iteshxt blog",
    "iteshxt experience",
    "iteshxt AI",
    "iteshxt github",
    "iteshxt linkedin",
    "iteshxt twitter"
    
  ],
  type: 'website',
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
