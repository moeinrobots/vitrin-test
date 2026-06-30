import { ImageResponse } from 'next/og';
import { SharedOpenGraphImage } from '@/shared/components/shared/opengraph-image';
import { siteConfig } from '@/shared/lib/site';

export const alt = siteConfig.name;
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
    return new ImageResponse(
        <SharedOpenGraphImage
            title={siteConfig.name}
            description={siteConfig.description}
        />,
        size,
    );
}
