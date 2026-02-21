import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllPresets, useRecordSession } from '../../hooks/useQueries';
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
import { useEffect } from 'react';

export default function CustomPresetTimer() {
  const { data: presets = [] } = useGetAllPresets();
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const recordSessionMutation = useRecordSession();

  const currentPreset = presets.find((p) => p.labelText === selectedPreset);

  useEffect(() => {
    if (selectedPreset && currentPreset) {
      setTimeLeft(Number(currentPreset.duration) / 1_000_000);
    }
  }, [selectedPreset, currentPreset]);

  useEffect(() => {
    let interval: number | null = null;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1000));
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      toast.success('Timer completed!');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const start = () => {
    if (!startTime) {
      setStartTime(Date.now());
    }
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setStartTime(null);
    if (currentPreset) {
      setTimeLeft(Number(currentPreset.duration) / 1_000_000);
    }
  };

  const handleSave = () => {
    if (startTime) {
      setShowSaveDialog(true);
    }
  };

  const handleConfirmSave = async () => {
    if (startTime && currentPreset) {
      const endTime = Date.now();
      await recordSessionMutation.mutateAsync({
        startTime: BigInt(startTime * 1_000_000),
        endTime: BigInt(endTime * 1_000_000),
        labelText: currentPreset.labelText,
        colorTheme: currentPreset.colorTheme,
        tags,
      });
      toast.success('Session saved successfully!');
      setShowSaveDialog(false);
      setTags([]);
      reset();
    }
  };

  if (presets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70 drop-shadow-lg">No custom presets available. Create one to get started!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="text-center">
          <div className="mb-8 max-w-xs mx-auto">
            <Label htmlFor="preset-select" className="text-white drop-shadow-lg mb-2 block">
              Select Preset
            </Label>
            <Select value={selectedPreset} onValueChange={setSelectedPreset}>
              <SelectTrigger 
                id="preset-select" 
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
              >
                <SelectValue placeholder="Choose a preset" />
              </SelectTrigger>
              <SelectContent className="bg-white/10 backdrop-blur-md border-white/20">
                {presets.map((preset) => (
                  <SelectItem key={preset.labelText} value={preset.labelText} className="text-white">
                    {preset.labelText}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPreset && currentPreset && (
            <>
              <div
                className="text-9xl font-mono font-bold mb-12 leading-none drop-shadow-2xl"
                style={{ color: currentPreset.colorTheme }}
              >
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
                {startTime && (
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
            </>
          )}
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
