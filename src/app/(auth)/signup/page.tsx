import type { Metadata } from 'next';
import {
    AuthFooterLink,
    AuthPanel,
} from '@/features/auth/components/AuthPanel';
import { getAuthHref, getAuthQuery } from '@/features/auth/lib/auth-query';
import { AuthSearchParams } from '@/features/auth/types/auth.types';
import { SignUpForm } from '@/features/auth/components/AuthFlowForms';

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
            <SignUpForm next={next} />
        </AuthPanel>
    );
}
