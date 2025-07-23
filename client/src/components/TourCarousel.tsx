import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import type { Journey } from "@shared/schema";

export default function TourCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  const { data: journeys, isLoading, error } = useQuery<Journey[]>({
    queryKey: ["/api/journeys"],
  });



  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".scroll-trigger");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3);
      } else if (window.innerWidth >= 768) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    if (journeys && currentIndex < journeys.length - visibleCards) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (isLoading && !journeys) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Sacred Journeys</h2>
            <p className="text-xl text-gray-600">Loading transformative retreats...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!journeys || journeys.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Sacred Journeys</h2>
            <p className="text-xl text-gray-600">
              {error ? 'Error loading journey data. Please try refreshing the page.' : 
               journeys ? `Found ${journeys.length} journeys` : 
               'Loading journey information...'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const displayedJourneys = journeys.slice(currentIndex, currentIndex + visibleCards);

  return (
    <section ref={sectionRef} id="journeys" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="scroll-trigger text-center mb-12">
          <h2 className="text-4xl font-bold mb-6">Sacred Journeys</h2>
          <p className="text-xl text-gray-600">Transformative retreats designed for your spiritual growth</p>
        </div>
        
        <div className="relative scroll-trigger">
          {/* Carousel Navigation */}
          <div className="flex justify-between items-center mb-8">
            <Button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="brand-primary hover:brand-bright text-white hover:text-black p-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Showing {currentIndex + 1}-{Math.min(currentIndex + visibleCards, journeys.length)} of {journeys.length} journeys
              </p>
            </div>
            
            <Button
              onClick={nextSlide}
              disabled={currentIndex >= journeys.length - visibleCards}
              className="brand-primary hover:brand-bright text-white hover:text-black p-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Carousel Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-500">
            {displayedJourneys.map((journey) => (
              <Card key={journey.id} className="tour-card bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                <img 
                  src={journey.image} 
                  alt={journey.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{journey.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{journey.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[hsl(75,64%,49%)] font-semibold">{journey.price}</span>
                    <span className="text-sm text-gray-500">{journey.duration}</span>
                  </div>
                  <Link href="/journeys">
                    <Button className="w-full brand-primary hover:brand-bright text-white hover:text-black py-3 rounded-lg font-semibold transition-all duration-300">
                      Start Your Journey
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(journeys.length / visibleCards) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * visibleCards)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / visibleCards) === index
                    ? "bg-[hsl(75,64%,49%)]"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}