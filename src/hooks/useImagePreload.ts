import { useState, useEffect } from 'react';

export function useImagePreload(src: string | undefined): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!src) {
      setLoaded(true);
      return;
    }

    // Reset when src changes
    setLoaded(false);

    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(true); // Show content even if image fails
    img.src = src;

    // If image is already cached, onload may not fire
    if (img.complete) {
      setLoaded(true);
    }
  }, [src]);

  return loaded;
}
