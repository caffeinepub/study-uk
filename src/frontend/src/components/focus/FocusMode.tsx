import { useEffect, useState } from 'react';
import { X, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFocusMode } from '../../hooks/useFocusMode';

export default function FocusMode() {
  const { disableFocusMode } = useFocusMode();
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (isRunning) {
      interval = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white drop-shadow-lg">Focus Mode</h2>
          <div className="text-6xl font-mono font-bold text-white leading-none drop-shadow-lg">
            {formatTime(time)}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            size="default"
            variant="outline"
            onClick={() => setIsRunning(!isRunning)}
            className="text-white hover:text-white/80"
          >
            {isRunning ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start
              </>
            )}
          </Button>

          <Button
            size="default"
            variant="ghost"
            onClick={disableFocusMode}
            className="text-white hover:text-white/80"
          >
            <X className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </div>

        <p className="text-sm text-white/80 drop-shadow-md">
          Press <kbd className="px-2 py-1 rounded text-white bg-white/10">F</kbd> to exit focus mode
        </p>
      </div>
    </div>
  );
}
