import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AuthCard } from '@/features/auth/components/AuthCard';

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
            <AuthCard mode="login" />
        </Suspense>
    );
}
