'use client';

import { useAudio } from '@/hooks/useAudio';
import { Volume2, VolumeX } from 'lucide-react';

export const AudioControl = ({ audioSrc }: { audioSrc: string }) => {
  const { isPlaying, togglePlay, mounted } = useAudio(audioSrc);

  if (!mounted) return null;

  return (
    <button
      onClick={togglePlay}
      className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
      aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
      title={isPlaying ? 'Pause' : 'Play'}
    >
      {isPlaying ? (
        <Volume2 className="w-5 h-5" />
      ) : (
        <VolumeX className="w-5 h-5" />
      )}
    </button>
  );
};
