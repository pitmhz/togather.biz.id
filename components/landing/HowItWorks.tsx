"use client"

import * as React from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { UserPlus, Settings, TrendingUp } from "lucide-react"

const STEPS = [
    {
        id: "register",
        number: "01",
        title: "Daftar & Verifikasi",
        description: "Daftarkan gereja atau komunitas sel Anda dalam hitungan menit.",
        icon: UserPlus
    },
    {
        id: "configure",
        number: "02",
        title: "Atur Komunitas",
        description: "Sesuaikan modul pelayanan, input jadwal ibadah, dan undang pelayan jemaat.",
        icon: Settings
    },
    {
        id: "grow",
        number: "03",
        title: "Mulai Bertumbuh",
        description: "Pantau perkembangan jemaat dan nikmati kemudahan koordinasi setiap hari.",
        icon: TrendingUp
    }
]

export function HowItWorks() {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 80%", "end 20%"]
    })

    const pathLength = useSpring(scrollYProgress, { stiffness: 50, damping: 20 })

    return (
        <section id="how-it-works" className="py-32 px-6 bg-background-secondary relative overflow-hidden" ref={containerRef}>
            <div className="max-w-5xl mx-auto relative z-10">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-3xl md:text-5xl font-black font-heading tracking-tight mb-4 text-text-primary">
                        Cara Kerja Togather
                    </h2>
                    <p className="text-lg text-text-secondary max-w-xl mx-auto">
                        Tiga langkah sederhana untuk memulai perjalanan digital gereja Anda.
                    </p>
                </motion.div>

                {/* Timeline Container */}
                <div className="relative">

                    {/* SVG Connector Line */}
                    <div className="hidden md:block absolute top-[60px] left-0 right-0 h-20 -z-10">
                        <svg className="w-full h-full" viewBox="0 0 1000 20" preserveAspectRatio="none">
                            {/* Background Line */}
                            <path
                                d="M0,10 L1000,10"
                                stroke="var(--color-border)"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="10 10"
                            />
                            {/* Animated Line */}
                            <motion.path
                                d="M0,10 L1000,10"
                                stroke="var(--color-text-accent)"
                                strokeWidth="3"
                                fill="none"
                                style={{ pathLength }}
                            />
                        </svg>

                        {/* Pulse Dot */}
                        <motion.div
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-text-accent rounded-full shadow-[0_0_20px_rgba(var(--color-text-accent),0.5)] z-20"
                            style={{
                                left: useTransform(pathLength, [0, 1], ["0%", "100%"]),
                                opacity: useTransform(pathLength, [0, 0.05], [0, 1])
                            }}
                        />
                    </div>

                    {/* Steps Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon
                            // Calculate step active range based on index
                            const startRange = index * 0.3
                            const endRange = startRange + 0.3

                            return (
                                <StepItem
                                    key={step.id}
                                    step={step}
                                    index={index}
                                    progress={scrollYProgress}
                                    range={[startRange, endRange]}
                                />
                            )
                        })}
                    </div>

                </div>

            </div>
        </section>
    )
}

// Sub-component for individual step to handle logic cleanly
function StepItem({ step, index, progress, range }: { step: any, index: number, progress: any, range: number[] }) {
    const Icon = step.icon
    const isActive = useTransform(progress, (v: number) => v > range[0])
    const opacity = useTransform(progress, range, [0.5, 1])
    const scale = useTransform(progress, range, [0.9, 1])
    const color = useTransform(progress, (v: number) => v > range[0] ? "var(--color-text-accent)" : "var(--color-text-secondary)")
    const bgColor = useTransform(progress, (v: number) => v > range[0] ? "rgba(var(--color-text-accent), 0.1)" : "rgba(var(--color-text-secondary), 0.1)")

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            className="relative text-center group"
        >
            {/* Icon Circle */}
            <motion.div
                className="w-32 h-32 rounded-full border-4 flex items-center justify-center mx-auto mb-6 relative z-10 bg-background-card transition-colors duration-500"
                style={{
                    borderColor: bgColor
                }}
            >
                <motion.div
                    className="w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-500"
                    style={{ backgroundColor: bgColor }}
                >
                    <motion.div style={{ color: color }}>
                        <Icon className="w-10 h-10" />
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Step Number */}
            <div className="text-sm font-mono text-text-accent mb-2 font-bold">
                {step.number}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold font-heading mb-3 text-text-primary group-hover:text-text-accent transition-colors">
                {step.title}
            </h3>

            {/* Description */}
            <p className="text-text-secondary leading-relaxed">
                {step.description}
            </p>
        </motion.div>
    )
}
