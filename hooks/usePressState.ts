import { useState, useCallback } from "react"

type PressState = {
  isPressed: boolean
  x: number
  y: number
}

type PressStateProps = {
  onTouchStart: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseUp: (e: React.MouseEvent) => void
  className?: string
}

export function usePressState(): [PressState, PressStateProps] {
  const [pressState, setPressState] = useState<PressState>({
    isPressed: false,
    x: 0,
    y: 0
  })

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    setPressState({
      isPressed: true,
      x: touch.clientX,
      y: touch.clientY
    })
  }, [])

  const handleTouchEnd = useCallback(() => {
    setPressState(prev => ({ ...prev, isPressed: false }))
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setPressState({
      isPressed: true,
      x: e.clientX,
      y: e.clientY
    })
  }, [])

  const handleMouseUp = useCallback(() => {
    setPressState(prev => ({ ...prev, isPressed: false }))
  }, [])

  return [
    pressState,
    {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      className: "suppress-tap-highlight"
    }
  ]
}
