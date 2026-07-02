import {
    getPathAvailability,
    getInitialSiteConfig,
} from '@/shared/lib/initial-config';
import { MaintenanceScreen } from '@/shared/components/shared/MaintenanceScreen';

export default async function AboutPage() {
    const config = await getInitialSiteConfig();
    const availability = getPathAvailability(config, '/about');

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
            <h1 className="text-2xl font-semibold tracking-normal">
                درباره ما
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                {config.description}
            </p>
        </section>
    );
}
