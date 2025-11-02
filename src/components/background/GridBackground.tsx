'use client';

import { GRID_CONFIG } from '@/lib/constants';

export const GridBackground = ({ theme }: { theme: 'light' | 'dark' }) => {
  const opacity = theme === 'light' ? 0.15 : 0.12;

  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="grid"
          width={GRID_CONFIG.size}
          height={GRID_CONFIG.size}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${GRID_CONFIG.size} 0 L 0 0 0 ${GRID_CONFIG.size}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={GRID_CONFIG.strokeWidth}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
};
