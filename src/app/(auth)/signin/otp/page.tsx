import type { Metadata } from 'next';
import {
    AuthFooterLink,
    AuthPanel,
} from '@/features/auth/components/AuthPanel';
import { getAuthHref, getAuthQuery } from '@/features/auth/lib/auth-query';
import { AuthSearchParams } from '@/features/auth/types/auth.types';
import { SignInOtpForm } from '@/features/auth/components/AuthFlowForms';

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
    const { next } = await getAuthQuery(searchParams);

    return (
        <AuthPanel
            title="ورود با کد یکبار مصرف"
            description="کدی که برای شماره موبایل شما ارسال شده است را وارد کنید."
            footer={
                <AuthFooterLink
                    action="ورود با رمز عبور"
                    href={getAuthHref('/signin/pwd', { next })}
                    label="رمز عبور دارید؟"
                />
            }
        >
            <SignInOtpForm next={next} />
        </AuthPanel>
    );
}
