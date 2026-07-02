import localFont from 'next/font/local';
import { cn } from '@/shared/lib/utils';
import { siteConfig } from '@/shared/lib/site';
import { AppProvider } from '@/shared/providers/AppProvider';
import {
    getInitialSiteConfig,
    isProjectUnderMaintenance,
} from '@/shared/lib/initial-config';
import {
    createRuntimeThemeCss,
    normalizeRuntimeTheme,
} from '@/shared/lib/theme-css';
import { MaintenanceScreen } from '@/shared/components/shared/MaintenanceScreen';

import '../shared/styles/globals.css';

import type { Metadata } from 'next';

const iranSans = localFont({
    src: [
        {
            path: '../shared/assets/fonts/ultra_light.ttf',
            weight: '100',
            style: 'normal',
        },
        {
            path: '../shared/assets/fonts/light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../shared/assets/fonts/regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../shared/assets/fonts/medium.ttf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../shared/assets/fonts/bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../shared/assets/fonts/black.ttf',
            weight: '900',
            style: 'normal',
        },
    ],
    variable: '--font-iran-sans',
    display: 'swap',
    fallback: ['Tahoma', 'Arial', 'sans-serif'],
});

export async function generateMetadata(): Promise<Metadata> {
    const initialConfig = await getInitialSiteConfig();
    const iconUrl = initialConfig.icon;

    return {
        metadataBase: new URL(siteConfig.url),
        title: initialConfig.siteName,
        description: initialConfig.description,
        icons: iconUrl
            ? {
                  icon: [{ url: iconUrl }],
                  shortcut: [iconUrl],
                  apple: [{ url: iconUrl }],
              }
            : undefined,
        openGraph: {
            title: initialConfig.siteName,
            description: initialConfig.description,
            url: siteConfig.url,
            siteName: initialConfig.siteName,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: initialConfig.siteName,
            description: initialConfig.description,
        },
    };
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const initialConfig = await getInitialSiteConfig();
    const runtimeThemeCss = createRuntimeThemeCss(
        normalizeRuntimeTheme(initialConfig.theme),
    );
    const page = isProjectUnderMaintenance(initialConfig) ? (
        <MaintenanceScreen
            siteName={initialConfig.siteName}
            message={initialConfig.maintenance.message}
        />
    ) : (
        children
    );

    return (
        <html
            lang="fa"
            dir="rtl"
            suppressHydrationWarning
            className={cn('h-full antialiased font-sans', iranSans.variable)}
        >
            <body className="min-h-full flex flex-col">
                {runtimeThemeCss ? (
                    <style
                        id="runtime-theme"
                        dangerouslySetInnerHTML={{ __html: runtimeThemeCss }}
                    />
                ) : null}
                <AppProvider theme={initialConfig.theme}>{page}</AppProvider>
            </body>
        </html>
    );
}
