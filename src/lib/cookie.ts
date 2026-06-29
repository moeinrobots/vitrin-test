const isBrowser = () => typeof document !== 'undefined';

export function getTokenCookie(name = 'token') {
    if (!isBrowser()) return null;

    const cookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${encodeURIComponent(name)}=`));

    if (!cookie) return null;

    return decodeURIComponent(cookie.split('=').slice(1).join('='));
}

export function setTokenCookie(
    name = 'token',
    value: string,
    ttlSeconds = 60 * 60 * 24 * 7,
) {
    if (!isBrowser()) return;

    document.cookie = [
        `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
        `Max-Age=${ttlSeconds}`,
        'Path=/',
        'SameSite=Lax',
        window.location.protocol === 'https:' ? 'Secure' : '',
    ]
        .filter(Boolean)
        .join('; ');
}

export function removeTokenCookie(name = 'token') {
    if (!isBrowser()) return;

    document.cookie = `${encodeURIComponent(
        name,
    )}=; Max-Age=0; Path=/; SameSite=Lax`;
}
