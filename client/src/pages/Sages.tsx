import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Heart, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Sage } from "@shared/schema";

export default function Sages() {
  const { data: sages, isLoading, error } = useQuery<Sage[]>({
    queryKey: ["/api/sages"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Loading Wisdom of the Sages...</h1>
              <p className="text-xl text-gray-600">Gathering the profound teachings of spiritual masters</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6 text-red-600">Unable to Load Sage Wisdom</h1>
              <p className="text-xl text-gray-600">
                We're experiencing difficulties accessing the sacred texts and teachings. 
                Please try again later or contact our support team.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!sages || sages.length === 0) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Wisdom of the Sages</h1>
              <p className="text-xl text-gray-600">
                The sacred teachings are being compiled. Please check back soon as we continue 
                to gather wisdom from spiritual masters across traditions.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Wisdom of the Sages</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Spiritual philosophers, to whatever background they may belong, have left their mark in sands of times. 
            They lived and left this world holding a single aspiration – progress of their fellow human beings 
            in paths of spirituality. For this they sacrificed their own comforts, tolerated hardships, censure, 
            torture, ridicule with grace and with kindness.
          </p>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 bg-[hsl(84,42%,18%)] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <blockquote className="text-2xl font-light italic leading-relaxed">
            "By reading their lives and letting it inspire you, you pay your ultimate homage 
            to them and their lives efforts."
          </blockquote>
        </div>
      </section>

      {/* Sages Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {sages.map((sage) => (
              <Card key={sage.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src={sage.image} 
                      alt={sage.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold mb-2">{sage.name}</h3>
                        <p className="text-[hsl(75,64%,49%)] font-medium mb-3">{sage.description}</p>
                      </div>
                      
                      <div className="mb-4 flex-grow">
                        <p className="text-gray-700 leading-relaxed line-clamp-4">
                          {sage.biography}
                        </p>
                      </div>

                      {sage.teachings && sage.teachings.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Sparkles className="text-[hsl(75,64%,49%)] text-sm" />
                            <h4 className="font-semibold text-gray-700">Core Teachings</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {sage.teachings.slice(0, 3).map((teaching, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {teaching}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {sage.books && sage.books.length > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <BookOpen className="text-[hsl(75,64%,49%)] text-sm" />
                            <h4 className="font-semibold text-gray-700">Notable Works</h4>
                          </div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {sage.books.slice(0, 3).map((book, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-1.5 h-1.5 brand-primary rounded-full mr-2 flex-shrink-0"></span>
                                {book}
                              </li>
                            ))}
                            {sage.books.length > 3 && (
                              <li className="text-[hsl(75,64%,49%)] text-xs">
                                + {sage.books.length - 3} more works
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Carry Their Light Forward</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            The wisdom of these great souls transcends time and culture. Their teachings remain as relevant today 
            as they were centuries ago, offering guidance for our modern spiritual journey. By studying their lives 
            and integrating their wisdom, we honor their legacy and continue the eternal tradition of spiritual growth.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 brand-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">Study Their Teachings</h3>
              <p className="text-sm text-gray-600">Immerse yourself in their profound wisdom</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 brand-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">Practice with Devotion</h3>
              <p className="text-sm text-gray-600">Apply their guidance in daily life</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 brand-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="text-white" />
              </div>
              <h3 className="font-semibold mb-2">Share Their Light</h3>
              <p className="text-sm text-gray-600">Inspire others through their example</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
