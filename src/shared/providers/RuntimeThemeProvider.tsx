'use client';

import { useEffect, type ReactNode } from 'react';
import {
    createRuntimeThemeCss,
    normalizeRuntimeTheme,
} from '@/shared/lib/theme-css';

const RUNTIME_THEME_STYLE_ID = 'runtime-theme';

type RuntimeThemeProviderProps = {
    children: ReactNode;
    theme?: unknown;
};

export function RuntimeThemeProvider({
    children,
    theme,
}: RuntimeThemeProviderProps) {
    useEffect(() => {
        const css = createRuntimeThemeCss(normalizeRuntimeTheme(theme));

        if (css) {
            applyRuntimeThemeCss(css);

            return;
        }

        removeRuntimeThemeCss();
    }, [theme]);

    return children;
}

function applyRuntimeThemeCss(css: string) {
    const styleElement =
        document.getElementById(RUNTIME_THEME_STYLE_ID) ??
        document.createElement('style');

    styleElement.id = RUNTIME_THEME_STYLE_ID;
    styleElement.textContent = css;

    if (!styleElement.parentNode) {
        document.head.appendChild(styleElement);
    }
}

function removeRuntimeThemeCss() {
    document.getElementById(RUNTIME_THEME_STYLE_ID)?.remove();
}
