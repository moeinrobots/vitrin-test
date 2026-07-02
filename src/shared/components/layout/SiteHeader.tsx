import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, UserRound } from 'lucide-react';

import LogoIcon from '@/shared/assets/icons/icons';
import { Button } from '@/shared/components/ui/button';
import type { InitialSiteConfig } from '@/shared/lib/initial-config';

const navigationItems = [
    { href: '/', label: 'خانه' },
    { href: '/products', label: 'محصولات' },
    { href: '/shop', label: 'فروشگاه' },
    { href: '/blogs', label: 'بلاگ' },
    { href: '/about', label: 'درباره ما' },
];

type SiteHeaderProps = {
    config: InitialSiteConfig;
};

export function SiteHeader({ config }: SiteHeaderProps) {
    return (
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-3">
                    <Link
                        href="/"
                        className="flex min-w-0 items-center gap-2 font-semibold"
                    >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-card">
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
                        <span className="truncate text-base">
                            {config.siteName}
                        </span>
                    </Link>

                    <div className="flex shrink-0 items-center gap-1.5">
                        <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            title="علاقه‌مندی‌ها"
                        >
                            <Link
                                href="/panel/favorites"
                                aria-label="علاقه‌مندی‌ها"
                            >
                                <Heart aria-hidden="true" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            title="سبد خرید"
                        >
                            <Link href="/cart" aria-label="سبد خرید">
                                <ShoppingBag aria-hidden="true" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/signin">
                                <UserRound aria-hidden="true" />
                                ورود
                            </Link>
                        </Button>
                    </div>
                </div>

                <nav
                    aria-label="ناوبری اصلی"
                    className="flex gap-1 overflow-x-auto text-sm text-muted-foreground"
                >
                    {navigationItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="shrink-0 rounded-lg px-3 py-2 transition-colors hover:bg-muted hover:text-foreground"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
