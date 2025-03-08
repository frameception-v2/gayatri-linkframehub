import { useCallback, useRef } from 'react';

type LongPressEvent = React.TouchEvent | React.MouseEvent;
type LongPressCallback = (e: LongPressEvent) => void;

export function useLongPress({
  onLongPress,
  onCancel,
  delay = 300
}: {
  onLongPress: LongPressCallback;
  onCancel?: () => void;
  delay?: number;
}) {
  const timeout = useRef<NodeJS.Timeout>();
  const savedCallback = useRef<LongPressCallback>(onLongPress);
  const savedCancel = useRef(onCancel);

  const start = useCallback((e: LongPressEvent) => {
    timeout.current = setTimeout(() => {
      savedCallback.current(e);
    }, delay);
  }, [delay]);

  const clear = useCallback(() => {
    timeout.current && clearTimeout(timeout.current);
    savedCancel.current?.();
  }, []);

  return {
    onTouchStart: start,
    onTouchEnd: clear,
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear
  };
}
