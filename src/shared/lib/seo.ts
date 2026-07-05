import type { Metadata } from 'next';

import { siteConfig } from './site';

export type SeoImage = {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
    type?: string;
};

export type SeoConfig = {
    title?: string;
    description?: string;
    keywords?: string[];
    canonical?: string;
    noIndex?: boolean;
    noFollow?: boolean;
    images?: SeoImage[];
};

type SeoDefaults = {
    title: string;
    description?: string;
    canonical?: string;
    siteName?: string;
    type?: 'website' | 'article';
    images?: SeoImage[];
};

export function normalizeSeoConfig(
    value: unknown,
    defaults: Partial<SeoConfig> = {},
): SeoConfig {
    const source = getSeoSource(value);
    const openGraph =
        getRecord(source?.openGraph) ??
        getRecord(source?.open_graph) ??
        getRecord(source?.og);
    const twitter = getRecord(source?.twitter);
    const robots = getRecord(source?.robots);
    const imageSource =
        source?.image ??
        source?.images ??
        source?.ogImage ??
        source?.openGraphImage ??
        openGraph?.image ??
        openGraph?.images ??
        twitter?.image ??
        twitter?.images;

    return compactSeoConfig({
        title:
            getString(source?.title) ??
            getString(source?.metaTitle) ??
            getString(source?.meta_title) ??
            getString(openGraph?.title) ??
            defaults.title,
        description:
            getString(source?.description) ??
            getString(source?.metaDescription) ??
            getString(source?.meta_description) ??
            getString(openGraph?.description) ??
            defaults.description,
        keywords:
            getStringArray(source?.keywords) ??
            getCommaSeparatedStrings(source?.keywords) ??
            defaults.keywords,
        canonical:
            getString(source?.canonical) ??
            getString(source?.canonicalUrl) ??
            getString(source?.canonical_url) ??
            defaults.canonical,
        noIndex: getSeoRobotValue(
            getBoolean(source?.noIndex) ?? getBoolean(source?.no_index),
            getBoolean(robots?.index),
            defaults.noIndex,
        ),
        noFollow: getSeoRobotValue(
            getBoolean(source?.noFollow) ?? getBoolean(source?.no_follow),
            getBoolean(robots?.follow),
            defaults.noFollow,
        ),
        images: normalizeSeoImages(imageSource, defaults.images),
    });
}

export function createSeoMetadata(
    seo: SeoConfig | undefined,
    defaults: SeoDefaults,
): Metadata {
    const title = seo?.title ?? defaults.title;
    const description = seo?.description ?? defaults.description;
    const images = seo?.images?.length ? seo.images : defaults.images;
    const canonical = seo?.canonical ?? defaults.canonical;

    return {
        metadataBase: new URL(siteConfig.url),
        title,
        description,
        keywords: seo?.keywords,
        alternates: canonical
            ? {
                  canonical,
              }
            : undefined,
        robots:
            seo?.noIndex || seo?.noFollow
                ? {
                      index: !seo.noIndex,
                      follow: !seo.noFollow,
                  }
                : undefined,
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: defaults.siteName,
            type: defaults.type ?? 'website',
            images: images?.map(toMetadataImage),
        },
        twitter: {
            card: images?.length ? 'summary_large_image' : 'summary',
            title,
            description,
            images: images?.map(toMetadataImage),
        },
    };
}

export function getMediaAlt(
    media: unknown,
    fallback: string,
    index?: number,
): string {
    const image = getRecord(media);
    const seo = normalizeSeoConfig(image);
    const alt =
        getString(image?.alt) ??
        getString(image?.alternativeText) ??
        getString(image?.description) ??
        getString(image?.caption) ??
        seo.description ??
        seo.title;

    if (alt) return alt;
    if (typeof index === 'number') return `${fallback} - تصویر ${index + 1}`;

    return fallback;
}

function getSeoSource(value: unknown) {
    const record = getRecord(value);
    if (!record) return undefined;

    return (
        getRecord(record.seo) ??
        getRecord(record.meta) ??
        getRecord(record.metadata) ??
        record
    );
}

function normalizeSeoImages(
    value: unknown,
    fallback?: SeoImage[],
): SeoImage[] | undefined {
    const images = (Array.isArray(value) ? value : [value]).flatMap(
        (item): SeoImage[] => {
            const record = getRecord(item);
            const url =
                getString(item) ??
                getString(record?.url) ??
                getString(record?.src) ??
                getString(record?.f);

            if (!url) return [];

            return [
                {
                    url,
                    alt:
                        getString(record?.alt) ??
                        getString(record?.description) ??
                        getString(record?.title),
                    width: getNumber(record?.width),
                    height: getNumber(record?.height),
                    type: getString(record?.type),
                },
            ];
        },
    );

    return images.length ? images : fallback;
}

function toMetadataImage(image: SeoImage) {
    return {
        url: image.url,
        alt: image.alt,
        width: image.width,
        height: image.height,
        type: image.type,
    };
}

function compactSeoConfig(seo: SeoConfig): SeoConfig {
    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords?.length ? seo.keywords : undefined,
        canonical: seo.canonical,
        noIndex: seo.noIndex,
        noFollow: seo.noFollow,
        images: seo.images?.length ? seo.images : undefined,
    };
}

function getString(value: unknown) {
    if (typeof value !== 'string') return undefined;

    const trimmed = value.trim();

    return trimmed || undefined;
}

function getStringArray(value: unknown) {
    if (!Array.isArray(value)) return undefined;

    const values = value.flatMap((item) => {
        const stringValue = getString(item);

        return stringValue ? [stringValue] : [];
    });

    return values.length ? values : undefined;
}

function getCommaSeparatedStrings(value: unknown) {
    const stringValue = getString(value);
    if (!stringValue) return undefined;

    const values = stringValue
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    return values.length ? values : undefined;
}

function getNumber(value: unknown) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;

    return undefined;
}

function getBoolean(value: unknown) {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;

    return undefined;
}

function getSeoRobotValue(
    directValue: boolean | undefined,
    inverseRobotValue: boolean | undefined,
    fallback: boolean | undefined,
) {
    if (typeof directValue === 'boolean') return directValue;
    if (typeof inverseRobotValue === 'boolean') return !inverseRobotValue;

    return fallback;
}

function getRecord(value: unknown): Record<string, unknown> | undefined {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : undefined;
}
