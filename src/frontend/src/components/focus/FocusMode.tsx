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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white drop-shadow-lg">Focus Mode</h2>
          <div className="text-9xl font-mono font-bold text-white drop-shadow-2xl leading-none">
            {formatTime(time)}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsRunning(!isRunning)}
            className="w-32 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
          >
            {isRunning ? (
              <>
                <Pause className="mr-2 h-5 w-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start
              </>
            )}
          </Button>

          <Button
            size="lg"
            variant="ghost"
            onClick={disableFocusMode}
            className="w-32 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
          >
            <X className="mr-2 h-5 w-5" />
            Exit
          </Button>
        </div>

        <p className="text-sm text-white/70 drop-shadow-lg">
          Press <kbd className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-white">F</kbd> to exit focus mode
        </p>
      </div>
    </div>
  );
}
