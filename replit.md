# SkyBudgetFly - Flight Quote Platform

## Overview
SkyBudgetFly is a web application designed to offer discounted flight bookings globally. It provides a bilingual (English/Spanish) interface for users to search flights, view discounted prices, and process secure payments via Stripe. The platform leverages exclusive airline partnerships to offer a 40% discount on all flights. The business model involves the owner manually purchasing tickets after customer payment and emailing them.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript.
- **Routing**: Wouter for client-side routing.
- **Styling**: Tailwind CSS with shadcn/ui components.
- **State Management**: React Query for server state, React Context for language, React Hook Form with Zod for forms.
- **UI Components**: Radix UI primitives with custom shadcn/ui styling.
- **Build Tool**: Vite.

### Backend
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ESM modules.
- **API Design**: RESTful endpoints for airports and quotes.

### Database & ORM
- **Database**: PostgreSQL (Neon serverless).
- **ORM**: Drizzle ORM.
- **Key Tables**: `users`, `airports`, `quotes`, `bookings` (for flight reservations and payment tracking).

### Core Features
- **Airline Partnership Segmentation**: Flight searches classify routes as "Domestic USA" (USA to USA) or "International" (any route involving a non-USA airport).
  - **Domestic USA Airlines**: Alaska Airlines, American Airlines.
  - **International Airlines**: British Airways, Cathay Pacific, Fiji Airways, Finnair, Iberia, Japan Airlines, Malaysia Airlines, Oman Air, Qantas, Qatar Airways, Royal Air Maroc, Royal Jordanian, SriLankan Airlines.
- **Worldwide Flight Support**: Users can search for flights from/to any international airport in the database, with the 40% discount applied consistently.
- **Booking and Payment System**:
  - Integrated Stripe for secure payment processing.
  - Generates example flight data with a 40% discount.
  - Captures customer information and creates bookings in the database, tracking original price, discounted price, and payment status.
  - Displays original price (strikethrough) alongside the discounted price and savings.
- **Internationalization (i18n)**: Supports English and Spanish with language preference stored in localStorage.
- **Responsive Design**: Mobile-first approach using Tailwind CSS breakpoints.
- **Homepage Structure** (Complete Landing Page):
  1. **Hero Section**: Search form with airplane background and red brand overlay
  2. **Trust Badges**: Security features (Secure Booking, Secure Payments, 24/7 Support)
  3. **Popular Destinations**: 8 featured destinations with 40% discount badge
  4. **Why Choose Us**: 4 key benefits (40% discount, worldwide coverage, instant booking, expert support)
  5. **Customer Testimonials**: 4 real customer reviews with 5-star ratings

### Design Patterns
- **Component Composition**: Shadcn/ui pattern with Radix UI.
- **Custom Hooks**: For reusable logic (e.g., `useTranslation`).
- **Form Handling**: React Hook Form + Zod resolver.
- **API Layer**: Centralized `apiRequest` helper.

## External Dependencies

### Third-Party Services
- **Stripe**: Payment processing for flight bookings, including payment intent creation and webhooks for status updates. Uses `pk_test_...` and `sk_test_...` for development.
- **EmailJS**: Client-side email service for sending quote requests.
- **Neon Database**: Serverless PostgreSQL hosting.

### API Integrations
- **Airport Data**: CSV-based import system for 500+ international airports, accessible via `/api/airports/search`.

### External Libraries
- **Radix UI**: For accessible UI components.
- **React Hook Form & Zod**: For form management and validation.
- **TanStack React Query**: For server state management.
- **date-fns**: For date manipulation.
- **csv-parse**: For airport data imports.
- **Lucide React**: For icons.

