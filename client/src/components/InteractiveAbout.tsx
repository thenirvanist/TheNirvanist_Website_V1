import { useEffect, useRef, useState } from "react";
import { Mountain, Users, Heart, Compass, Flower2, Globe } from "lucide-react";

export default function InteractiveAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleWords, setVisibleWords] = useState<number>(0);
  const [isInView, setIsInView] = useState(false);

  const aboutText = [
    "At", "The", "Nirvanist,", "we", "believe", "that", "true", "transformation", 
    "begins", "with", "a", "single", "step", "into", "the", "unknown.", "We", "are", 
    "not", "just", "a", "travel", "company", "—", "we", "are", "curators", "of", 
    "sacred", "experiences,", "architects", "of", "spiritual", "awakening,", "and", 
    "guides", "on", "your", "journey", "to", "inner", "peace."
  ];

  const mission = [
    "Our", "mission", "is", "simple:", "to", "connect", "seekers", "with", "ancient", 
    "wisdom", "traditions,", "sacred", "spaces,", "and", "transformative", "experiences", 
    "that", "nourish", "the", "soul", "and", "expand", "consciousness."
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && visibleWords < aboutText.length) {
      const timer = setTimeout(() => {
        setVisibleWords(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInView, visibleWords, aboutText.length]);

  return (
    <section ref={sectionRef} className="min-h-screen bg-white text-black flex items-center justify-center py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Interactive Text Animation */}
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-8xl font-light mb-12 tracking-tight">
            <span className="text-[hsl(70,71%,62%)]">About</span> Us
          </h2>
          
          <div className="text-2xl md:text-3xl leading-relaxed font-light max-w-4xl mx-auto mb-8">
            {aboutText.map((word, index) => (
              <span
                key={index}
                className={`inline-block mr-2 transition-all duration-500 ${
                  index < visibleWords 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-4'
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`,
                  color: index % 8 === 0 ? 'hsl(70,71%,62%)' : 'black'
                }}
              >
                {word}
              </span>
            ))}
          </div>

          <div className="text-xl md:text-2xl leading-relaxed font-light max-w-3xl mx-auto opacity-80">
            {mission.map((word, index) => (
              <span
                key={index}
                className={`inline-block mr-2 transition-all duration-500 ${
                  index < Math.max(0, visibleWords - aboutText.length) 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-4'
                }`}
                style={{
                  transitionDelay: `${(aboutText.length + index) * 50}ms`,
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(70,71%,62%)] to-[hsl(75,64%,49%)] rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="absolute inset-2 bg-[hsl(70,71%,62%)] rounded-full flex items-center justify-center">
                <Mountain className="text-black text-2xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[hsl(70,71%,62%)]">Sacred Destinations</h3>
            <p className="text-gray-300">Ancient ashrams, holy mountains, and peaceful monasteries around the world</p>
          </div>
          
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(70,71%,62%)] to-[hsl(75,64%,49%)] rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="absolute inset-2 bg-[hsl(70,71%,62%)] rounded-full flex items-center justify-center">
                <Globe className="text-black text-2xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[hsl(70,71%,62%)]">Global Community</h3>
            <p className="text-gray-300">Connect with like-minded souls from every corner of the globe</p>
          </div>
          
          <div className="text-center group">
            <div className="w-20 h-20 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(70,71%,62%)] to-[hsl(75,64%,49%)] rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="absolute inset-2 bg-[hsl(70,71%,62%)] rounded-full flex items-center justify-center">
                <Flower2 className="text-black text-2xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-[hsl(70,71%,62%)]">Inner Transformation</h3>
            <p className="text-gray-300">Guided practices for lasting spiritual growth and enlightenment</p>
          </div>
        </div>
      </div>
    </section>
  );
}
