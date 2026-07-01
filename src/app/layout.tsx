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
        background: '#f8fafc',
        foreground: '#0f172a',
        card: '#ffffff',
        cardForeground: '#0f172a',
        primary: '#2563eb',
        primaryForeground: '#ffffff',
        secondary: '#e2e8f0',
        secondaryForeground: '#334155',
        muted: '#f1f5f9',
        mutedForeground: '#64748b',
        accent: '#f97316',
        accentForeground: '#ffffff',
        border: '#e2e8f0',
        input: '#e2e8f0',
        ring: '#2563eb',
    },
    dark: {
        background: '#020617',
        foreground: '#f8fafc',
        card: '#0f172a',
        cardForeground: '#f8fafc',
        primary: '#3b82f6',
        primaryForeground: '#ffffff',
        secondary: '#1e293b',
        secondaryForeground: '#cbd5e1',
        muted: '#1e293b',
        mutedForeground: '#94a3b8',
        accent: '#fb923c',
        accentForeground: '#ffffff',
        border: '#334155',
        input: '#334155',
        ring: '#3b82f6',
    },
    radius: '0.75rem',
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
