'use client';

import { useEffect, useRef, useState } from 'react';

export const useAudio = (src: string) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        if (!audioRef.current) {
            const audio = new Audio(src);
            audio.loop = true;
            audio.volume = volume;
            audioRef.current = audio;
        }

        const storedVolume = localStorage.getItem('audioVolume');
        if (storedVolume) {
            const vol = parseFloat(storedVolume);
            setVolume(vol);
            if (audioRef.current) {
                audioRef.current.volume = vol;
            }
        }

        const storedIsPlaying = localStorage.getItem('audioPlaying');
        if (storedIsPlaying === 'true' && audioRef.current) {
            audioRef.current.play().catch(() => {
                // Browser may block autoplay
                console.log('Autoplay prevented by browser');
            });
            setIsPlaying(true);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [src]);

    const togglePlay = () => {
        if (!audioRef.current || !mounted) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            localStorage.setItem('audioPlaying', 'false');
        } else {
            audioRef.current.play().catch(() => {
                console.log('Playback failed');
            });
            setIsPlaying(true);
            localStorage.setItem('audioPlaying', 'true');
        }
    };

    const setVolumeLevel = (level: number) => {
        const clampedVolume = Math.max(0, Math.min(1, level));
        setVolume(clampedVolume);
        if (audioRef.current) {
            audioRef.current.volume = clampedVolume;
        }
        localStorage.setItem('audioVolume', clampedVolume.toString());
    };

    return {
        isPlaying,
        volume,
        togglePlay,
        setVolume: setVolumeLevel,
        mounted,
    };
};
