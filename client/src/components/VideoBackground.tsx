import { useState, useRef, useEffect } from 'react';
import heroVideo from "@assets/Heritge Film India_VF720p30_CQ30 Slow_1753290344167.webm";

export default function VideoBackground() {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = () => {
      setHasError(true);
    };

    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('error', handleError);
    };
  }, []);

  if (hasError) {
    return null; // Fall back to static background
  }

  return (
    <video 
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay 
      loop 
      muted 
      playsInline
      preload="auto"
    >
      <source src={heroVideo} type="video/webm" />
    </video>
  );
}