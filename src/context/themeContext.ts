import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark';

type ThemeContextValue = {
  setTheme: (theme: Theme) => void;
  theme: Theme;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider.');
  }

  return context;
}
