import React from 'react';
import { getInitialSiteConfig, getPageSeo } from '@/shared/lib/initial-config';
import { createSeoMetadata } from '@/shared/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const config = await getInitialSiteConfig();

    return createSeoMetadata(getPageSeo(config, '/contents'), {
        title: 'محتواها',
        description: config.description,
        canonical: '/contents',
        siteName: config.siteName,
        images: config.seo?.images,
    });
}

export default function page() {
    return <div>page</div>;
}
