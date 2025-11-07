'use client';

import Link from 'next/link';
import { Github, Code2, Linkedin, Mail, BookOpen } from 'lucide-react';

// Codilio Icon Component (using a code brackets icon)
const CodilioIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const SOCIAL_LINKS = [
  {
    icon: Github,
    href: 'https://github.com/iteshxt',
    label: 'GitHub',
    target: '_blank',
  },
  {
    icon: Code2,
    href: 'https://leetcode.com/iteshxt',
    label: 'LeetCode',
    target: '_blank',
  },
  {
    icon: BookOpen,
    href: 'https://codolio.com/profile/iteshxt',
    label: 'Codolio',
    target: '_blank',
  },
  {
    icon: Linkedin,
    href: 'https://linkedin.com/in/iteshxt',
    label: 'LinkedIn',
    target: '_blank',
  },
  {
    icon: Mail,
    href: 'mailto:iteshxt@gmail.com',
    label: 'Email',
    target: '_self',
  },
];

export const SocialLinks = () => {
  return (
    <div className="fixed left-3 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 hidden md:block">
      <style>{`
        .social-links-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2rem;
        }
        
        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.5rem;
          color: hsl(var(--foreground) / 0.7);
          gap: 0.75rem;
          padding: 0 0.625rem;
          transition: all 0.3s ease-out;
        }
        
        .social-link:hover {
          width: auto;
          color: hsl(var(--foreground));
        }
        
        .social-link:hover span {
          opacity: 1;
        }
        
        .social-link span {
          opacity: 0;
          transition: opacity 0.3s ease-out;
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .social-link svg {
          flex-shrink: 0;
          width: 1.25rem;
          height: 1.25rem;
        }
      `}</style>
      
      <div className="social-links-container">
        {SOCIAL_LINKS.map((social) => {
          const Icon = social.icon;
          return (
            <Link
              key={social.label}
              href={social.href}
              target={social.target}
              rel={social.target === '_blank' ? 'noopener noreferrer' : undefined}
              className="social-link"
            >
              <Icon />
              <span>{social.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
