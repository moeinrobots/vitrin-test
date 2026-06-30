'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useAppStore } from '@/shared/stores';

export function CartSyncProvider({ children }: { children: ReactNode }) {
    const token = useAppStore((state) => state.token);
    const cartItems = useAppStore((state) => state.cartItems);
    const syncCart = useAppStore((state) => state.syncCart);
    const syncedTokenRef = useRef<string | null>(null);

    useEffect(() => {
        if (!token) {
            syncedTokenRef.current = null;
            return;
        }

        if (syncedTokenRef.current === token || cartItems.length === 0) return;

        syncedTokenRef.current = token;
        void syncCart(token);
    }, [cartItems.length, syncCart, token]);

    return children;
}
