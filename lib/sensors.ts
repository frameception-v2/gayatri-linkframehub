import { useEffect } from 'react';

const SHAKE_THRESHOLD = 15; // Adjust sensitivity
const REFRESH_DEBOUNCE = 2000; // 2 seconds between shakes

export function useShakeDetector(onShake: () => void) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('DeviceMotionEvent' in window)) {
      return () => {}; // Return empty cleanup function
    }

    let lastUpdate = 0;
    let lastX: number | null = null;
    let lastY: number | null = null;
    let lastZ: number | null = null;
    let mounted = true;
    
    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const now = Date.now();
      if (now - lastUpdate < 100) return; // Throttle to 10Hz
      
      const { x, y, z } = acceleration;
      if (lastX === null || lastY === null || lastZ === null) {
        lastX = x;
        lastY = y;
        lastZ = z;
        return;
      }

      // Calculate delta
      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);

      if ((deltaX > SHAKE_THRESHOLD && deltaY > SHAKE_THRESHOLD) ||
          (deltaX > SHAKE_THRESHOLD && deltaZ > SHAKE_THRESHOLD) ||
          (deltaY > SHAKE_THRESHOLD && deltaZ > SHAKE_THRESHOLD)) {
        if (now - lastUpdate > REFRESH_DEBOUNCE) {
          onShake();
          lastUpdate = now;
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      mounted = false;
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [onShake]);
}
