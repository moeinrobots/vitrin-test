import { type ComponentProps, type ReactNode } from 'react';
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
