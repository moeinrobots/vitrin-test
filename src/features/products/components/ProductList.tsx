'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useMemo, useState, useTransition } from 'react';

import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
    normalizeProductQuery,
    productListQueryKey,
} from '../api/products.query';
import { ProductCard } from './ProductCard';
import { getProductsClient } from '../api/products.client';

import type {
    NormalizedProductQuery,
    ProductResponse,
} from '../types/ProductList.types';

type ProductListProps = {
    initialData: ProductResponse;
    initialQuery: NormalizedProductQuery;
};

export function ProductList({ initialData, initialQuery }: ProductListProps) {
    // hook
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // memo
    const query = useMemo(
        () => normalizeProductQuery(Object.fromEntries(searchParams.entries())),
        [searchParams],
    );

    // state
    const [search, setSearch] = useState(String(query.search ?? ''));

    const productsQuery = useQuery({
        queryKey: productListQueryKey(query),
        queryFn: () => getProductsClient(query),
        initialData: isSameQuery(query, initialQuery) ? initialData : undefined,
        placeholderData: keepPreviousData,
    });

    // derived value
    const products = productsQuery.data;
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 12);
    const totalPages = products
        ? Math.max(1, Math.ceil(products.count / limit))
        : 1;

    // handler
    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        handleUpdateQuery({ search: search.trim() || undefined, page: 1 });
    }

    function handleUpdateQuery(nextQuery: Partial<NormalizedProductQuery>) {
        const params = new URLSearchParams(searchParams);

        Object.entries(nextQuery).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') {
                params.delete(key);
                return;
            }

            params.set(key, String(value));
        });

        startTransition(() => {
            const qs = params.toString();
            router.replace(qs ? `/products?${qs}` : '/products', {
                scroll: false,
            });
        });
    }

    return (
        <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 border-b pb-5 md:flex-row md:items-end md:justify-between">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-normal">
                        محصولات
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {products
                            ? `${products.count.toLocaleString('fa-IR')} محصول`
                            : 'در حال دریافت محصولات'}
                    </p>
                </div>

                <form
                    onSubmit={handleSearch}
                    className="flex w-full gap-2 md:max-w-sm"
                >
                    <Input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="جستجوی محصول"
                        className="h-9"
                    />
                    <Button type="submit" size="lg" disabled={isPending}>
                        <Search aria-hidden="true" />
                        جستجو
                    </Button>
                </form>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Button
                    type="button"
                    variant={
                        query.ordering === '-created_date'
                            ? 'default'
                            : 'outline'
                    }
                    onClick={() =>
                        handleUpdateQuery({
                            ordering: '-created_date',
                            page: 1,
                        })
                    }
                >
                    جدیدترین
                </Button>
                <Button
                    type="button"
                    variant={query.ordering === 'price' ? 'default' : 'outline'}
                    onClick={() =>
                        handleUpdateQuery({ ordering: 'price', page: 1 })
                    }
                >
                    ارزان‌ترین
                </Button>
                <Button
                    type="button"
                    variant={
                        query.ordering === '-price' ? 'default' : 'outline'
                    }
                    onClick={() =>
                        handleUpdateQuery({ ordering: '-price', page: 1 })
                    }
                >
                    گران‌ترین
                </Button>
                <Button
                    type="button"
                    variant={query.in_stock === 'true' ? 'default' : 'outline'}
                    onClick={() =>
                        handleUpdateQuery({
                            in_stock:
                                query.in_stock === 'true' ? undefined : 'true',
                            page: 1,
                        })
                    }
                >
                    فقط موجود
                </Button>
            </div>

            {productsQuery.isError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    دریافت محصولات با خطا مواجه شد.
                </div>
            ) : null}

            <div
                className={
                    productsQuery.isFetching
                        ? 'grid grid-cols-2 gap-4 opacity-60 transition-opacity md:grid-cols-3 lg:grid-cols-4'
                        : 'grid grid-cols-2 gap-4 transition-opacity md:grid-cols-3 lg:grid-cols-4'
                }
            >
                {products?.results.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {products?.results.length === 0 ? (
                <div className="rounded-lg border bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
                    محصولی با این فیلترها پیدا نشد.
                </div>
            ) : null}

            <div className="flex items-center justify-between border-t pt-5">
                <Button
                    type="button"
                    variant="outline"
                    disabled={page <= 1 || productsQuery.isFetching}
                    onClick={() => handleUpdateQuery({ page: page - 1 })}
                >
                    قبلی
                </Button>
                <span className="text-sm text-muted-foreground">
                    صفحه {page.toLocaleString('fa-IR')} از{' '}
                    {totalPages.toLocaleString('fa-IR')}
                </span>
                <Button
                    type="button"
                    variant="outline"
                    disabled={page >= totalPages || productsQuery.isFetching}
                    onClick={() => handleUpdateQuery({ page: page + 1 })}
                >
                    بعدی
                </Button>
            </div>
        </section>
    );
}

function isSameQuery(
    currentQuery: NormalizedProductQuery,
    initialQuery: NormalizedProductQuery,
) {
    return JSON.stringify(currentQuery) === JSON.stringify(initialQuery);
}
