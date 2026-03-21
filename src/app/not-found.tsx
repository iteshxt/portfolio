'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { CrosshairCursor } from './page';

export default function NotFound() {
  useEffect(() => {
    if (localStorage.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <>
      <CrosshairCursor />
      <section className="relative min-h-screen py-20 px-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto z-10 relative text-center">
        <h1 className="display-huge mb-4" style={{ color: 'var(--foreground)' }}>
          404
        </h1>
        <div className="w-16 h-0.5 mx-auto mb-8" style={{ background: 'var(--accent)' }} />

        <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-base mb-8" style={{ color: 'var(--muted)' }}>
          Looks like you&apos;ve ventured into uncharted territory.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/" className="btn-primary">
            <Home className="w-4 h-4" /> BACK TO HOME
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" /> GO BACK
          </button>
        </div>
      </div>
    </section>
    </>
  );
}
