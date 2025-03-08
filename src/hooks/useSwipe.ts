import { useState, useCallback } from 'react'

type SwipeDirection = 'left'|'right'|'up'|'down'
type SwipeHandler = (direction: SwipeDirection) => void

const useSwipe = (onSwipe: SwipeHandler, options = { threshold: 50, minVelocity: 0.1 }) => {
  const [touchStart, setTouchStart] = useState<[number, number]>([0, 0])
  const [touchTime, setTouchTime] = useState<number>(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart([e.touches[0].clientX, e.touches[0].clientY])
    setTouchTime(Date.now())
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const [startX, startY] = touchStart
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const deltaTime = Date.now() - touchTime
    
    const deltaX = endX - startX
    const deltaY = endY - startY
    const velocityX = Math.abs(deltaX) / deltaTime
    const velocityY = Math.abs(deltaY) / deltaTime
    
    if (Math.abs(deltaX) > options.threshold && velocityX > options.minVelocity) {
      onSwipe(deltaX > 0 ? 'right' : 'left')
    } else if (Math.abs(deltaY) > options.threshold && velocityY > options.minVelocity) {
      onSwipe(deltaY > 0 ? 'down' : 'up')
    }
  }, [touchStart, touchTime, onSwipe, options])

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd
  }
}

export default useSwipe
