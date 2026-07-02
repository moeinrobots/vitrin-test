import Link from 'next/link';
import type { Metadata } from 'next';
import {
    AuthField,
    AuthInput,
    PendingAuthForm,
} from '@/features/auth/components/AuthForm';
import {
    AuthFooterLink,
    AuthPanel,
} from '@/features/auth/components/AuthPanel';
import { getAuthHref, getAuthQuery } from '@/features/auth/lib/auth-query';
import { AuthSearchParams } from '@/features/auth/types/auth.types';

export const metadata: Metadata = {
    title: 'ورود با رمز عبور',
    robots: {
        index: false,
        follow: false,
    },
};

export default async function SignInPasswordPage({
    searchParams,
}: {
    searchParams: AuthSearchParams;
}) {
    const { next, phone } = await getAuthQuery(searchParams);

    return (
        <AuthPanel
            title="ورود با رمز عبور"
            description="شماره موبایل و رمز عبور حساب خود را وارد کنید."
            footer={
                <AuthFooterLink
                    action="دریافت کد یکبار مصرف"
                    href={getAuthHref('/signin/otp', { next, phone })}
                    label="رمز عبور را فراموش کرده‌اید؟"
                />
            }
        >
            <PendingAuthForm submitLabel="ورود">
                {next ? <input name="next" type="hidden" value={next} /> : null}
                <AuthField id="phone" label="شماره موبایل">
                    <AuthInput
                        autoComplete="tel"
                        defaultValue={phone}
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
                        autoComplete="current-password"
                        dir="ltr"
                        id="password"
                        minLength={6}
                        name="password"
                        placeholder="••••••••"
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
            </PendingAuthForm>
        </AuthPanel>
    );
}
