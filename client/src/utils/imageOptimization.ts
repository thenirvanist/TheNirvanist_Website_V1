/**
 * Image optimization utilities for better performance
 */

export interface ImageSizes {
  mobile: string;
  tablet: string;
  desktop: string;
}

/**
 * Generate responsive image URLs with different sizes
 */
export function generateResponsiveImageUrl(
  baseUrl: string,
  sizes: ImageSizes = {
    mobile: '400w',
    tablet: '800w', 
    desktop: '1200w'
  }
): string {
  // For now, return the base URL since we don't have an image CDN
  // In production, this would generate multiple sized URLs
  return baseUrl;
}

/**
 * Create optimized image src set for responsive images
 */
export function createImageSrcSet(baseUrl: string): string {
  // In production, this would generate a proper srcset
  // For now, return the base URL
  return baseUrl;
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalImageFormat(): 'webp' | 'avif' | 'jpg' {
  if (typeof window === 'undefined') return 'jpg';
  
  // Check for AVIF support
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  try {
    const avifSupported = canvas.toDataURL('image/avif').indexOf('image/avif') === 5;
    if (avifSupported) return 'avif';
  } catch (e) {
    // AVIF not supported
  }
  
  try {
    const webpSupported = canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
    if (webpSupported) return 'webp';
  } catch (e) {
    // WebP not supported
  }
  
  return 'jpg';
}

/**
 * Preload critical images
 */
export function preloadImage(url: string, priority: 'high' | 'low' = 'low'): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    if (priority === 'high') {
      // Use high priority for critical images
      img.fetchPriority = 'high';
    }
    
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Lazy load images with intersection observer
 */
export function setupImageLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.classList.remove('loading');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px 0px'
    });

    // Find all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}