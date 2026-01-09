"use client"

import * as React from "react"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MagneticButton } from "@/components/ui/magnetic-button"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle2, UserPlus } from "lucide-react"

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
                        delay: i * 0.03,
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

// Live Toast Component
const LiveToast = () => {
    const [toast, setToast] = React.useState<{ text: string, type: 'join' | 'active' } | null>(null)

    const messages = [
        { text: "Gereja Mawar Sharon, Medan baru saja bergabung", type: 'join' as const },
        { text: "Komsel Pemuda aktif menggunakan modul Absensi", type: 'active' as const },
        { text: "GBI Gilgal, Jakarta mengatur jadwal ibadah", type: 'active' as const },
        { text: "GKII Pusat mengunggah Warta Jemaat", type: 'active' as const },
    ]

    React.useEffect(() => {
        const showToast = () => {
            const randomMsg = messages[Math.floor(Math.random() * messages.length)]
            setToast(randomMsg)
            setTimeout(() => setToast(null), 4000) // Hide after 4s
        }

        // Initial delay then loop
        const timeout = setTimeout(showToast, 2000)
        const interval = setInterval(showToast, 8000) // Show every 8s

        return () => {
            clearTimeout(timeout)
            clearInterval(interval)
        }
    }, [])

    return (
        <AnimatePresence>
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: 20, x: -20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: 20, x: -20 }}
                    className="fixed bottom-8 left-8 z-50 flex items-center gap-3 px-4 py-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-border max-w-sm hidden md:flex"
                >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${toast.type === 'join' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {toast.type === 'join' ? <UserPlus size={18} /> : <CheckCircle2 size={18} />}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-text-primary uppercase tracking-wider mb-0.5">
                            {toast.type === 'join' ? 'Partner Baru' : 'Akitivitas Langsung'}
                        </p>
                        <p className="text-sm text-text-secondary leading-tight">
                            {toast.text}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export function Hero() {
    const { scrollY } = useScroll()
    const opacity = useTransform(scrollY, [0, 600], [1, 0])
    const scale = useTransform(scrollY, [0, 600], [1, 0.95])
    const y = useTransform(scrollY, [0, 600], [0, 100])

    // Parallax layers
    const layer1Y = useTransform(scrollY, [0, 600], [0, -50])
    const layer2Y = useTransform(scrollY, [0, 600], [0, -100])

    const smoothY = useSpring(y, { stiffness: 100, damping: 20 })

    return (
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center perspective-1000">
            <LiveToast />

            <div className="max-w-7xl mx-auto w-full text-center relative z-10">

                {/* STATUS BADGE */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-status-success/10 border border-status-success/20 text-status-success mb-8 backdrop-blur-sm"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
                    </span>
                    <span className="text-xs font-bold tracking-widest uppercase">Siap Melayani</span>
                </motion.div>

                {/* HEADLINE - 3D Stagger Reveal */}
                <h1 className="text-4xl md:text-7xl lg:text-8xl font-black font-heading tracking-tight mb-6 text-text-primary leading-[0.95]">
                    <span className="block mb-2">
                        <StaggeredText text="ERATKAN PERSEKUTUAN," />
                    </span>
                    <span className="block text-text-accent">
                        <StaggeredText text="MUDAHKAN PELAYANAN." />
                    </span>
                </h1>

                {/* SUBHEADLINE */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Satu rumah digital untuk mengelola ibadah, komunitas sel, dan pelayanan jemaat dengan lebih kasih.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 relative z-20"
                >
                    <Link href="#deploy">
                        <MagneticButton strength={0.2}>
                            <Button size="lg" className="rounded-full shadow-xl shadow-text-accent/20 w-full sm:w-auto px-8 py-6 text-lg bg-text-primary text-background-primary hover:opacity-90 transition-all">
                                Mulai Pelayanan
                            </Button>
                        </MagneticButton>
                    </Link>
                    <Link href="#features">
                        <MagneticButton strength={0.1}>
                            <Button variant="outline" size="lg" className="rounded-full border w-full sm:w-auto px-8 py-6 text-lg border-border text-text-primary hover:bg-background-secondary">
                                Lihat Demo
                            </Button>
                        </MagneticButton>
                    </Link>
                </motion.div>

                {/* DASHBOARD CONTAINER - Hero Visual */}
                <div className="relative mx-auto max-w-6xl h-[600px] md:h-[800px]">

                    {/* Floating Parallax Card 1 (Left) */}
                    <motion.div
                        style={{ y: layer1Y }}
                        className="hidden md:flex absolute -left-12 top-20 z-30 bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-xl border border-border/50 items-center gap-3 animate-float-slow"
                    >
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <UserPlus className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-text-secondary uppercase">Baru Saja</p>
                            <p className="text-sm font-bold text-text-primary">12 Anggota Baru</p>
                        </div>
                    </motion.div>

                    {/* Floating Parallax Card 2 (Right) */}
                    <motion.div
                        style={{ y: layer2Y }}
                        className="hidden md:flex absolute -right-8 bottom-1/3 z-30 bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-xl border border-border/50 items-center gap-3 animate-float-slower"
                    >
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-text-secondary uppercase">Status</p>
                            <p className="text-sm font-bold text-text-primary">Ibadah Minggu Siap</p>
                        </div>
                    </motion.div>

                    {/* MAIN IMAGE */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, rotateX: 20 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ delay: 1.2, duration: 1.2, type: "spring", stiffness: 50 }}
                        style={{ opacity, scale, y: smoothY }}
                        className="relative w-full h-full rounded-[32px] overflow-hidden border border-border shadow-2xl shadow-text-accent/20 bg-background-card"
                    >
                        <div className="relative w-full h-full group">
                            <Image
                                src="/images/hero-dashboard.png"
                                alt="Togather Dashboard - Pusat Pelayanan Digital"
                                fill
                                className="object-cover object-top"
                                priority
                            />
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        </div>
                    </motion.div>
                </div>

            </div>
        </section>
    )
}
