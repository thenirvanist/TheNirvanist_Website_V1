import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import InteractiveAbout from "@/components/InteractiveAbout";
// Import critical sections directly to ensure immediate data loading
import TourCarousel from "@/components/TourCarousel";
import MeetupsSection from "@/components/MeetupsSection";
import SagesSection from "@/components/SagesSection";
import AshramsSection from "@/components/AshramsSection";

// Only lazy load non-critical sections for better performance
const SpiritualCollage = lazy(() => import("@/components/SpiritualCollage"));
const Newsletter = lazy(() => import("@/components/Newsletter"));
const Footer = lazy(() => import("@/components/Footer"));

// Loading component for lazy-loaded sections
function SectionSkeleton() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="loading-skeleton h-8 w-64 mx-auto mb-8 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="loading-skeleton h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Critical above-the-fold content */}
      <Navigation />
      <HeroSection />
      <InteractiveAbout />
      
      {/* Below-the-fold content */}
      <Suspense fallback={<SectionSkeleton />}>
        <SpiritualCollage />
      </Suspense>
      
      {/* Critical sections with immediate data loading */}
      <TourCarousel />
      <MeetupsSection />
      <SagesSection />
      <AshramsSection />
      
      {/* Non-critical sections with lazy loading */}
      <Suspense fallback={<SectionSkeleton />}>
        <Newsletter />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <Footer />
      </Suspense>
    </div>
  );
}
