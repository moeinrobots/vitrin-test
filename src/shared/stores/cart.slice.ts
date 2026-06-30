import { getTokenCookie } from '@/shared/lib/cookie';
import {
    removeServerCartItem,
    replaceServerCartItem,
    syncCartWithServer,
} from '@/features/cart/api/cart.client';
import type { CartItem } from '@/features/cart/types/cart.types';

import type { StateCreator } from 'zustand';

const CART_STORAGE_KEY = 'cart';

const isBrowser = () => typeof window !== 'undefined';

function getCartItemKey(item: Pick<CartItem, 'productId' | 'variantId'>) {
    return `${item.productId}:${item.variantId ?? 'default'}`;
}

function normalizeQuantity(quantity: number) {
    return Math.max(1, Math.floor(quantity));
}

function getStoredCart() {
    if (!isBrowser()) return [];

    try {
        const parsed = JSON.parse(
            window.localStorage.getItem(CART_STORAGE_KEY) || '[]',
        ) as CartItem[];

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        window.localStorage.removeItem(CART_STORAGE_KEY);
        return [];
    }
}

function persistCart(items: CartItem[]) {
    if (!isBrowser()) return;

    if (items.length > 0) {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } else {
        window.localStorage.removeItem(CART_STORAGE_KEY);
    }
}

export type CartSyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

export interface CartSlice {
    cartItems: CartItem[];
    cartSyncStatus: CartSyncStatus;
    cartSyncError: string | null;
    cartCount: () => number;
    addCartItem: (item: CartItem) => void;
    updateCartItemQuantity: (
        item: Pick<CartItem, 'productId' | 'variantId'>,
        quantity: number,
    ) => void;
    removeCartItem: (item: Pick<CartItem, 'productId' | 'variantId'>) => void;
    replaceCart: (items: CartItem[]) => void;
    clearCart: () => void;
    syncCart: (token?: string | null) => Promise<void>;
}

export const createCartSlice: StateCreator<CartSlice> = (set, get) => {
    const commitCart = (items: CartItem[]) => {
        persistCart(items);
        set({ cartItems: items });
    };

    const syncOptimisticCart = async (
        token: string | null,
        action: () => Promise<{ items: CartItem[] }>,
    ) => {
        if (!token) return;

        set({ cartSyncStatus: 'syncing', cartSyncError: null });

        try {
            const result = await action();
            commitCart(result.items);
            set({ cartSyncStatus: 'synced' });
        } catch (error) {
            set({
                cartSyncStatus: 'error',
                cartSyncError:
                    error instanceof Error ? error.message : 'Cart sync failed',
            });
        }
    };

    return {
        cartItems: getStoredCart(),
        cartSyncStatus: 'idle',
        cartSyncError: null,

        cartCount: () =>
            get().cartItems.reduce((total, item) => total + item.quantity, 0),

        addCartItem: (item) => {
            const nextItem = {
                ...item,
                quantity: normalizeQuantity(item.quantity),
            };
            const key = getCartItemKey(nextItem);
            const items = [...get().cartItems];
            const itemIndex = items.findIndex(
                (cartItem) => getCartItemKey(cartItem) === key,
            );

            if (itemIndex >= 0) {
                items[itemIndex] = {
                    ...items[itemIndex],
                    ...nextItem,
                    quantity: items[itemIndex].quantity + nextItem.quantity,
                };
            } else {
                items.push(nextItem);
            }

            commitCart(items);

            const token = getTokenCookie('token');
            void syncOptimisticCart(token, () =>
                replaceServerCartItem(
                    token as string,
                    items.find(
                        (cartItem) => getCartItemKey(cartItem) === key,
                    ) ?? nextItem,
                ),
            );
        },

        updateCartItemQuantity: (item, quantity) => {
            const key = getCartItemKey(item);
            const nextQuantity = normalizeQuantity(quantity);
            const nextItem = get().cartItems.find(
                (cartItem) => getCartItemKey(cartItem) === key,
            );

            if (!nextItem) return;

            const items = get().cartItems.map((cartItem) =>
                getCartItemKey(cartItem) === key
                    ? { ...cartItem, quantity: nextQuantity }
                    : cartItem,
            );

            commitCart(items);

            const token = getTokenCookie('token');
            void syncOptimisticCart(token, () =>
                replaceServerCartItem(token as string, {
                    ...nextItem,
                    quantity: nextQuantity,
                }),
            );
        },

        removeCartItem: (item) => {
            const items = get().cartItems.filter(
                (cartItem) => getCartItemKey(cartItem) !== getCartItemKey(item),
            );

            commitCart(items);

            const token = getTokenCookie('token');
            void syncOptimisticCart(token, () =>
                removeServerCartItem(token as string, item),
            );
        },

        replaceCart: (items) => {
            const normalizedItems = items.map((item) => ({
                ...item,
                quantity: normalizeQuantity(item.quantity),
            }));

            commitCart(normalizedItems);
        },

        clearCart: () => {
            commitCart([]);
        },

        syncCart: async (token = getTokenCookie('token')) => {
            if (!token) return;

            await syncOptimisticCart(token, () =>
                syncCartWithServer(token, get().cartItems),
            );
        },
    };
};
