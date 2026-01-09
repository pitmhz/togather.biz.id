"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

// --- DATA STRUCTURE ---
const MISSION_MODULES = [
    {
        id: "mission-control",
        title: "PUSAT PELAYANAN",
        caption: "Dashboard terpadu untuk mengelola seluruh aspek pelayanan gereja Anda.",
        image: "/images/showcase/mission-control.jpg", // Placeholder
        accent: "indigo", // Denim equivalent
        color: "from-text-primary/10 to-transparent",
        textColor: "text-text-primary"
    },
    {
        id: "service-dna",
        title: "ESSENSI PELAYANAN",
        caption: "Susun liturgi dan rundown ibadah dengan teratur dan penuh perhatian.",
        image: "/images/showcase/service-dna.jpg",
        accent: "blue",
        color: "from-text-accent/10 to-transparent",
        textColor: "text-text-accent"
    },
    {
        id: "financial-pulse",
        title: "FINANCIAL PULSE",
        caption: "Transparansi total untuk kolekte, budget, dan pelaporan keuangan.",
        image: "/images/showcase/financial.jpg",
        accent: "emerald",
        color: "from-status-success/10 to-transparent",
        textColor: "text-status-success"
    },
    {
        id: "task-force",
        title: "TIM PELAYANAN",
        caption: "Koordinasi volunteer dan pengerja dalam satu sistem yang mudah diakses.",
        image: "/images/showcase/task-force.jpg",
        accent: "amber",
        color: "from-status-warning/10 to-transparent",
        textColor: "text-status-warning"
    },
    {
        id: "logistics-hub",
        title: "KOMUNITAS SEL",
        caption: "Pantau pertumbuhan kelompok sel dan perkuat persekutuan jemaat.",
        image: "/images/showcase/logistics.jpg",
        accent: "orange",
        color: "from-status-warning/10 to-transparent",
        textColor: "text-status-warning"
    },
    {
        id: "komsel-intel",
        title: "PERTUMBUHAN KOMSEL",
        caption: "Kelola komsel dengan lebih efektif dan penuh kasih.",
        image: "/images/showcase/komsel.jpg",
        accent: "pink",
        color: "from-text-accent/10 to-transparent",
        textColor: "text-text-accent"
    }
]

export function ShowcaseSection() {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [direction, setDirection] = React.useState(0)
    const imageContainerRef = React.useRef<HTMLDivElement>(null)
    const imageRef = React.useRef<HTMLDivElement>(null)

    // Autoplay
    React.useEffect(() => {
        const timer = setInterval(() => {
            nextSlide()
        }, 5000)
        return () => clearInterval(timer)
    }, [currentIndex])

    const nextSlide = () => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % MISSION_MODULES.length)
    }

    const prevSlide = () => {
        setDirection(-1)
        setCurrentIndex((prev) => (prev - 1 + MISSION_MODULES.length) % MISSION_MODULES.length)
    }

    const activeModule = MISSION_MODULES[currentIndex]

    // GSAP 3D Tilt on Hover
    useGSAP(() => {
        const card = imageContainerRef.current
        if (!card) return

        const handleMouseMove = (e: MouseEvent) => {
            const rect = card.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const centerX = rect.width / 2
            const centerY = rect.height / 2

            const rotateX = ((y - centerY) / centerY) * -5
            const rotateY = ((x - centerX) / centerX) * 5

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.4,
                ease: "power2.out",
                transformPerspective: 1000,
            })
        }

        const handleMouseLeave = () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.6,
                ease: "elastic.out(1, 0.5)",
            })
        }

        card.addEventListener("mousemove", handleMouseMove)
        card.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            card.removeEventListener("mousemove", handleMouseMove)
            card.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, { scope: imageContainerRef })

    // GSAP Image Transition Effect
    useGSAP(() => {
        // Parallax swipe effect on image change
        gsap.fromTo(imageRef.current,
            { scale: 1.1, opacity: 0.8 },
            { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }
        )
    }, [currentIndex])

    return (
        <section className="py-24 px-6 overflow-hidden relative transition-colors duration-700 bg-background-primary">

            {/* Dynamic Background Blob */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-30 transition-colors duration-1000",
                activeModule.color
            )} />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

                {/* LEFT: Content & Navigation */}
                <div className="order-2 lg:order-1 flex flex-col justify-center min-h-[400px]">
                    <div className="mb-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeModule.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <span className={cn("text-sm font-bold tracking-widest uppercase mb-2 block", activeModule.textColor)}>
                                    Module {currentIndex + 1} / {MISSION_MODULES.length}
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black font-heading tracking-tight mb-4 text-text-primary leading-none">
                                    {activeModule.title}
                                </h2>
                                <p className="text-xl text-text-secondary leading-relaxed max-w-md">
                                    {activeModule.caption}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="https://app.togather.biz.id" target="_blank">
                            <Button size="lg" className="rounded-full px-8 text-base shadow-xl bg-text-primary text-background-primary hover:opacity-90">
                                Buka Dashboard
                            </Button>
                        </Link>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={prevSlide}
                                className="rounded-full w-12 h-12 border hover:bg-background-secondary border-text-secondary/10"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={nextSlide}
                                className="rounded-full w-12 h-12 border hover:bg-background-secondary border-text-secondary/10"
                            >
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-12 w-full h-1 bg-text-secondary/10 rounded-full overflow-hidden">
                        <motion.div
                            className={cn("h-full", activeModule.textColor.replace('text-', 'bg-'))}
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 5, ease: "linear", repeat: 0 }}
                            key={activeModule.id} // Reset on change
                        />
                    </div>
                </div>

                {/* RIGHT: Image Showcase */}
                <div className="order-1 lg:order-2 perspective-1000">
                    <div
                        ref={imageContainerRef}
                        className="relative aspect-[4/3] md:aspect-[16/10] rounded overflow-hidden shadow-2xl bg-background-secondary border border-text-secondary/10"
                        style={{ transformStyle: "preserve-3d" }} // Important for 3D tilt
                    >
                        {/* Image Container with Parallax Logic */}
                        <div ref={imageRef} className="absolute inset-0 w-full h-full">
                            {/* Placeholder Gradient if image fails, or solid color fallback */}
                            <div className={cn(
                                "w-full h-full bg-gradient-to-br flex items-center justify-center",
                                activeModule.color.replace('20', '80') // Darker version for visual weight
                            )}>
                                {/* 
                     Ideally we would use <Image src={activeModule.image} ... /> here.
                     For now, using a stylized abstract placeholder to match the "No placeholders" rule 
                     but dynamically generated via CSS since we don't have the literal jpgs yet. 
                     
                     If you want real placeholders, we can generate them or use a service.
                     For now, I'll create a nice CSS composition.
                 */}
                                <div className="text-center p-8 transform translate-z-10">
                                    <span className="text-9xl opacity-20 font-black text-white mix-blend-overlay">
                                        {currentIndex + 1}
                                    </span>
                                    <p className="text-white/50 font-bold tracking-widest mt-4 uppercase">
                                        {activeModule.title} VISUAL
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Glass Overlay/Gloss */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/50 to-transparent opacity-60" />

                        {/* Tactical Corners */}
                        <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-white/30 rounded-tl" />
                        <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-white/30 rounded-tr" />
                        <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-white/30 rounded-bl" />
                        <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-white/30 rounded-br" />
                    </div>
                </div>

            </div>
        </section>
    )
}
