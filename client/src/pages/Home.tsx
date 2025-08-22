import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import OptimizedHeroSection from "@/components/OptimizedHeroSection";
import InteractiveAbout from "@/components/InteractiveAbout";

// Lazy load below-the-fold components for better initial load performance
const SpiritualCollage = lazy(() => import("@/components/SpiritualCollage"));
const TourCarousel = lazy(() => import("@/components/TourCarousel"));
const MeetupsSection = lazy(() => import("@/components/MeetupsSection"));
const SagesSection = lazy(() => import("@/components/SagesSection"));
const AshramsSection = lazy(() => import("@/components/AshramsSection"));
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
      <OptimizedHeroSection priority />
      <InteractiveAbout />
      
      {/* Below-the-fold content with lazy loading */}
      <Suspense fallback={<SectionSkeleton />}>
        <SpiritualCollage />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <TourCarousel />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <MeetupsSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <SagesSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <AshramsSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <Newsletter />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <Footer />
      </Suspense>
    </div>
  );
}
