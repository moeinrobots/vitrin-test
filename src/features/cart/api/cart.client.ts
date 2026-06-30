import type { CartItem, CartSyncResult } from '../types/cart.types';

const CART_ENDPOINT = '/api/cart';
const CART_SYNC_ENDPOINT = '/api/cart/sync';

async function cartRequest<T>(
    url: string,
    token: string,
    init: RequestInit,
): Promise<T> {
    const response = await fetch(url, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...init.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`Cart request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
}

export function syncCartWithServer(
    token: string,
    items: CartItem[],
): Promise<CartSyncResult> {
    return cartRequest<CartSyncResult>(CART_SYNC_ENDPOINT, token, {
        method: 'POST',
        body: JSON.stringify({ items }),
    });
}

export function replaceServerCartItem(
    token: string,
    item: CartItem,
): Promise<CartSyncResult> {
    return cartRequest<CartSyncResult>(CART_ENDPOINT, token, {
        method: 'PUT',
        body: JSON.stringify({ item }),
    });
}

export function removeServerCartItem(
    token: string,
    item: Pick<CartItem, 'productId' | 'variantId'>,
): Promise<CartSyncResult> {
    return cartRequest<CartSyncResult>(CART_ENDPOINT, token, {
        method: 'DELETE',
        body: JSON.stringify({ item }),
    });
}
