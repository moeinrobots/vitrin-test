import {
    getInitialSiteConfig,
    getPageSeo,
    getPathAvailability,
} from '@/shared/lib/initial-config';
import { MaintenanceScreen } from '@/shared/components/shared/MaintenanceScreen';
import { createSeoMetadata } from '@/shared/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const config = await getInitialSiteConfig();

    return createSeoMetadata(getPageSeo(config, '/cart'), {
        title: 'سبد خرید',
        description: config.description,
        canonical: '/cart',
        siteName: config.siteName,
        images: config.seo?.images,
    });
}

export default async function CartPage() {
    const config = await getInitialSiteConfig();
    const availability = getPathAvailability(config, '/cart');

    if (availability) {
        return (
            <MaintenanceScreen
                siteName={config.siteName}
                mode={availability.mode}
                message={availability.message ?? config.maintenance.message}
                workingHours={availability.workingHours}
            />
        );
    }

    return (
        <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold tracking-normal">سبد خرید</h1>
            <p className="text-sm text-muted-foreground">
                سبد خرید شما در حال حاضر خالی است.
            </p>
        </section>
    );
}
