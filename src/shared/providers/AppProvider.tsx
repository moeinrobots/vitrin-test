'use client';

import { type ReactNode } from 'react';
import { CartSyncProvider } from './CartSyncProvider';
import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';

export function AppProvider({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <QueryProvider>
                <CartSyncProvider>{children}</CartSyncProvider>
            </QueryProvider>
        </ThemeProvider>
    );
}
