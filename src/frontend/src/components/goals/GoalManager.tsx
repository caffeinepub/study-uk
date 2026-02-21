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
import { useSetGoal } from '../../hooks/useQueries';
import { GoalType } from '../../backend';
import { toast } from 'sonner';

interface GoalManagerProps {
  onClose: () => void;
}

export default function GoalManager({ onClose }: GoalManagerProps) {
  const [name, setName] = useState('');
  const [targetHours, setTargetHours] = useState(2);
  const setGoalMutation = useSetGoal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a goal name');
      return;
    }

    await setGoalMutation.mutateAsync({
      name: name.trim(),
      targetType: GoalType.Daily,
      targetHours,
    });

    toast.success('Goal created successfully!');
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-white/10 backdrop-blur-md border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white drop-shadow-lg">Create Study Goal</DialogTitle>
          <DialogDescription className="text-white/70 drop-shadow-lg">
            Set a daily study target to track your progress
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-name" className="text-white drop-shadow-lg">Goal Name</Label>
            <Input
              id="goal-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Daily Study Goal"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-hours" className="text-white drop-shadow-lg">Target Hours per Day</Label>
            <Input
              id="target-hours"
              type="number"
              value={targetHours}
              onChange={(e) => setTargetHours(Number(e.target.value))}
              min={0.5}
              max={24}
              step={0.5}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
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
              disabled={setGoalMutation.isPending}
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              {setGoalMutation.isPending ? 'Creating...' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
