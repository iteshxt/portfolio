import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Writings - Itesh Tomar',
  description: 'Shower thoughts and niche things that I find interesting.',
  path: '/writings',
  keywords: [
    // Itesh + writings context
    'Itesh Tomar blog', 'Itesh Tomar writings', 'Itesh Tomar articles', 'Itesh Tomar thoughts',
    'Itesh Singh Tomar blog', 'Itesh developer blog',
    'Hitesh Tomar blog', 'Nitesh Tomar blog', 'Ritesh Tomar blog',
    // Generalized + context
    'developer blog', 'tech blog India', 'software developer writing',
    'programming blog developer', 'web developer articles', 'tech thoughts developer',
    'developer insights', 'software engineering thoughts', 'developer perspective',
    'tech writing Noida', 'developer thoughts India',
  ],
  type: 'website',
});

export default function WritingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
