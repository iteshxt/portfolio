'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ExperienceContextType {
  immersive: boolean;
  toggle: () => void;
}

const ExperienceContext = createContext<ExperienceContextType>({
  immersive: false,
  toggle: () => {},
});

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [immersive, setImmersive] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('experience-mode');
    if (stored === 'immersive') setImmersive(true);
    setHydrated(true);
  }, []);

  const toggle = () => {
    setImmersive((prev) => {
      const next = !prev;
      localStorage.setItem('experience-mode', next ? 'immersive' : 'minimal');
      return next;
    });
  };

  // Prevent flash of wrong mode before hydration
  if (!hydrated) return <>{children}</>;

  return (
    <ExperienceContext.Provider value={{ immersive, toggle }}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  return useContext(ExperienceContext);
}
