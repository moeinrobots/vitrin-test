export type MaintenanceMode = 'maintenance' | 'offHours';

type MaintenanceScreenProps = {
    siteName: string;
    mode?: MaintenanceMode;
    title?: string;
    message?: string;
    workingHours?: string;
};

const modeContent: Record<
    MaintenanceMode,
    {
        title: string;
        message: string;
    }
> = {
    maintenance: {
        title: 'در حال تعمیر',
        message: 'این بخش موقتاً در حال تعمیر است.',
    },
    offHours: {
        title: 'خارج از ساعت کاری',
        message: 'این بخش در حال حاضر خارج از ساعت کاری در دسترس نیست.',
    },
};

export function MaintenanceScreen({
    siteName,
    mode = 'maintenance',
    title,
    message,
    workingHours,
}: MaintenanceScreenProps) {
    const isOffHours = mode === 'offHours';
    const content = modeContent[mode];

    return (
        <main className="flex min-h-screen flex-1 items-center justify-center bg-background px-4">
            <section className="w-full max-w-md space-y-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                    {siteName}
                </p>
                <h1 className="text-2xl font-semibold tracking-normal">
                    {title ?? content.title}
                </h1>
                <p className="text-sm leading-7 text-muted-foreground">
                    {message ?? content.message}
                </p>
                {isOffHours && workingHours ? (
                    <div className="rounded-lg border bg-card px-4 py-3 text-sm">
                        <span className="text-muted-foreground">
                            ساعت کاری:{' '}
                        </span>
                        <span className="font-medium">{workingHours}</span>
                    </div>
                ) : null}
            </section>
        </main>
    );
}
