import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
      <DialogContent className="bg-white/10 backdrop-blur-md border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white drop-shadow-lg">Keyboard Shortcuts</DialogTitle>
          <DialogDescription className="text-white/70 drop-shadow-lg">
            Quick access to common actions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between">
              <span className="text-sm text-white/70 drop-shadow-lg">{shortcut.description}</span>
              <kbd className="px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded text-white font-mono text-sm drop-shadow-lg">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
