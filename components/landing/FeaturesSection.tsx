'use client';

import {
    Music,
    Mic,
    Cross,
    Users,
    MapPin,
    Car,
    CheckCircle2,
    TrendingUp,
    Wallet,
    Clock
} from 'lucide-react';
import { BentoCard } from './BentoCard';

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 px-6 bg-background-secondary">
            <div className="max-w-7xl mx-auto">
                {/* Heading */}
                <div className="mb-20 md:text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black font-heading mb-6 tracking-tight text-text-primary">
                        MODULAR INTELLIGENCE <br />
                        <span className="text-text-secondary">FOR EVERY MINISTRY.</span>
                    </h2>
                    <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
                        Aktifkan fitur yang Anda butuhkan, dari perencanaan ibadah hingga pengelolaan keuangan,
                        dalam satu sistem terpadu yang dirancang untuk melayani dengan kasih.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[minmax(320px,auto)]">

                    {/* Card A: SERVICE DNA */}
                    <BentoCard
                        title="Alur Ibadah & Liturgi"
                        description="Susun jadwal dan rangkaian ibadah dengan rapi. Pastikan setiap pelayan jemaat terkoordinasi dengan baik."
                        accent="blue"
                        colSpan={2}
                    >
                        <div className="bg-background-card rounded p-6 border border-border h-full flex flex-col justify-center">
                            {/* Timeline Visualization */}
                            <div className="relative flex items-center justify-between px-2">
                                {/* Connecting Line */}
                                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-text-accent/20 -z-0" />

                                {/* Node 1 */}
                                <div className="relative z-10 flex flex-col items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-background-card border border-text-accent shadow-sm flex items-center justify-center text-text-accent">
                                        <Music size={18} />
                                    </div>
                                    <span className="text-xs font-mono font-medium text-text-secondary bg-background-card px-1.5 py-0.5 rounded border border-border">09:00</span>
                                </div>

                                {/* Node 2 */}
                                <div className="relative z-10 flex flex-col items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-text-accent shadow-lg shadow-text-accent/30 flex items-center justify-center text-background-primary">
                                        <Mic size={18} />
                                    </div>
                                    <span className="text-xs font-mono font-medium text-text-accent bg-background-secondary px-1.5 py-0.5 rounded border border-text-accent/20">09:15</span>
                                </div>

                                {/* Node 3 */}
                                <div className="relative z-10 flex flex-col items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-background-card border border-text-accent shadow-sm flex items-center justify-center text-text-accent">
                                        <Cross size={18} />
                                    </div>
                                    <span className="text-xs font-mono font-medium text-text-secondary bg-background-card px-1.5 py-0.5 rounded border border-border">09:45</span>
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Card B: FINANCIAL PULSE */}
                    <BentoCard
                        title="Man

