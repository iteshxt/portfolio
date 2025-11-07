'use client';

import { GridBackground } from './GridBackground';
import { GRID_CONFIG } from '@/lib/constants';

export const Background = ({ theme }: { theme: 'light' | 'dark' }) => {
  return (
    <>
      {/* Grid background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-10">
        <GridBackground theme={theme} />
      </div>
    </>
  );
};
