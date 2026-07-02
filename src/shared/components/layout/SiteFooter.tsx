import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

import LogoIcon from '@/shared/assets/icons/icons';
import type { InitialSiteConfig } from '@/shared/lib/initial-config';

const footerLinks = [
    { href: '/products', label: 'محصولات' },
    { href: '/order-tracking', label: 'پیگیری سفارش' },
    { href: '/contents', label: 'محتوا' },
    { href: '/posts', label: 'پست‌ها' },
];

type SiteFooterProps = {
    config: InitialSiteConfig;
};

export function SiteFooter({ config }: SiteFooterProps) {
    return (
        <footer className="border-t bg-muted/30">
            <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
                <div className="space-y-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 font-semibold"
                    >
                        <span className="flex size-9 items-center justify-center rounded-lg border bg-background">
                            {config.logo ? (
                                <Image
                                    src={config.logo}
                                    alt={`${config.siteName} logo`}
                                    width={24}
                                    height={24}
                                    className="size-6 object-contain"
                                    unoptimized
                                />
                            ) : (
                                <LogoIcon className="size-5" />
                            )}
                        </span>
                        {config.siteName}
                    </Link>
                    <p className="max-w-md text-sm leading-7 text-muted-foreground">
                        {config.description}
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-sm font-semibold">دسترسی سریع</h2>
                    <nav className="grid gap-2 text-sm text-muted-foreground">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="transition-colors hover:text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="space-y-4">
                    <h2 className="text-sm font-semibold">ارتباط با ما</h2>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                            <Phone aria-hidden="true" className="size-4" />
                            ۰۲۱-۰۰۰۰۰۰۰۰
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail aria-hidden="true" className="size-4" />
                            info@vitrin.com
                        </li>
                        <li className="flex items-center gap-2">
                            <MapPin aria-hidden="true" className="size-4" />
                            مشهد ,وکیل اباد
                        </li>
                    </ul>
                    <div className="flex items-center gap-2">
                        <Link
                            href="#"
                            aria-label="ایمیل"
                            className="flex size-8 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Mail aria-hidden="true" className="size-4" />
                        </Link>
                        <Link
                            href="#"
                            aria-label="تلگرام"
                            className="flex size-8 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Send aria-hidden="true" className="size-4" />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear().toLocaleString('fa-IR')}{' '}
                {config.siteName}
            </div>
        </footer>
    );
}
