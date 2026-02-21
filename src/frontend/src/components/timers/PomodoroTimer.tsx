import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Save, Settings } from 'lucide-react';
import { usePomodoro } from '../../hooks/usePomodoro';
import { useRecordSession } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import TagInput from '../tags/TagInput';

export default function PomodoroTimer() {
  const [showSettings, setShowSettings] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const { 
    timeLeft, 
    isRunning, 
    phase, 
    start, 
    pause, 
    reset, 
    getSessionData,
    workDuration,
    shortBreakDuration,
    tags,
    setTags,
    setWorkDuration,
    setShortBreakDuration,
  } = usePomodoro();
  
  const recordSessionMutation = useRecordSession();

  const [tempWorkDuration, setTempWorkDuration] = useState(workDuration);
  const [tempBreakDuration, setTempBreakDuration] = useState(shortBreakDuration);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (phase === 'work') {
      setShowSaveDialog(true);
    }
  };

  const handleConfirmSave = async () => {
    const sessionData = getSessionData();
    if (sessionData) {
      await recordSessionMutation.mutateAsync(sessionData);
      toast.success('Session saved successfully!');
      setShowSaveDialog(false);
      reset();
    }
  };

  const handleApplySettings = () => {
    setWorkDuration(tempWorkDuration);
    setShortBreakDuration(tempBreakDuration);
    setShowSettings(false);
  };

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <div className="mb-4">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              phase === 'work' 
                ? 'text-red-300' 
                : 'text-green-300'
            }`}>
              {phase === 'work' ? '🍅 Work Time' : '☕ Break Time'}
            </span>
          </div>

          <div className={`text-6xl font-mono font-bold mb-8 leading-none drop-shadow-lg ${
            phase === 'work' ? 'text-red-400' : 'text-green-400'
          }`}>
            {formatTime(timeLeft)}
          </div>

          <div className="flex justify-center gap-3">
            {!isRunning ? (
              <Button 
                size="default" 
                onClick={start} 
                className="text-white hover:text-white/80"
              >
                <Play className="mr-2 h-4 w-4" />
                Start
              </Button>
            ) : (
              <Button 
                size="default" 
                variant="secondary" 
                onClick={pause} 
                className="text-white hover:text-white/80"
              >
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
            )}
            <Button 
              size="default" 
              variant="outline" 
              onClick={reset} 
              className="text-white hover:text-white/80"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button
              size="default"
              variant="outline"
              onClick={() => setShowSettings(true)}
              className="text-white hover:text-white/80"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            {phase === 'work' && (
              <Button
                size="default"
                variant="default"
                onClick={handleSave}
                disabled={recordSessionMutation.isPending}
                className="text-white hover:text-white/80"
              >
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-white">Pomodoro Settings</DialogTitle>
            <DialogDescription className="text-white/70">
              Customize your work and break durations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="work-duration" className="text-white">Work Duration (minutes)</Label>
              <Input
                id="work-duration"
                type="number"
                value={tempWorkDuration}
                onChange={(e) => setTempWorkDuration(Number(e.target.value))}
                min={1}
                max={120}
                className="text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="break-duration" className="text-white">Break Duration (minutes)</Label>
              <Input
                id="break-duration"
                type="number"
                value={tempBreakDuration}
                onChange={(e) => setTempBreakDuration(Number(e.target.value))}
                min={1}
                max={60}
                className="text-white"
              />
            </div>
            <Button 
              onClick={handleApplySettings} 
              className="w-full text-white hover:text-white/80"
            >
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-white">Save Study Session</DialogTitle>
            <DialogDescription className="text-white/70">
              Add tags to categorize this session (optional)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Tags (Press Enter to add)</Label>
              <TagInput value={tags} onChange={setTags} />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowSaveDialog(false)}
                className="text-white hover:text-white/80"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmSave} 
                disabled={recordSessionMutation.isPending}
                className="text-white hover:text-white/80"
              >
                {recordSessionMutation.isPending ? 'Saving...' : 'Save Session'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
