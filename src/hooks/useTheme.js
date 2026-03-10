import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Hook to access theme state and toggle function.
 * @returns {{ theme: 'dark'|'light', isDark: boolean, toggleTheme: () => void }}
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
