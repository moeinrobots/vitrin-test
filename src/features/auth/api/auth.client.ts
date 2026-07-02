import { clientFetch } from '@/shared/lib/client-fetch';
import { resolveApiUrl } from '@/shared/lib/api-url';
import type {
    AuthLoginPayload,
    AuthOtpRequestPayload,
    AuthOtpVerifyPayload,
    AuthResponse,
    AuthSignupPayload,
} from '../types/auth.types';

const AUTH_ENDPOINTS = {
    otpRequest: '/api/shop/customers/auth/otp/signin',
    otpVerify: '/api/shop/customers/auth/otp/signin/verify',
    passwordSignin: '/api/shop/customers/auth/pwd/signin',
    signup: '/api/shop/customers/auth/pwd/signup',
};

export function requestOtp(payload: AuthOtpRequestPayload) {
    return clientFetch(resolveApiUrl(AUTH_ENDPOINTS.otpRequest), {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export function verifyOtp(payload: AuthOtpVerifyPayload) {
    return clientFetch<AuthResponse>(resolveApiUrl(AUTH_ENDPOINTS.otpVerify), {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export function loginWithPassword(payload: AuthLoginPayload) {
    return clientFetch<AuthResponse>(
        resolveApiUrl(AUTH_ENDPOINTS.passwordSignin),
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
}

export function signup(payload: AuthSignupPayload) {
    return clientFetch<AuthResponse>(resolveApiUrl(AUTH_ENDPOINTS.signup), {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
