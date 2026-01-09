"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Github, Twitter, Instagram, ChevronRight, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

// Live Clock Component
const LiveClock = () => {
    const [time, setTime] = React.useState<string>("00:00:00 UTC")

    React.useEffect(() => {
        // Run on client only
        const updateTime = () => {
            const now = new Date()
            setTime(now.toISOString().split('T')[1].split('.')[0] + " UTC")
        }
        updateTime() // Initial
        const timer = setInterval(updateTime, 1000)
        return () => clearInterval(timer)
    }, [])

    return <span className="font-mono text-xs md:text-sm tracking-widest opacity-80">{time}</span>
}

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "PRODUCT",
            links: [
                { label: "Mission Control", href: "#" },
                { label: "Church Intelligence", href: "#" },
                { label: "Financial Pulse", href: "#" },
                { label: "Pricing", href: "#pricing" },
            ]
        },
        {
            title: "RESOURCES",
            links: [
                { label: "Documentation", href: "#" },
                { label: "API Reference", href: "#" },
                { label: "System Status", href: "#" },
                { label: "Security Protocol", href: "#" },
            ]
        },
        {
            title: "COMMUNITY",
            links: [
                { label: "Discord Server", href: "#" },
                { label: "Twitter / X", href: "#" },
                { label: "GitHub", href: "#" },
            ]
        },
        {
            title: "LEGAL",
            links: [
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Data Processing", href: "#" },
            ]
        }
    ]

    return (
        <footer className="bg-background-card border-t border-border pt-24 pb-12 px-6 relative overflow-hidden transition-colors duration-500">
            {/* BACKGROUND GRID (Subtle) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-text-secondary)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-text-secondary)_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.03] pointer-events-none fade-mask" />

            <div className="max-w-7xl mx-auto relative z-10">

                {/* TOP BAR: Logo & System Status */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b border-border pb-8">
                    <div className="mb-6 md:mb-0">
                        <Link href="/" className="text-2xl font-bold font-heading tracking-tight text-text-primary">
                            TOGATHER
                        </Link>
                        <p className="text-sm text-text-secondary mt-1 max-w-xs">
                            The operating system for modern ministries.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-background-secondary px-4 py-2 rounded-full border border-border">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
                        </div>
                        <span className="text-xs font-bold tracking-widest text-status-success uppercase">
                            Operational: 99.9% Uptime
                        </span>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h4 className="font-bold text-sm tracking-widest text-text-primary mb-6 uppercase">
                                {section.title}
                            </h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="group flex items-center text-text-secondary hover:text-text-accent transition-colors text-sm font-medium"
                                        >
                                            <span className="relative overflow-hidden w-0 transition-all duration-300 group-hover:w-4">
                                                <ChevronRight className="w-3 h-3 absolute top-1/2 -translate-y-1/2 left-0" />
                                            </span>
                                            <span className="transform group-hover:translate-x-0 transition-transform">
                                                {link.label}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* BOTTOM BAR: Copyright & Time */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-text-secondary border-t border-border pt-8">

                    <div className="text-xs font-mono uppercase">
                        © {currentYear} TOGATHER OPERATIONS. ALL RIGHTS RESERVED.
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Live Clock */}
                        <div className="flex items-center gap-2 px-3 py-1 rounded bg-background-secondary border border-border">
                            <Circle className="w-2 h-2 fill-current animate-pulse" />
                            <LiveClock />
                        </div>

                        {/* Socials */}
                        <div className="flex items-center gap-4">
                            <Link href="#" className="hover:text-text-primary hover:scale-110 transition-all">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="hover:text-text-primary hover:scale-110 transition-all">
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="hover:text-text-primary hover:scale-110 transition-all">
                                <Instagram className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
