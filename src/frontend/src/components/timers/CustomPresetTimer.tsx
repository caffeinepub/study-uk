import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Save, Plus } from 'lucide-react';
import { useGetAllPresets, useRecordSession } from '../../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import TagInput from '../tags/TagInput';
import PresetManager from '../presets/PresetManager';

export default function CustomPresetTimer() {
  const { data: presets = [], isLoading } = useGetAllPresets();
  const recordSessionMutation = useRecordSession();

  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<bigint | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showPresetManager, setShowPresetManager] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const currentPreset = presets.find((p) => p.labelText === selectedPreset);

  useEffect(() => {
    if (currentPreset && !isRunning) {
      setTimeLeft(Number(currentPreset.duration) / 1_000_000_000);
    }
  }, [currentPreset, isRunning]);

  useEffect(() => {
    let interval: number | null = null;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            toast.success('Timer completed!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!currentPreset) {
      toast.error('Please select a preset first');
      return;
    }
    setStartTime(BigInt(Date.now()) * BigInt(1_000_000));
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setStartTime(null);
    if (currentPreset) {
      setTimeLeft(Number(currentPreset.duration) / 1_000_000_000);
    }
  };

  const handleSave = () => {
    if (startTime && currentPreset) {
      setShowSaveDialog(true);
    }
  };

  const handleConfirmSave = async () => {
    if (startTime && currentPreset) {
      const endTime = BigInt(Date.now()) * BigInt(1_000_000);
      await recordSessionMutation.mutateAsync({
        startTime,
        endTime,
        labelText: currentPreset.labelText,
        colorTheme: currentPreset.colorTheme,
        tags,
      });
      toast.success('Session saved successfully!');
      setShowSaveDialog(false);
      setTags([]);
      handleReset();
    }
  };

  if (isLoading) {
    return <div className="text-center text-white">Loading presets...</div>;
  }

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <div className="mb-6 max-w-md mx-auto">
            <Label className="text-white mb-2 block">Select Preset</Label>
            <div className="flex gap-2">
              <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                <SelectTrigger className="flex-1 text-white">
                  <SelectValue placeholder="Choose a preset" />
                </SelectTrigger>
                <SelectContent>
                  {presets.map((preset) => (
                    <SelectItem key={preset.labelText} value={preset.labelText}>
                      {preset.labelText}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowPresetManager(true)}
                className="text-white hover:text-white/80"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {currentPreset && (
            <>
              <div className="text-6xl font-mono font-bold mb-8 leading-none drop-shadow-lg"
                style={{ color: currentPreset.colorTheme }}
              >
                {formatTime(timeLeft)}
              </div>

              <div className="flex justify-center gap-3">
                {!isRunning ? (
                  <Button 
                    size="default" 
                    onClick={handleStart} 
                    className="text-white hover:text-white/80"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                ) : (
                  <Button 
                    size="default" 
                    variant="secondary" 
                    onClick={handlePause} 
                    className="text-white hover:text-white/80"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                )}
                <Button 
                  size="default" 
                  variant="outline" 
                  onClick={handleReset} 
                  className="text-white hover:text-white/80"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                {startTime && (
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
            </>
          )}
        </div>
      </div>

      {showPresetManager && (
        <PresetManager onClose={() => setShowPresetManager(false)} />
      )}

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
