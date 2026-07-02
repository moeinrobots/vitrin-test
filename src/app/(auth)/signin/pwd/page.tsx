import type { Metadata } from 'next';
import {
    AuthFooterLink,
    AuthPanel,
} from '@/features/auth/components/AuthPanel';
import { getAuthHref, getAuthQuery } from '@/features/auth/lib/auth-query';
import { AuthSearchParams } from '@/features/auth/types/auth.types';
import { SignInPasswordForm } from '@/features/auth/components/AuthFlowForms';

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
    const { next } = await getAuthQuery(searchParams);

    return (
        <AuthPanel
            title="ورود با رمز عبور"
            description="شماره موبایل و رمز عبور حساب خود را وارد کنید."
            footer={
                <AuthFooterLink
                    action="دریافت کد یکبار مصرف"
                    href={getAuthHref('/signin/otp', { next })}
                    label="رمز عبور را فراموش کرده‌اید؟"
                />
            }
        >
            <SignInPasswordForm next={next} />
        </AuthPanel>
    );
}
