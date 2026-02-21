import { ReactNode, useState } from 'react';
import WallpaperBackground from '../wallpaper/WallpaperBackground';
import WallpaperSelector from '../wallpaper/WallpaperSelector';
import KeyboardShortcutsHelp from '../help/KeyboardShortcutsHelp';
import Navigation from './Navigation';
import { Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SiCaffeine } from 'react-icons/si';

interface MainLayoutProps {
  children: ReactNode;
  currentPage: 'timer' | 'dashboard';
  onPageChange: (page: 'timer' | 'dashboard') => void;
}

export default function MainLayout({ children, currentPage, onPageChange }: MainLayoutProps) {
  const [showHelp, setShowHelp] = useState(false);
  const appIdentifier = encodeURIComponent(window.location.hostname || 'study-sanctuary');

  return (
    <div className="relative min-h-screen">
      <WallpaperBackground />
      
      <div className="relative z-10">
        <nav className="bg-transparent border-b border-white/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <span className="font-semibold text-lg text-white drop-shadow-lg">Study Sanctuary</span>
              </div>
              <Navigation currentPage={currentPage} onPageChange={onPageChange} />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHelp(true)}
                title="Keyboard Shortcuts"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto bg-black/50 backdrop-blur-md border-white/20">
                  <SheetHeader>
                    <SheetTitle className="text-white drop-shadow-lg">Wallpaper Settings</SheetTitle>
                    <SheetDescription className="text-white/70 drop-shadow-lg">
                      Choose your perfect study atmosphere
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <WallpaperSelector />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>

        <main className="min-h-[calc(100vh-8rem)]">
          {children}
        </main>

        <footer className="bg-transparent border-t border-white/20 backdrop-blur-sm py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-sm text-white/70 drop-shadow-lg">
            <p className="flex items-center justify-center gap-2">
              © {new Date().getFullYear()} Built with{' '}
              <span className="text-rose-400">♥</span> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1"
              >
                <SiCaffeine className="inline" />
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </div>

      {showHelp && <KeyboardShortcutsHelp onClose={() => setShowHelp(false)} />}
    </div>
  );
}
