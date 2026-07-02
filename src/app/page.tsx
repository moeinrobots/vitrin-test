import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { SiteShell } from '@/shared/components/layout/SiteShell';
import { getInitialSiteConfig } from '@/shared/lib/initial-config';

export default async function Home() {
    const initialConfig = await getInitialSiteConfig();

    return (
        <SiteShell>
            <section className="border-b bg-muted/30">
                <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:items-center lg:px-8 lg:py-16">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                            <ShieldCheck
                                aria-hidden="true"
                                className="size-4"
                            />
                            خرید ساده، سریع و مطمئن
                        </div>
                        <div className="space-y-4">
                            <h1 className="max-w-2xl text-3xl font-bold leading-12 sm:text-4xl">
                                {initialConfig.siteName}
                            </h1>
                            <p className="max-w-xl text-base leading-8 text-muted-foreground">
                                {initialConfig.description}
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button asChild size="lg">
                                <Link href="/products">
                                    مشاهده محصولات
                                    <ArrowLeft aria-hidden="true" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link href="/order-tracking">پیگیری سفارش</Link>
                            </Button>
                        </div>
                    </div>

                    {/* <div className="grid gap-3 rounded-lg border bg-background p-4">
                        <div className="flex items-center gap-3 rounded-lg bg-muted/60 p-4">
                            <PackageSearch
                                aria-hidden="true"
                                className="size-6 text-foreground"
                            />
                            <div>
                                <h2 className="text-sm font-semibold">
                                    جستجوی دقیق محصول
                                </h2>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    محصولات را با فیلترهای کاربردی پیدا کنید.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg bg-muted/60 p-4">
                            <Truck
                                aria-hidden="true"
                                className="size-6 text-foreground"
                            />
                            <div>
                                <h2 className="text-sm font-semibold">
                                    ارسال و پیگیری سفارش
                                </h2>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    مسیر سفارش را از داخل سایت دنبال کنید.
                                </p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </section>
        </SiteShell>
    );
}
