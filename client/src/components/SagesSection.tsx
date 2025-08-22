import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import LazyImage from "@/components/LazyImage";
import type { Sage } from "@shared/schema";

export default function SagesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Use regular useQuery with immediate fetching to ensure data loads on initial page load
  const { data: sages, isLoading, error } = useQuery<Sage[]>({
    queryKey: ["/api/sages"],
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
  });


  // Ensure data fetching happens immediately when component mounts
  useEffect(() => {
    // This effect ensures the query is triggered as soon as the component mounts
    // The query will automatically fetch due to the queryKey dependency
  }, []);



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
    if (sages && sages.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % sages.length);
    }
  };

  const prevSlide = () => {
    if (sages && sages.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + sages.length) % sages.length);
    }
  };

  // Show loading state only when actively loading
  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Wisdom of the Sages</h2>
            <p className="text-lg text-gray-700">Loading spiritual wisdom...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Wisdom of the Sages</h2>
            <p className="text-lg text-gray-700">Error loading sages data. Please try refreshing the page.</p>
          </div>
        </div>
      </section>
    );
  }

  // Show empty state if no data
  if (!sages || sages.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Wisdom of the Sages</h2>
            <p className="text-lg text-gray-700">No sage information available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="sages" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="scroll-trigger">
            <h2 className="text-4xl font-bold mb-6">Wisdom of the Sages</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Spiritual philosophers, to whatever background they may belong, have left their mark in sands of times. They lived and left this world holding a single aspiration – progress of their fellow human beings in paths of spirituality. For this they sacrificed their own comforts, tolerated hardships, censure, torture, ridicule with grace and with kindness. By reading their lives and letting it inspire you, you pay your ultimate homage to them and their lives efforts.
            </p>
          </div>
          
          <div className="scroll-trigger">
            <div className="image-carousel-container overflow-hidden rounded-xl mb-6">
              <div className="flex h-64 gap-2">
                {sages.slice(0, 5).map((sage, index) => (
                  <div
                    key={sage.id}
                    className={`cursor-pointer transition-all duration-500 rounded-lg overflow-hidden ${
                      index === currentIndex 
                        ? "flex-[2] opacity-100" 
                        : "flex-1 opacity-70 hover:opacity-90"
                    }`}
                    style={{
                      backgroundImage: `url('${sage.image}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <div className="w-full h-full bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                      <div className="text-white">
                        <h5 className="font-semibold text-sm">{sage.name}</h5>
                        {index === currentIndex && (
                          <p className="text-xs opacity-90 mt-1">{sage.description}</p>
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
                <h4 className="font-semibold text-lg">{sages[currentIndex]?.name}</h4>
                <p className="text-sm text-gray-600">{sages[currentIndex]?.description}</p>
              </div>
              <Button
                onClick={nextSlide}
                className="brand-primary hover:brand-bright text-white hover:text-black p-3 rounded-full transition-all duration-300"
              >
                <ChevronRight />
              </Button>
            </div>
            
            <Link href="/sages">
              <Button className="w-full brand-primary hover:brand-bright text-white hover:text-black py-3 rounded-lg font-semibold transition-all duration-300">
                Visit the Sages
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
