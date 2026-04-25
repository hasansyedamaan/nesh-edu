---
name: New Age Education
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#3f4945'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#6f7975'
  outline-variant: '#bfc9c4'
  surface-tint: '#256958'
  primary: '#256958'
  on-primary: '#ffffff'
  primary-container: '#98dbc6'
  on-primary-container: '#1c6251'
  inverse-primary: '#91d4bf'
  secondary: '#5d5988'
  on-secondary: '#ffffff'
  secondary-container: '#cec9ff'
  on-secondary-container: '#565381'
  tertiary: '#7b5549'
  on-tertiary: '#ffffff'
  tertiary-container: '#f5c3b3'
  on-tertiary-container: '#744e42'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acf0db'
  primary-fixed-dim: '#91d4bf'
  on-primary-fixed: '#002019'
  on-primary-fixed-variant: '#005141'
  secondary-fixed: '#e3dfff'
  secondary-fixed-dim: '#c6c1f7'
  on-secondary-fixed: '#191541'
  on-secondary-fixed-variant: '#45416f'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#edbbac'
  on-tertiary-fixed: '#2f140b'
  on-tertiary-fixed-variant: '#613e33'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
  max_width: 1280px
---

## Brand & Style
The design system is centered on the concept of "Cognitive Clarity." Designed for NESH, it positions the platform as a serene, high-end sanctuary for digital learning. The brand personality is intellectual yet approachable, sophisticated yet simple. 

The visual style blends **Minimalism** with **Refined Glassmorphism**. By using high-transparency layers and vibrant background blurs, the UI feels lightweight and ethereal, as if floating in a clean, digital ether. This "new age" aesthetic moves away from traditional corporate SaaS density toward a breathable, editorial-inspired layout that reduces cognitive load for students and educators alike.

## Colors
The palette utilizes desaturated pastels to maintain a professional, high-end SaaS feel while remaining welcoming. 

- **Mint (#98DBC6):** Used for primary actions and success states, symbolizing growth.
- **Lavender (#C9C4FA):** Used for secondary features and creative elements.
- **Peach (#FFCCBC):** Used for highlighting and community-focused interactions.
- **Sky Blue (#B3E5FC):** Used for informational accents and calm notifications.

Backgrounds should remain predominantly white or the softest gray to allow the pastels to function as gentle organizational cues rather than overwhelming the senses.

## Typography
This design system employs **Manrope** for its exceptional balance of geometric modernity and functional readability. The type scale is generous, prioritizing legibility and a sense of "openness."

Headlines should use tighter letter spacing and heavier weights to anchor the page, while body text uses a slightly increased line height (1.6) to ensure long-form educational content is easy to digest. Labels are set in semi-bold for clear categorization at smaller sizes.

## Layout & Spacing
The design system follows a **Fixed-Fluid Hybrid** grid. Main dashboard views utilize a 12-column grid with a maximum container width of 1280px to prevent line lengths from becoming unreadable on ultra-wide monitors.

Spacing is governed by an 8px rhythmic scale. To achieve the "plenty of whitespace" requirement, use the `lg` (48px) and `xl` (80px) tokens liberally between major sections. This intentional emptiness is a functional choice to keep the user focused on a single task at a time.

## Elevation & Depth
Depth is created through **Glassmorphism** and **Ambient Shadows** rather than stark borders.

1.  **The Glass Layer:** Surfaces use a semi-transparent white background (opacity 60-80%) with a `backdrop-filter: blur(20px)`. 
2.  **The Stroke:** Every glass element must have a 1px solid white border at 40% opacity to define its edges against the background.
3.  **The Shadow:** We use "Sky Shadows"—highly diffused, low-opacity shadows with a subtle tint of the Primary (Mint) or Sky Blue colors (#98DBC6 at 5% alpha). This makes components feel like they are floating in a natural, light-filled environment.

## Shapes
The shape language is consistently "Rounded" to evoke a sense of safety and friendliness. 

- **Standard Elements:** Buttons, input fields, and small cards use a 0.5rem (8px) radius.
- **Large Containers:** Main content cards and glass panels use a 1.5rem (24px) radius.
- **Pill Elements:** Status tags and selection chips use a full pill radius for maximum visual distinction from interactive buttons.

## Components

### Buttons
Primary buttons use a solid Mint background with white text. Secondary buttons use a glass-effect background with a Lavender border. All buttons have a subtle "lift" hover effect using increased shadow diffusion.

### Glass Cards
The core container for the educational hub. Cards must have the backdrop blur and the semi-transparent white border. Avoid nested cards where possible; use whitespace to separate internal content.

### Chips & Tags
Chips are used for course categories. They use high-chroma pastel backgrounds (e.g., light Sky Blue) with slightly darker text of the same hue to ensure accessibility while maintaining the soft aesthetic.

### Input Fields
Inputs are minimalist: a simple bottom border or a very light gray fill. On focus, the field transforms into a soft glass surface with a Mint glow.

### Progress Indicators
Educational progress is tracked using thin, rounded bars in Mint. Background tracks are a very light 10% opacity version of the same color.

### Navigation
Sidebar navigation uses a clear, vertical layout with plenty of "breathable" space between items. Active states are indicated by a soft Peach vertical bar and a subtle glass background on the menu item.