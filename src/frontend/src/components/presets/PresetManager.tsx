import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useSavePreset } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface PresetManagerProps {
  onClose: () => void;
}

export default function PresetManager({ onClose }: PresetManagerProps) {
  const [presetName, setPresetName] = useState('');
  const [labelText, setLabelText] = useState('');
  const [duration, setDuration] = useState(25);
  const [colorTheme, setColorTheme] = useState('#3b82f6');
  const savePresetMutation = useSavePreset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!presetName || !labelText) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await savePresetMutation.mutateAsync({
        name: presetName,
        duration: BigInt(duration * 60 * 1_000_000_000),
        labelText,
        colorTheme,
      });
      toast.success('Preset created successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to create preset');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-white">Create Custom Timer</DialogTitle>
          <DialogDescription className="text-white/70">
            Design your own study timer preset
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="preset-name" className="text-white">Preset Name</Label>
            <Input
              id="preset-name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="e.g., Deep Work"
              className="text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="label-text" className="text-white">Display Label</Label>
            <Input
              id="label-text"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              placeholder="e.g., Deep Work Session"
              className="text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-white">Duration: {duration} minutes</Label>
            <Slider
              id="duration"
              value={[duration]}
              onValueChange={(value) => setDuration(value[0])}
              min={5}
              max={120}
              step={5}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color-theme" className="text-white">Color Theme</Label>
            <Input
              id="color-theme"
              type="color"
              value={colorTheme}
              onChange={(e) => setColorTheme(e.target.value)}
              className="h-10 text-white"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="text-white hover:text-white/80"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={savePresetMutation.isPending}
              className="text-white hover:text-white/80"
            >
              {savePresetMutation.isPending ? 'Creating...' : 'Create Preset'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
