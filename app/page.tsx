import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ShowcaseSection } from "@/components/landing/ShowcaseSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { NewsGrid } from "@/components/landing/NewsGrid";
import { LeadForm } from "@/components/landing/LeadForm";
import { Footer } from "@/components/landing/Footer";
import { getLatestNews } from "@/app/actions/news";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  // Fetch latest news (Mission Log)
  const newsRequest = await getLatestNews(3);
  const latestNews = newsRequest.success && newsRequest.data ? newsRequest.data : [];

  return (
    <div className="min-h-screen bg-background-primary overflow-x-hidden font-sans">
      <Navbar />

      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10">

        {/* VISUAL HERO SECTION */}
        <Hero />

        {/* TACTICAL SHOWCASE (ADAPTIVE SLIDESHOW) */}
        <ShowcaseSection />

        {/* FEATURES GRID (BENTO INTELLIGENCE) */}
        <FeaturesSection />

        {/* MISSION LOG (NEWS) */}
        <section id="mission-log" className="py-24 px-6 bg-background-secondary/30 dark:bg-background-secondary/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <Badge className="mb-4">Intel</Badge>
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-text-primary dark:text-white">
                  Mission Log
                </h2>
              </div>
              <Link href="/news" className="text-text-accent font-medium hover:text-indigo-700 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
                View Full Log
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <NewsGrid posts={latestNews} />
          </div>
        </section>

        {/* MISSION BRIEFING (LEAD FORM) */}
        <LeadForm />

        {/* TACTICAL FOOTER */}
        <Footer />

      </div>
    </div>
  );
}
