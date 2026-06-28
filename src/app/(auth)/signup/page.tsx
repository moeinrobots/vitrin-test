import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'ثبت‌نام',
    robots: {
        index: false,
        follow: false,
    },
};

export default function RegisterPage() {
    return (
        <Suspense>
            <p>ثبت‌نام در سایت</p>
        </Suspense>
    );
}
