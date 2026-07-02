type MaintenanceScreenProps = {
    siteName: string;
    mode?: 'maintenance' | 'offHours';
    message?: string;
    workingHours?: string;
};

export function MaintenanceScreen({
    siteName,
    mode = 'maintenance',
    message,
    workingHours,
}: MaintenanceScreenProps) {
    const isOffHours = mode === 'offHours';

    return (
        <main className="flex min-h-screen flex-1 items-center justify-center bg-background px-4">
            <section className="w-full max-w-md space-y-4 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                    {siteName}
                </p>
                <h1 className="text-2xl font-semibold tracking-normal">
                    {isOffHours ? 'خارج از ساعت کاری' : 'در حال تعمیر'}
                </h1>
                <p className="text-sm leading-7 text-muted-foreground">
                    {message ??
                        (isOffHours
                            ? 'این بخش در حال حاضر خارج از ساعت کاری در دسترس نیست.'
                            : 'این بخش موقتاً در حال تعمیر است.')}
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
