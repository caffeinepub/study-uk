import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Save } from 'lucide-react';
import { useAnimedoro } from '../../hooks/useAnimedoro';
import { useRecordSession } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
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
                ? 'text-purple-300' 
                : 'text-blue-300'
            }`}>
              {phase === 'study' ? '📖 Study Time' : '🎨 Break Time'}
            </span>
          </div>

          <div className={`text-6xl font-mono font-bold mb-8 leading-none drop-shadow-lg ${
            phase === 'study' ? 'text-purple-400' : 'text-blue-400'
          }`}>
            {formatTime(timeLeft)}
          </div>

          <div className="mb-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-white text-sm">Study Duration: {studyDuration} min</Label>
            </div>
            <Slider
              value={[studyDuration]}
              onValueChange={(value) => setStudyDuration(value[0])}
              min={40}
              max={60}
              step={5}
              className="w-full"
              disabled={isRunning}
            />
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
            {phase === 'study' && (
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
