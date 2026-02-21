import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSavePreset } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface PresetManagerProps {
  onClose: () => void;
}

export default function PresetManager({ onClose }: PresetManagerProps) {
  const [name, setName] = useState('');
  const [labelText, setLabelText] = useState('');
  const [duration, setDuration] = useState(30);
  const [colorTheme, setColorTheme] = useState('#3b82f6');
  const savePresetMutation = useSavePreset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !labelText.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    await savePresetMutation.mutateAsync({
      name: name.trim(),
      duration: BigInt(duration * 60 * 1_000_000_000),
      labelText: labelText.trim(),
      colorTheme,
    });

    toast.success('Preset created successfully!');
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-white/10 backdrop-blur-md border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white drop-shadow-lg">Create Custom Timer</DialogTitle>
          <DialogDescription className="text-white/70 drop-shadow-lg">
            Design your own timer preset
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="preset-name" className="text-white drop-shadow-lg">Preset Name</Label>
            <Input
              id="preset-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom Timer"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="label-text" className="text-white drop-shadow-lg">Display Label</Label>
            <Input
              id="label-text"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              placeholder="Study Session"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-white drop-shadow-lg">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min={1}
              max={180}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color-theme" className="text-white drop-shadow-lg">Color Theme</Label>
            <Input
              id="color-theme"
              type="color"
              value={colorTheme}
              onChange={(e) => setColorTheme(e.target.value)}
              className="bg-white/10 backdrop-blur-sm border-white/20 h-10"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={savePresetMutation.isPending}
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              {savePresetMutation.isPending ? 'Creating...' : 'Create Preset'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
