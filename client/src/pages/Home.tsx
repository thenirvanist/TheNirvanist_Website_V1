import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import InteractiveAbout from "@/components/InteractiveAbout";
import SpiritualCollage from "@/components/SpiritualCollage";
import TourCarousel from "@/components/TourCarousel";
import MeetupsSection from "@/components/MeetupsSection";
import SagesSection from "@/components/SagesSection";
import AshramsSection from "@/components/AshramsSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <InteractiveAbout />
      <SpiritualCollage />
      <TourCarousel />
      <MeetupsSection />
      <SagesSection />
      <AshramsSection />
      <Newsletter />
      <Footer />
    </div>
  );
}
