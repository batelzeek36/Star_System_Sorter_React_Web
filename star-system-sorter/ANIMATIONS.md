# Animation Enhancements

This document describes the smooth, elegant animations added to Star System Sorter.

## Custom Animations (Tailwind Config)

Added to `tailwind.config.js`:

### Fade Animations
- `animate-fade-in` - Smooth opacity fade (0.6s)
- `animate-fade-in-up` - Fade in while sliding up from below (0.6s)
- `animate-fade-in-down` - Fade in while sliding down from above (0.5s)

### Scale & Transform
- `animate-scale-in` - Gentle scale from 90% to 100% with fade (0.5s)
- `animate-slide-up` - Slide up from bottom with fade (0.5s)

### Cosmic Effects
- `animate-glow-pulse` - Pulsing glow effect for cosmic elements (3s infinite)
- `animate-shimmer` - Shimmer effect for loading states (2.5s infinite)
- `animate-float` - Gentle floating motion (6s infinite)

## Screen-Specific Animations

### OnboardingScreen
- **App Icon**: `animate-scale-in` + `animate-float` for gentle floating
- **Title**: `animate-fade-in-down` for elegant entrance
- **Step Cards**: Staggered `animate-fade-in-up` with delays (0.1s, 0.2s, 0.3s)
- **Button**: `animate-fade-in-up` with 0.4s delay
- **Background Glow**: `animate-glow-pulse` for cosmic atmosphere
- **Hover Effects**: Scale on step numbers (1.1x) and button (1.05x)

### InputScreen
- **Background**: `animate-fade-in` for starfield
- **Gradient Glow**: `animate-glow-pulse` for cosmic effect
- **Header**: `animate-fade-in-down` for title entrance
- **Form**: `animate-fade-in-up` with 0.1s delay

### ResultScreen
- **Background Glow**: `animate-glow-pulse` for cosmic atmosphere
- **Header**: `animate-fade-in-down` for title
- **Crest Container**: `animate-scale-in` + `animate-float` for floating crest
- **Ally Chips**: Staggered `animate-fade-in-up` with individual delays
- **Buttons**: Staggered `animate-fade-in-up` with hover scale (1.05x)
- **Disclaimer**: `animate-fade-in` with 0.7s delay

### WhyScreen
- **Background Glow**: `animate-glow-pulse`
- **Header**: `animate-fade-in-down` with back button slide effect
- **System Summary**: `animate-fade-in-up` with 0.1s delay
- **System Tabs**: `animate-fade-in-up` with 0.2s delay + scale on active/hover
- **Back Button**: Translates left on hover for intuitive feedback

## Component Enhancements

### Button
- Smooth `transition-all duration-200` on all states
- Hover: Scale 1.05x with shadow enhancement
- Active: Scale 0.98x for tactile feedback
- Already had good transitions, enhanced with hover effects

### Chip
- Added `transition-all duration-300`
- Hover: Scale 1.05x on all chips (selectable and static)
- Smooth opacity transitions on selectable chips

### Card
- Added `transition-all duration-300`
- Hover: Enhanced border color and shadow
- Smooth backdrop blur transitions

## Global Transitions

Added to `index.css`:

```css
/* Smooth transitions for interactive elements */
button, a, input, select, textarea,
[role="button"], [role="link"] {
  transition: all 0.2s ease-in-out;
}

/* Smooth hover effects */
button:hover, a:hover,
[role="button"]:hover, [role="link"]:hover {
  transform: translateY(-1px);
}

button:active, a:active,
[role="button"]:active, [role="link"]:active {
  transform: translateY(0);
}
```

## Accessibility

All animations respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Animation Timing Strategy

- **Fast interactions**: 200ms (buttons, links)
- **Standard transitions**: 300ms (cards, chips, tabs)
- **Page entrances**: 500-600ms (fade-in, scale-in)
- **Ambient effects**: 2-6s (glow-pulse, float, shimmer)

## Staggered Animations

Used `animationDelay` inline styles with `animationFillMode: 'both'` for:
- Sequential card reveals
- Chip appearances
- Button entrances

Example:
```tsx
<div 
  className="animate-fade-in-up" 
  style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
>
```

## Performance Considerations

- Used CSS transforms (translateY, scale) for GPU acceleration
- Avoided animating expensive properties (width, height, margin)
- Limited number of simultaneous animations
- Virtualization already in place for long lists (WhyScreen)

## Future Enhancements

Potential additions for Phase 2:
- Page transition animations between routes
- Micro-interactions on form validation
- Loading skeleton animations
- Parallax effects on scroll
- Particle effects for star systems
