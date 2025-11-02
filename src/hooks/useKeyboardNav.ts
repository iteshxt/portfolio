'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NAV_ITEMS } from '@/lib/constants';

export const useKeyboardNav = () => {
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Keyboard shortcuts 1-5 for navigation
            const key = e.key;
            if (['1', '2', '3', '4', '5'].includes(key)) {
                const navItem = NAV_ITEMS.find((item) => item.shortcut === key);
                if (navItem) {
                    router.push(navItem.href);
                }
            }

            // Escape key can be used to close modals (handled by individual components)
            if (key === 'Escape') {
                // Dispatch custom event for modals to listen to
                window.dispatchEvent(new Event('closeModals'));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);
};
