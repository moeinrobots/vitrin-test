'use client';

import { useState, type ReactNode } from 'react';
import {
    MutationCache,
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { ApiError } from '@/shared/lib/api-error';
import { useAppStore } from '@/shared/stores';

function handleAuthError(error: unknown) {
    if (!(error instanceof ApiError)) return;
    if (error.status !== 401) return;

    useAppStore.getState().logout();

    if (window.location.pathname !== '/signin') {
        window.location.replace('/signin');
    }
}

export function QueryProvider({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: handleAuthError,
                }),
                mutationCache: new MutationCache({
                    onError: handleAuthError,
                }),
                defaultOptions: {
                    queries: {
                        staleTime: 60_000,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
