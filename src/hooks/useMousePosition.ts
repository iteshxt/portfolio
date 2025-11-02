'use client';

import { useEffect, useState } from 'react';

interface CursorPosition {
    x: number;
    y: number;
}

export const useMousePosition = () => {
    const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) return;

        const handleMouseMove = (e: MouseEvent) => {
            setPosition({
                x: e.clientX,
                y: e.clientY,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isClient]);

    return { x: position.x, y: position.y, isClient };
};
