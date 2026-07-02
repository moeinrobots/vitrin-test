import type { ReactNode } from 'react';

import { SiteShell } from '@/shared/components/layout/SiteShell';

export default function StoreLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return <SiteShell>{children}</SiteShell>;
}
