'use client';

import { GridBackground } from './GridBackground';
import DotGrid from './DotGrid';
import { GRID_CONFIG } from '@/lib/constants';

export const Background = ({ theme }: { theme: 'light' | 'dark' }) => {
  return (
    <>
      {/* Grid background - fixed to viewport */}
      <div className="fixed inset-0 w-full h-screen pointer-events-none z-10">
        <GridBackground theme={theme} />
      </div>
      
      {/* Interactive Dot Grid - below other elements but above grid */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none z-15 top-0 left-0">
        <DotGrid
          dotSize={5}
          gap={GRID_CONFIG.size}
          baseColor={theme === 'light' ? '#e4e4e7' : '#5227FF'}
          activeColor={theme === 'light' ? '#d4d4d8' : '#8b5cf6'}
          proximity={120}
          shockRadius={300}
          shockStrength={4}
          resistance={100}
          returnDuration={0.5}
        />
      </div>
    </>
  );
};
