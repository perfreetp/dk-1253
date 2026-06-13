import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'dark' | 'light';
  initialized: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

const applyTheme = (theme: 'dark' | 'light') => {
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  localStorage.setItem('theme-storage', JSON.stringify({ state: { theme } }));
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      initialized: false,
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        applyTheme(newTheme);
      },
      initializeTheme: () => {
        if (!get().initialized) {
          applyTheme(get().theme);
          set({ initialized: true });
        }
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state && !state.initialized) {
          applyTheme(state.theme);
          state.initialized = true;
        }
      },
    }
  )
);

if (typeof window !== 'undefined') {
  const savedState = localStorage.getItem('theme-storage');
  if (savedState) {
    try {
      const { state } = JSON.parse(savedState);
      if (state?.theme) {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(state.theme);
      }
    } catch (e) {
      console.error('Failed to restore theme:', e);
    }
  }
}
