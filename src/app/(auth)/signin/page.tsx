import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'ورود',
    robots: {
        index: false,
        follow: false,
    },
};

export default function LoginPage() {
    return (
        <Suspense>
            <p>ورود به حساب کاربری</p>
        </Suspense>
    );
}
