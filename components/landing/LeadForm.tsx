"use client"

import * as React from "react"
import { useActionState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Loader2, CheckCircle, AlertCircle, Send, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { submitLead } from "@/app/actions/leads"
import { cn } from "@/lib/utils"

// --- TYPES ---
interface FormState {
    message: string;
    errors?: Record<string, string[] | undefined>;
    success?: boolean;
}

const initialState: FormState = {
    message: "",
    errors: {},
}

export function LeadForm() {
    const [state, formAction, isPending] = useActionState(submitLead, initialState as any)
    const [isSuccess, setIsSuccess] = React.useState(false)
    const formRef = React.useRef<HTMLFormElement>(null)

    // Handle Success State
    React.useEffect(() => {
        if (state?.success) {
            setIsSuccess(true)
            formRef.current?.reset()
        }
    }, [state])

    // GSAP Focus Animation (Blinking Cursor)
    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const parent = e.target.parentElement
        const cursor = parent?.querySelector(".cursor-blink")
        if (cursor) {
            gsap.to(cursor, { opacity: 1, duration: 0.2 })
        }
        // Animate Border Color
        gsap.to(e.target, { borderColor: "var(--color-text-accent)", duration: 0.3 })
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const parent = e.target.parentElement
        const cursor = parent?.querySelector(".cursor-blink")
        if (cursor) {
            gsap.to(cursor, { opacity: 0, duration: 0.2 })
        }
        // Revert Border Color (unless valid - logic could be expanded)
        if (!e.target.value) {
            gsap.to(e.target, { borderColor: "var(--color-text-secondary)", opacity: 0.2, duration: 0.3 })
        } else {
            gsap.to(e.target, { borderColor: "var(--color-status-success)", duration: 0.3 }) // Emerald if has value
        }
    }

    // Staggered Reveal
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }

    return (
        <section className="py-24 px-6 bg-background-primary dark:bg-background transition-colors duration-500 relative overflow-hidden" id="deploy">

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-status-success/5 rounded-full blur-3xl -z-0 pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10">

                {/* HEADER */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-status-success/10 border border-status-success/20 text-status-success"
                    >
                        <Terminal className="w-3 h-3" />
                        <span className="text-xs font-mono font-bold tracking-widest uppercase">Siap Melayani</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tight mb-4 text-text-primary dark:text-white">
                        MARI BERTUMBUH BERSAMA
                    </h2>
                    <p className="text-xl text-text-secondary max-w-xl mx-auto">
                        Daftarkan komunitas atau gereja Anda untuk mulai menggunakan Togather.
                    </p>
                </div>

                {/* FORM */}
                <motion.form
                    ref={formRef}
                    action={formAction}
                    className="space-y-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Leader Name */}
                        <motion.div variants={itemVariants} className="relative group">
                            <label htmlFor="leader_name" className="block text-sm font-bold uppercase tracking-widest text-text-secondary mb-2 group-focus-within:text-status-success transition-colors flex items-center gap-2">
                                Nama Koordinator
                                <span className="cursor-blink w-2 h-4 bg-status-success opacity-0" />
                            </label>
                            <input
                                type="text"
                                id="leader_name"
                                name="leader_name"
                                required
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className="w-full bg-transparent border-b border-border py-3 text-xl font-medium text-text-primary focus:outline-none transition-colors rounded-none"
                                placeholder="Enter your full name"
                            />
                            {state?.errors?.leader_name && (
                                <p className="mt-2 text-sm text-status-error flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> {state.errors.leader_name[0]}
                                </p>
                            )}
                        </motion.div>

                        {/* Church Name */}
                        <motion.div variants={itemVariants} className="relative group">
                            <label htmlFor="church_name" className="block text-sm font-bold uppercase tracking-widest text-text-secondary mb-2 group-focus-within:text-status-success transition-colors flex items-center gap-2">
                                Nama Gereja/Komunitas
                                <span className="cursor-blink w-2 h-4 bg-status-success opacity-0" />
                            </label>
                            <input
                                type="text"
                                id="church_name"
                                name="church_name"
                                required
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className="w-full bg-transparent border-b border-border py-3 text-xl font-medium text-text-primary focus:outline-none transition-colors rounded-none"
                                placeholder="Enter church name"
                            />
                            {state?.errors?.church_name && (
                                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> {state.errors.church_name[0]}
                                </p>
                            )}
                        </motion.div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Email */}
                        <motion.div variants={itemVariants} className="relative group">
                            <label htmlFor="email" className="block text-sm font-bold uppercase tracking-widest text-text-secondary mb-2 group-focus-within:text-status-success transition-colors flex items-center gap-2">
                                Email Kontak
                                <span className="cursor-blink w-2 h-4 bg-status-success opacity-0" />
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className="w-full bg-transparent border-b border-border py-3 text-xl font-medium text-text-primary focus:outline-none transition-colors rounded-none"
                                placeholder="name@church.org"
                            />
                            {state?.errors?.email && (
                                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-4 h-4" /> {state.errors.email[0]}
                                </p>
                            )}
                        </motion.div>

                        {/* Ministry Size */}
                        <motion.div variants={itemVariants} className="relative group">
                            <label htmlFor="estimated_members" className="block text-sm font-bold uppercase tracking-widest text-text-secondary mb-2 group-focus-within:text-status-success transition-colors flex items-center gap-2">
                                Jumlah Anggota Jemaat
                                <span className="cursor-blink w-2 h-4 bg-status-success opacity-0" />
                            </label>
                            <select
                                id="estimated_members"
                                name="estimated_members"
                                required
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                className="w-full bg-transparent border-b border-border py-3 text-xl font-medium text-text-primary focus:outline-none transition-colors rounded-none appearance-none"
                            >
                                <option value="" disabled selected>Select size</option>
                                <option value="40">Just Planting (&lt;50)</option>
                                <option value="150">Growing (50-200)</option>
                                <option value="350">Established (200-500)</option>
                                <option value="600">Mega (500+)</option>
                            </select>
                        </motion.div>
                    </div>

                    {/* Hidden Honeypot */}
                    <input type="text" name="website" className="hidden" aria-hidden="true" />

                    {/* Global Error Message */}
                    {state?.message && !state?.success && (
                        <div className="bg-status-error/10 border border-status-error/20 text-status-error p-3 rounded-lg text-sm text-center">
                            {state.message}
                        </div>
                    )}

                    {/* CTA */}
                    <motion.div variants={itemVariants} className="pt-8 flex justify-center">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isPending}
                            className="w-full md:w-auto min-w-[300px] h-14 rounded-full text-lg font-bold tracking-wide shadow-xl bg-text-primary text-background-primary hover:opacity-90 transition-all duration-300"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    MENGIRIM DATA...
                                </>
                            ) : (
                                <>
                                    KIRIM PENDAFTARAN
                                    <Send className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </Button>
                    </motion.div>
                </motion.form>
            </div>

            {/* SUCCESS MODAL (Mission Accepted) */}
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
                        onClick={() => setIsSuccess(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-background-card border border-status-success/30 p-8 md:p-12 rounded-[32px] max-w-lg w-full text-center relative shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />

                            <div className="w-20 h-20 bg-status-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-status-success" />
                            </div>

                            <h3 className="text-3xl font-black font-heading mb-2 text-text-primary">
                                PENDAFTARAN DITERIMA
                            </h3>
                            <p className="text-text-secondary mb-8 text-lg">
                                Pendaftaran Anda telah kami terima dengan baik. <br />
                                Tim kami akan segera menghubungi Anda untuk langkah selanjutnya.
                            </p>

                            <Button
                                onClick={() => setIsSuccess(false)}
                                className="w-full rounded-full bg-status-success hover:bg-status-success/90 text-background-primary"
                            >
                                KEMBALI
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </section>
    )
}
