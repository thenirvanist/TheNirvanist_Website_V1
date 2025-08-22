import { useState, useRef, useEffect } from 'react';
import heroVideo from "@assets/Heritge Film India_VF720p30_CQ30 Slow_1753290344167.webm";

export default function VideoBackground() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => {
      setIsLoaded(true);
    };

    const handleError = () => {
      setHasError(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    // Preload metadata only initially
    video.preload = 'metadata';

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError) {
    return null; // Fall back to static background
  }

  return (
    <video 
      ref={videoRef}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      autoPlay 
      loop 
      muted 
      playsInline
      preload="metadata"
      poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9IiMyMjI3MzMiLz48L3N2Zz4K"
    >
      <source src={heroVideo} type="video/webm" />
    </video>
  );
}