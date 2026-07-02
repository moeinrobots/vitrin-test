import { getProducts } from '@/features/products/api/products.server';
import { ProductList } from '@/features/products/components/ProductList';
import { normalizeProductQuery } from '@/features/products/api/products.query';
import { getInitialSiteConfig } from '@/shared/lib/initial-config';

import type { ProductQuery } from '@/features/products/types/ProductList.types';

type ProductPageProps = {
    searchParams: Promise<ProductQuery>;
};

export default async function ProductPage({ searchParams }: ProductPageProps) {
    const query = normalizeProductQuery(await searchParams);
    const [products, config] = await Promise.all([
        getProducts(query),
        getInitialSiteConfig(),
    ]);

    return (
        <ProductList
            initialData={products}
            initialQuery={query}
            layout={config.layout}
        />
    );
}
