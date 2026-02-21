import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import MainLayout from './components/layout/MainLayout';
import TimerPage from './pages/TimerPage';
import DashboardPage from './pages/DashboardPage';
import FocusMode from './components/focus/FocusMode';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useFocusMode } from './hooks/useFocusMode';

function App() {
  const { isFocusMode } = useFocusMode();
  const [currentPage, setCurrentPage] = useState<'timer' | 'dashboard'>('timer');
  useKeyboardShortcuts();

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <MainLayout currentPage={currentPage} onPageChange={setCurrentPage}>
        {currentPage === 'timer' ? <TimerPage /> : <DashboardPage />}
      </MainLayout>
      {isFocusMode && <FocusMode />}
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
