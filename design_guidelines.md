# SkyBudgetFly Design Guidelines

## Design Approach: Reference-Based (Travel Industry Leaders)

**Primary References**: Booking.com's trust elements + Airbnb's premium feel + Kayak's flight result clarity

**Core Principles**:
- Build immediate trust through professional polish and clear information hierarchy
- Premium aesthetic without intimidation - welcoming to all budget travelers
- Data-dense flight information presented with breathing room
- Discount visibility as a key differentiator

## Color Palette

**Light Mode**:
- Primary Brand: 220 85% 45% (deep sky blue - trustworthy, aviation-themed)
- Primary Hover: 220 85% 38%
- Success/Discount Accent: 142 76% 36% (emerald green for savings highlight)
- Background: 0 0% 100%
- Surface: 220 15% 97%
- Text Primary: 220 20% 15%
- Text Secondary: 220 10% 45%
- Border: 220 15% 90%

**Dark Mode**:
- Primary Brand: 220 75% 55%
- Primary Hover: 220 75% 48%
- Success/Discount: 142 70% 45%
- Background: 220 15% 8%
- Surface: 220 12% 12%
- Text Primary: 220 15% 95%
- Text Secondary: 220 10% 65%
- Border: 220 10% 20%

## Typography

**Font Stack**: 
- Primary: 'Inter' (Google Fonts) - exceptional readability for flight data
- Accent: 'DM Sans' (Google Fonts) - headings and CTAs

**Scale**:
- Hero Headline: 3.5rem/4rem (bold, tight leading)
- Section Titles: 2rem/2.5rem (semibold)
- Flight Price: 2rem (bold) - prominent display
- Card Titles: 1.125rem (semibold)
- Body: 1rem (regular)
- Fine Print: 0.875rem (regular) - flight details, times

## Layout System

**Spacing Primitives**: Tailwind units 2, 4, 6, 8, 12, 16, 20, 24
**Container Strategy**: max-w-7xl for main content, max-w-6xl for search/results sections
**Grid**: 12-column system for flight results, 2-column for comparison layouts

## Component Library

### Navigation
- Fixed top bar with language toggle (EN/ES flag icons)
- Logo left, "Sign In" + "Book Now" CTA right
- Mobile: hamburger menu with full-screen overlay
- Trust badges in header: "Secure Booking" + "24/7 Support" micro-text

### Hero Section (80vh)
- Large background image showing airplane window view with clouds
- Semi-transparent dark overlay (40% opacity)
- Centered search module with white/surface background
- Search includes: Origin/Destination inputs, Date pickers, Passenger selector, "Search Flights" primary button
- Headline: "Fly for 40% Less. Book with Confidence."
- Subtext highlighting savings + trusted by X travelers

### Flight Search Card
- White surface with subtle shadow and border
- Rounded corners (0.75rem)
- Organized in sections: Origin → Destination, Dates, Passengers
- Clear visual separators between input groups
- Large, accessible touch targets (48px minimum)

### Flight Result Cards
- Grid layout: 1 column mobile, 2 columns tablet, 3 columns desktop
- Each card structure:
  - Airline logo (top-left, 48px)
  - Departure/Arrival times (large, bold)
  - Duration + stops indicator (secondary text)
  - Original price (strikethrough, muted)
  - Discounted price (large, success green, bold)
  - "40% OFF" badge (success background, white text, rounded-full)
  - "Book Now" primary button (full-width within card)
  - Amenities icons: WiFi, meals, baggage (Heroicons)

### Trust Elements Section (below hero)
- 4-column grid (stack on mobile): "Secure Payment", "Best Price Guarantee", "24/7 Support", "Instant Confirmation"
- Icons from Heroicons (shield, currency, support, check-circle)
- Brief descriptive text under each

### Payment Integration Area
- Two-column layout: Left (booking summary), Right (Stripe Elements)
- Summary shows: Flight details, passenger info, price breakdown with discount highlighted
- Stripe card input styled to match form aesthetic
- Security badges: "Secured by Stripe" + SSL icon
- Final "Confirm Booking" button (large, primary color, with lock icon)

### Footer
- Three columns: Company info, Quick links, Contact + Language selector
- Newsletter signup with inline form
- Payment method icons (Visa, Mastercard, etc.)
- Copyright + trust seals

## Images

**Hero Section**: 
- Large hero image (1920x1080 min): Airplane wing view from window seat with clouds and blue sky at golden hour - conveys travel aspiration and trust
- Use high-quality stock from Unsplash/Pexels
- Apply 40% dark overlay for text readability

**Trust Section**:
- Small accent images optional - prioritize icons for clarity

**Flight Cards**:
- Real airline logos via API or CDN
- Placeholder: 48x48px airline logo squares

## Interactions

**Minimal Animation Philosophy**:
- Subtle hover states on cards (slight elevation, border color change)
- Smooth transitions on button states (150ms ease)
- Search form: animated label floating on input focus
- NO scroll animations or parallax
- Price update: brief highlight flash when recalculating

## Accessibility & Bilingual

- All form inputs with proper labels in both languages
- Language toggle maintains user selection across session
- ARIA labels for screen readers on flight time displays
- Keyboard navigation through all interactive elements
- Focus indicators clearly visible in both color modes
- High contrast maintained for price displays and CTAs

**Mobile Optimization**:
- Flight cards stack vertically (single column)
- Search module becomes accordion-style expandable sections
- Bottom-fixed "View Flights" CTA on scroll
- Touch-friendly 48px minimum tap targets throughout