'use client';

import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { BookOpen } from 'lucide-react';

export default function Writings() {
  useKeyboardNav();

  return (
    <section className="relative min-h-screen py-16 sm:py-20 px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto z-10 relative">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">Writings</h1>
        <p className="text-sm sm:text-base text-foreground/60 mb-12 sm:mb-16">
          Shower thoughts and niche things that i find interesting
        </p>

        {/* Under Construction */}
        <div className="flex flex-col items-center justify-center min-h-72 sm:min-h-96 border border-foreground/10 rounded-lg bg-foreground/5 p-6 sm:p-12">
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-foreground/40 mb-4 sm:mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-center">Coming Soon</h2>
          <p className="text-xs sm:text-sm text-foreground/60 text-center max-w-md">
            I'm currently working on it. Check back later!
          </p>
          
        </div>
      </div>
    </section>
  );
}
