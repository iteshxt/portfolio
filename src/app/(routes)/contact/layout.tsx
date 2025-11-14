import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact - Itesh Tomar',
  description: 'Get in touch with me. I\'m always interested in new projects and opportunities.',
  path: '/contact',
  keywords: [
    // Itesh + contact context
    "contact Itesh Tomar", "Itesh Tomar email", "Itesh Tomar hire", "Itesh Tomar collaborate",
    "Itesh Singh Tomar contact", "Itesh developer contact",
    "Hitesh Tomar contact", "Nitesh Tomar contact", "Ritesh Tomar contact",
    "Itesh Noida contact", "Itesh India email",
    // Generalized + context
    "hire developer Noida", "contact developer India", "freelance developer Noida",
    "software developer for hire", "developer collaboration India", "work with developer",
    "reach out developer", "message developer", "email developer Noida",
    "project inquiry developer", "developer available for work",
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
