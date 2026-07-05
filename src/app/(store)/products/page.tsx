import { getProducts } from '@/features/products/api/products.server';
import { ProductList } from '@/features/products/components/ProductList';
import { normalizeProductQuery } from '@/features/products/api/products.query';
import { getInitialSiteConfig, getPageSeo } from '@/shared/lib/initial-config';
import { createSeoMetadata } from '@/shared/lib/seo';

import type { Metadata } from 'next';
import type { ProductQuery } from '@/features/products/types/ProductList.types';

type ProductPageProps = {
    searchParams: Promise<ProductQuery>;
};

export async function generateMetadata(): Promise<Metadata> {
    const config = await getInitialSiteConfig();

    return createSeoMetadata(getPageSeo(config, '/products'), {
        title: 'محصولات',
        description: config.description,
        canonical: '/products',
        siteName: config.siteName,
        images: config.seo?.images,
    });
}

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
