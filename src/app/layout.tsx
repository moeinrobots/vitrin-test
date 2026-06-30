import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../shared/styles/globals.css';
import { siteConfig } from '@/shared/lib/site';
import { cn } from '@/shared/lib/utils';

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="fa"
            dir="rtl"
            className={cn('h-full antialiased font-sans', iranSans.variable)}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
