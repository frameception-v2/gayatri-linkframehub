```markdown
# Farcaster Link Tree Frame Specification

## 1. OVERVIEW

### Core Functionality
- Dynamic link tree displaying permanent social links (Farcaster, GitHub) + 3 most recently shared URLs
- Client-side navigation between link categories using swipe gestures
- Direct interaction with links through native device capabilities (browser launch, wallet connections)
- Local persistence of user interaction history for personalized sorting

### UX Flow
1. Frame initializes with avatar + primary links (Farcaster/GitHub)
2. Horizontal swipe reveals "Recent Links" panel
3. Vertical scroll within panels for overflow content
4. Long-press on links opens context menu (Copy URL/Share)
5. Visual feedback on interactions through CSS transforms

## 2. TECHNICAL REQUIREMENTS

### Responsive Design
- Mobile-first CSS grid (1xN vertical stack <768px, 2xN grid >768px)
- Dynamic viewport units (vh/vw) for consistent scaling
- Touch target sizing: Minimum 48x48px interactive areas
- System font stack with em-based typography

### API Constraints
- Frame v2 SDK only for wallet/identity interactions
- localStorage for device-specific link history
- Native Web Intents for sharing/copying (no clipboard API)
- Window.postMessage for cross-frame communication

## 3. FRAMES v2 IMPLEMENTATION

### Interactive Elements
- Gesture-controlled carousel (touchmove events)
- Animated transition effects using CSS keyframes
- Dynamic state serialization/deserialization
- Signature verification for authenticated actions

### Input Handling
- Pointer events abstraction for cross-device support
- Accelerometer-based navigation (shake to refresh)
- Hover states with @media (hover: hover) detection
- Virtual keyboard avoidance for text inputs

### Data Persistence
- localStorage schema versioning
- LRU caching for recent links (max 10 entries)
- Compressed state encoding (Base64 + gzip)
- Frame metadata in sessionStorage

## 4. MOBILE CONSIDERATIONS

### Layout
- Safe area insets for notch devices
- 100dvh fallback for mobile browsers
- Hardware-accelerated animations
- Orientation change handlers

### Touch Patterns
- Swipe velocity detection
- Ripple effect animations
- Tap highlight suppression
- Overscroll behavior containment

## 5. CONSTRAINTS COMPLIANCE

### Storage
- Per-device localStorage isolation
- No cross-device sync mechanisms
- Ephemeral session storage for transactions

### Infrastructure
- Zero database requirements
- No smart contract interactions
- Static asset hosting only
- No authentication layers

### Scope
- Progressive enhancement baseline
- Feature flags for experimental capabilities
- No error tracking/services
- Fallback static image for legacy clients

### Development
- Monolithic component architecture
- Environment-based feature toggles
- No test suite required
- Documentation-driven development
```