import StudyStats from '../components/stats/StudyStats';
import GoalTracker from '../components/goals/GoalTracker';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white drop-shadow-2xl">
            Your Progress
          </h1>
          <p className="text-lg text-white/70 drop-shadow-lg">
            Track your study journey and achievements
          </p>
        </header>

        <GoalTracker />
        <StudyStats />
      </div>
    </div>
  );
}
