import { siteConfig } from '@/shared/lib/site';

type SharedOpenGraphImageProps = {
    title?: string;
    description?: string;
};

export function SharedOpenGraphImage({
    title = siteConfig.name,
    description = siteConfig.description,
}: SharedOpenGraphImageProps) {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#f8fafc',
                color: '#111827',
                padding: 72,
                fontFamily: 'Inter, Arial, sans-serif',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    fontSize: 34,
                    fontWeight: 700,
                }}
            >
                <div
                    style={{
                        width: 56,
                        height: 56,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#111827',
                        color: '#ffffff',
                        borderRadius: 14,
                    }}
                >
                    V
                </div>
                {siteConfig.name}
            </div>

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 24,
                    maxWidth: 860,
                }}
            >
                <div
                    style={{
                        fontSize: 92,
                        fontWeight: 800,
                        lineHeight: 0.95,
                        letterSpacing: 0,
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        fontSize: 34,
                        lineHeight: 1.35,
                        color: '#475569',
                    }}
                >
                    {description}
                </div>
            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 26,
                    color: '#64748b',
                }}
            >
                <span>{siteConfig.url.replace(/^https?:\/\//, '')}</span>
                <span>CMS foundation for modern React apps</span>
            </div>
        </div>
    );
}
