# Farcaster Link Tree Frame Implementation Prompts

## Phase 1: Core Infrastructure Setup

```markdown
**Prompt 1: Initialize Base Layout**
- Create responsive grid layout component using CSS grid
- Implement viewport units for scaling (100dvh fallback)
- Add safe area insets handling for mobile
- Integrate system font stack with em-based typography
- Export component as default from /components/Layout.tsx
```

```markdown
**Prompt 2: Avatar & Static Links**
- Create Avatar component with border-radius: 50%
- Add permanent social links (Farcaster/GitHub) as <a> tags
- Style links with minimum 48px touch targets
- Implement hover states with media query detection
- Import and position in Layout component
```

## Phase 2: Interaction Layer

```markdown
**Prompt 3: Swipe Handling**
- Create useSwipe hook with touchstart/touchend handlers
- Calculate swipe direction/velocity
- Implement threshold-based panel switching
- Add basic CSS transform transitions
- Integrate hook into Layout component
```

```markdown
**Prompt 4: LocalStorage Manager**
- Create storage.ts with LRU cache implementation
- Implement Base64 + gzip compression helpers
- Add schema versioning for future compatibility
- Export getRecentLinks/saveLink methods
- Wire into Layout component state
```

## Phase 3: Dynamic Content

```markdown
**Prompt 5: Recent Links Renderer**
- Create RecentLinks component with scrollable container
- Implement vertical overflow scrolling with CSS
- Add timestamp display relative to current time
- Style with consistent touch target sizing
- Connect to storage.ts data in Layout
```

```markdown
**Prompt 6: Context Menu System**
- Create ContextMenu component with Web Intents
- Implement long-press detection logic
- Add copy/share actions using navigator.share
- Position menu relative to touch coordinates
- Wire into link elements in both panels
```

## Phase 4: Mobile Optimization

```markdown
**Prompt 7: Touch Feedback**
- Add ripple animation using CSS keyframes
- Implement tap highlight suppression
- Create press state management hook
- Handle virtual keyboard avoidance
- Apply to all interactive elements
```

```markdown
**Prompt 8: Orientation Handling**
- Add resize observer for viewport changes
- Implement CSS grid reflow logic
- Create accelerometer shake detection
- Wire refresh action to shake gesture
- Update Layout component accordingly
```

## Phase 5: Final Integration

```markdown
**Prompt 9: State Serialization**
- Implement frame state compression
- Add sessionStorage metadata tracking
- Create hydration/dehydration utilities
- Handle initialization sequence
- Connect all persistence systems
```

```markdown
**Prompt 10: Fallback & Edge Cases**
- Add legacy client image fallback
- Implement storage quota management
- Create error boundaries for critical components
- Add feature flags for experimental gestures
- Final wiring of all systems
```

## Implementation Notes

1. Each prompt builds on previous components
2. State management flows upward through props
3. Mobile behaviors are progressively enhanced
4. All touch handlers abstract device differences
5. Final integration handles error conditions

This sequence ensures each feature is independently verifiable while maintaining incremental progress. The prompts avoid big leaps by focusing on concrete component boundaries and clearly defined integration points.