'use client';

import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Dark mode' : 'Light mode'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
};
