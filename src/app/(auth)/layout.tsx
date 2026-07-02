import type { ReactNode } from 'react';

export default function AuthLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <main className="flex min-h-screen flex-1 items-center justify-center bg-muted/40 px-4 py-8">
            <section className="flex w-full max-w-md flex-col items-center gap-6">
                {children}
            </section>
        </main>
    );
}
