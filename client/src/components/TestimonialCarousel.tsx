import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import type { Testimonial } from "@shared/schema";

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ["/api/testimonials"],
  });

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoPlaying || !testimonials?.length) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials?.length]);

  const nextTestimonial = () => {
    if (!testimonials?.length) return;
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    if (!testimonials?.length) return;
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (isLoading || !testimonials?.length) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">What Our Travelers Say</h2>
            <p className="text-xl text-gray-600">Loading spiritual experiences...</p>
          </div>
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6">What Our Travelers Say</h2>
          <p className="text-xl text-gray-600">Transformative experiences from our spiritual community</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <Card className="bg-white shadow-xl border-0 overflow-hidden">
            <CardContent className="p-12 text-center">
              <Quote className="w-16 h-16 text-[hsl(75,64%,49%)] mx-auto mb-8 opacity-20" />
              
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < currentTestimonial.rating
                        ? "text-[hsl(75,64%,49%)] fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <blockquote className="text-2xl font-light text-gray-800 leading-relaxed mb-8 italic">
                "{currentTestimonial.content}"
              </blockquote>

              <div className="flex items-center justify-center space-x-4">
                {currentTestimonial.avatar && (
                  <img
                    src={currentTestimonial.avatar}
                    alt={currentTestimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div className="text-left">
                  <p className="font-semibold text-lg text-gray-900">
                    {currentTestimonial.name}
                  </p>
                  <p className="text-gray-600">{currentTestimonial.location}</p>
                  {currentTestimonial.journeyTitle && (
                    <p className="text-[hsl(75,64%,49%)] text-sm font-medium">
                      {currentTestimonial.journeyTitle}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Arrows */}
          <div className="flex justify-between items-center mt-8">
            <Button
              onClick={prevTestimonial}
              className="brand-primary hover:brand-bright text-white hover:text-black p-3 rounded-full transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                {currentIndex + 1} of {testimonials.length}
              </p>
              
              {/* Dots Indicator */}
              <div className="flex justify-center space-x-2">
                {testimonials.slice(0, Math.min(testimonials.length, 10)).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-[hsl(75,64%,49%)]"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
                {testimonials.length > 10 && (
                  <span className="text-gray-400 text-sm">...</span>
                )}
              </div>
            </div>

            <Button
              onClick={nextTestimonial}
              className="brand-primary hover:brand-bright text-white hover:text-black p-3 rounded-full transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Auto-play Toggle */}
          <div className="text-center mt-6">
            <Button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              variant="outline"
              className="text-sm"
            >
              {isAutoPlaying ? "Pause Auto-play" : "Resume Auto-play"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}