### Environment Variables
- `DATABASE_URL`
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_STRIPE_PUBLIC_KEY`
- `STRIPE_SECRET_KEY`
## Recent Design Updates (October 14, 2025)

### Hero Section Background Image
- **Implementation**: Added professional airplane background image with red brand overlay
- **Stock Image**: Airplane flying in sky (aerial view)
- **Brand Filter**: Red overlay at 40% opacity (`bg-red-600/40`) for brand identity
- **Layout**: Full-section background with proper z-index layering (image → overlay → content)
- **File Modified**: `client/src/components/HeroSection.tsx`
- **Asset Location**: `attached_assets/stock_images/airplane_flying_in_s_3b371e33.jpg`
- **Result**: Professional hero section maintaining text readability with branded visual identity

### Trust Badges Section (14 Oct 2025)
- **Purpose**: Display security and support features to build user trust
- **Location**: Below Hero Section on homepage
- **Features**:
  - **Reserva Segura / Secure Booking**: Shield icon, SSL encryption message
  - **Pagos Seguros / Secure Payments**: Credit Card icon, Stripe security message
  - **Asistencia 24/7 / 24/7 Support**: Headphones icon, anytime support message
- **Design**: 3-column grid on desktop, single column on mobile, circular icon backgrounds
- **Component**: `client/src/components/TrustBadges.tsx`
- **Bilingual**: Full English/Spanish support via translations

### Popular Destinations Section (14 Oct 2025)
- **Purpose**: Showcase top travel destinations with 40% discount included
- **Destinations Featured** (8 total):
  1. **Santorini, Greece** - White buildings and blue domes
  2. **Rio de Janeiro, Brazil** - Christ the Redeemer statue
  3. **Tokyo, Japan** - Modern cityscape
  4. **Cusco, Peru** - Machu Picchu ancient ruins
  5. **Barcelona, Spain** - Sagrada Familia architecture
  6. **Bali, Indonesia** - Tropical beach and temples
  7. **New York, USA** - Manhattan skyline
  8. **Dubai, UAE** - Burj Khalifa modern city
- **Design**: 
  - 4-column grid on desktop (lg:grid-cols-4), 2 columns on tablet, 1 on mobile
  - Professional stock images with gradient overlay
  - Hover effect with image zoom
  - Red badge showing "40% OFF Included" / "40% de Descuento Incluido"
- **Component**: `client/src/components/PopularDestinations.tsx`
- **Images**: 8 professional stock photos in `attached_assets/stock_images/`
- **Bilingual**: Full EN/ES support for destination names and discount badge

### Why Choose SkyBudgetFly Section (14 Oct 2025)
- **Purpose**: Highlight key benefits and value propositions to convince users
- **Location**: After Popular Destinations section on homepage
- **Benefits Featured** (4 total):
  1. **40% Guaranteed Discount** - Save big with exclusive airline partnerships (Percent icon, red)
  2. **Worldwide Coverage** - Book flights to any destination globally (Globe icon, blue)
  3. **Instant Booking** - Fast checkout process, secure flights in minutes (Zap icon, yellow)
  4. **Expert Support** - 24/7 travel specialists available (Headset icon, green)
- **Design**: 
  - 4-column grid on desktop, 2 columns on tablet, single column on mobile
  - Each benefit card has: colored icon in circle, title, description
  - Hover effect with background color change
  - Muted background cards for visual separation
- **Component**: `client/src/components/WhyChooseUs.tsx`
- **Bilingual**: Full EN/ES support for all benefit titles and descriptions

### Customer Testimonials Section (14 Oct 2025)
- **Purpose**: Display real customer experiences and build trust through social proof
- **Location**: After Why Choose Us section on homepage
- **Featured Testimonials** (4 customers):
  1. **Sarah Johnson** (Miami, USA) - Family trip savings, seamless booking
  2. **Carlos Méndez** (Mexico City, Mexico) - 40% discount verification, best experience
  3. **Yuki Tanaka** (Tokyo, Japan) - Exceptional service, unbeatable price
  4. **Emma Williams** (London, UK) - Fast, reliable, dream vacation enabled
- **Design**: 
  - 4-column grid on desktop, 2 on tablet, 1 on mobile
  - Card-based layout with quote icon, 5-star rating, testimonial text
  - Customer name and location displayed at bottom
  - Hover effect with shadow elevation
- **Component**: `client/src/components/Testimonials.tsx`
- **Bilingual**: Full EN/ES translations for all testimonial text
- **Visual Elements**: Quote icon, 5 yellow stars rating, bordered sections

## Homepage Components Summary (October 14, 2025)

### Complete Page Structure
The homepage (`client/src/pages/home.tsx`) now includes a comprehensive landing page experience:

1. **Header** - Navigation and language selector
2. **Hero Section** (`HeroSection.tsx`)
   - Airplane background image with red brand overlay (40% opacity)
   - Flight search form (7 fields: from, to, departure, return, passengers, class, type)
   - Full bilingual support
3. **Trust Badges** (`TrustBadges.tsx`)
   - Secure Booking (Shield icon)
   - Secure Payments (Credit Card icon) 
   - 24/7 Support (Headphones icon)
4. **Popular Destinations** (`PopularDestinations.tsx`)
   - 8 destinations with professional stock images
   - "40% OFF Included" badge on each
   - Destinations: Santorini, Rio, Tokyo, Cusco, Barcelona, Bali, New York, Dubai
5. **Why Choose Us** (`WhyChooseUs.tsx`)
   - 40% Guaranteed Discount (Percent icon, red)
   - Worldwide Coverage (Globe icon, blue)
   - Instant Booking (Zap icon, yellow)
   - Expert Support (Headset icon, green)
6. **Customer Testimonials** (`Testimonials.tsx`)
   - 4 customer reviews with 5-star ratings
   - Quote icon, card-based design
   - Customers: Sarah Johnson, Carlos Méndez, Yuki Tanaka, Emma Williams

### Design System
- **Colors**: Primary red brand color, complemented by blue, yellow, green accents
- **Layout**: Responsive grid system (1-2-4 columns based on screen size)
- **Typography**: Bold headings, muted descriptive text
- **Icons**: Lucide React icons throughout
- **Images**: Professional stock photography (9 images total)
- **Effects**: Hover animations, shadow elevations, image zoom on hover

### Bilingual Implementation
All components fully support English and Spanish:
- Automatic language switching via language selector
- Translation keys in `client/src/lib/translations.ts`
- localStorage persistence for language preference
