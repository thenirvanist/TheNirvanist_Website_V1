import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import type { Ashram } from "@shared/schema";

export default function AshramsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Enhanced useQuery configuration to ensure immediate data fetching on component mount
  const { data: ashrams, isLoading, error } = useQuery<Ashram[]>({
    queryKey: ["/api/ashrams"],
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
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

  const nextSlide = () => {
    if (ashrams && ashrams.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % ashrams.length);
    }
  };

  const prevSlide = () => {
    if (ashrams && ashrams.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + ashrams.length) % ashrams.length);
    }
  };

  // Show loading state with spinner
  if (isLoading) {
    return (
      <section className="py-20 bg-[#F7F2E8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Sacred Ashrams</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[hsl(75,64%,49%)]"></div>
              <p className="text-lg text-gray-700">Loading sacred spaces...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state with fallback message
  if (error) {
    return (
      <section className="py-20 bg-[#F7F2E8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Sacred Ashrams</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-800 font-medium mb-2">Content unavailable</p>
              <p className="text-red-600 text-sm">We're experiencing technical difficulties. Please try refreshing the page.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Always render the section if we have data, even if empty
  if (!ashrams) {
    return (
      <section className="py-20 bg-[#F7F2E8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Sacred Ashrams</h2>
            <p className="text-lg text-gray-700">Loading ashram data...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="ashrams" className="py-20 bg-[#F7F2E8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="scroll-trigger">
            <h2 className="text-4xl font-bold mb-6">Sacred Ashrams</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Discover ancient ashrams where countless souls have found peace and enlightenment. These sacred spaces have preserved spiritual wisdom for centuries, offering refuge and guidance to seekers from all walks of life. Each ashram carries its unique energy and teachings, providing authentic pathways to inner transformation.
            </p>
          </div>
          
          <div className="scroll-trigger">
            <div className="image-carousel-container overflow-hidden rounded-xl mb-6">
              <div className="flex h-64 gap-2">
                {ashrams.slice(0, 5).map((ashram, index) => (
                  <div
                    key={ashram.id}
                    className={`cursor-pointer transition-all duration-500 rounded-lg overflow-hidden ${
                      index === currentIndex 
                        ? "flex-[2] opacity-100" 
                        : "flex-1 opacity-70 hover:opacity-90"
                    }`}
                    style={{
                      backgroundImage: `url('${ashram.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <div className="w-full h-full bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                      <div className="text-white">
                        <h5 className="font-semibold text-sm">{ashram.name}</h5>
                        {index === currentIndex && (
                          <p className="text-xs opacity-90 mt-1">{ashram.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={prevSlide}
                className="brand-primary hover:brand-bright text-white hover:text-black p-3 rounded-full transition-all duration-300"
              >
                <ChevronLeft />
              </Button>
              <div className="text-center">
                <h4 className="font-semibold text-lg">{ashrams[currentIndex]?.name}</h4>
                <p className="text-sm text-gray-600">{ashrams[currentIndex]?.location}</p>
              </div>
              <Button
                onClick={nextSlide}
                className="brand-primary hover:brand-bright text-white hover:text-black p-3 rounded-full transition-all duration-300"
              >
                <ChevronRight />
              </Button>
            </div>
            
            <Link href="/ashrams">
              <Button className="w-full brand-primary hover:brand-bright text-white hover:text-black py-3 rounded-lg font-semibold transition-all duration-300">
                Explore Ashrams
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
