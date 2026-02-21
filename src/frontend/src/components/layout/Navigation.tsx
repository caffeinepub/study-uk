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
        className={
          currentPage === 'timer'
            ? 'bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30'
            : 'bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20'
        }
      >
        <Timer className="mr-2 h-4 w-4" />
        Focus
      </Button>
      <Button
        variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onPageChange('dashboard')}
        className={
          currentPage === 'dashboard'
            ? 'bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30'
            : 'bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20'
        }
      >
        <BarChart3 className="mr-2 h-4 w-4" />
        Dashboard
      </Button>
    </div>
  );
}
