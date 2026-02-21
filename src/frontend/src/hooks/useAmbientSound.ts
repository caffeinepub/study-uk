import { useState, useEffect, useRef } from 'react';

export interface AmbientSound {
  id: string;
  name: string;
  url: string;
  icon: string;
}

const AMBIENT_SOUNDS: AmbientSound[] = [
  {
    id: 'rain',
    name: 'Rain',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/13/audio_257112e4ca.mp3',
    icon: '🌧️',
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_4dedf3f94c.mp3',
    icon: '☕',
  },
  {
    id: 'forest',
    name: 'Forest',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c610232532.mp3',
    icon: '🌲',
  },
  {
    id: 'waves',
    name: 'Ocean Waves',
    url: 'https://cdn.pixabay.com/download/audio/2022/06/07/audio_d2c9d0707a.mp3',
    icon: '🌊',
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_29a91c09c4.mp3',
    icon: '📻',
  },
  {
    id: 'lofi',
    name: 'Lofi Beats',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    icon: '🎵',
  },
];

export function useAmbientSound() {
  const [selectedSound, setSelectedSound] = useState<string | null>(() => {
    return localStorage.getItem('ambientSound');
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    const stored = localStorage.getItem('ambientVolume');
    return stored ? parseFloat(stored) : 50;
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (selectedSound) {
      localStorage.setItem('ambientSound', selectedSound);
    } else {
      localStorage.removeItem('ambientSound');
    }
  }, [selectedSound]);

  useEffect(() => {
    localStorage.setItem('ambientVolume', String(volume));
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (selectedSound && isPlaying) {
      const sound = AMBIENT_SOUNDS.find((s) => s.id === selectedSound);
      if (sound) {
        if (!audioRef.current || audioRef.current.src !== sound.url) {
          if (audioRef.current) {
            audioRef.current.pause();
          }
          audioRef.current = new Audio(sound.url);
          audioRef.current.loop = true;
          audioRef.current.volume = volume / 100;
        }
        audioRef.current.play().catch((error) => {
          console.error('Audio playback error:', error);
          setIsPlaying(false);
        });
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
    }

    return () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.pause();
      }
    };
  }, [selectedSound, isPlaying, volume]);

  const play = (soundId: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setSelectedSound(soundId);
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return {
    sounds: AMBIENT_SOUNDS,
    selectedSound,
    isPlaying,
    volume,
    play,
    pause,
    togglePlay,
    setVolume,
  };
}
