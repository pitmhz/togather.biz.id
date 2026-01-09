"use client"

import * as React from "react"
import { motion } from "framer-motion"

export const AmbientGlow = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Blob 1 - Denim/Blue - Top Left */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-indigo-100/30 dark:bg-indigo-900/10 blur-[100px]"
            />

            {/* Blob 2 - Sage/Green - Bottom Right */}
            <motion.div
                animate={{
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-emerald-100/30 dark:bg-emerald-900/10 blur-[100px]"
            />

            {/* Blob 3 - Warm - Center moving */}
            <motion.div
                animate={{
                    x: [-50, 50, -50],
                    y: [-50, 50, -50],
                    rotate: [0, 180, 360],
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-orange-50/20 dark:bg-orange-900/5 blur-[80px]"
            />
        </div>
    )
}
