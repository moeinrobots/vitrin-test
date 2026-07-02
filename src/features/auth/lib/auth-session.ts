const AUTH_PHONE_STORAGE_KEY = 'auth:phone';

function canUseSessionStorage() {
    return typeof window !== 'undefined' && Boolean(window.sessionStorage);
}

export function getStoredAuthPhone() {
    if (!canUseSessionStorage()) return '';

    return window.sessionStorage.getItem(AUTH_PHONE_STORAGE_KEY) ?? '';
}

export function setStoredAuthPhone(phone: string) {
    if (!canUseSessionStorage()) return;

    const normalizedPhone = phone.trim();

    if (normalizedPhone) {
        window.sessionStorage.setItem(AUTH_PHONE_STORAGE_KEY, normalizedPhone);
    } else {
        window.sessionStorage.removeItem(AUTH_PHONE_STORAGE_KEY);
    }
}

export function clearStoredAuthPhone() {
    if (!canUseSessionStorage()) return;

    window.sessionStorage.removeItem(AUTH_PHONE_STORAGE_KEY);
}
