import React from 'react';
import { getInitialSiteConfig, getPageSeo } from '@/shared/lib/initial-config';
import { createSeoMetadata } from '@/shared/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const config = await getInitialSiteConfig();

    return createSeoMetadata(getPageSeo(config, '/order-tracking'), {
        title: 'پیگیری سفارش',
        description: config.description,
        canonical: '/order-tracking',
        siteName: config.siteName,
        images: config.seo?.images,
    });
}

export default function page() {
    return <div>page</div>;
}
