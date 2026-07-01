import * as React from 'react';

import { cn } from '@/shared/lib/utils';

type SeparatorProps = React.ComponentProps<'div'> & {
    orientation?: 'horizontal' | 'vertical';
};

function Separator({
    className,
    orientation = 'horizontal',
    ...props
}: SeparatorProps) {
    return (
        <div
            role="separator"
            aria-orientation={orientation}
            data-orientation={orientation}
            data-slot="separator"
            className={cn(
                orientation === 'horizontal'
                    ? 'h-px w-full bg-border'
                    : 'h-full w-px bg-border',
                className,
            )}
            {...props}
        />
    );
}

export { Separator };
