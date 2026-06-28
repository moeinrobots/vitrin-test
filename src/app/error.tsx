'use client';

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ErrorPageProps = {
    error: Error & { digest?: string };
    unstable_retry: () => void;
};

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
            <section className="w-full max-w-md space-y-6 text-center">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                        Something went wrong
                    </p>
                    <h1 className="text-3xl font-semibold tracking-normal">
                        We could not load this part of Vitrin CMS.
                    </h1>
                    <p className="text-sm leading-6 text-muted-foreground">
                        Try again. If it keeps happening, refresh the page or
                        come back in a moment.
                    </p>
                </div>

                {error.digest ? (
                    <p className="rounded-lg border bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
                        Error ID: {error.digest}
                    </p>
                ) : null}

                <Button
                    type="button"
                    size="lg"
                    className="mx-auto"
                    onClick={() => unstable_retry()}
                >
                    <RotateCcw aria-hidden="true" />
                    Try again
                </Button>
            </section>
        </main>
    );
}
