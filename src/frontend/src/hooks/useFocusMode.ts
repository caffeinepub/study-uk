import { useState, useEffect } from 'react';

export function useFocusMode() {
  const [isFocusMode, setIsFocusMode] = useState(() => {
    const stored = localStorage.getItem('focusMode');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('focusMode', String(isFocusMode));
  }, [isFocusMode]);

  const toggleFocusMode = () => {
    setIsFocusMode((prev) => !prev);
  };

  const enableFocusMode = () => {
    setIsFocusMode(true);
  };

  const disableFocusMode = () => {
    setIsFocusMode(false);
  };

  return {
    isFocusMode,
    toggleFocusMode,
    enableFocusMode,
    disableFocusMode,
  };
}
