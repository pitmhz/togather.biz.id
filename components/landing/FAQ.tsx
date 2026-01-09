"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, MessageCircleQuestion } from "lucide-react"

const FAQ_ITEMS = [
    {
        question: "Apakah Togather gratis?",
        answer: "Ya! Togather menyediakan paket gratis untuk komunitas kecil hingga 50 anggota. Untuk fitur yang lebih lengkap dan kapasitas lebih besar, kami menawarkan paket premium yang terjangkau."
    },
    {
        question: "Bagaimana keamanan data jemaat?",
        answer: "Keamanan adalah prioritas utama kami. Semua data terenkripsi end-to-end, disimpan di server yang tersertifikasi, dan hanya dapat diakses oleh admin yang berwenang. Kami juga mematuhi standar privasi data internasional."
    },
    {
        question: "Bisa untuk komunitas kecil atau komsel?",
        answer: "Tentu saja! Togather dirancang untuk berbagai skala komunitas, mulai dari kelompok sel kecil (5-10 orang) hingga gereja besar dengan ribuan jemaat. Setiap fitur dapat disesuaikan dengan kebutuhan Anda."
    }
]

function FAQItem({ item, isOpen, onToggle }: { item: typeof FAQ_ITEMS[0], isOpen: boolean, onToggle: () => void }) {
    return (
        <motion.div
            animate={{
                backgroundColor: isOpen ? "rgba(var(--color-dry-sage-100), 0.5)" : "transparent",
                borderColor: isOpen ? "rgba(var(--color-text-accent), 0.2)" : "transparent"
            }}
            className="border-b border-border last:border-b-0 rounded-2xl transition-colors duration-300 overflow-hidden"
        >
            <button
                onClick={onToggle}
                className="w-full py-6 px-6 flex items-center justify-between text-left group"
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg transition-colors duration-300 ${isOpen ? "bg-text-accent/10 text-text-accent" : "bg-transparent text-text-secondary"}`}>
                        <MessageCircleQuestion className="w-5 h-5" />
                    </div>
                    <span className={`text-lg font-semibold transition-colors duration-300 ${isOpen ? "text-text-primary" : "text-text-secondary group-hover:text-text-primary"}`}>
                        {item.question}
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    className={isOpen ? "text-text-accent" : "text-text-secondary"}
                >
                    <ChevronDown className="w-5 h-5" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-6 pl-[4.5rem]">
                            <p className="text-text-secondary leading-relaxed">
                                {item.answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export function FAQ() {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0)

    return (
        <section id="faq" className="py-24 px-6 bg-transparent">
            <div className="max-w-3xl mx-auto">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-black font-heading tracking-tight mb-4 text-text-primary">
                        Pertanyaan Umum
                    </h2>
                    <p className="text-lg text-text-secondary">
                        Jawaban untuk pertanyaan yang sering ditanyakan.
                    </p>
                </motion.div>

                {/* Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-background-card/80 backdrop-blur-sm rounded-[32px] p-2 shadow-lg border border-border"
                >
                    {FAQ_ITEMS.map((item, index) => (
                        <FAQItem
                            key={index}
                            item={item}
                            isOpen={openIndex === index}
                            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </motion.div>

            </div>
        </section>
    )
}
