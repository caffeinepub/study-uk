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
                ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                : 'bg-green-500/20 text-green-300 border border-green-500/30'
            } backdrop-blur-sm drop-shadow-lg`}>
              {phase === 'work' ? '🍅 Work Time' : '☕ Break Time'}
            </span>
          </div>

          <div className={`text-9xl font-mono font-bold mb-12 leading-none drop-shadow-2xl ${
            phase === 'work' ? 'text-red-400' : 'text-green-400'
          }`}>
            {formatTime(timeLeft)}
          </div>

          <div className="flex justify-center gap-4">
            {!isRunning ? (
              <Button 
                size="lg" 
                onClick={start} 
                className="w-40 h-14 text-lg bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <Play className="mr-2 h-6 w-6" />
                Start
              </Button>
            ) : (
              <Button 
                size="lg" 
                variant="secondary" 
                onClick={pause} 
                className="w-40 h-14 text-lg bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <Pause className="mr-2 h-6 w-6" />
                Pause
              </Button>
            )}
            <Button 
              size="lg" 
              variant="outline" 
              onClick={reset} 
              className="w-40 h-14 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <RotateCcw className="mr-2 h-6 w-6" />
              Reset
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowSettings(true)}
              className="w-40 h-14 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <Settings className="mr-2 h-6 w-6" />
              Settings
            </Button>
            {phase === 'work' && (
              <Button
                size="lg"
                variant="default"
                onClick={handleSave}
                disabled={recordSessionMutation.isPending}
                className="w-40 h-14 text-lg bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <Save className="mr-2 h-6 w-6" />
                Save
              </Button>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-white/10 backdrop-blur-md border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white drop-shadow-lg">Pomodoro Settings</DialogTitle>
            <DialogDescription className="text-white/70 drop-shadow-lg">
              Customize your work and break durations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="work-duration" className="text-white drop-shadow-lg">Work Duration (minutes)</Label>
              <Input
                id="work-duration"
                type="number"
                value={tempWorkDuration}
                onChange={(e) => setTempWorkDuration(Number(e.target.value))}
                min={1}
                max={120}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="break-duration" className="text-white drop-shadow-lg">Break Duration (minutes)</Label>
              <Input
                id="break-duration"
                type="number"
                value={tempBreakDuration}
                onChange={(e) => setTempBreakDuration(Number(e.target.value))}
                min={1}
                max={60}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
              />
            </div>
            <Button 
              onClick={handleApplySettings} 
              className="w-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              Apply
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="bg-white/10 backdrop-blur-md border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white drop-shadow-lg">Save Study Session</DialogTitle>
            <DialogDescription className="text-white/70 drop-shadow-lg">
              Add tags to categorize this session (optional)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white drop-shadow-lg">Tags (Press Enter to add)</Label>
              <TagInput value={tags} onChange={setTags} />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowSaveDialog(false)}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmSave} 
                disabled={recordSessionMutation.isPending}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
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
