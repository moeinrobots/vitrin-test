import type { Metadata } from 'next';
import { AuthField, AuthInput } from '@/features/auth/components/AuthForm';
import {
    AuthFooterLink,
    AuthPanel,
} from '@/features/auth/components/AuthPanel';
import { getAuthHref, getAuthQuery } from '@/features/auth/lib/auth-query';
import { Button } from '@/shared/components/ui/button';
import { AuthSearchParams } from '@/features/auth/types/auth.types';

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
            <form action="/signin/otp" className="grid gap-4" method="get">
                {next ? <input name="next" type="hidden" value={next} /> : null}
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
                <div className="grid gap-2">
                    <Button className="h-11 w-full" type="submit">
                        دریافت کد یکبار مصرف
                    </Button>
                    <Button
                        className="h-11 w-full"
                        formAction="/signin/pwd"
                        type="submit"
                        variant="outline"
                    >
                        ورود با رمز عبور
                    </Button>
                </div>
            </form>
        </AuthPanel>
    );
}
