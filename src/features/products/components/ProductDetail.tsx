import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { CheckCircle2, ChevronLeft, Heart, Star, Truck } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import type { ProductResult } from '../types/ProductList.types';
import { ProductPurchasePanel } from './ProductPurchasePanel';

type ProductDetailProps = {
    product: ProductResult;
};

const currencyFormatter = new Intl.NumberFormat('fa-IR');

export function ProductDetail({ product }: ProductDetailProps) {
    const hasDiscount = product.discount_percent > 0;
    const thumbnails = product.image?.thumbnails ?? [];
    const categories = product.category_data ?? product.categories ?? [];
    const brandName = product.brand_data?.name ?? product.brand?.name;

    return (
        <main className="flex-1 bg-background">
            <article className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:px-8">
                <div className="space-y-8">
                    <nav
                        aria-label="مسیر صفحه"
                        className="flex items-center gap-1 text-sm text-muted-foreground"
                    >
                        <Link
                            href="/products"
                            className="hover:text-foreground"
                        >
                            محصولات
                        </Link>
                        <ChevronLeft aria-hidden="true" className="size-4" />
                        <span className="line-clamp-1 text-foreground">
                            {product.title}
                        </span>
                    </nav>

                    <section className="grid gap-6 lg:grid-cols-[minmax(20rem,28rem)_1fr]">
                        <div className="space-y-3">
                            <figure className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                                {product.image?.f ? (
                                    <Image
                                        src={product.image.f}
                                        alt={product.title}
                                        fill
                                        priority
                                        loading="eager"
                                        unoptimized
                                        sizes="(min-width: 1024px) 28rem, 100vw"
                                        className="object-cover"
                                    />
                                ) : (
                                    <figcaption className="flex size-full items-center justify-center text-sm text-muted-foreground">
                                        بدون تصویر
                                    </figcaption>
                                )}
                            </figure>

                            {thumbnails.length > 0 ? (
                                <div className="grid grid-cols-5 gap-2">
                                    {thumbnails.slice(0, 5).map((thumbnail) => (
                                        <div
                                            key={thumbnail.id}
                                            className="relative aspect-square overflow-hidden rounded-lg border bg-muted"
                                        >
                                            <Image
                                                src={thumbnail.f}
                                                alt=""
                                                fill
                                                unoptimized
                                                sizes="5rem"
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <header className="space-y-5">
                            <div className="flex flex-wrap items-center gap-2">
                                {categories.map((category) => (
                                    <Badge
                                        key={category.id}
                                        variant="secondary"
                                    >
                                        {category.name}
                                    </Badge>
                                ))}
                                {hasDiscount ? (
                                    <Badge variant="destructive">
                                        {currencyFormatter.format(
                                            product.discount_percent,
                                        )}
                                        ٪ تخفیف
                                    </Badge>
                                ) : null}
                            </div>

                            <div className="space-y-3">
                                <h1 className="text-2xl font-semibold leading-9 tracking-normal md:text-3xl md:leading-11">
                                    {product.title}
                                </h1>
                                <p className="text-sm text-muted-foreground">
                                    کد کالا: {product.code ?? 'ثبت نشده'}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="inline-flex items-center gap-1">
                                    <Star
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                    {currencyFormatter.format(
                                        product.rating || 0,
                                    )}
                                </span>
                                <span>
                                    {currencyFormatter.format(
                                        product.comments_count || 0,
                                    )}{' '}
                                    دیدگاه
                                </span>
                                <span>{brandName ?? 'بدون برند'}</span>
                            </div>

                            <Separator />

                            {product.excerpt ? (
                                <p className="text-sm leading-7 text-muted-foreground">
                                    {product.excerpt}
                                </p>
                            ) : null}

                            <dl className="grid gap-3 text-sm sm:grid-cols-2">
                                <div className="rounded-lg border p-3">
                                    <dt className="text-muted-foreground">
                                        وضعیت موجودی
                                    </dt>
                                    <dd className="mt-1 font-medium">
                                        {product.in_stock
                                            ? `${currencyFormatter.format(product.stock)} عدد موجود`
                                            : 'ناموجود'}
                                    </dd>
                                </div>
                                <div className="rounded-lg border p-3">
                                    <dt className="text-muted-foreground">
                                        برند
                                    </dt>
                                    <dd className="mt-1 font-medium">
                                        {brandName ?? 'بدون برند'}
                                    </dd>
                                </div>
                            </dl>
                        </header>
                    </section>

                    <section aria-labelledby="product-info-heading">
                        <Card>
                            <CardHeader>
                                <CardTitle id="product-info-heading">
                                    اطلاعات محصول
                                </CardTitle>
                                <CardDescription>
                                    مشخصات اصلی و نکات مربوط به قیمت
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <dl className="grid gap-4 text-sm md:grid-cols-2">
                                    <DetailRow label="نوع موجودی">
                                        {product.stock_type || 'ثبت نشده'}
                                    </DetailRow>
                                    <DetailRow label="قیمت پایه">
                                        {currencyFormatter.format(
                                            product.regular_price,
                                        )}{' '}
                                        تومان
                                    </DetailRow>
                                    <DetailRow label="قیمت فروش">
                                        {currencyFormatter.format(
                                            product.sale_price || product.price,
                                        )}{' '}
                                        تومان
                                    </DetailRow>
                                    <DetailRow label="یادداشت قیمت">
                                        {product.price_notes || 'ندارد'}
                                    </DetailRow>
                                </dl>
                            </CardContent>
                        </Card>
                    </section>
                </div>

                <aside className="lg:sticky lg:top-6 lg:self-start">
                    <Card>
                        <CardHeader>
                            <CardTitle>خرید محصول</CardTitle>
                            <CardDescription>
                                قیمت و وضعیت نهایی قبل از افزودن به سبد
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                {hasDiscount ? (
                                    <p className="text-sm text-muted-foreground line-through">
                                        {currencyFormatter.format(
                                            product.regular_price,
                                        )}{' '}
                                        تومان
                                    </p>
                                ) : null}
                                <p className="text-2xl font-semibold">
                                    {currencyFormatter.format(product.price)}{' '}
                                    تومان
                                </p>
                            </div>

                            <div className="space-y-2 text-sm">
                                <p
                                    className={
                                        product.in_stock
                                            ? 'inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400'
                                            : 'text-muted-foreground'
                                    }
                                >
                                    <CheckCircle2
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                    {product.in_stock
                                        ? 'آماده ارسال'
                                        : 'در حال حاضر ناموجود'}
                                </p>
                                <p className="inline-flex items-center gap-2 text-muted-foreground">
                                    <Truck
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                    ارسال طبق شرایط فروشگاه
                                </p>
                            </div>

                            <ProductPurchasePanel product={product} />

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                            >
                                <Heart aria-hidden="true" className="size-4" />
                                افزودن به علاقه‌مندی‌ها
                            </Button>
                        </CardContent>
                    </Card>
                </aside>
            </article>
        </main>
    );
}

function DetailRow({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="grid gap-1 border-b pb-3 last:border-b-0 md:border-b">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium leading-7">{children}</dd>
        </div>
    );
}
