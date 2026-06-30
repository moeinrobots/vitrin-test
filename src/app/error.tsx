'use client';

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

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
                    <p className="text-xl font-semibold tracking-normal">
                        خطایی رخ داده است
                    </p>
                    <p className="text-sm leading-6 text-muted-foreground">
                        لطفاً دوباره تلاش کنید. اگر مشکل همچنان ادامه داشت، صفحه
                        را بازنشانی کنید یا چند لحظه دیگر مجدداً امتحان کنید.
                    </p>
                </div>

                {error.digest ? (
                    <p className="rounded-lg border bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">
                        شناسه خطا: {error.digest}
                    </p>
                ) : null}

                <Button
                    type="button"
                    size="lg"
                    className="mx-auto"
                    onClick={() => unstable_retry()}
                >
                    <RotateCcw aria-hidden="true" />
                    تلاش مجدد
                </Button>
            </section>
        </main>
    );
}
