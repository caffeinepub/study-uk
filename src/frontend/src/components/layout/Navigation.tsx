import { Button } from '@/components/ui/button';
import { Timer, BarChart3 } from 'lucide-react';

interface NavigationProps {
  currentPage: 'timer' | 'dashboard';
  onPageChange: (page: 'timer' | 'dashboard') => void;
}

export default function Navigation({ currentPage, onPageChange }: NavigationProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={currentPage === 'timer' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onPageChange('timer')}
        className="text-white hover:text-white/80"
      >
        <Timer className="mr-2 h-4 w-4" />
        Timer
      </Button>
      <Button
        variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onPageChange('dashboard')}
        className="text-white hover:text-white/80"
      >
        <BarChart3 className="mr-2 h-4 w-4" />
        Dashboard
      </Button>
    </div>
  );
}
