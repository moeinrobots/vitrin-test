import Link from 'next/link';
import type { ReactNode } from 'react';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/shared/components/ui/card';

type AuthPanelProps = {
    title: string;
    description: string;
    children: ReactNode;
    footer?: ReactNode;
};

export function AuthPanel({
    title,
    description,
    children,
    footer,
}: AuthPanelProps) {
    return (
        <Card className="w-full max-w-md shadow-sm">
            <CardHeader className="gap-1 p-6 pb-4">
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription className="leading-6">
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">{children}</CardContent>
            {footer ? (
                <CardFooter className="justify-center border-t p-4 text-sm text-muted-foreground">
                    {footer}
                </CardFooter>
            ) : null}
        </Card>
    );
}

export function AuthFooterLink({
    href,
    label,
    action,
}: {
    href: string;
    label: string;
    action: string;
}) {
    return (
        <p>
            {label}{' '}
            <Link
                className="font-medium text-primary hover:underline"
                href={href}
            >
                {action}
            </Link>
        </p>
    );
}
