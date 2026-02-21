import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Save } from 'lucide-react';
import { useStopwatch } from '../../hooks/useStopwatch';
import { useRecordSession } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import TagInput from '../tags/TagInput';

export default function StopwatchTimer() {
  const { elapsedTime, isRunning, start, pause, reset, getSessionData } = useStopwatch();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const recordSessionMutation = useRecordSession();

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (elapsedTime > 0) {
      setShowSaveDialog(true);
    }
  };

  const handleConfirmSave = async () => {
    const sessionData = getSessionData();
    if (sessionData) {
      await recordSessionMutation.mutateAsync({
        ...sessionData,
        labelText: 'Stopwatch',
        colorTheme: '#3b82f6',
        tags,
      });
      toast.success('Session saved successfully!');
      setShowSaveDialog(false);
      setTags([]);
      reset();
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-white mb-8 leading-none drop-shadow-lg">
            {formatTime(elapsedTime)}
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
            {elapsedTime > 0 && (
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
