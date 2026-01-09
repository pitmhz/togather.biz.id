'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    description: string;
    className?: string;
    children?: React.ReactNode;
    accent?: 'indigo' | 'emerald' | 'amber' | 'blue' | 'orange' | 'pink';
    colSpan?: 1 | 2 | 3 | 4;
}

export function BentoCard({
    title,
    description,
    className,
    children,
    accent = 'indigo',
    colSpan = 1,
    ...props
}: BentoCardProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const glowRef = React.useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const card = containerRef.current;
        if (!card) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max -5deg tilt
            const rotateY = ((x - centerX) / centerX) * 5;  // Max 5deg tilt

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.4,
                ease: "power2.out",
                transformPerspective: 1000,
            });

            if (glowRef.current) {
                gsap.to(glowRef.current, {
                    x: x,
                    y: y,
                    opacity: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            }
        };

        const handleMouseLeave = () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.5)",
            });

            if (glowRef.current) {
                gsap.to(glowRef.current, {
                    opacity: 0,
                    duration: 0.4
                });
            }
        };

        card.addEventListener("mousemove", handleMouseMove);
        card.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            card.removeEventListener("mousemove", handleMouseMove);
            card.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, { scope: containerRef });

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
            className={cn(
                "group h-full",
                colSpan === 2 && "md:col-span-2",
                colSpan === 3 && "md:col-span-3",
                colSpan === 4 && "md:col-span-4"
            )}
        >
            <div
                ref={containerRef}
                className={cn(
                    "h-full flex flex-col justify-between overflow-hidden rounded bg-background-card border border-border p-8 shadow-sm transition-shadow duration-300 hover:shadow-2xl relative preserve-3d",
                    className
                )}
                style={{ transformStyle: "preserve-3d" }}
                {...props}
            >
                {/* Glow Cursor Follower */}
                <div
                    ref={glowRef}
                    className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-text-primary/10 blur-3xl opacity-0"
                    style={{ zIndex: 20 }} // Top layer for glow
                />

                {/* Module Content */}
                <div className="relative z-10 w-full mb-6 flex-grow transform-gpu translate-z-10 group-hover:translate-z-12 transition-transform duration-300">
                    {children}
                </div>

                {/* Text Content */}
                <div className="relative z-10 mt-auto transform-gpu translate-z-10 group-hover:translate-z-12 transition-transform duration-300">
                    <h3 className={cn(
                        "text-xl font-bold font-heading mb-2",
                        accent === 'indigo' && "text-text-primary",
                        accent === 'emerald' && "text-status-success",
                        accent === 'amber' && "text-status-warning",
                        accent === 'blue' && "text-text-accent",
                        accent === 'orange' && "text-status-warning",
                        accent === 'pink' && "text-text-accent"
                    )}>
                        {title}
                    </h3>
                    <p className="text-text-secondary dark:text-gray-400 text-sm leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Decorative Gradient Blob (Subtle) */}
                <div
                    className={cn(
                        "absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 -z-0 translate-x-1/2 translate-y-1/2 transition-opacity group-hover:opacity-40",
                        accent === 'indigo' && "bg-text-primary/5 dark:bg-text-primary/20",
                        accent === 'emerald' && "bg-status-success/10",
                        accent === 'amber' && "bg-status-warning/10",
                        accent === 'blue' && "bg-text-accent/10",
                        accent === 'orange' && "bg-status-warning/10",
                        accent === 'pink' && "bg-text-accent/10"
                    )}
                />
            </div>
        </motion.div>
    );
}
