import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      <Card className="bg-transparent border-white/20 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Target className="h-12 w-12 mx-auto text-white/70 drop-shadow-lg" />
            <div>
              <h3 className="font-semibold mb-2 text-white drop-shadow-lg">Set Your Study Goals</h3>
              <p className="text-sm text-white/70 mb-4 drop-shadow-lg">
                Track your progress and stay motivated
              </p>
              <Button 
                onClick={() => setShowManager(true)}
                className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Goal
              </Button>
            </div>
          </div>
        </CardContent>
        {showManager && <GoalManager onClose={() => setShowManager(false)} />}
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-transparent border-white/20 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-white drop-shadow-lg">
                <Target className="h-5 w-5" />
                Study Goals
              </CardTitle>
              <CardDescription className="text-white/70 drop-shadow-lg">Track your daily progress</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowManager(true)}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.map((goal, index) => {
            const progressPercent = Math.min((goal.progress / goal.targetHours) * 100, 100);
            const isAchieved = goal.achieved || progressPercent >= 100;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white drop-shadow-lg">Daily Goal</span>
                    {isAchieved && (
                      <Trophy className="h-4 w-4 text-yellow-300 drop-shadow-lg" />
                    )}
                  </div>
                  <span className="text-sm text-white/70 drop-shadow-lg">
                    {goal.progress.toFixed(1)}h / {goal.targetHours}h
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
                {isAchieved && (
                  <p className="text-xs text-yellow-300 font-medium drop-shadow-lg">
                    🎉 Goal achieved! Streak: {Number(goal.streak)} days
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
      {showManager && <GoalManager onClose={() => setShowManager(false)} />}
    </>
  );
}
