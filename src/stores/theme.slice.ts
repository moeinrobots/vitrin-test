import type { StateCreator } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = Exclude<Theme, 'system'>;

const THEME_STORAGE_KEY = 'theme';

const isBrowser = () => typeof window !== 'undefined';

function getSystemTheme(): ResolvedTheme {
    if (!isBrowser()) return 'light';

    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

function resolveTheme(theme: Theme): ResolvedTheme {
    return theme === 'system' ? getSystemTheme() : theme;
}

function getStoredTheme(): Theme {
    if (!isBrowser()) return 'system';

    const theme = window.localStorage.getItem(THEME_STORAGE_KEY);

    return theme === 'light' || theme === 'dark' || theme === 'system'
        ? theme
        : 'system';
}

function applyTheme(theme: Theme) {
    if (!isBrowser()) return;

    const resolvedTheme = resolveTheme(theme);
    window.document.documentElement.classList.toggle(
        'dark',
        resolvedTheme === 'dark',
    );
}

export interface ThemeSlice {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
}

const initialTheme = getStoredTheme();
applyTheme(initialTheme);

export const createThemeSlice: StateCreator<ThemeSlice> = (set) => ({
    theme: initialTheme,
    resolvedTheme: resolveTheme(initialTheme),
    setTheme: (theme) => {
        applyTheme(theme);

        if (isBrowser()) {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        }

        set({ theme, resolvedTheme: resolveTheme(theme) });
    },
});
