import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Save } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useAnimedoro } from '../../hooks/useAnimedoro';
import { useRecordSession } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import TagInput from '../tags/TagInput';

export default function AnimedoroTimer() {
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const { 
    timeLeft, 
    isRunning, 
    phase, 
    start, 
    pause, 
    reset, 
    getSessionData,
    studyDuration,
    tags,
    setTags,
    setStudyDuration,
  } = useAnimedoro();
  
  const recordSessionMutation = useRecordSession();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (phase === 'study') {
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

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <div className="mb-4">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              phase === 'study' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
            } backdrop-blur-sm drop-shadow-lg`}>
              {phase === 'study' ? '📚 Study Time' : '🎬 Anime Break'}
            </span>
          </div>

          <div className={`text-9xl font-mono font-bold mb-12 leading-none drop-shadow-2xl ${
            phase === 'study' ? 'text-purple-400' : 'text-pink-400'
          }`}>
            {formatTime(timeLeft)}
          </div>

          <div className="flex justify-center gap-4 mb-8">
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
            {phase === 'study' && (
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

          <div className="max-w-md mx-auto space-y-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
            <Label htmlFor="study-duration" className="text-white drop-shadow-lg">
              Study Duration: {studyDuration} minutes
            </Label>
            <Slider
              id="study-duration"
              value={[studyDuration]}
              onValueChange={(value) => setStudyDuration(value[0])}
              min={40}
              max={60}
              step={5}
              disabled={isRunning}
            />
            <p className="text-xs text-white/70 drop-shadow-lg">
              Break duration is fixed at 20 minutes (1 anime episode)
            </p>
          </div>
        </div>
      </div>

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
