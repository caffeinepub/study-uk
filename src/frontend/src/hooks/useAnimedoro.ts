import { useState, useEffect, useRef } from 'react';

type AnimedoroPhase = 'study' | 'break';

export function useAnimedoro() {
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<AnimedoroPhase>('study');
  const [studyDuration, setStudyDuration] = useState(40);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const breakDuration = 20;
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handlePhaseComplete();
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handlePhaseComplete = () => {
    const audio = new Audio('/assets/timer-complete.mp3');
    audio.play().catch(() => {});

    if (phase === 'study') {
      setPhase('break');
      setTimeLeft(breakDuration * 60);
    } else {
      setPhase('study');
      setTimeLeft(studyDuration * 60);
    }
    
    setIsRunning(false);
  };

  const start = () => {
    if (!isRunning && phase === 'study' && !sessionStartTime) {
      setSessionStartTime(Date.now());
    }
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setPhase('study');
    setTimeLeft(studyDuration * 60);
    setSessionStartTime(null);
    setTags([]);
  };

  const getSessionData = () => {
    if (sessionStartTime && phase === 'study') {
      return {
        startTime: BigInt(sessionStartTime * 1_000_000),
        endTime: BigInt(Date.now() * 1_000_000),
        labelText: 'Animedoro',
        colorTheme: '#8b5cf6',
        tags,
      };
    }
    return null;
  };

  return {
    timeLeft,
    isRunning,
    phase,
    studyDuration,
    breakDuration,
    tags,
    start,
    pause,
    reset,
    setTags,
    setStudyDuration: (duration: number) => {
      setStudyDuration(duration);
      if (phase === 'study' && !isRunning) {
        setTimeLeft(duration * 60);
      }
    },
    getSessionData,
  };
}
