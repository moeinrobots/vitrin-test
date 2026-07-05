import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    allowedDevOrigins: ['192.168.70.118'],
    async headers() {
        return [
            {
                source: '/robots.txt',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
                    },
                ],
            },
            {
                source: '/sitemap.xml',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
