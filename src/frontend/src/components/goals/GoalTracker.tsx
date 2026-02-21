import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Target, Plus, Trophy } from 'lucide-react';
import { useGetAllGoals } from '../../hooks/useQueries';
import { useState } from 'react';
import GoalManager from './GoalManager';

export default function GoalTracker() {
  const { data: goals = [], isLoading } = useGetAllGoals();
  const [showManager, setShowManager] = useState(false);

  if (isLoading) {
    return null;
  }

  if (goals.length === 0 && !showManager) {
    return (
      <div className="p-6">
        <div className="text-center space-y-4">
          <Target className="h-12 w-12 mx-auto text-white/70" />
          <div>
            <h3 className="font-semibold mb-2 text-white">Set Your Study Goals</h3>
            <p className="text-sm text-white/70 mb-4">
              Track your progress and stay motivated
            </p>
            <Button 
              onClick={() => setShowManager(true)}
              className="text-white hover:text-white/80"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Goal
            </Button>
          </div>
        </div>
        {showManager && <GoalManager onClose={() => setShowManager(false)} />}
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
              <Target className="h-5 w-5" />
              Study Goals
            </h3>
            <p className="text-sm text-white/70">Track your daily progress</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowManager(true)}
            className="text-white hover:text-white/80"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Goal
          </Button>
        </div>
        <div className="space-y-4">
          {goals.map((goal, index) => {
            const progressPercent = Math.min((goal.progress / goal.targetHours) * 100, 100);
            const isAchieved = goal.achieved || progressPercent >= 100;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">Daily Goal</span>
                    {isAchieved && (
                      <Trophy className="h-4 w-4 text-yellow-300" />
                    )}
                  </div>
                  <span className="text-sm text-white/70">
                    {goal.progress.toFixed(1)}h / {goal.targetHours}h
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
                {isAchieved && (
                  <p className="text-xs text-yellow-300 font-medium">
                    🎉 Goal achieved! Streak: {Number(goal.streak)} days
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {showManager && <GoalManager onClose={() => setShowManager(false)} />}
    </>
  );
}
