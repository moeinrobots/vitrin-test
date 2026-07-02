'use client';

import {
    useState,
    type ComponentProps,
    type FormEvent,
    type ReactNode,
} from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

type AuthFieldProps = {
    id: string;
    label: string;
    children: ReactNode;
};

export function AuthField({ id, label, children }: AuthFieldProps) {
    return (
        <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor={id}>
                {label}
            </label>
            {children}
        </div>
    );
}

export function AuthInput(props: ComponentProps<typeof Input>) {
    return <Input className="h-11 px-3 text-sm" {...props} />;
}

export function PendingAuthForm({
    children,
    submitLabel,
}: {
    children: ReactNode;
    submitLabel: string;
}) {
    const [message, setMessage] = useState<string | null>(null);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage('سرویس احراز هویت هنوز به این فرم متصل نشده است.');
    }

    return (
        <form className="grid gap-4" onSubmit={handleSubmit}>
            {children}
            {message ? (
                <p
                    className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm leading-6 text-destructive"
                    role="status"
                >
                    {message}
                </p>
            ) : null}
            <Button className="h-11 w-full" type="submit">
                {submitLabel}
            </Button>
        </form>
    );
}
