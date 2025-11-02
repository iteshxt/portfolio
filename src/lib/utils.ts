// Animation utility functions and helpers

export const generateRandomDuration = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
};

export const generateRandomDelay = (max: number): number => {
    return Math.random() * max;
};

export const generateRandomPosition = (
    min: number,
    max: number
): { x: number; y: number } => {
    return {
        x: Math.random() * (max - min) + min,
        y: Math.random() * (max - min) + min,
    };
};

export const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

// Format nav item label with number
export const formatNavLabel = (number: number, label: string): string => {
    return `${String(number).padStart(2, '0')}. ${label}`;
};
