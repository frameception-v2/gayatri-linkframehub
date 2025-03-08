Here's the optimized implementation checklist:

- [ ] Create Layout component with responsive CSS grid and viewport scaling (components/Layout.tsx)
- [ ] Implement Avatar component with circular border and system fonts (components/Avatar.tsx)
- [ ] Add permanent social links with proper touch targets in Layout (components/Layout.tsx)
- [ ] Develop useSwipe hook with touch event handlers and direction logic (hooks/useSwipe.ts)
- [ ] Integrate swipe transitions and panel switching in Layout (components/Layout.tsx)
- [ ] Create storage module with LRU cache and compression (lib/storage.ts)
- [ ] Connect storage methods to Layout state for recent links (components/Layout.tsx)
- [ ] Build RecentLinks component with scrollable container and relative timestamps (components/RecentLinks.tsx)
- [ ] Wire RecentLinks to display data from storage in Layout (components/Layout.tsx)
- [ ] Implement ContextMenu component with positioning logic (components/ContextMenu.tsx)
- [ ] Add long-press detection hook for menu activation (hooks/useLongPress.ts)
- [ ] Create share/copy actions in ContextMenu using Web APIs (components/ContextMenu.tsx)
- [ ] Integrate ContextMenu with all link elements in both panels (components/Layout.tsx)
- [ ] Develop CSS ripple animations for touch feedback (styles/ripple.css)
- [ ] Implement usePressState hook for interactive element states (hooks/usePressState.ts)
- [ ] Add keyboard avoidance logic in Layout component (components/Layout.tsx)
- [ ] Create orientation handler with resize observer (hooks/useOrientation.ts)
- [ ] Implement shake detection and refresh action wiring (lib/sensors.ts)
- [ ] Add state compression and sessionStorage hydration (lib/state.ts)
- [ ] Create error boundaries and storage quota management (components/ErrorBoundary.tsx)

This list follows the exact dependency order from the original plan while maintaining 20 atomic implementation tasks. Each completed item brings the system closer to full functionality without overlap or redundant work. The sequence ensures mobile foundations are solid before adding interactions, followed by progressive enhancement of features.