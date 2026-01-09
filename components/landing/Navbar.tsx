import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* LOGO */}
                <Link href="/" className="text-2xl font-bold font-heading tracking-tight text-text-primary">
                    TOGATHER
                </Link>

                {/* LINKS */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                        Fitur
                    </Link>
                    <Link href="#about" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                        Tentang Kami
                    </Link>
                    <Link href="#news" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                        Berita
                    </Link>

                    <Link href="https://app.togather.biz.id" target="_blank">
                        <Button variant="primary" size="sm" className="bg-text-primary text-background-primary hover:opacity-90 dark:bg-text-accent dark:text-background-primary rounded-full px-6">
                            Masuk Aplikasi
                        </Button>
                    </Link>

                    <div className="pl-4 border-l border-border">
                        <ThemeToggle />
                    </div>
                </div>

                {/* MOBILE MENU Placeholder */}
                <div className="md:hidden flex items-center gap-2">
                    <ThemeToggle />
                    <button className="text-text-primary p-2">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}
