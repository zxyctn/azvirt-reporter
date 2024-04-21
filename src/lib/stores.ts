import { makeAutoObservable } from 'mobx';

import type { Theme } from '@/lib/types';

class ThemeStore {
  theme: Theme = 'light';

  constructor() {
    makeAutoObservable(this);

    const theme = window.localStorage.getItem('theme') as Theme;
    this.setTheme(theme || 'light');
  }

  setTheme(theme: Theme) {
    this.theme = theme;
    window.localStorage.setItem('theme', theme);

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }
}

export const themeStore = new ThemeStore();
