import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import type { Journey } from "@shared/schema";

export default function TourCarousel() {
  const sectionRef = useRef<HTMLElement>(null);

  const { data: journeys, isLoading } = useQuery<Journey[]>({
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

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Sacred Journeys</h2>
            <p className="text-xl text-gray-600">No journeys available at the moment. Please check back soon.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} id="journeys" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="scroll-trigger text-center mb-12">
          <h2 className="text-4xl font-bold mb-6">Sacred Journeys</h2>
          <p className="text-xl text-gray-600">Transformative retreats designed for your spiritual growth</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-trigger">
          {journeys.map((journey) => (
            <Card key={journey.id} className="tour-card bg-white rounded-xl shadow-lg overflow-hidden">
              <img 
                src={journey.image} 
                alt={journey.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">{journey.title}</h3>
                <p className="text-gray-600 mb-4">{journey.description}</p>
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
      </div>
    </section>
  );
}
