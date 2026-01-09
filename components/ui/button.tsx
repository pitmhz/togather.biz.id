import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'tactical';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    fullWidth?: boolean;
}

/**
 * Togather Button
 * Design: Pill-shaped, tactile hover effects, industrial colors
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-3xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none',

                    // Variants
                    variant === 'primary' &&
                    'bg-text-primary text-background-primary hover:opacity-90 shadow-lg hover:shadow-xl',
                    variant === 'secondary' &&
                    'bg-background-secondary text-text-primary hover:bg-background-secondary/80 dark:hover:bg-background-secondary/60',
                    variant === 'outline' &&
                    'border border-border text-text-primary hover:bg-background-secondary',
                    variant === 'ghost' &&
                    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-background-secondary/50',
                    variant === 'tactical' &&
                    'bg-text-accent text-white hover:opacity-90 shadow-text-accent/20 shadow-md',

                    // Sizes
                    size === 'sm' && 'h-9 px-4 text-sm',
                    size === 'md' && 'h-11 px-6 text-base',
                    size === 'lg' && 'h-14 px-8 text-lg font-semibold',
                    size === 'icon' && 'h-10 w-10 p-0',

                    // Layout
                    fullWidth && 'w-full',

                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = 'Button';
