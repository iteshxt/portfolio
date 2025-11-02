'use client';

import Link from 'next/link';
import { Heart, Github, Code2, Linkedin, Mail, BookOpen } from 'lucide-react';

// Codilio Icon Component
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
  { icon: Github, href: 'https://github.com/iteshxt', label: 'GitHub' },
  { icon: Code2, href: 'https://leetcode.com/iteshxt', label: 'LeetCode' },
  { icon: BookOpen, href: 'https://codolio.com/profile/iteshxt', label: 'Codolio' },
  { icon: Linkedin, href: 'https://linkedin.com/in/iteshxt', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:iteshxt@gmail.com', label: 'Email' },
];

export const Footer = () => {
  return (
    <footer className="w-full flex flex-col items-center justify-center py-3 md:py-8 z-20 gap-3 md:gap-6">
      {/* Mobile social links (visible only on small screens) */}
      <div className="md:hidden flex items-center gap-4 flex-wrap justify-center">
        {SOCIAL_LINKS.map((social) => {
          const Icon = social.icon;
          return (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              title={social.label}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-foreground/60 hover:text-foreground hover:bg-foreground/10 transition-all"
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </div>

      {/* Desktop footer text */}
      <Link
        href="https://github.com/iteshxt"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground transition-colors"
      >
        <span>Designed and Built with</span>
        <Heart className="w-4 h-4 fill-foreground/60 text-foreground/60" />
        <span>by Itesh</span>
      </Link>
    </footer>
  );
};