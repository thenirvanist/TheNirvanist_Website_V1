import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Journey } from "@shared/schema";

export default function Journeys() {
  const { data: journeys, isLoading, error } = useQuery<Journey[]>({
    queryKey: ["/api/journeys"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Loading Sacred Journeys...</h1>
              <p className="text-xl text-gray-600">Please wait while we gather your transformative experiences</p>
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
              <h1 className="text-4xl font-bold mb-6 text-red-600">Unable to Load Journeys</h1>
              <p className="text-xl text-gray-600">We're experiencing difficulties connecting to our spiritual guidance system. Please try again later or contact our support team.</p>
              <Button className="mt-6 brand-primary hover:brand-bright text-white hover:text-black">
                Try Again
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!journeys || journeys.length === 0) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Sacred Journeys</h1>
              <p className="text-xl text-gray-600">No spiritual journeys are currently available. Please check back soon as we're always adding new transformative experiences.</p>
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
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Sacred Journeys</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Embark on transformative spiritual adventures that connect you with ancient wisdom, 
            sacred places, and your inner truth. Each journey is carefully curated to provide 
            authentic experiences that foster deep personal growth.
          </p>
        </div>
      </section>

      {/* Journeys Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journeys.map((journey) => (
              <Card key={journey.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={journey.image} 
                    alt={journey.title}
                    className="w-full h-56 object-cover"
                  />
                  {journey.available && (
                    <Badge className="absolute top-4 right-4 brand-primary text-white">
                      Available
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-3">{journey.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{journey.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-500">Location:</span>
                      <span className="text-sm text-gray-700">{journey.location}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-500">Duration:</span>
                      <span className="text-sm text-gray-700">{journey.duration}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium text-gray-500">Investment:</span>
                      <span className="text-lg font-semibold text-[hsl(75,64%,49%)]">{journey.price}</span>
                    </div>
                  </div>

                  {journey.inclusions && journey.inclusions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Includes:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {journey.inclusions.slice(0, 3).map((inclusion, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-2 h-2 brand-primary rounded-full mr-2"></span>
                            {inclusion}
                          </li>
                        ))}
                        {journey.inclusions.length > 3 && (
                          <li className="text-[hsl(75,64%,49%)] text-xs">+ {journey.inclusions.length - 3} more inclusions</li>
                        )}
                      </ul>
                    </div>
                  )}

                  <Button 
                    className="w-full brand-primary hover:brand-bright text-white hover:text-black py-3 rounded-lg font-semibold transition-all duration-300"
                    disabled={!journey.available}
                  >
                    {journey.available ? "Begin Your Journey" : "Currently Unavailable"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
