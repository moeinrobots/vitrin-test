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
    title: 'ثبت‌نام',
    robots: {
        index: false,
        follow: false,
    },
};

export default async function SignUpPage({
    searchParams,
}: {
    searchParams: AuthSearchParams;
}) {
    const { next } = await getAuthQuery(searchParams);

    return (
        <AuthPanel
            title="ثبت‌نام"
            description="برای ساخت حساب کاربری، اطلاعات زیر را تکمیل کنید."
            footer={
                <AuthFooterLink
                    action="وارد شوید"
                    href={getAuthHref('/signin', { next })}
                    label="قبلا ثبت‌نام کرده‌اید؟"
                />
            }
        >
            <PendingAuthForm submitLabel="ثبت‌نام">
                {next ? <input name="next" type="hidden" value={next} /> : null}
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
            </PendingAuthForm>
        </AuthPanel>
    );
}