ajemen Kas & Persembahan"
                        description="Catat persembahan dan kelola anggaran pelayanan dengan transparan dan akuntabel."
                        accent="emerald"
                    >
                        <div className="bg-status-success/5 rounded p-6 border border-status-success/20 h-full flex flex-col items-center justify-center">
                            {/* Donut Chart / Progress Visualization */}
                            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="var(--color-status-success)"
                                        className="opacity-20"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="var(--color-status-success)"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray="351.86"
                                        strokeDashoffset="52.78" /* 85% */
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-900">
                                    <span className="text-3xl font-bold text-status-success">85%</span>
                                    <Wallet size={16} className="text-status-success mt-1" />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold uppercase tracking-wider text-status-success mb-1">Weekly Target</p>
                                <p className="text-sm font-medium text-text-primary">Rp 8.5M / 10M</p>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Card C: TASK FORCE */}
                    <BentoCard
                        title="Koordinasi Tim Pelayanan"
                        description="Kelola jadwal pengerja dan volunteer. Berikan ruang bagi jemaat untuk terlibat dalam pelayanan."
                        accent="indigo"
                    >
                        <div className="bg-background-card rounded p-6 border border-border h-full flex flex-col justify-center">
                            {/* Avatar Pile */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-text-accent/5 rounded-xl border border-text-accent/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-text-accent/20 flex items-center justify-center text-text-accent text-xs font-bold">JD</div>
                                        <span className="text-sm font-medium text-text-primary">Worship Ldr</span>
                                    </div>
                                    <CheckCircle2 size={16} className="text-text-accent" />
                                </div>

                                <div className="flex items-center justify-between p-3 bg-background-card rounded-xl border border-border shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-status-warning/20 flex items-center justify-center text-status-warning text-xs font-bold">AS</div>
                                        <span className="text-sm font-medium text-text-secondary">Usher</span>
                                    </div>
                                    <div className="w-4 h-4 rounded-full border border-border" />
                                </div>

                                <div className="flex items-center justify-between p-3 bg-background-card rounded border border-border shadow-sm opacity-60">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center text-text-secondary text-xs font-bold">?</div>
                                        <span className="text-sm font-medium text-text-secondary">Media</span>
                                    </div>
                                    <div className="w-4 h-4 rounded-full border border-border" />
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Card D: LOGISTICS HUB */}
                    <BentoCard
                        title="Pertumbuhan Komsel"
                        description="Pantau perkembangan kelompok sel dan pererat hubungan antar anggota jemaat di mana pun mereka berada."
                        accent="amber"
                        colSpan={4}
                        className="md:col-span-4" // Expanding specific one to full width or customized? Prompt said "lg:grid-cols-4", user listing 4 cards. 
                    // Wait, card D is Logistics. Let's stick to the prompt structure. 
                    // Prompt: "Implement a responsive CSS Grid... grid-cols-1 md:grid-cols-2 lg:grid-cols-4".
                    // 4 Core modules. 
                    // Card A (Service DNA)
                    // Card B (Financial)
                    // Card C (Task Force)
                    // Card D (Logistics)
                    // The prompt says "Card A: ...", "Card B: ...". It doesn't specify colSpan for A, but A has a horizontal timeline.
                    // I set A to colSpan=2 in my code above.
                    // B is 1 col.
                    // C is 1 col.
                    // That makes 4 cols total in the top row.
                    // But wait, the prompt list is A, B, C, D.
                    // If A is 2 cols, B 1, C 1, that fits a 4-col row.
                    // D? Where does D go?
                    // "The 4 Modular Cards".
                    // Maybe Card D is also intended for a layout. The prompt didn't specify D's colspan.
                    // Let's assume standard grid flow.
                    // A (2 cols), B (1), C (1) = 4 cols.
                    // D (Logistics) -> Map. Maps usually look good wide. Maybe D takes full width or 2 cols?
                    // Or maybe the grid is just auto wrapping.
                    // Let's make D colSpan 4 (full width) or 2 depending on design.
                    // "Logistics Hub... Visualization: Stylized mini-map... central pin... 2-3 smaller car icons".
                    // A map works best with some width. 
                    // Let's make D spanning 2 cols or 4.
                    // Let's modify:
                    // Row 1: A (2), B (1), C (1)
                    // Row 2: D (2? 4?)
                    // Actually, for "lg:grid-cols-4", creating a nice layout:
                    // A (2 cols) | B (1 col) | C (1 col)
                    // D (4 cols) - Full width map? Or maybe varied.
                    // Let's try to make it compact. A (2), D (2). B(1), C(1)? 
                    // Let's stick to A(2), B(1), C(1) for top row, and D(4) for bottom row or D(2) and maybe another card?
                    // The user only listed A, B, C, D.
                    // Let's make D colSpan=4 for a big logistics map.
                    >
                        <div className="bg-status-warning/5 rounded border border-status-warning/20 h-full min-h-[200px] relative overflow-hidden flex items-center justify-center">
                            {/* Map Visualization */}
                            <div className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: 'radial-gradient(circle, var(--color-status-warning) 1px, transparent 1px)',
                                    backgroundSize: '24px 24px'
                                }}
                            />

                            {/* Roads */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-status-warning/30" strokeWidth="2">
                                <path d="M-100 200 Q 300 150 600 200 T 1200 100" fill="none" />
                                <path d="M400 -100 Q 450 300 400 600" fill="none" />
                            </svg>

                            {/* Central Pin */}
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-status-warning shadow-xl shadow-status-warning/30 flex items-center justify-center text-background-primary animate-bounce">
                                    <MapPin size={24} fill="currentColor" />
                                </div>
                                <div className="bg-background-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-status-warning mt-2 shadow-sm border border-border">
                                    Main Venue
                                </div>
                            </div>

                            {/* Cars */}
                            <div className="absolute top-1/3 left-1/4 animate-pulse">
                                <div className="bg-background-card p-1.5 rounded-full shadow-md text-status-warning">
                                    <Car size={16} />
                                </div>
                            </div>
                            <div className="absolute bottom-1/3 right-1/4 animate-pulse delay-700">
                                <div className="bg-background-card p-1.5 rounded-full shadow-md text-status-warning">
                                    <Car size={16} />
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                </div>
            </div>
        </section>
    );
}
