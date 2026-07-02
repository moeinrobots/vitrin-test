import type { Metadata } from 'next';
import {
    AuthFooterLink,
    AuthPanel,
} from '@/features/auth/components/AuthPanel';
import { getAuthHref, getAuthQuery } from '@/features/auth/lib/auth-query';
import { AuthSearchParams } from '@/features/auth/types/auth.types';
import { SignInMethodForm } from '@/features/auth/components/AuthFlowForms';

export const metadata: Metadata = {
    title: 'ورود',
    robots: {
        index: false,
        follow: false,
    },
};

export default async function SignInPage({
    searchParams,
}: {
    searchParams: AuthSearchParams;
}) {
    const { next } = await getAuthQuery(searchParams);

    return (
        <AuthPanel
            title="ورود به حساب کاربری"
            description="شماره موبایل خود را وارد کنید و روش ورود را انتخاب کنید."
            footer={
                <AuthFooterLink
                    action="ثبت‌نام کنید"
                    href={getAuthHref('/signup', { next })}
                    label="حساب کاربری ندارید؟"
                />
            }
        >
            <SignInMethodForm next={next} />
        </AuthPanel>
    );
}
