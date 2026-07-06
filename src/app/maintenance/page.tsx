import type { Metadata } from 'next';

import {
    getInitialSiteConfig,
    getPathAvailability,
} from '@/shared/lib/initial-config';
import { MaintenanceScreen } from '@/shared/components/shared/MaintenanceScreen';

type MaintenancePageProps = {
    searchParams: Promise<{
        path?: string;
    }>;
};

export const metadata: Metadata = {
    title: 'در دسترس نیست',
};

export default async function MaintenancePage({
    searchParams,
}: MaintenancePageProps) {
    const [{ path }, config] = await Promise.all([
        searchParams,
        getInitialSiteConfig(),
    ]);
    const availability = getPathAvailability(config, path ?? '/maintenance');

    return (
        <MaintenanceScreen
            siteName={config.siteName}
            mode={availability?.mode ?? config.maintenance.mode}
            message={
                availability?.message ??
                config.maintenance.message ??
                config.description
            }
            workingHours={
                availability?.workingHours ?? config.maintenance.workingHours
            }
        />
    );
}
