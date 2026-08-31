import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeContextType, ThemeMode } from '../types/portfolio';
import { publicApiService } from '../services/publicApiService';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'ga_portfolio_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasUserPreference, setHasUserPreference] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      return false;
    }
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // Storage unavailable
    }
    const adminMode = publicApiService.getState().themeMode;
    if (adminMode === 'LIGHT') return 'light';
    if (adminMode === 'DARK') return 'dark';
    return 'light';
  });

  // Listen to remote API theme setting if user hasn't explicitly toggled
  useEffect(() => {
    if (hasUserPreference) return;
    return publicApiService.subscribe((state) => {
      if (state.themeMode) {
        setThemeState(state.themeMode.toLowerCase() as ThemeMode);
      }
    });
  }, [hasUserPreference]);

  useEffect(() => {
    try {
      if (hasUserPreference) {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    } catch {
      // Ignore storage errors
    }
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.backgroundColor = '#111111';
      document.body.style.backgroundColor = '#111111';
      document.body.style.color = '#FEFDF3';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#FEFDF3';
      document.body.style.backgroundColor = '#FEFDF3';
      document.body.style.color = '#111111';
    }
  }, [theme, hasUserPreference]);

  const toggleTheme = () => {
    setHasUserPreference(true);
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme === 'light' ? 'dark' : 'light');
    } catch {}
  };

  const setTheme = (mode: ThemeMode) => {
    setHasUserPreference(true);
    setThemeState(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
