import { useState, useEffect, useRef } from 'react';

export function useStopwatch() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setElapsedTime((prev) => prev + 10);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const start = () => {
    if (!isRunning) {
      setStartTime(Date.now() - elapsedTime);
      setIsRunning(true);
    }
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime(null);
  };

  const getSessionData = () => {
    if (startTime && elapsedTime > 0) {
      return {
        startTime: BigInt(startTime * 1_000_000),
        endTime: BigInt((startTime + elapsedTime) * 1_000_000),
      };
    }
    return null;
  };

  return {
    elapsedTime,
    isRunning,
    start,
    pause,
    reset,
    getSessionData,
  };
}
