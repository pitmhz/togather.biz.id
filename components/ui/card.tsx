import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Togather Card
 * Design: High-rounded corners, clean background, optional glassmorphism
 */
export const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { glass?: boolean }
>(({ className, glass, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                'rounded border border-border bg-background-card p-8 shadow-sm transition-shadow hover:shadow-md',
                glass && 'bg-white/80 backdrop-blur-md border-white/20 shadow-lg',
                className
            )}
            {...props}
        />
    );
});
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('mb-4 flex flex-col space-y-1.5', className)}
        {...props}
    />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn('text-lg font-semibold leading-none tracking-tight text-text-primary', className)}
        {...props}
    />
));
CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm text-text-secondary', className)} {...props} />
));
CardContent.displayName = 'CardContent';
