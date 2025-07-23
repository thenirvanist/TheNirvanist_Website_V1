import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import type { Ashram } from "@shared/schema";

export default function AshramsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: ashrams, isLoading } = useQuery<Ashram[]>({
    queryKey: ["/api/ashrams"],
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

  if (isLoading) {
    return (
      <section className="py-20 bg-[#E8DCC3]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Sacred Ashrams</h2>
            <p className="text-lg text-gray-700">Loading sacred spaces...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!ashrams || ashrams.length === 0) {
    return (
      <section className="py-20 bg-[#E8DCC3]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Sacred Ashrams</h2>
            <p className="text-lg text-gray-700">No ashram information available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="ashrams" className="py-20 bg-[#E8DCC3]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="scroll-trigger">
            <h2 className="text-4xl font-bold mb-6">Sacred Ashrams</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Discover ancient ashrams where countless souls have found peace and enlightenment. These sacred spaces have preserved spiritual wisdom for centuries, offering refuge and guidance to seekers from all walks of life. Each ashram carries its unique energy and teachings, providing authentic pathways to inner transformation.
            </p>
          </div>
          
          <div className="scroll-trigger">
            <div className="accordion-carousel-container overflow-hidden rounded-xl mb-6">
              <div className="accordion-carousel">
                {ashrams.map((ashram, index) => (
                  <div
                    key={ashram.id}
                    className="accordion-item"
                    style={{
                      backgroundImage: `url('${ashram.image}')`,
                      flex: index === currentIndex ? "0 0 250px" : "0 0 120px"
                    }}
                    onClick={() => setCurrentIndex(index)}
                  />
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
