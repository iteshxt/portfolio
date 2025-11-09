'use client';

import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export const AudioControl = ({ audioSrc }: { audioSrc: string }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedMuted = localStorage.getItem('soundMuted');
    if (storedMuted !== null) {
      setIsMuted(storedMuted === 'true');
    }
  }, []);

  const handleToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('soundMuted', newMuted ? 'true' : 'false');
    
    // Dispatch custom event to notify ClickSpark
    window.dispatchEvent(new CustomEvent('soundMuteToggle', { detail: newMuted }));
  };

  if (!mounted) return null;

  return (
    <button
      onClick={handleToggle}
      className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
      aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
      title={isMuted ? 'Sound Off' : 'Sound On'}
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </button>
  );
};
