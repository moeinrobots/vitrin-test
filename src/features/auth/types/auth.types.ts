import type { ProfileType } from '@/features/profile/types/profile.types';

export type AuthSearchParams = Promise<{
    next?: string | string[];
}>;

export type AuthOtpRequestPayload = {
    mobile_number: string;
};

export type AuthOtpVerifyPayload = {
    code: number;
};

export type AuthLoginPayload = {
    username: string;
    password: string;
};

export type AuthSignupPayload = {
    username: string;
    password1: string;
    password2: string;
};

export type AuthResponse = {
    token: string;
    refreshToken?: string;
    ttlSeconds?: number;
    user?: ProfileType | null;
};
