import { useState, useEffect, useRef } from 'react';

export interface AmbientSound {
  id: string;
  name: string;
  url: string;
  icon: string;
}

// Using Google's free sound library - reliable, CORS-enabled, and publicly accessible
const AMBIENT_SOUNDS: AmbientSound[] = [
  {
    id: 'rain',
    name: 'Rain',
    url: 'https://actions.google.com/sounds/v1/weather/rain_on_roof.ogg',
    icon: '🌧️',
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    url: 'https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg',
    icon: '☕',
  },
  {
    id: 'forest',
    name: 'Forest',
    url: 'https://actions.google.com/sounds/v1/ambiences/forest_birds.ogg',
    icon: '🌲',
  },
  {
    id: 'waves',
    name: 'Ocean Waves',
    url: 'https://actions.google.com/sounds/v1/water/waves_crashing_on_rock_beach.ogg',
    icon: '🌊',
  },
  {
    id: 'white-noise',
    name: 'White Noise',
    url: 'https://actions.google.com/sounds/v1/ambiences/ambient_hum_air_conditioner.ogg',
    icon: '📻',
  },
  {
    id: 'lofi',
    name: 'Lofi Beats',
    url: 'https://actions.google.com/sounds/v1/ambiences/soft_jazz_music.ogg',
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsInteraction, setNeedsInteraction] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSoundIdRef = useRef<string | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

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
      console.log('[AmbientSound] Volume updated:', volume);
    }
  }, [volume]);

  // Cleanup function for audio element
  const cleanupAudio = () => {
    if (audioRef.current) {
      console.log('[AmbientSound] Cleaning up audio element');
      audioRef.current.pause();
      audioRef.current.removeEventListener('playing', handlePlaying);
      audioRef.current.removeEventListener('pause', handlePause);
      audioRef.current.removeEventListener('ended', handleEnded);
      audioRef.current.removeEventListener('error', handleError);
      audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
      audioRef.current.removeEventListener('loadeddata', handleLoadedData);
      audioRef.current.src = '';
      audioRef.current = null;
    }
    currentSoundIdRef.current = null;
  };

  // Event handlers
  const handlePlaying = () => {
    console.log('[AmbientSound] Audio started playing');
    setIsPlaying(true);
    setIsLoading(false);
    setError(null);
    setNeedsInteraction(false);
    retryCountRef.current = 0;
  };

  const handlePause = () => {
    console.log('[AmbientSound] Audio paused');
    setIsPlaying(false);
  };

  const handleEnded = () => {
    console.log('[AmbientSound] Audio ended (should loop)');
  };

  const handleError = (e: Event) => {
    const audioElement = e.target as HTMLAudioElement;
    const error = audioElement.error;
    
    if (!error) {
      console.error('[AmbientSound] Audio error event fired but no error object');
      setError('Failed to load audio: Unknown error');
      setIsLoading(false);
      setIsPlaying(false);
      return;
    }

    // Map HTML5 Media Error codes to user-friendly messages
    let errorMessage = 'Unknown error';
    let errorDetails = '';
    
    switch (error.code) {
      case MediaError.MEDIA_ERR_ABORTED:
        errorMessage = 'Loading aborted';
        errorDetails = 'MEDIA_ERR_ABORTED';
        break;
      case MediaError.MEDIA_ERR_NETWORK:
        errorMessage = 'Network error';
        errorDetails = 'MEDIA_ERR_NETWORK';
        break;
      case MediaError.MEDIA_ERR_DECODE:
        errorMessage = 'Decoding error';
        errorDetails = 'MEDIA_ERR_DECODE';
        break;
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        errorMessage = 'Source not supported';
        errorDetails = 'MEDIA_ERR_SRC_NOT_SUPPORTED';
        break;
    }

    console.error(`[AmbientSound] Audio error: ${errorDetails} (code ${error.code})`, error.message);
    console.error('[AmbientSound] Failed source URL:', audioElement.src);
    
    setError(`Failed to load audio: ${errorMessage}`);
    setIsLoading(false);
    setIsPlaying(false);
  };

  const handleCanPlayThrough = () => {
    console.log('[AmbientSound] Audio can play through');
    setIsLoading(false);
  };

  const handleLoadedData = () => {
    console.log('[AmbientSound] Audio data loaded');
  };

  // Attempt to play audio with retry logic
  const attemptPlay = async (audio: HTMLAudioElement, retryCount = 0): Promise<void> => {
    // Validate audio element state before attempting play
    if (audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
      console.log('[AmbientSound] Audio not ready yet, waiting for data...');
      if (retryCount < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return attemptPlay(audio, retryCount + 1);
      } else {
        console.error('[AmbientSound] Audio never became ready');
        setError('Audio failed to load');
        setIsLoading(false);
        setIsPlaying(false);
        return;
      }
    }

    try {
      console.log(`[AmbientSound] Attempting to play (attempt ${retryCount + 1}/${maxRetries + 1})`);
      console.log('[AmbientSound] Audio readyState:', audio.readyState);
      
      await audio.play();
      console.log('[AmbientSound] Play successful');
      setError(null);
      setNeedsInteraction(false);
    } catch (err) {
      const error = err as Error;
      console.error('[AmbientSound] Play failed:', error.name, error.message);

      // Check if it's an autoplay restriction
      if (error.name === 'NotAllowedError' || error.message.includes('user interaction')) {
        console.log('[AmbientSound] Browser autoplay restriction detected');
        setNeedsInteraction(true);
        setError('Browser blocked autoplay. Click play to start.');
        setIsPlaying(false);
        setIsLoading(false);
        return;
      }

      // Retry logic for other errors
      if (retryCount < maxRetries) {
        console.log(`[AmbientSound] Retrying in ${(retryCount + 1) * 500}ms...`);
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 500));
        return attemptPlay(audio, retryCount + 1);
      } else {
        console.error('[AmbientSound] Max retries reached');
        setError(`Playback failed: ${error.message}`);
        setIsPlaying(false);
        setIsLoading(false);
      }
    }
  };

  // Handle audio playback
  useEffect(() => {
    const sound = selectedSound ? AMBIENT_SOUNDS.find((s) => s.id === selectedSound) : null;

    if (sound && isPlaying) {
      console.log('[AmbientSound] Starting playback for:', sound.name);

      // Create new audio element if sound changed or doesn't exist
      if (!audioRef.current || currentSoundIdRef.current !== sound.id) {
        console.log('[AmbientSound] Creating new audio element');
        cleanupAudio();

        setIsLoading(true);
        setError(null);

        // Create new audio element with proper initialization sequence
        const audio = new Audio();
        
        // Set properties before adding listeners
        audio.loop = true;
        audio.volume = volume / 100;
        audio.preload = 'auto';
        
        // Add event listeners BEFORE setting src
        audio.addEventListener('playing', handlePlaying);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);
        audio.addEventListener('canplaythrough', handleCanPlayThrough);
        audio.addEventListener('loadeddata', handleLoadedData);

        // Now set the source
        audio.src = sound.url;
        
        audioRef.current = audio;
        currentSoundIdRef.current = sound.id;

        console.log('[AmbientSound] Loading audio from:', sound.url);

        // Load the audio
        audio.load();
        
        // Wait for audio to start loading before attempting play
        setTimeout(() => {
          if (audioRef.current === audio) {
            attemptPlay(audio);
          }
        }, 200);
      } else {
        // Resume existing audio
        console.log('[AmbientSound] Resuming existing audio');
        attemptPlay(audioRef.current);
      }
    } else if (audioRef.current && !isPlaying) {
      // Pause audio
      console.log('[AmbientSound] Pausing audio');
      audioRef.current.pause();
    }

    // Cleanup on unmount
    return () => {
      if (!isPlaying) {
        cleanupAudio();
      }
    };
  }, [selectedSound, isPlaying]);

  const play = (soundId: string) => {
    console.log('[AmbientSound] Play requested for:', soundId);
    setSelectedSound(soundId);
    setIsPlaying(true);
    setError(null);
    setNeedsInteraction(false);
    retryCountRef.current = 0;
  };

  const pause = () => {
    console.log('[AmbientSound] Pause requested');
    setIsPlaying(false);
  };

  const togglePlay = () => {
    console.log('[AmbientSound] Toggle play requested, current state:', isPlaying);
    if (needsInteraction) {
      // Clear the interaction flag and try again
      setNeedsInteraction(false);
      setError(null);
    }
    setIsPlaying((prev) => !prev);
  };

  return {
    sounds: AMBIENT_SOUNDS,
    selectedSound,
    isPlaying,
    volume,
    isLoading,
    error,
    needsInteraction,
    play,
    pause,
    togglePlay,
    setVolume,
  };
}
