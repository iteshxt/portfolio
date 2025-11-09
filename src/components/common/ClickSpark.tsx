'use client';

import React, { useRef, useEffect, useCallback, useState, forwardRef, useImperativeHandle } from 'react';
import { useTheme } from '@/hooks/useTheme';

export interface ClickSparkRef {
  toggleSound: () => void;
  isSoundMuted: boolean;
}

// Global mute state
let globalSoundMuted = typeof window !== 'undefined' ? localStorage.getItem('soundMuted') === 'true' : false;

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  extraScale?: number;
  children?: React.ReactNode;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

const ClickSpark = forwardRef<ClickSparkRef, ClickSparkProps>(
  ({
    sparkColor = '#fff',
    sparkSize = 10,
    sparkRadius = 15,
    sparkCount = 8,
    duration = 400,
    easing = 'ease-out',
    extraScale = 1.0,
    children
  }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState(globalSoundMuted);
  const [mounted, setMounted] = useState(false);

  // Expose toggleSound to parent
  useImperativeHandle(ref, () => ({
    toggleSound,
    get isSoundMuted() {
      return globalSoundMuted;
    }
  }));

  // Initialize audio
  useEffect(() => {
    setMounted(true);
    
    // Create audio element
    if (!audioRef.current) {
      const audio = new Audio('/audio/bloop-sound.mp3');
      audio.loop = false;
      audio.volume = 0.5;
      audioRef.current = audio;
    }

    // Listen for storage changes (when mute is toggled in another tab or component)
    const handleStorageChange = () => {
      const storedMuted = localStorage.getItem('soundMuted') === 'true';
      globalSoundMuted = storedMuted;
      setIsSoundMuted(storedMuted);
    };

    // Listen for custom sound mute toggle event
    const handleSoundToggle = (event: any) => {
      globalSoundMuted = event.detail;
      setIsSoundMuted(event.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('soundMuteToggle', handleSoundToggle);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('soundMuteToggle', handleSoundToggle);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let resizeTimeout: NodeJS.Timeout;

    const resizeCanvas = () => {
      const { width, height } = parent.getBoundingClientRect();
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    const ro = new ResizeObserver(handleResize);
    ro.observe(parent);

    resizeCanvas();

    return () => {
      ro.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, []);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case 'linear':
          return t;
        case 'ease-in':
          return t * t;
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const draw = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark: Spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) {
          return false;
        }

        const progress = elapsed / duration;
        const eased = easeFunc(progress);

        const distance = eased * sparkRadius * extraScale;
        const lineLength = sparkSize * (1 - eased);

        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easeFunc, extraScale]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = performance.now();
    const newSparks: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
      x,
      y,
      angle: (2 * Math.PI * i) / sparkCount,
      startTime: now
    }));

    sparksRef.current.push(...newSparks);
    
    // Play sound if not muted (use global state)
    if (!globalSoundMuted && audioRef.current && mounted) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        console.log('Could not play sound');
      });
    }
  };

  const toggleSound = () => {
    globalSoundMuted = !globalSoundMuted;
    setIsSoundMuted(globalSoundMuted);
    localStorage.setItem('soundMuted', globalSoundMuted ? 'true' : 'false');
  };

  return (
    <div className="relative w-full h-full" onClick={handleClick}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      {children}
    </div>
  );
}
);

export default ClickSpark;
