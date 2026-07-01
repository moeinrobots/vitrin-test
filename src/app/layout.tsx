import localFont from 'next/font/local';
import { cn } from '@/shared/lib/utils';
import { siteConfig } from '@/shared/lib/site';
import { AppProvider } from '@/shared/providers/AppProvider';

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

export const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: siteConfig.name,
    description: siteConfig.description,
    openGraph: {
        title: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        siteName: siteConfig.name,
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: siteConfig.name,
        description: siteConfig.description,
    },
};

const testTheme = {
    light: {
        background: '#fefce8',
        foreground: '#1c1917',
        card: '#ffffff',
        cardForeground: '#1c1917',
        primary: '#dc2626',
        primaryForeground: '#ffffff',
        secondary: '#fde68a',
        secondaryForeground: '#78350f',
        muted: '#fef3c7',
        mutedForeground: '#92400e',
        accent: '#f97316',
        accentForeground: '#ffffff',
        border: '#fbbf24',
        input: '#fbbf24',
        ring: '#dc2626',
    },
    dark: {
        background: '#1c1917',
        foreground: '#fefce8',
        card: '#292524',
        cardForeground: '#fefce8',
        primary: '#f97316',
        primaryForeground: '#1c1917',
        secondary: '#78350f',
        secondaryForeground: '#fef3c7',
        muted: '#44403c',
        mutedForeground: '#fde68a',
        accent: '#dc2626',
        accentForeground: '#ffffff',
        border: '#57534e',
        input: '#57534e',
        ring: '#f97316',
    },
    radius: '50%',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="fa"
            dir="rtl"
            suppressHydrationWarning
            className={cn('h-full antialiased font-sans', iranSans.variable)}
        >
            <body className="min-h-full flex flex-col">
                <AppProvider theme={testTheme}>{children}</AppProvider>
            </body>
        </html>
    );
}
