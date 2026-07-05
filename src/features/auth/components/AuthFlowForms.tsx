'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import {
    loginWithPassword,
    requestOtp,
    signup,
    verifyOtp,
} from '@/features/auth/api/auth.client';
import { getAuthHref } from '@/features/auth/lib/auth-query';
import { ApiError } from '@/shared/lib/api-error';
import { Button } from '@/shared/components/ui/button';
import { useAppStore } from '@/shared/stores';
import { AuthField, AuthInput } from './AuthForm';

import type { AuthResponse } from '@/features/auth/types/auth.types';

type AuthFormProps = {
    next?: string;
};

const defaultRedirect = '/panel';

export function SignInMethodForm({ next }: AuthFormProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage(null);

        const form = event.currentTarget;
        const formData = new FormData(form);
        const submitter = (event.nativeEvent as SubmitEvent)
            .submitter as HTMLButtonElement | null;
        const intent = submitter?.value ?? 'otp';
        const phone = String(formData.get('phone') ?? '').trim();

        // setStoredAuthPhone(phone);

        if (intent === 'password') {
            router.push(getAuthHref('/signin/pwd', { next }));
            return;
        }

        setIsPending(true);

        try {
            await requestOtp({ mobile_number: phone });
            router.push(getAuthHref('/signin/otp', { next }));
        } catch (error) {
            setMessage(getAuthErrorMessage(error));
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form className="grid gap-4" onSubmit={handleSubmit}>
            <AuthField id="phone" label="شماره موبایل">
                <AuthInput
                    autoComplete="tel"
                    dir="ltr"
                    id="phone"
                    inputMode="tel"
                    name="phone"
                    pattern="^09[0-9]{9}$"
                    placeholder="09123456789"
                    required
                    type="tel"
                />
            </AuthField>
            <AuthStatusMessage message={message} />
            <div className="grid gap-2">
                <Button
                    className="h-11 w-full"
                    disabled={isPending}
                    name="intent"
                    type="submit"
                    value="otp"
                >
                    {isPending ? 'در حال ارسال کد...' : 'دریافت کد یکبار مصرف'}
                </Button>
                <Button
                    className="h-11 w-full"
                    disabled={isPending}
                    name="intent"
                    type="submit"
                    value="password"
                    variant="outline"
                >
                    ورود با رمز عبور
                </Button>
            </div>
        </form>
    );
}

export function SignInOtpForm({ next }: AuthFormProps) {
    const router = useRouter();
    // const [phone, setPhone] = useState(getStoredAuthPhone);
    const [isPending, setIsPending] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage(null);
        setIsPending(true);

        const formData = new FormData(event.currentTarget);
        const otp = String(formData.get('otp') ?? '').trim();

        try {
            const result = await verifyOtp({ code: +otp });
            applyAuthResult(result);
            router.replace(next || defaultRedirect);
        } catch (error) {
            setMessage(getAuthErrorMessage(error));
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form className="grid gap-4" onSubmit={handleSubmit}>
            <AuthField id="otp" label="کد تایید">
                <AuthInput
                    autoComplete="one-time-code"
                    dir="ltr"
                    id="otp"
                    inputMode="numeric"
                    maxLength={6}
                    minLength={4}
                    name="otp"
                    pattern="[0-9]{4,6}"
                    placeholder="123456"
                    required
                    type="text"
                />
            </AuthField>
            <Link
                className="justify-self-start text-sm font-medium text-primary hover:underline"
                href={getAuthHref('/signin', { next })}
            >
                تغییر شماره موبایل
            </Link>
            <AuthStatusMessage message={message} />
            <Button className="h-11 w-full" disabled={isPending} type="submit">
                {isPending ? 'در حال ورود...' : 'ورود'}
            </Button>
        </form>
    );
}

export function SignInPasswordForm({ next }: AuthFormProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage(null);
        setIsPending(true);

        const formData = new FormData(event.currentTarget);
        const password = String(formData.get('password') ?? '');

        try {
            const result = await loginWithPassword({
                username: String(formData.get('username')),
                password,
            });
            applyAuthResult(result);
            router.replace(next || defaultRedirect);
        } catch (error) {
            setMessage(getAuthErrorMessage(error));
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form className="grid gap-4" onSubmit={handleSubmit}>
            <AuthField id="password" label="رمز عبور">
                <AuthInput
                    autoComplete="current-password"
                    dir="ltr"
                    id="password"
                    minLength={6}
                    name="password"
                    placeholder="رمز عبور"
                    required
                    type="password"
                />
            </AuthField>
            <Link
                className="justify-self-start text-sm font-medium text-primary hover:underline"
                href={getAuthHref('/signin', { next })}
            >
                بازگشت به انتخاب روش ورود
            </Link>
            <AuthStatusMessage message={message} />
            <Button className="h-11 w-full" disabled={isPending} type="submit">
                {isPending ? 'در حال ورود...' : 'ورود'}
            </Button>
        </form>
    );
}

export function SignUpForm({ next }: AuthFormProps) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage(null);
        setIsPending(true);

        const formData = new FormData(event.currentTarget);
        const username = String(formData.get('name') ?? '').trim();
        const password1 = String(formData.get('phone') ?? '').trim();
        const password2 = String(formData.get('password') ?? '');

        try {
            const result = await signup({ username, password1, password2 });
            applyAuthResult(result);
            router.replace(next || defaultRedirect);
        } catch (error) {
            setMessage(getAuthErrorMessage(error));
        } finally {
            setIsPending(false);
        }
    }

    return (
        <form className="grid gap-4" onSubmit={handleSubmit}>
            <AuthField id="name" label="نام و نام خانوادگی">
                <AuthInput
                    autoComplete="name"
                    id="name"
                    name="name"
                    placeholder="نام شما"
                    required
                    type="text"
                />
            </AuthField>
            <AuthField id="phone" label="شماره موبایل">
                <AuthInput
                    autoComplete="tel"
                    dir="ltr"
                    id="phone"
                    inputMode="tel"
                    name="phone"
                    pattern="^09[0-9]{9}$"
                    placeholder="09123456789"
                    required
                    type="tel"
                />
            </AuthField>
            <AuthField id="password" label="رمز عبور">
                <AuthInput
                    autoComplete="new-password"
                    dir="ltr"
                    id="password"
                    minLength={6}
                    name="password"
                    placeholder="حداقل ۶ کاراکتر"
                    required
                    type="password"
                />
            </AuthField>
            <AuthStatusMessage message={message} />
            <Button className="h-11 w-full" disabled={isPending} type="submit">
                {isPending ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
            </Button>
        </form>
    );
}

function AuthStatusMessage({ message }: { message: string | null }) {
    if (!message) return null;

    return (
        <p
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm leading-6 text-destructive"
            role="status"
        >
            {message}
        </p>
    );
}

function applyAuthResult(result: AuthResponse) {
    const store = useAppStore.getState();

    store.setToken(result.token, result.ttlSeconds);
    store.setUser(result.user ?? null);
}

function getAuthErrorMessage(error: unknown) {
    if (error instanceof ApiError) {
        if (isRecord(error.body)) {
            const detail =
                getString(error.body.detail) ??
                getString(error.body.message) ??
                getString(error.body.error);

            if (detail) return detail;
        }
    }

    if (error instanceof Error) return error.message;

    return 'درخواست با خطا مواجه شد.';
}

function getString(value: unknown) {
    return typeof value === 'string' ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
