import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext, type Theme } from './themeContext';

export const THEME_STORAGE_KEY = 'pokemon-search-theme';

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const storedTheme = getStoredBrowserTheme();

    if (storedTheme) {
      const timeoutId = window.setTimeout(() => {
        setTheme(storedTheme);
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ setTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function getStoredBrowserTheme(): Theme | null {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  return storedTheme === 'dark' || storedTheme === 'light'
    ? storedTheme
    : null;
}
