import { useState, useEffect } from 'react'

type LongPressOptions = {
  onLongPress: (event: MouseEvent | TouchEvent) => void
  delay?: number
  onCancel?: () => void
}

export const useLongPress = ({
  onLongPress,
  delay = 500,
  onCancel
}: LongPressOptions) => {
  const [pressStartTime, setPressStartTime] = useState<number | null>(null)
  const [isPressing, setIsPressing] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (pressStartTime !== null && isPressing) {
      timer = setTimeout(() => {
        onLongPress(
          (pressStartTime as unknown) as MouseEvent | TouchEvent
        )
        setIsPressing(false)
      }, delay)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [pressStartTime, isPressing, delay, onLongPress])

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.nativeEvent instanceof MouseEvent && e.nativeEvent.button !== 0) return
    
    setPressStartTime(Date.now())
    setIsPressing(true)
  }

  const cancel = () => {
    if (pressStartTime !== null) {
      if (Date.now() - pressStartTime < delay) {
        onCancel?.()
      }
      setPressStartTime(null)
      setIsPressing(false)
    }
  }

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: cancel,
    onTouchEnd: cancel,
    onMouseLeave: cancel
  }
}
