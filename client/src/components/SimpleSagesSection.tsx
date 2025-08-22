import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Sage } from "@shared/schema";

export default function SimpleSagesSection() {
  const { data: sages, isLoading, error } = useQuery<Sage[]>({
    queryKey: ["/api/sages"],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Wisdom of the Sages</h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[hsl(75,64%,49%)]"></div>
              <p className="text-lg text-gray-700">Loading spiritual wisdom...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">Wisdom of the Sages</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-800 font-medium">Content unavailable</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-6">Wisdom of the Sages</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Spiritual philosophers have left their mark in sands of times. They lived and left this world 
            holding a single aspiration – progress of their fellow human beings in paths of spirituality.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sages.slice(0, 3).map((sage) => (
            <div key={sage.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img 
                src={sage.image} 
                alt={sage.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{sage.name}</h3>
                <p className="text-gray-600 mb-3">{sage.description}</p>
                <p className="text-sm text-gray-500 mb-4">{sage.location}</p>
                
                {sage.teachings && sage.teachings.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Core Teachings:</h4>
                    <div className="flex flex-wrap gap-2">
                      {sage.teachings.slice(0, 3).map((teaching, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {teaching}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <Link href={`/sages/${sage.id}`} onClick={() => window.scrollTo(0, 0)}>
                  <Button className="w-full brand-primary hover:brand-bright text-white hover:text-black py-3 rounded-lg font-semibold transition-all duration-300">
                    Read Full Biography
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/sages" onClick={() => window.scrollTo(0, 0)}>
            <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300">
              Visit All Sages
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}