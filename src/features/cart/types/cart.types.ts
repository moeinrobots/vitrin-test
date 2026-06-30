export interface CartItemSnapshot {
    title?: string;
    image?: string;
    price?: number;
    currency?: string;
}

export interface CartItem {
    productId: string;
    variantId?: string;
    quantity: number;
    snapshot?: CartItemSnapshot;
}

export interface CartSyncResult {
    items: CartItem[];
}
