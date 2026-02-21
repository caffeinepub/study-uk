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
  const currentSoundIdRef = useRef<string | null>(null);

  // Persist selected sound
  useEffect(() => {
    if (selectedSound) {
      localStorage.setItem('ambientSound', selectedSound);
    } else {
      localStorage.removeItem('ambientSound');
    }
  }, [selectedSound]);

  // Persist volume
  useEffect(() => {
    localStorage.setItem('ambientVolume', String(volume));
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Handle audio playback
  useEffect(() => {
    const sound = selectedSound ? AMBIENT_SOUNDS.find((s) => s.id === selectedSound) : null;

    if (sound && isPlaying) {
      // Create new audio element if sound changed or doesn't exist
      if (!audioRef.current || currentSoundIdRef.current !== sound.id) {
        // Clean up old audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
          audioRef.current = null;
        }

        // Create new audio element
        const audio = new Audio();
        audio.src = sound.url;
        audio.loop = true;
        audio.volume = volume / 100;
        audioRef.current = audio;
        currentSoundIdRef.current = sound.id;

        // Wait for audio to be ready before playing
        audio.addEventListener('canplaythrough', () => {
          audio.play().catch((error) => {
            console.error('Audio playback error:', error);
            setIsPlaying(false);
          });
        }, { once: true });

        // Load the audio
        audio.load();
      } else {
        // Resume existing audio
        audioRef.current.play().catch((error) => {
          console.error('Audio playback error:', error);
          setIsPlaying(false);
        });
      }
    } else if (audioRef.current) {
      // Pause audio
      audioRef.current.pause();
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.pause();
      }
    };
  }, [selectedSound, isPlaying, volume]);

  const play = (soundId: string) => {
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
