import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Video, Users, Globe } from "lucide-react";
import { Link } from "wouter";

export default function MeetupsSection() {
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
    <section ref={sectionRef} id="meetups" className="py-20 bg-[#E8DCC3]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="scroll-trigger">
            <h2 className="text-4xl font-bold mb-6">Global Spiritual Meetups</h2>
            <h3 className="text-2xl font-semibold mb-4 text-[hsl(75,64%,49%)]">Join a Global Circle of Spiritual Seekers</h3>
            <p className="text-lg text-gray-700 mb-6">
              Weekly online satsangs to pause, reflect, and grow — together. Each Sunday, we gather online to watch a short video from a spiritual master and then join intimate virtual circles of 6-8 people from around the world.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Video className="text-[hsl(75,64%,49%)] text-xl" />
                <span>Short inspirational videos from spiritual masters</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="text-[hsl(75,64%,49%)] text-xl" />
                <span>Small group reflections and discussions</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="text-[hsl(75,64%,49%)] text-xl" />
                <span>Connect with seekers worldwide</span>
              </div>
            </div>
          </div>
          
          <div className="relative scroll-trigger">
            <img 
              src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Global spiritual video meetup" 
              className="rounded-xl shadow-lg w-full"
            />
            <div className="absolute inset-0 bg-[hsl(84,42%,18%)] bg-opacity-20 rounded-xl flex items-end justify-center pb-8">
              <Link href="/meetups">
                <Button className="brand-primary hover:brand-bright text-white hover:text-black px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                  Participate Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
