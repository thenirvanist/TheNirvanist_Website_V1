import { useEffect, useRef } from "react";
import { Mountain, Users, Heart } from "lucide-react";

export default function InteractiveAbout() {
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="scroll-trigger">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
            We Guide Souls on Sacred Paths
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            At The Nirvanist, we believe that true transformation happens when we step outside our comfort zones and immerse ourselves in ancient wisdom traditions. Our carefully curated spiritual journeys combine authentic cultural experiences with guided self-discovery.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Sacred Destinations</h3>
              <p className="text-gray-600">Ancient ashrams, holy mountains, and peaceful monasteries</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Global Community</h3>
              <p className="text-gray-600">Connect with like-minded souls from around the world</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white text-2xl" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Inner Transformation</h3>
              <p className="text-gray-600">Guided practices for lasting spiritual growth</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
