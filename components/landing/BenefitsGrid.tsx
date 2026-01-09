"use client"

import * as React from "react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { Users, Clock, Shield, Smartphone } from "lucide-react"

const BENEFITS = [
    {
        id: "personal",
        title: "Pelayanan yang Personal",
        description: "Kenali setiap jemaat dan berikan perhatian yang mereka butuhkan.",
        icon: Users,
        visual: "avatars"
    },
    {
        id: "efficiency",
        title: "Hemat Waktu Persiapan",
        description: "Otomatisasi jadwal dan rundown ibadah dalam hitungan menit.",
        icon: Clock,
        visual: "calendar"
    },
    {
        id: "security",
        title: "Privasi Terjaga",
        description: "Data jemaat terenkripsi dan hanya dapat diakses oleh pihak berwenang.",
        icon: Shield,
        visual: "lock"
    },
    {
        id: "access",
        title: "Akses di Mana Saja",
        description: "Kelola pelayanan langsung dari smartphone Anda, kapan pun.",
        icon: Smartphone,
        visual: "phone"
    }
]

function BenefitCard({ benefit, index }: { benefit: typeof BENEFITS[0], index: number }) {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect()
        mouseX.set(clientX - left)
        mouseY.set(clientY - top)
    }

    const Icon = benefit.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            className="group relative bg-background-card rounded-[32px] overflow-hidden border border-border"
        >
            {/* Gradient Border Trace */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            var(--color-text-accent),
                            transparent 80%
                        )
                    `,
                }}
            />
            {/* Inner Content Mask to show border only */}
            <div className="absolute inset-[1px] rounded-[31px] bg-background-card z-0" />

            <div className="relative z-10 p-8 h-full flex flex-col">
                {/* Icon with Bounce */}
                <div className="w-14 h-14 rounded-2xl bg-text-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-text-accent" />
                </div>

                {/* Content Stagger */}
                <h3 className="text-xl font-bold font-heading mb-3 text-text-primary group-hover:text-text-accent transition-colors">
                    {benefit.title}
                </h3>
                <p className="text-text-secondary leading-relaxed mb-6 flex-grow">
                    {benefit.description}
                </p>

                {/* Visual Placeholder (Lift Effect) */}
                <div className="mt-auto h-32 rounded-2xl bg-background-secondary/50 flex items-center justify-center group-hover:-translate-y-2 transition-transform duration-500 delay-75">
                    {benefit.visual === "avatars" && (
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    className="w-10 h-10 rounded-full bg-text-accent/20 border-2 border-background-card flex items-center justify-center"
                                >
                                    <span className="text-xs font-bold text-text-accent">{i}</span>
                                </motion.div>
                            ))}
                            <div className="w-10 h-10 rounded-full bg-status-success/20 border-2 border-background-card flex items-center justify-center">
                                <span className="text-xs font-bold text-status-success">+</span>
                            </div>
                        </div>
                    )}
                    {benefit.visual === "calendar" && (
                        <div className="flex gap-2">
                            {["Min", "Sen", "Sel"].map((day, i) => (
                                <motion.div
                                    key={day}
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                                    className={`w-12 h-16 rounded-xl ${i === 0 ? "bg-text-accent" : "bg-text-accent/10"} flex flex-col items-center justify-center`}
                                >
                                    <span className={`text-xs ${i === 0 ? "text-background-primary" : "text-text-secondary"}`}>{day}</span>
                                    <span className={`text-lg font-bold ${i === 0 ? "text-background-primary" : "text-text-primary"}`}>{5 + i}</span>
                                </motion.div>
                            ))}
                        </div>
                    )}
                    {benefit.visual === "lock" && (
                        <div className="flex flex-col items-center">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <Shield className="w-12 h-12 text-text-accent mb-2" />
                            </motion.div>
                            <span className="text-xs font-mono text-status-success bg-status-success/10 px-2 py-1 rounded-full">Secure Sync</span>
                        </div>
                    )}
                    {benefit.visual === "phone" && (
                        <div className="w-16 h-28 rounded-xl bg-text-primary/10 border-2 border-text-primary/20 flex items-center justify-center relative overflow-hidden">
                            <motion.div
                                animate={{ y: ["100%", "-100%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute w-full h-1/2 bg-gradient-to-b from-transparent to-text-accent/20"
                            />
                            <div className="w-10 h-20 rounded-lg bg-background-card shadow-inner z-10" />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export function BenefitsGrid() {
    return (
        <section id="benefits" className="py-24 px-6 bg-transparent">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-black font-heading tracking-tight mb-4 text-text-primary">
                        Mengapa Pemimpin Memilih Togather?
                    </h2>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Empat alasan utama yang membuat pelayanan Anda lebih efektif dan bermakna.
                    </p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {BENEFITS.map((benefit, index) => (
                        <BenefitCard key={benefit.id} benefit={benefit} index={index} />
                    ))}
                </div>

            </div>
        </section>
    )
}
