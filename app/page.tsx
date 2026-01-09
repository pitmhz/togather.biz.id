import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ShowcaseSection } from "@/components/landing/ShowcaseSection";
import { BenefitsGrid } from "@/components/landing/BenefitsGrid";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FAQ } from "@/components/landing/FAQ";
import { NewsGrid } from "@/components/landing/NewsGrid";
import { LeadForm } from "@/components/landing/LeadForm";
import { Footer } from "@/components/landing/Footer";
import { getLatestNews } from "@/app/actions/news";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AmbientGlow } from "@/components/ui/ambient-glow";
import { NoiseOverlay } from "@/components/ui/noise-overlay";

export default async function Home() {
  // Fetch latest news
  const newsRequest = await getLatestNews(3);
  const latestNews = newsRequest.success && newsRequest.data ? newsRequest.data : [];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden font-sans relative">
      <NoiseOverlay />
      <AmbientGlow />

      <Navbar />

      <div className="relative z-10">

        {/* 1. HERO SECTION */}
        <Hero />

        {/* 2. ADAPTIVE UI SHOWCASE */}
        <ShowcaseSection />

        {/* 3. BENEFITS GRID */}
        <BenefitsGrid />

        {/* 4. HOW IT WORKS */}
        <HowItWorks />

        {/* 5. NEWS / BERITA */}
        <section id="news" className="py-24 px-6 bg-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <Badge className="mb-4">Berita</Badge>
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-text-primary">
                  Kabar Terbaru
                </h2>
              </div>
              <Link href="/news" className="text-text-accent font-medium hover:opacity-80 transition-opacity flex items-center gap-2">
                Lihat Semua
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <NewsGrid posts={latestNews} />
          </div>
        </section>

        {/* 6. FAQ */}
        <FAQ />

        {/* 7. LEAD FORM */}
        <LeadForm />

        {/* 8. FOOTER */}
        <Footer />

      </div>
    </div>
  );
}
