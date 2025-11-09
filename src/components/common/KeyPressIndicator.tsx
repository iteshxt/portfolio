'use client';

import { useState, useEffect } from 'react';
import { animated, useSpring } from '@react-spring/web';

export const KeyPressIndicator = () => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleKeyPress = (event: Event) => {
      const customEvent = event as CustomEvent;
      const key = customEvent.detail;
      setPressedKey(key);

      // Hide after 600ms
      setTimeout(() => {
        setPressedKey(null);
      }, 600);
    };

    window.addEventListener('keyPressIndicator', handleKeyPress);
    return () => window.removeEventListener('keyPressIndicator', handleKeyPress);
  }, []);

  const fadeSpring = useSpring({
    opacity: pressedKey ? 1 : 0,
    scale: pressedKey ? 1 : 0.8,
    config: { tension: 300, friction: 25 },
  });

  if (!mounted || !pressedKey) return null;

  return (
    <animated.div
      style={fadeSpring}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-foreground/10 backdrop-blur-sm border border-foreground/20">
        <span className="text-2xl font-bold text-foreground select-none">
          {pressedKey}
        </span>
      </div>
    </animated.div>
  );
};
