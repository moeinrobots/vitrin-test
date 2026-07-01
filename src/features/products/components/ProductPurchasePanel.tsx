'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useAppStore } from '@/shared/stores';
import type { ProductResult } from '../types/ProductList.types';

type ProductPurchasePanelProps = {
    product: ProductResult;
};

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
    const addCartItem = useAppStore((state) => state.addCartItem);
    const [quantity, setQuantity] = useState(1);
    const maxQuantity = product.stock > 0 ? product.stock : 1;

    function updateQuantity(nextQuantity: number) {
        setQuantity(Math.min(maxQuantity, Math.max(1, nextQuantity)));
    }

    function addToCart() {
        addCartItem({
            productId: String(product.id),
            quantity,
            snapshot: {
                title: product.title,
                image: product.image?.f,
                price: product.price,
                currency: 'تومان',
            },
        });
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-[2rem_1fr_2rem] items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={!product.in_stock || quantity <= 1}
                    aria-label="کم کردن تعداد"
                    onClick={() => updateQuantity(quantity - 1)}
                >
                    <Minus aria-hidden="true" />
                </Button>
                <Input
                    type="number"
                    min={1}
                    max={maxQuantity}
                    value={quantity}
                    disabled={!product.in_stock}
                    aria-label="تعداد محصول"
                    className="h-8 text-center"
                    onChange={(event) =>
                        updateQuantity(Number(event.target.value))
                    }
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={!product.in_stock || quantity >= maxQuantity}
                    aria-label="زیاد کردن تعداد"
                    onClick={() => updateQuantity(quantity + 1)}
                >
                    <Plus aria-hidden="true" />
                </Button>
            </div>

            <Button
                type="button"
                size="lg"
                className="w-full"
                disabled={!product.in_stock}
                onClick={addToCart}
            >
                <ShoppingCart aria-hidden="true" />
                افزودن به سبد خرید
            </Button>
        </div>
    );
}
