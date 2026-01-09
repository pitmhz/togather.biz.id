import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Togather Bento Grid
 * Design: Responsive grid layout for features
 */
export const BentoGrid = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-8 auto-rows-[minmax(180px,auto)]',
                className
            )}
            {...props}
        />
    );
});
BentoGrid.displayName = 'BentoGrid';

export const BentoItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        colSpan?: 1 | 2 | 3;
        rowSpan?: 1 | 2;
    }
>(({ className, colSpan = 1, rowSpan = 1, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                'group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-background-card border border-gray-100 p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1',
                // Responsive spans
                colSpan === 2 && 'md:col-span-2',
                colSpan === 3 && 'md:col-span-3',
                rowSpan === 2 && 'row-span-2',
                className
            )}
            {...props}
        />
    );
});
BentoItem.displayName = 'BentoItem';
