import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface Quote {
  id: number;
  title: string;
  author: string;
  quoteText?: string;
  imageUrl: string;
  displayDate: string;
  active?: boolean;
}

export default function QuotesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Fetch active quotes from API
  const { data: quotes = [], isLoading, isError } = useQuery<Quote[]>({
    queryKey: ["/api/quotes/active"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || quotes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isPlaying, quotes.length]);

  // Navigate to previous quote
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
    setIsPlaying(false);
  };

  // Navigate to next quote
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
    setIsPlaying(false);
  };

  // Navigate to specific quote
  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
  };

  // Resume autoplay after interaction
  useEffect(() => {
    if (!isPlaying) {
      const timeout = setTimeout(() => setIsPlaying(true), 5000); // Resume after 5 seconds
      return () => clearTimeout(timeout);
    }
  }, [isPlaying]);

  // Format date for display (without timezone shift)
  const formatDate = (dateString: string) => {
    // Append time to force UTC interpretation and avoid timezone shift
    const date = new Date(dateString + 'T00:00:00Z');
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric',
      timeZone: 'UTC' // Force UTC to prevent timezone shifts
    });
  };

  if (isLoading) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Daily Wisdom
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Inspirational quotes from spiritual masters and mystics
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  if (isError || quotes.length === 0) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Daily Wisdom
            </h2>
            <p className="text-xl text-gray-600">
              Unable to load quotes at this time. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentQuote = quotes[currentIndex];

  return (
    <section className="bg-white py-16" data-testid="quotes-carousel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Daily Wisdom
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-pink-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Inspirational quotes from spiritual masters and mystics around the world
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-xl mx-auto">
          {/* Main Quote Card */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <div 
              className="aspect-square bg-cover bg-center relative"
              style={{ backgroundImage: `url(${currentQuote.imageUrl})` }}
            >
              {/* Date Label */}
              <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full z-10">
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(currentQuote.displayDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-lg z-20"
            data-testid="button-previous-quote"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-lg z-20"
            data-testid="button-next-quote"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Autoplay Control */}
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-4 right-4 px-3 py-2 bg-white/90 hover:bg-white text-gray-900 text-xs rounded-full shadow-lg z-20"
            data-testid="button-toggle-autoplay"
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center items-center mt-8 space-x-3">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gradient-to-r from-orange-400 to-pink-500 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              data-testid={`dot-indicator-${index}`}
            />
          ))}
        </div>

        {/* Author Labels */}
        <div className="flex justify-center items-center mt-6 flex-wrap gap-2">
          {quotes.map((quote, index) => (
            <button
              key={quote.id}
              onClick={() => goToIndex(index)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                index === currentIndex
                  ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              data-testid={`author-label-${index}`}
            >
              {quote.author}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
