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
    title: 'ورود با کد یکبار مصرف',
    robots: {
        index: false,
        follow: false,
    },
};

export default async function SignInOtpPage({
    searchParams,
}: {
    searchParams: AuthSearchParams;
}) {
    const { next, phone } = await getAuthQuery(searchParams);

    return (
        <AuthPanel
            title="ورود با کد یکبار مصرف"
            description="کدی که برای شماره موبایل شما ارسال شده است را وارد کنید."
            footer={
                <AuthFooterLink
                    action="ورود با رمز عبور"
                    href={getAuthHref('/signin/pwd', { next, phone })}
                    label="رمز عبور دارید؟"
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
            </PendingAuthForm>
        </AuthPanel>
    );
}
