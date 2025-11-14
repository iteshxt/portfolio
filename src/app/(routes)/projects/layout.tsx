import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Projects - Itesh Tomar',
  description: 'Explore my portfolio of web development and software engineering projects built with modern technologies.',
  path: '/projects',
  keywords: [
    // Itesh + projects context
    'Itesh Tomar projects', 'Itesh Tomar portfolio', 'Itesh Tomar work',
    'Itesh Singh Tomar projects', 'Itesh developer projects',
    'Hitesh Tomar projects', 'Nitesh Tomar projects', 'Ritesh Tomar projects',
    'Itesh Noida portfolio', 'Itesh India projects',
    // Generalized + context
    'web developer portfolio', 'developer projects India', 'software engineer projects',
    'React projects portfolio', 'Next.js projects', 'Node.js projects India',
    'full stack projects Noida', 'web application projects',
    'GitHub projects developer', 'portfolio projects', 'developer portfolio website',
    'custom web projects', 'web development portfolio Noida',
  ],
  type: 'website',
});

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
