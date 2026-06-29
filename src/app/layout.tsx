import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '../styles/globals.css';
import { siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';

const iranSans = localFont({
    src: [
        {
            path: '../assets/fonts/ultra_light.ttf',
            weight: '100',
            style: 'normal',
        },
        {
            path: '../assets/fonts/light.ttf',
            weight: '300',
            style: 'normal',
        },
        {
            path: '../assets/fonts/regular.ttf',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../assets/fonts/medium.ttf',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../assets/fonts/bold.ttf',
            weight: '700',
            style: 'normal',
        },
        {
            path: '../assets/fonts/black.ttf',
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
