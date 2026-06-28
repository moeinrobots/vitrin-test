import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AuthCard } from '@/features/auth/components/AuthCard';

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
            <AuthCard mode="register" />
        </Suspense>
    );
}
