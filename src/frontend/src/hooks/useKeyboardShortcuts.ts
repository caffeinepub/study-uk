import { useEffect } from 'react';
import { useFocusMode } from './useFocusMode';

export function useKeyboardShortcuts() {
  const { toggleFocusMode } = useFocusMode();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'f':
          e.preventDefault();
          toggleFocusMode();
          break;
        case '?':
          e.preventDefault();
          // Show keyboard shortcuts help
          const event = new CustomEvent('show-keyboard-help');
          window.dispatchEvent(event);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleFocusMode]);
}
