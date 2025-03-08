import { useState, useEffect } from 'react'

type OrientationState = {
  orientation: 'portrait' | 'landscape'
  viewportSize: { width: number; height: number }
  isPortrait: boolean
}

export function useOrientation(): OrientationState {
  const [state, setState] = useState<OrientationState>({
    orientation: 'portrait',
    viewportSize: { width: 0, height: 0 },
    isPortrait: true
  })

  useEffect(() => {
    const handleResize = () => {
      const width = visualViewport?.width || window.innerWidth
      const height = visualViewport?.height || window.innerHeight
      const isPortrait = height > width
      
      setState({
        orientation: isPortrait ? 'portrait' : 'landscape',
        viewportSize: { width, height },
        isPortrait
      })
    }

    const observer = new ResizeObserver(handleResize)
    observer.observe(document.documentElement)
    
    // Initial update
    handleResize()

    return () => observer.disconnect()
  }, [])

  return state
}
