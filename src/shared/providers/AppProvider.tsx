'use client';

import { type ReactNode } from 'react';
import { CartSyncProvider } from './CartSyncProvider';
import { QueryProvider } from './QueryProvider';
import { RuntimeThemeProvider } from './RuntimeThemeProvider';
import { ThemeProvider } from './ThemeProvider';

type AppProviderProps = {
    children: ReactNode;
    theme?: unknown;
};

export function AppProvider({ children, theme }: AppProviderProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <QueryProvider>
                <RuntimeThemeProvider theme={theme}>
                    <CartSyncProvider>{children}</CartSyncProvider>
                </RuntimeThemeProvider>
            </QueryProvider>
        </ThemeProvider>
    );
}
