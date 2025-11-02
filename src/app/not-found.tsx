'use client';

import Link from 'next/link';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  useKeyboardNav();

  return (
    <section className="relative min-h-screen py-20 px-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto z-10 relative">
        {/* 404 Content */}
        <div className="text-center">
          {/* Large 404 */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[150px] font-bold text-foreground/90 mb-2 tracking-tighter">
              404
            </h1>
            <div className="h-1 w-24 mx-auto bg-foreground/30 rounded-full mb-8"></div>
          </div>

          {/* Message */}
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Page Not Found</h2>
          
          <p className="text-lg text-foreground/70 mb-8 max-w-md mx-auto">
            Looks like you've ventured into uncharted territory. This page doesn't exist, but there's plenty to explore elsewhere!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-foreground text-background hover:bg-foreground/90 rounded-lg font-semibold transition-all hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-6 py-3 border border-foreground/30 hover:bg-foreground/10 rounded-lg font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Fun message */}
          <div className="mt-12 p-6 bg-foreground/5 rounded-lg border border-foreground/10">
            <p className="text-sm text-foreground/60 italic">
              💡 Tip: Try pressing <span className="font-mono font-semibold">1</span>, <span className="font-mono font-semibold">2</span>, <span className="font-mono font-semibold">3</span>, or <span className="font-mono font-semibold">4</span> to navigate quickly!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
