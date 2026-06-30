import { ProfileType } from '@/features/profile/types/profile.types';
import {
    getTokenCookie,
    removeTokenCookie,
    setTokenCookie,
} from '@/shared/lib/cookie';

import type { StateCreator } from 'zustand';

const USER_STORAGE_KEY = 'user';

const isBrowser = () => typeof window !== 'undefined';

function getStoredUser() {
    if (!isBrowser()) return null;

    try {
        return JSON.parse(
            window.localStorage.getItem(USER_STORAGE_KEY) || 'null',
        ) as ProfileType | null;
    } catch {
        window.localStorage.removeItem(USER_STORAGE_KEY);
        return null;
    }
}

export interface UserSlice {
    user: ProfileType | null;
    token: string | null;
    phone: string | null;
    setPhone: (phone: string) => void;
    setUser: (u: ProfileType | null | undefined) => void;
    setToken: (token: string | null, ttlSeconds?: number) => void;
    logout: () => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
    user: getStoredUser(),
    token: getTokenCookie('token') || null,
    phone: null,
    setPhone: (phone) => {
        set({ phone });
    },
    setUser: (user) => {
        set({ user: user ?? null });

        if (!isBrowser()) return;

        if (user) {
            window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        } else {
            window.localStorage.removeItem(USER_STORAGE_KEY);
        }
    },

    setToken: (token: string | null, ttlSeconds = 604800) => {
        set({ token });
        if (token) setTokenCookie('token', token, ttlSeconds);
        else removeTokenCookie('token');
    },

    logout: () => {
        set({ user: null, token: null });
        removeTokenCookie('token');

        if (isBrowser()) {
            window.localStorage.removeItem(USER_STORAGE_KEY);
        }
    },
});
