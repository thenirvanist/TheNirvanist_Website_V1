import { useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Star, Heart, Leaf, ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAshram } from "@/hooks/useSupabaseQuery";

export default function AshramDetail() {
  const { id } = useParams<{ id: string }>();
  const ashramId = parseInt(id || "0");

  const { data: ashram, isLoading, error } = useAshram(ashramId);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">Loading Sacred Space...</h1>
              <p className="text-xl text-gray-600">Gathering details about this spiritual sanctuary</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !ashram) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6 text-red-600">Ashram Not Found</h1>
              <p className="text-xl text-gray-600 mb-8">
                We couldn't find the ashram you're looking for.
              </p>
              <Link href="/ashrams">
                <Button className="brand-primary hover:brand-bright text-white hover:text-black">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to All Ashrams
                </Button>
              </Link>
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
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/ashrams">
            <Button variant="ghost" className="mb-6 hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Ashrams
            </Button>
          </Link>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <img 
                src={ashram.image} 
                alt={ashram.name}
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
            
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-4">{ashram.name}</h1>
              
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-gray-700 text-lg">{ashram.location}</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {ashram.region && (
                  <Badge variant="secondary" className="text-sm">
                    {ashram.region}
                  </Badge>
                )}
                {ashram.focus && (
                  <Badge variant="outline" className="text-sm">
                    {ashram.focus}
                  </Badge>
                )}
              </div>

              {ashram.founders && (
                <div className="flex items-center mb-6">
                  <User className="w-5 h-5 text-[hsl(75,64%,49%)] mr-2" />
                  <span className="text-gray-700">
                    <span className="font-semibold">Founded by:</span> {ashram.founders}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Heart className="w-6 h-6 text-[hsl(75,64%,49%)] mr-3" />
                About This Sacred Space
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {ashram.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Facilities & Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {ashram.facilities && ashram.facilities.length > 0 && (
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <Leaf className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                    Facilities & Offerings
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {ashram.facilities.map((facility, index) => (
                      <div key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-[hsl(75,64%,49%)] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700 font-medium">{facility}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Phone className="w-5 h-5 text-[hsl(75,64%,49%)] mr-3" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {ashram.contact && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-500 mr-3" />
                      <span className="text-gray-700">{ashram.contact}</span>
                    </div>
                  )}
                  
                  {ashram.website && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 text-gray-500 mr-3" />
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

                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-500 mr-3" />
                    <span className="text-gray-700">{ashram.location}</span>
                  </div>
                </div>
                
                <div className="mt-8 space-y-3">
                  <Button className="w-full brand-primary hover:brand-bright text-white hover:text-black py-3">
                    Plan Your Visit
                  </Button>
                  <Button variant="outline" className="w-full border-[hsl(75,64%,49%)] text-[hsl(75,64%,49%)] hover:bg-[hsl(75,64%,49%)] hover:text-white py-3">
                    Contact Ashram
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Begin Your Sacred Journey</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            {ashram.name} offers a unique opportunity for spiritual growth and inner transformation. 
            Connect with this sacred tradition and discover the peace that awaits within.
          </p>
          <Link href="/ashrams">
            <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-3">
              Explore More Ashrams
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}