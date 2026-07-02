import type { ReactNode } from 'react';

import { getInitialSiteConfig } from '@/shared/lib/initial-config';

import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

type SiteShellProps = {
    children: ReactNode;
};

export async function SiteShell({ children }: SiteShellProps) {
    const initialConfig = await getInitialSiteConfig();

    return (
        <div className="flex min-h-screen flex-1 flex-col bg-background">
            <SiteHeader config={initialConfig} />
            <main className="flex flex-1 flex-col">{children}</main>
            <SiteFooter config={initialConfig} />
        </div>
    );
}
