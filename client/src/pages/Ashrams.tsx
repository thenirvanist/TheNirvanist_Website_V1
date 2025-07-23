import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Star, Heart, Leaf } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import type { Ashram } from "@shared/schema";

export default function Ashrams() {
  const { data: ashrams, isLoading, error } = useQuery<Ashram[]>({
    queryKey: ["/api/ashrams"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Loading Sacred Ashrams...</h1>
              <p className="text-xl text-gray-600">Discovering peaceful sanctuaries for spiritual growth</p>
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
              <h1 className="text-4xl font-bold mb-6 text-red-600">Unable to Load Sacred Spaces</h1>
              <p className="text-xl text-gray-600">
                We're experiencing difficulties connecting to our ashram network. 
                Please try again later or contact our support team.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!ashrams || ashrams.length === 0) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Sacred Ashrams</h1>
              <p className="text-xl text-gray-600">
                Our network of sacred ashrams is being carefully curated. Please check back soon 
                as we continue to connect with spiritual centers worldwide.
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
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-cover bg-center bg-no-repeat" 
               style={{backgroundImage: "url('https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-6xl font-bold mb-6">Sacred Ashrams</h1>
          <p className="text-xl mb-8 leading-relaxed">
            Discover ancient ashrams where countless souls have found peace and enlightenment. 
            These sacred spaces have preserved spiritual wisdom for centuries, offering refuge 
            and guidance to seekers from all walks of life.
          </p>
          <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-4 text-lg rounded-lg font-semibold transition-all duration-300">
            Explore Sacred Spaces
          </Button>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 bg-[hsl(84,42%,18%)] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <blockquote className="text-2xl font-light italic leading-relaxed">
            "In the silence of sacred spaces, the soul finds its true home."
          </blockquote>
        </div>
      </section>

      {/* Ashrams Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {ashrams.map((ashram) => (
              <Card key={ashram.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={ashram.image} 
                    alt={ashram.name}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="brand-primary text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Sacred Space
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-2xl text-[hsl(84,42%,18%)]">{ashram.name}</CardTitle>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{ashram.location}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-gray-700 leading-relaxed">
                    {ashram.description}
                  </p>

                  {ashram.facilities && ashram.facilities.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Leaf className="text-[hsl(75,64%,49%)] w-5 h-5" />
                        <h4 className="font-semibold text-gray-700">Facilities & Offerings</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {ashram.facilities.map((facility, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <span className="w-2 h-2 brand-primary rounded-full mr-2 flex-shrink-0"></span>
                            <span className="text-gray-600">{facility}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4 space-y-3">
                    {ashram.contact && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-3 text-[hsl(75,64%,49%)]" />
                        <span>{ashram.contact}</span>
                      </div>
                    )}
                    
                    {ashram.website && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="w-4 h-4 mr-3 text-[hsl(75,64%,49%)]" />
                        <a 
                          href={`https://${ashram.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[hsl(75,64%,49%)] hover:underline"
                        >
                          {ashram.website}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button 
                      className="flex-1 brand-primary hover:brand-bright text-white hover:text-black transition-all duration-300"
                    >
                      Learn More
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-[hsl(75,64%,49%)] text-[hsl(75,64%,49%)] hover:bg-[hsl(75,64%,49%)] hover:text-white"
                    >
                      Plan Visit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">What Makes These Ashrams Special</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Authentic Traditions</h3>
              <p className="text-gray-600">
                Experience genuine spiritual practices passed down through generations of masters
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Natural Harmony</h3>
              <p className="text-gray-600">
                Peaceful environments that foster deep connection with nature and inner self
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-3">Guided Growth</h3>
              <p className="text-gray-600">
                Experienced teachers and practitioners to support your spiritual journey
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[hsl(84,42%,18%)] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Ashram Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Connect with these sacred spaces and discover the path that resonates with your soul
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-3 text-lg font-semibold"
            >
              Plan Your Visit
            </Button>
            <Button 
              size="lg"
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[hsl(84,42%,18%)] px-8 py-3 text-lg font-semibold"
            >
              Contact Our Guides
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
