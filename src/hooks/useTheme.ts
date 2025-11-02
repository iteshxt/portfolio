'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check localStorage or system preference
        const stored = localStorage.getItem('theme') as Theme | null;
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)')
            .matches
            ? 'dark'
            : 'light';

        const initialTheme = stored || systemPreference;
        setTheme(initialTheme);
        applyTheme(initialTheme);
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
            return newTheme;
        });
    };

    const applyTheme = (theme: Theme) => {
        const html = document.documentElement;
        html.classList.remove('light', 'dark');
        html.classList.add(theme);
    };

    return { theme, toggleTheme, mounted };
};
