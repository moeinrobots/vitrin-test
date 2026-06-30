export const siteConfig = {
    name: process.env.SITE_NAME ?? 'Vitrin CMS',
    description: 'Create and manage React applications with Vitrin CMS.',
    url:
        process.env.NEXT_PUBLIC_SITE_URL ??
        (process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'https://vitrin.com'),
};

export function getAbsoluteUrl(path = '/') {
    return new URL(path, siteConfig.url).toString();
}
