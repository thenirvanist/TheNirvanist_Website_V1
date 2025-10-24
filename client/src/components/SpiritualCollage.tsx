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
    <section ref={sectionRef} className="py-20 bg-[#F7F2E8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 scroll-trigger">
          <h2 className="text-4xl font-bold mb-6">Sacred Experiences</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Immerse yourself in the transformative power of ancient wisdom traditions
          </p>
        </div>

        {/* Single Image Placeholder for Looping GIF */}
        <div className="flex justify-center scroll-trigger">
          <div className="relative w-full max-w-4xl aspect-video overflow-hidden rounded-2xl shadow-2xl">
            <div className="w-full h-full bg-gradient-to-br from-[hsl(70,71%,62%)]/20 to-[hsl(75,64%,49%)]/20 flex items-center justify-center">
              <div className="text-center p-8">
                <p className="text-2xl font-light text-gray-700 mb-4">Looping GIF Placeholder</p>
                <p className="text-lg text-gray-600">Replace this section with your looping GIF</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}