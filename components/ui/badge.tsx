import * as React from 'react';
import { cn } from '@/lib/utils'; // Reuse cn utility

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'neutral' | 'success' | 'warning' | 'error' | 'tactical';
}

/**
 * Togather Status Badge
 * Design: Luma-style, small, vibrant indicators
 */
export function Badge({
    className,
    variant = 'neutral',
    ...props
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider',

                variant === 'neutral' && 'bg-background-secondary text-text-secondary',
                variant === 'success' && 'bg-status-success/15 text-status-success',
                variant === 'warning' && 'bg-status-warning/15 text-status-warning',
                variant === 'error' && 'bg-status-error/15 text-status-error',
                variant === 'tactical' && 'bg-text-accent/10 text-text-accent border border-text-accent/20',

                className
            )}
            {...props}
        />
    );
}
