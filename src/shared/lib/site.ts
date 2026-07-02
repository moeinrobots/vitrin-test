export const siteConfig = {
    name: process.env.SITE_NAME ?? 'ویترین',
    description: 'پلتفرم سایت ساز ویترین',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vitrin.com',
};

export function getAbsoluteUrl(path = '/') {
    return new URL(path, siteConfig.url).toString();
}
