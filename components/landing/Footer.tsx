"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronRight, Circle, Globe } from "lucide-react"
import { motion } from "framer-motion"

// Live Clock Component (WIB)
const LiveClock = () => {
    const [time, setTime] = React.useState<string>("00:00:00")
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
        const updateTime = () => {
            const now = new Date()
            // Convert to WIB (UTC+7)
            const wibTime = new Date(now.getTime() + (7 * 60 * 60 * 1000))
            const timeString = wibTime.toISOString().split('T')[1].split('.')[0]
            setTime(timeString)
        }
        updateTime()
        const timer = setInterval(updateTime, 1000)
        return () => clearInterval(timer)
    }, [])

    if (!mounted) return <span className="font-mono text-xs md:text-sm tracking-widest opacity-0">00:00:00</span>

    return (
        <span className="font-mono text-xs md:text-sm tracking-widest opacity-80 min-w-[80px]">
            {time} <span className="text-[10px] opacity-50 ml-1">UTC+7</span>
        </span>
    )
}

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "LAYANAN",
            links: [
                { label: "Pusat Pelayanan", href: "#" },
                { label: "Alur Ibadah", href: "#" },
                { label: "Manajemen Komsel", href: "#" },
                { label: "Transparansi Kas", href: "#" },
            ]
        },
        {
            title: "SUMBER DAYA",
            links: [
                { label: "Dokumentasi", href: "#" },
                { label: "Panduan Pengguna", href: "#" },
                { label: "Status Sistem", href: "#" },
                { label: "Keamanan Data", href: "#" },
            ]
        },
        {
            title: "KOMUNITAS",
            links: [
                { label: "Grup WhatsApp", href: "#" },
                { label: "Instagram", href: "#" },
                { label: "YouTube", href: "#" },
            ]
        },
        {
            title: "LEGAL",
            links: [
                { label: "Kebijakan Privasi", href: "#" },
                { label: "Syarat Penggunaan", href: "#" },
                { label: "Pemrosesan Data", href: "#" },
            ]
        }
    ]

    return (
        <footer className="relative bg-background-card border-t border-border pt-32 pb-12 px-6 overflow-hidden">
            {/* BACKGROUND GRID (Subtle) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-text-secondary)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-text-secondary)_1px,transparent_1px)] bg-[size:4px_4px] opacity-[0.03] pointer-events-none mix-blend-overlay" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* TOP BAR: Logo & System Status */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 border-b border-border/50 pb-12">
                    <div className="mb-8 md:mb-0">
                        <Link href="/" className="text-3xl font-black font-heading tracking-tighter text-text-primary">
                            TOGATHER<span className="text-text-accent">.</span>
                        </Link>
                        <p className="text-base text-text-secondary mt-2 max-w-sm leading-relaxed">
                            Rumah digital untuk pelayanan gereja yang lebih kasih, teratur, dan berdampak.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-background-secondary/50 backdrop-blur-md px-5 py-3 rounded-full border border-border transition-all duration-300 hover:border-status-success/30 hover:shadow-lg hover:shadow-status-success/5 group cursor-default">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75 group-hover:opacity-100 transition-opacity"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-status-success shadow-[0_0_10px_rgba(var(--color-status-success),0.5)]"></span>
                        </div>
                        <span className="text-xs font-bold tracking-widest text-status-success uppercase">
                            Sistem Siap Melayani
                        </span>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-16 mb-32">
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h4 className="font-bold text-xs tracking-[0.2em] text-text-primary mb-8 uppercase opacity-80">
                                {section.title}
                            </h4>
                            <ul className="space-y-5">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center text-text-secondary hover:text-text-primary transition-colors text-sm font-medium w-fit"
                                        >
                                            <span className="relative overflow-hidden w-0 transition-all duration-300 group-hover:w-4 opacity-0 group-hover:opacity-100">
                                                <ChevronRight className="w-3 h-3 text-text-accent absolute top-1/2 -translate-y-1/2 left-0" />
                                            </span>
                                            <span className="transform group-hover:translate-x-1 transition-transform duration-300 relative inline-block">
                                                {link.label}
                                                <span className="absolute left-0 right-0 bottom-0 h-px bg-text-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* BOTTOM BAR: Copyright & Time */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-text-secondary border-t border-border/50 pt-10">

                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                        <div className="text-xs font-mono uppercase text-center md:text-left opacity-60">
                            © {currentYear} TOGATHER.
                        </div>
                        <div className="flex gap-6">
                            <Link href="#" className="text-xs font-medium hover:text-text-primary transition-colors">Privacy</Link>
                            <Link href="#" className="text-xs font-medium hover:text-text-primary transition-colors">Terms</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Live Clock */}
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-background-secondary/30 border border-border hover:bg-background-secondary/50 transition-colors">
                            <Globe className="w-3 h-3 text-text-secondary" />
                            <div className="w-px h-3 bg-border" />
                            <LiveClock />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
