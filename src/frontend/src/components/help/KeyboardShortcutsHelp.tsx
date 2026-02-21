import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface KeyboardShortcutsHelpProps {
  onClose: () => void;
}

export default function KeyboardShortcutsHelp({ onClose }: KeyboardShortcutsHelpProps) {
  const shortcuts = [
    { key: 'F', description: 'Toggle Focus Mode' },
    { key: '?', description: 'Show Keyboard Shortcuts' },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-white">Keyboard Shortcuts</DialogTitle>
          <DialogDescription className="text-white/70">
            Quick access to common actions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between py-2">
              <span className="text-white">{shortcut.description}</span>
              <kbd className="px-3 py-1 rounded text-sm font-mono text-white">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose} className="text-white hover:text-white/80">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
