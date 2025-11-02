import type { NavItem } from '@/types';

// Navigation items with numbering
export const NAV_ITEMS: NavItem[] = [
    {
        label: 'Home',
        href: '/',
        number: 1,
        shortcut: '1',
    },
    {
        label: 'Experience',
        href: '/experience',
        number: 2,
        shortcut: '2',
    },
    {
        label: 'Projects',
        href: '/projects',
        number: 3,
        shortcut: '3',
    },
    {
        label: 'Writings',
        href: '/writings',
        number: 4,
        shortcut: '4',
    },
    {
        label: 'Contact',
        href: '/contact',
        number: 5,
        shortcut: '5',
    },
];


// Audio settings
export const AUDIO_CONFIG = {
    defaultVolume: 0.3,
    minVolume: 0,
    maxVolume: 1,
    fadeInDuration: 1000, // ms
    fadeOutDuration: 500, // ms
};


// Grid background settings
export const GRID_CONFIG = {
    size: 50, // px
    strokeWidth: 1,
    opacity: 0.1,
};
