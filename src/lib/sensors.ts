export const useShakeDetector = (callback: () => void, sensitivity = 15) => {
  useEffect(() => {
    let lastX: number, lastY: number, lastZ: number;
    let shakeCount = 0;
    
    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      const { x, y, z } = e.acceleration || {};
      if (!x || !y || !z) return;

      if (!lastX) {
        lastX = x;
        lastY = y;
        lastZ = z;
        return;
      }

      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);

      if ((deltaX > sensitivity || deltaY > sensitivity || deltaZ > sensitivity)) {
        shakeCount++;
        if (shakeCount > 2) {
          callback();
          shakeCount = 0;
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    window.addEventListener('devicemotion', handleDeviceMotion);
    return () => window.removeEventListener('devicemotion', handleDeviceMotion);
  }, [callback, sensitivity]);
};
