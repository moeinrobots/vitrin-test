import type { Metadata } from 'next';
import localFont from 'next/font/local';

import {
    getInitialSiteConfig,
} from '@/shared/lib/initial-config';
import {
    createRuntimeThemeCss,
    normalizeRuntimeTheme,
} from '@/shared/lib/theme-css';
import { cn } from '@/shared/lib/utils';
import { createSeoMetadata } from '@/shared/lib/seo';
import { AppProvider } from '@/shared/providers/AppProvider';

import '../shared/styles/globals.css';

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
    const metadata = createSeoMetadata(initialConfig.seo, {
        title: initialConfig.siteName,
        description: initialConfig.description,
        canonical: '/',
        siteName: initialConfig.siteName,
        images: [initialConfig.logo, iconUrl].flatMap((url) =>
            url ? [{ url, alt: initialConfig.siteName }] : [],
        ),
    });

    return {
        ...metadata,
        icons: iconUrl
            ? {
                  icon: [{ url: iconUrl }],
                  shortcut: [iconUrl],
                  apple: [{ url: iconUrl }],
              }
            : undefined,
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
                <AppProvider theme={initialConfig.theme}>{children}</AppProvider>
            </body>
        </html>
    );
}
