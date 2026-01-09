"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowLeft, ArrowRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

// --- SLIDE DATA ---
const SLIDES = [
    {
        id: "pusat",
        title: "Pusat Pelayanan",
        caption: "Pantau seluruh aktivitas jemaat dalam satu dashboard yang teduh.",
        image: "/images/showcase/pusat.png",
        detail: "Analitik pertumbuhan jemaat realtime."
    },
    {
        id: "ibadah",
        title: "Alur Ibadah",
        caption: "Otomasi liturgi dan jadwal pelayanan pengerja dengan rapi.",
        image: "/images/showcase/ibadah.png",
        detail: "Drag-and-drop rundown builder."
    },
    {
        id: "komsel",
        title: "Manajemen Komsel",
        caption: "Pererat hubungan antar anggota melalui pelaporan kelompok sel yang interaktif.",
        image: "/images/showcase/komsel.png",
        detail: "Absensi digital berbasis lokasi."
    },
    {
        id: "kas",
        title: "Transparansi Kas",
        caption: "Kelola persembahan dan anggaran pelayanan secara akuntabel.",
        image: "/images/showcase/kas.png",
        detail: "Laporan keuangan multi-channel."
    },
    {
        id: "volunteer",
        title: "Tim Volunteer",
        caption: "Koordinasi jadwal pelayan jemaat tanpa tumpang tindih.",
        image: "/images/showcase/volunteer.png",
        detail: "Notifikasi otomatis via WhatsApp."
    },
    {
        id: "warta",
        title: "Ruang Warta",
        caption: "Sampaikan kabar terbaru gereja langsung ke ponsel jemaat.",
        image: "/images/showcase/warta.png",
        detail: "Broadcast berita tanpa biaya SMS."
    }
]

export function ShowcaseSection() {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [isHovering, setIsHovering] = React.useState(false)
    const imageRef = React.useRef<HTMLDivElement>(null)
    const activeSlide = SLIDES[currentIndex]

    // Auto-progress state
    const [progressKey, setProgressKey] = React.useState(0)

    // Autoplay every 5s
    React.useEffect(() => {
        if (isHovering) return

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % SLIDES.length)
            setProgressKey(prev => prev + 1) // Reset progress bar animation
        }, 5000)
        return () => clearInterval(interval)
    }, [isHovering])

    // Manual navigation resets stats
    const goNext = () => {
        setCurrentIndex((prev) => (prev + 1) % SLIDES.length)
        setProgressKey(prev => prev + 1)
    }
    const goPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
        setProgressKey(prev => prev + 1)
    }

    // GSAP 3D Tilt on hover (kept from previous version)
    useGSAP(() => {
        if (!imageRef.current) return
        const el = imageRef.current

        const handleMouseMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const centerX = rect.width / 2
            const centerY = rect.height / 2
            const rotateX = ((y - centerY) / centerY) * -3 // Reduced intensity for elegance
            const rotateY = ((x - centerX) / centerX) * 3

            gsap.to(el, {
                rotateX,
                rotateY,
                duration: 0.5,
                ease: "power2.out"
            })
        }

        const handleMouseLeave = () => {
            gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power2.out" })
        }

        el.addEventListener("mousemove", handleMouseMove)
        el.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            el.removeEventListener("mousemove", handleMouseMove)
            el.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, [currentIndex])

    return (
        <section id="features" className="py-24 px-6 bg-transparent overflow-hidden">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-black font-heading tracking-tight mb-4 text-text-primary">
                        Fitur yang Menyederhanakan
                    </h2>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Enam modul terintegrasi untuk mengelola seluruh aspek pelayanan gereja Anda.
                    </p>
                </motion.div>

                {/* Split Screen Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Text Content */}
                    <div className="order-2 lg:order-1 relative z-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSlide.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-8"
                            >
                                {/* Slide Counter & Progress */}
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-mono text-text-accent font-bold">
                                        {String(currentIndex + 1).padStart(2, '0')}
                                    </span>
                                    <div className="h-0.5 w-12 bg-border relative overflow-hidden">
                                        <motion.div
                                            key={progressKey}
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 5, ease: "linear" }}
                                            className="absolute top-0 left-0 h-full bg-text-accent"
                                        />
                                    </div>
                                    <span className="text-sm font-mono text-text-secondary">
                                        {String(SLIDES.length).padStart(2, '0')}
                                    </span>
                                </div>

                                <div>
                                    {/* Title */}
                                    <h3 className="text-4xl md:text-6xl font-black font-heading tracking-tight text-text-primary mb-4">
                                        {activeSlide.title}
                                    </h3>

                                    {/* Caption */}
                                    <p className="text-xl text-text-secondary leading-relaxed max-w-md">
                                        {activeSlide.caption}
                                    </p>
                                </div>

                                {/* CTA */}
                                <Link href="https://app.togather.biz.id" target="_blank">
                                    <Button size="lg" className="rounded-full px-8 bg-text-primary text-background-primary hover:opacity-90">
                                        Coba Sekarang
                                    </Button>
                                </Link>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        <div className="flex gap-3 mt-12">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={goPrev}
                                className="rounded-full border-border hover:bg-white hover:text-text-primary transition-colors w-12 h-12"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={goNext}
                                className="rounded-full border-border hover:bg-white hover:text-text-primary transition-colors w-12 h-12"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div
                        className="order-1 lg:order-2"
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                    >
                        <div
                            ref={imageRef}
                            className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-text-accent/10 bg-background-card border border-border aspect-[4/3] group"
                            style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeSlide.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="relative w-full h-full"
                                >
                                    {/* Slow Zoom Pan Effect */}
                                    <motion.div
                                        initial={{ scale: 1 }}
                                        animate={{ scale: 1.05 }}
                                        transition={{ duration: 5, ease: "linear" }}
                                        className="w-full h-full relative"
                                    >
                                        <Image
                                            src={activeSlide.image}
                                            alt={activeSlide.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </motion.div>

                                    {/* Scan Light Effect */}
                                    <motion.div
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "200%" }}
                                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none z-10"
                                    />

                                    {/* Interactive Hotspot / Tooltip */}
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.5, type: "spring" }}
                                        className="absolute bottom-6 right-6 z-20"
                                    >
                                        <div className="relative group/hotspot">
                                            <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur text-text-accent flex items-center justify-center shadow-lg cursor-help">
                                                <Info className="w-5 h-5" />
                                            </div>
                                            <div className="absolute w-10 h-10 rounded-full bg-white/50 animate-ping inset-0 -z-10" />

                                            {/* Tooltip Content */}
                                            <div className="absolute bottom-full right-0 mb-3 w-48 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-xl border border-border opacity-0 group-hover/hotspot:opacity-100 transition-opacity pointer-events-none group-hover/hotspot:pointer-events-auto origin-bottom-right transform scale-95 group-hover/hotspot:scale-100">
                                                <p className="text-xs font-bold text-text-primary mb-1">Fitur Unggulan</p>
                                                <p className="text-xs text-text-secondary leading-snug">
                                                    {activeSlide.detail}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
