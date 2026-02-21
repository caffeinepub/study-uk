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
import { useSetGoal } from '../../hooks/useQueries';
import { GoalType } from '../../backend';
import { toast } from 'sonner';

interface GoalManagerProps {
  onClose: () => void;
}

export default function GoalManager({ onClose }: GoalManagerProps) {
  const [goalName, setGoalName] = useState('Daily Study Goal');
  const [targetHours, setTargetHours] = useState(2);
  const setGoalMutation = useSetGoal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await setGoalMutation.mutateAsync({
        name: goalName,
        targetType: GoalType.Daily,
        targetHours,
      });
      toast.success('Goal created successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to create goal');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-white">Create Study Goal</DialogTitle>
          <DialogDescription className="text-white/70">
            Set a daily study target to track your progress
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-name" className="text-white">Goal Name</Label>
            <Input
              id="goal-name"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="e.g., Daily Study Goal"
              className="text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-hours" className="text-white">Target Hours per Day</Label>
            <Input
              id="target-hours"
              type="number"
              value={targetHours}
              onChange={(e) => setTargetHours(Number(e.target.value))}
              min={0.5}
              max={24}
              step={0.5}
              className="text-white"
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
              disabled={setGoalMutation.isPending}
              className="text-white hover:text-white/80"
            >
              {setGoalMutation.isPending ? 'Creating...' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
