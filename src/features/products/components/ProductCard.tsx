import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import type { ProductResult } from '../types/ProductList.types';

type ProductCardProps = {
    product: ProductResult;
};

const currencyFormatter = new Intl.NumberFormat('fa-IR');

export function ProductCard({ product }: ProductCardProps) {
    const imageUrl = product.image?.f;
    const hasDiscount = product.discount_percent > 0;
    const brandName = product.brand_data?.name ?? product.brand?.name;

    return (
        <article className="group overflow-hidden rounded-lg border bg-card text-card-foreground transition-colors hover:border-foreground/20">
            <Link
                href={`/products/${product.slug}`}
                className="relative block aspect-square bg-muted"
            >
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={product.title}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                        unoptimized
                    />
                ) : (
                    <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                        بدون تصویر
                    </div>
                )}
            </Link>

            <div className="space-y-3 p-3">
                <div className="flex items-start justify-between gap-3">
                    <Link
                        href={`/products/${product.slug}`}
                        className="line-clamp-2 min-h-10 text-sm font-medium leading-5"
                    >
                        {product.title}
                    </Link>

                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border text-muted-foreground">
                        <Heart
                            aria-hidden="true"
                            className={
                                product.is_favorite
                                    ? 'size-4 fill-current text-destructive'
                                    : 'size-4'
                            }
                        />
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>{brandName ?? 'بدون برند'}</span>
                    <span className="inline-flex items-center gap-1">
                        <Star aria-hidden="true" className="size-3.5" />
                        {currencyFormatter.format(product.rating || 0)}
                    </span>
                </div>

                <div className="flex min-h-11 items-end justify-between gap-3">
                    <div className="space-y-1">
                        {hasDiscount ? (
                            <p className="text-xs text-muted-foreground line-through">
                                {currencyFormatter.format(
                                    product.regular_price,
                                )}
                            </p>
                        ) : null}
                        <p className="text-sm font-semibold">
                            {currencyFormatter.format(product.price)} تومان
                        </p>
                    </div>

                    {hasDiscount ? (
                        <span className="rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                            {currencyFormatter.format(product.discount_percent)}
                            ٪
                        </span>
                    ) : null}
                </div>

                <p
                    className={
                        product.in_stock
                            ? 'text-xs text-emerald-600 dark:text-emerald-400'
                            : 'text-xs text-muted-foreground'
                    }
                >
                    {product.in_stock ? 'موجود' : 'ناموجود'}
                </p>
            </div>
        </article>
    );
}
