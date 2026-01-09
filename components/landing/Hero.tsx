"use client"

import * as React from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Character-by-character reveal component
const StaggeredText = ({ text, className }: { text: string, className?: string }) => {
    return (
        <span className={`inline-block whitespace-pre ${className}`}>
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, rotateY: 90, y: 20 }}
                    animate={{ opacity: 1, rotateY: 0, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: i * 0.03, // Slight stagger
                        type: "spring",
                        damping: 12,
                        stiffness: 200
                    }}
                    className="inline-block origin-center"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {char}
                </motion.span>
            ))}
        </span>
    )
}

export function Hero() {
    const { scrollY } = useScroll()
    const opacity = useTransform(scrollY, [0, 600], [1, 0])
    const scale = useTransform(scrollY, [0, 600], [1, 0.95])
    const y = useTransform(scrollY, [0, 600], [0, 100])

    // Smooth spring for scroll values
    const smoothY = useSpring(y, { stiffness: 100, damping: 20 })

    return (
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
            <div className="max-w-7xl mx-auto w-full text-center relative z-10">

                {/* STATUS BADGE - Fade In */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-status-success/10 border border-status-success/20 text-status-success mb-8 backdrop-blur-sm"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
                    </span>
                    <span className="text-xs font-bold tracking-widest uppercase">Siap Melayani</span>
                </motion.div>

                {/* HEADLINE - 3D Stagger Reveal */}
                <h1 className="text-5xl md:text-8xl font-black font-heading tracking-tight mb-6 text-text-primary leading-[0.9] md:leading-[1.1]">
                    <span className="block mb-2">
                        <StaggeredText text="ERATKAN PERSEKUTUAN" />
                    </span>
                    <span className="block text-text-secondary/50">
                        <StaggeredText text="MUDAHKAN PELAYANAN" />
                    </span>
                </h1>

                {/* SUBHEADLINE - Fade Up */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Satu tempat untuk mengelola ibadah, komunitas sel, dan pelayanan jemaat dengan lebih kasih dan teratur.
                </motion.p>

                {/* CTAs - Fade Up */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
                >
                    <Link href="#deploy">
                        <Button size="lg" className="rounded-full shadow-xl shadow-text-accent/20 w-full sm:w-auto bg-text-primary text-background-primary hover:bg-background-secondary hover:text-text-primary transition-transform">
                            Mulai Pelayanan
                        </Button>
                    </Link>
                    <Link href="#demo">
                        <Button variant="outline" size="lg" className="rounded-full border w-full sm:w-auto border-text-secondary/20 text-text-primary hover:bg-background-secondary">
                            Pelajari Fitur
                        </Button>
                    </Link>
                </motion.div>

                {/* FLOATING DEVICE - Scroll Parallax */}
                <motion.div
                    style={{ opacity, scale, y: smoothY }}
                    className="relative mx-auto max-w-5xl rounded-[32px] overflow-hidden border border-text-secondary/10 shadow-2xl bg-background-card"
                >
                    {/* Placeholder for "Mission Control Dashboard" */}
                    <div className="aspect-[16/9] bg-gradient-to-br from-background-secondary to-background relative group cursor-pointer">

                        {/* Fake UI Elements */}
                        <div className="absolute inset-x-8 top-8 h-8 rounded-full bg-background-primary shadow-sm flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center group-hover:scale-105 transition-transform duration-500">
                                <p className="text-text-accent/20 font-black text-6xl md:text-8xl select-none">
                                    DASHBOARD
                                </p>
                            </div>
                        </div>

                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform" />
                    </div>
                </motion.div>

            </div>
        </section >
    )
}
