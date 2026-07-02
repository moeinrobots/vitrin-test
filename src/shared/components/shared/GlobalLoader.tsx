export function GlobalLoader() {
    return (
        <main
            aria-busy="true"
            aria-label="Loading"
            className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground"
        >
            <div className="flex w-full max-w-sm flex-col items-center gap-6">
                <div className="relative size-14">
                    <div className="absolute inset-0 rounded-full border-4 border-muted" />
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
                </div>

                {/* <div className="flex w-full flex-col gap-3">
                    <div className="h-3 w-2/3 animate-pulse rounded-full bg-muted" />
                    <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
                    <div className="h-3 w-5/6 animate-pulse rounded-full bg-muted" />
                </div> */}
            </div>
        </main>
    );
}
