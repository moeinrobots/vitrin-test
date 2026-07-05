import { notFound } from 'next/navigation';
import {
    getProductBySlug,
    getProducts,
} from '@/features/products/api/products.server';
import { ProductDetail } from '@/features/products/components/ProductDetail';
import {
    createSeoMetadata,
    getMediaAlt,
    normalizeSeoConfig,
} from '@/shared/lib/seo';
import type { Metadata } from 'next';

type ProductDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateStaticParams() {
    const products = await getProducts({
        limit: 100,
        page: 1,
    });

    return products.results.map((product) => ({
        slug: product.slug,
    }));
}

export async function generateMetadata({
    params,
}: ProductDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(decodeURIComponent(slug));

    if (!product) {
        return {
            title: 'محصول پیدا نشد',
        };
    }

    return createProductMetadata(product);
}

export default async function ProductDetailPage({
    params,
}: ProductDetailPageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(decodeURIComponent(slug));

    if (!product) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: product.image?.f ? [product.image.f] : undefined,
        description: product.excerpt || product.title,
        sku: product.code ?? undefined,
        brand:
            (product.brand_data?.name ?? product.brand?.name)
                ? {
                      '@type': 'Brand',
                      name: product.brand_data?.name ?? product.brand?.name,
                  }
                : undefined,
        aggregateRating:
            product.rating > 0
                ? {
                      '@type': 'AggregateRating',
                      ratingValue: product.rating,
                      reviewCount: product.comments_count || 1,
                  }
                : undefined,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'IRR',
            price: product.price,
            availability: product.in_stock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
                }}
            />
            <ProductDetail product={product} />
        </>
    );
}

function createProductMetadata(
    product: Awaited<ReturnType<typeof getProductBySlug>>,
) {
    if (!product) {
        return {
            title: 'محصول پیدا نشد',
        };
    }

    const image = product.image?.f
        ? [
              {
                  url: product.image.f,
                  alt: getMediaAlt(product.image, product.title),
                  width: product.image.width,
                  height: product.image.height,
              },
          ]
        : undefined;

    return createSeoMetadata(
        normalizeSeoConfig(product, {
            title: product.title,
            description:
                product.excerpt || product.price_notes || product.title,
            canonical: `/products/${product.slug}`,
            images: image,
        }),
        {
            title: product.title,
            description:
                product.excerpt || product.price_notes || product.title,
            canonical: `/products/${product.slug}`,
            images: image,
        },
    );
}
