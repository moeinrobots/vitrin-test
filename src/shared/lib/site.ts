export const siteConfig = {
    name: process.env.SITE_NAME ?? 'ویترین',
    description: 'به سایت ساز ویترین خوش آمدید',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vitrin.com',
};

export function getAbsoluteUrl(path = '/') {
    return new URL(path, siteConfig.url).toString();
}
