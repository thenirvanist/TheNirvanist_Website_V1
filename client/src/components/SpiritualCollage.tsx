import { useEffect, useRef } from "react";

export default function SpiritualCollage() {
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

  const images = [
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800",
      alt: "Himalayan meditation retreat",
      className: "col-span-2 row-span-2"
    },
    {
      src: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
      alt: "Ancient temple meditation",
      className: "col-span-1 row-span-1"
    },
    {
      src: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Yoga by the ocean",
      className: "col-span-1 row-span-1"
    },
    {
      src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      alt: "Sacred ashram grounds",
      className: "col-span-2 row-span-1"
    },
    {
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
      alt: "Mountain monastery",
      className: "col-span-1 row-span-2"
    },
    {
      src: "https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Prayer flags in wind",
      className: "col-span-1 row-span-1"
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 scroll-trigger">
          <h2 className="text-5xl md:text-6xl font-light text-white mb-8">
            Sacred <span className="text-[hsl(70,71%,62%)]">Experiences</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Immerse yourself in the transformative power of ancient wisdom traditions
          </p>
        </div>

        {/* Dynamic Collage Grid */}
        <div className="grid grid-cols-4 grid-rows-4 gap-4 h-[600px] scroll-trigger">
          {images.map((image, index) => (
            <div
              key={index}
              className={`
                ${image.className} 
                relative overflow-hidden rounded-2xl group cursor-pointer
                transform hover:scale-[1.02] transition-all duration-500
              `}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-medium">{image.alt}</p>
                </div>
              </div>
              
              {/* Floating Animation Elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-[hsl(70,71%,62%)] rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Floating Text Elements */}
        <div className="relative mt-16">
          <div className="absolute left-1/4 top-8 text-[hsl(70,71%,62%)] text-lg font-light animate-float opacity-60">
            Ancient Wisdom
          </div>
          <div className="absolute right-1/3 top-16 text-white text-sm font-light animate-float-delayed opacity-40">
            Sacred Journeys
          </div>
          <div className="absolute left-1/3 bottom-8 text-[hsl(70,71%,62%)] text-base font-light animate-float opacity-50">
            Inner Peace
          </div>
        </div>
      </div>
    </section>
  );
}