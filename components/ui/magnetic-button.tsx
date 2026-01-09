"use client"

import * as React from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    className?: string
    strength?: number
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
    ({ children, className, strength = 0.5, ...props }, ref) => {
        const refElement = React.useRef<HTMLButtonElement | null>(null)
        const x = useMotionValue(0)
        const y = useMotionValue(0)

        // Smooth spring animation
        const smoothX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
        const smoothY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

        // Convert the ref if passed, otherwise use internal
        React.useImperativeHandle(ref, () => refElement.current!)

        const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (!refElement.current) return

            const { clientX, clientY } = e
            const { left, top, width, height } = refElement.current.getBoundingClientRect()

            const centerX = left + width / 2
            const centerY = top + height / 2

            // Calculate distance from center
            const xOffset = (clientX - centerX) * strength
            const yOffset = (clientY - centerY) * strength

            x.set(xOffset)
            y.set(yOffset)
        }

        const handleMouseLeave = () => {
            x.set(0)
            y.set(0)
        }

        return (
            <motion.button
                ref={refElement}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    x: smoothX,
                    y: smoothY,
                }}
                className={cn("relative inline-block", className)}
                {...props as any} // Cast to any to avoid framer-motion/react conflict types
            >
                {children}
            </motion.button>
        )
    }
)

MagneticButton.displayName = "MagneticButton"
