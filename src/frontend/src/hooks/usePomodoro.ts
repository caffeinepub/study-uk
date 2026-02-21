import { useState, useEffect, useRef } from 'react';

type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

export function usePomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<PomodoroPhase>('work');
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
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

    if (phase === 'work') {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);
      
      if (newCount % 4 === 0) {
        setPhase('longBreak');
        setTimeLeft(longBreakDuration * 60);
      } else {
        setPhase('shortBreak');
        setTimeLeft(shortBreakDuration * 60);
      }
    } else {
      setPhase('work');
      setTimeLeft(workDuration * 60);
    }
    
    setIsRunning(false);
  };

  const start = () => {
    if (!isRunning && phase === 'work' && !sessionStartTime) {
      setSessionStartTime(Date.now());
    }
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setPhase('work');
    setTimeLeft(workDuration * 60);
    setCompletedPomodoros(0);
    setSessionStartTime(null);
    setTags([]);
  };

  const getSessionData = () => {
    if (sessionStartTime && phase === 'work' && completedPomodoros > 0) {
      return {
        startTime: BigInt(sessionStartTime * 1_000_000),
        endTime: BigInt(Date.now() * 1_000_000),
        labelText: 'Pomodoro',
        colorTheme: '#ef4444',
        tags,
      };
    }
    return null;
  };

  return {
    timeLeft,
    isRunning,
    phase,
    completedPomodoros,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    tags,
    start,
    pause,
    reset,
    setTags,
    setWorkDuration: (duration: number) => {
      setWorkDuration(duration);
      if (phase === 'work' && !isRunning) {
        setTimeLeft(duration * 60);
      }
    },
    setShortBreakDuration,
    setLongBreakDuration,
    getSessionData,
  };
}
