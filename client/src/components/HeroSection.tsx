import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background - placeholder for now */}
      <div 
        className="hero-video bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-reveal">
          Journey to Inner Peace
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 text-reveal" style={{animationDelay: "0.3s"}}>
          Transformative spiritual journeys that foster self-discovery and connection with diverse cultures
        </p>
        <Link href="/journeys">
          <Button 
            className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 text-reveal"
            style={{animationDelay: "0.6s"}}
          >
            Explore Sacred Journeys
          </Button>
        </Link>
      </div>
      
      {/* Partner Logo Carousel Band */}
      <div className="absolute bottom-0 left-0 right-0 brand-dark bg-opacity-95 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center space-x-12 text-white text-sm opacity-80">
            <span>Trusted Partners:</span>
            <div className="flex items-center space-x-8">
              <span>Sacred Earth Journeys</span>
              <span>Mindful Travel Co</span>
              <span>Wellness Retreats India</span>
              <span>Himalayan Spirituality</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
