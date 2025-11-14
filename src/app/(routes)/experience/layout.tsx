import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Experience - Itesh Tomar',
  description: 'My professional journey, work experience, and skills in software development.',
  path: '/experience',
  keywords: [
    // Itesh + experience context
    'Itesh Tomar experience', 'Itesh Tomar work', 'Itesh Tomar skills', 'Itesh Tomar resume',
    'Itesh Singh Tomar experience', 'Itesh developer experience',
    'Hitesh Tomar experience', 'Nitesh Tomar experience', 'Ritesh Tomar experience',
    'Itesh Noida developer', 'Itesh India experience',
    // Generalized + context
    'software developer experience Noida', 'full stack developer skills India',
    'web developer experience', 'developer skills India',
    'React developer experience', 'Next.js developer skills', 'Node.js experience Noida',
    'TypeScript developer', 'Python developer skills',
    'professional developer experience', 'developer portfolio experience',
    'work history developer', 'resume software developer',
  ],
  type: 'website',
});

export default function ExperienceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
