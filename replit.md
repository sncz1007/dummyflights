# SkyBudgetFly - Flight Quote Platform

## Overview
SkyBudgetFly is a web application offering discounted global flight bookings with a 40% discount leveraging exclusive airline partnerships. It supports a bilingual (English/Spanish) interface for flight search, secure Stripe payments, and booking management. The platform's business model involves manual ticket purchase and email delivery after customer payment.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The platform features a comprehensive, responsive landing page with a mobile-first approach. Key design elements include a professional airplane background with a red brand overlay in the hero section, trust badges, featured popular destinations with discount indicators, a "Why Choose Us" section highlighting benefits, customer testimonials, a dynamic video strip, and an FAQ section with an accordion design. The UI uses Tailwind CSS with shadcn/ui components, Radix UI primitives, and Lucide React for icons, ensuring accessibility and a consistent visual experience with a primary red brand color and complementary accents. All UI components support English and Spanish.

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Wouter for routing, TanStack React Query for server state, React Context for internationalization, and React Hook Form with Zod for form management. Vite is used as the build tool.
- **Backend**: Node.js with Express.js and TypeScript (ESM modules) providing RESTful APIs for airports and quotes.
- **Database**: PostgreSQL (Neon serverless) managed by Drizzle ORM, with tables for users, airports, quotes, and bookings.

### Feature Specifications
- **Airline Partnership Segmentation**: Differentiates between "Domestic USA" (Alaska Airlines, American Airlines) and "International" (British Airways, Cathay Pacific, Fiji Airways, Finnair, Iberia, Japan Airlines, Malaysia Airlines, Oman Air, Qantas, Qatar Airways, Royal Air Maroc, Royal Jordanian, SriLankan Airlines) routes, applying a consistent 40% discount globally.
- **Booking and Payment**: Integrates Stripe for secure payments, generates discounted flight data, captures customer information, and tracks booking and payment status.
- **Internationalization (i18n)**: Supports English and Spanish, with language preference stored in localStorage.
- **Homepage Structure**: Includes a Hero Section with a flight search form, Trust Badges, Popular Destinations, "Why Choose Us" benefits, Customer Testimonials, a Video Strip, an FAQ section, and a comprehensive Footer.

### System Design Choices
- **Component-Based Architecture**: Utilizes React's component model, custom hooks for reusable logic, and shadcn/ui's component composition pattern with Radix UI.
- **Centralized API Layer**: Employs a `apiRequest` helper for API interactions.
- **Data Import**: Supports CSV-based import for airport data.

## External Dependencies

### Third-Party Services
- **Stripe**: For secure payment processing, including payment intent creation and webhooks.
- **EmailJS**: Client-side email service for sending quote requests.
- **Neon Database**: Serverless PostgreSQL hosting.

### API Integrations
- **Airport Data API**: Accessible via `/api/airports/search` for 500+ international airports.

### External Libraries
- **Radix UI**: For accessible UI components.
- **React Hook Form & Zod**: For form management and validation.
- **TanStack React Query**: For server state management.
- **date-fns**: For date manipulation.
- **csv-parse**: For airport data imports.
- **Lucide React**: For icons.

### Environment Variables
- `DATABASE_URL`
- `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`
## Recent Updates (October 15, 2025)

### Contact Information
- **Email**: info@skybudgetfly.vip (integrated in footer)
- **Support**: 24/7 Customer Support (indicated in footer)

### Homepage Components
Complete landing page with the following sections (in order):

1. **Header** - Navigation and language selector (EN/ES)
2. **Hero Section** - Flight search form with airplane background image and red overlay
3. **Trust Badges** - Secure Booking, Secure Payments, 24/7 Support (3 features)
4. **Video Strip** - Looping airplane window view video (Pexels stock)
   - Full-width, responsive heights, auto-play, muted
5. **Popular Destinations** - 8 featured cities with 40% discount badge and professional images
   - Santorini, Rio de Janeiro, Tokyo, Cusco, Barcelona, Bali, New York, Dubai
6. **Why Choose Us** - 4 key benefits with color-coded icons
   - 40% Guaranteed Discount (red), Worldwide Coverage (blue), Instant Booking (yellow), Expert Support (green)
7. **Customer Testimonials** - 4 customer reviews with 5-star ratings
   - Sarah Johnson (USA), Carlos Méndez (Mexico), Yuki Tanaka (Japan), Emma Williams (UK)
8. **FAQ Section** - 6 frequently asked questions with accordion UI
   - Covers discount mechanics, ticket delivery, cancellation, airlines, fees
9. **Footer** - Complete footer with all standard elements
   - Logo, contact email (info@skybudgetfly.vip), customer support indicator
   - Company links, legal links (Terms, Privacy, Cookies)
   - Contact information (email, customer support)
   - Copyright notice

### Design Implementation
- **Stock Images**: 9 professional images (1 airplane background + 8 destinations)
- **Hero Background**: Airplane flying over city at sunset with purple/pink sky (`vecteezy_airplane-in-the-sky-with-cityscape-background-3d-rendering_28576292_1760624896421.jpg`)
- **Video**: Airplane window view from Pexels (free stock)
- **Icons**: Lucide React icons throughout
- **Colors**: Primary red (#red-600), complementary blue, yellow, green accents
- **Layout**: Responsive grid system (1-2-4 columns based on screen size)
- **Typography**: Bold headings, muted descriptive text
- **Bilingual**: Full English/Spanish support for all components

## Logo Implementation (October 15, 2025)

### Logo File
- **File**: `attached_assets/skybudget-logo.png`
- **Original Logo**: Red airplane icon with clouds and "SkyBudget" text
- **Format**: PNG image with transparent/white background

### Logo Usage
The official SkyBudgetFly logo has been implemented in:

1. **Header Component** (`client/src/components/Header.tsx`)
   - Full-color logo display
   - Height: 48px (h-12)
   - Positioned in top-left navigation area
   - Clickable link to homepage

2. **Footer Component** (`client/src/components/Footer.tsx`)
   - Inverted logo for dark background (brightness-0 invert)
   - Height: 40px (h-10)
   - Located in footer's logo section
   - White appearance on dark background

### Technical Implementation
- Import path: `@assets/skybudget-logo.png`
- Responsive sizing with `w-auto` for aspect ratio preservation
- Alt text: "SkyBudgetFly Logo" for accessibility
- Footer version uses CSS filters for color inversion

## Latest Updates (October 15, 2025)

### Header Logo Update
- **New Logo File**: `attached_assets/IMG_9390_1760553283513.jpeg`
- **Logo Display**: New official logo in header navigation
- **Company Name**: "SkyBudgetFly" displayed in red (text-red-600) next to logo
- **Layout**: Logo + red company name, both clickable to homepage

### Terms of Service Update
Updated Terms of Service page (`client/src/pages/terms.tsx`) with official content including:
- **Our Services**: Detailed payment process through Stripe, 20-minute payment window after receiving reservation code
- **Flight Quotes**: Oneworld alliance partnerships for domestic and international flights
- **Booking Process**: Complete workflow from quote request to payment
- **Cancellation Policy**: No refunds policy with free flight modification option (48-hour notice required)
- **Limitation of Liability**: SkyBudget not responsible for airline delays/cancellations
- **Contact**: info@skybudgetfly.vip
- **Last Updated**: October 2025

### Flight Search Form - Terms Acceptance (October 15, 2025)
Added mandatory terms and conditions acceptance to flight search form:
- **Required Checkbox**: Users must accept Terms & Conditions and Privacy Policy before searching
- **Form Validation**: Search button disabled until terms are accepted
- **Bilingual Support**: English and Spanish translations for checkbox text
- **Linked Policies**: Direct links to Terms of Service and Privacy Policy pages
- **Implementation**: Located in `client/src/components/HeroSection.tsx`
- **User Experience**: Clear, accessible checkbox with clickable policy links

### Privacy Policy Update (October 15, 2025)
Updated Privacy Policy page (`client/src/pages/privacy.tsx`) with concise official content:
- **Information Collection**: Details on collected data (name, email, phone, travel preferences)
- **Use of Information**: How data is used for quotes, bookings, and communication
- **Information Sharing**: No selling/sharing except as necessary for services
- **Data Security**: Security measures against unauthorized access
- **Cookies**: Usage for browsing experience and traffic analysis
- **Contact**: info@skybudgetfly.vip for privacy questions

## Latest Updates (October 16, 2025)

### About Us Section Added
New "About Us" (Sobre Nosotros) section added to homepage (`client/src/components/AboutUs.tsx`):
- **Location**: Positioned between Popular Destinations and Why Choose Us sections
- **Content**: Agency description highlighting 5+ years of experience, 3,000+ successful bookings, 40% discount, and Oneworld alliance partnership
- **Design**: 
  - Centered title and descriptive text
  - 4 key statistics with icons displayed in responsive grid (2 columns mobile, 4 columns desktop)
  - Background color: muted/30 for visual differentiation
  - Icons: Award, Users, TrendingDown, Plane from Lucide React
- **Bilingual Support**: Full English and Spanish translations
  - English: "About Us" with "We are an agency specialized in domestic and international flight reservations..."
  - Spanish: "Sobre Nosotros" with "Somos una agencia especializada en reservas de vuelos..."
- **Statistics Displayed**:
  - 5+ Years of Experience (Años de Experiencia)
  - 3,000+ Successful Bookings (Reservas Exitosas)
  - 40% Discount (Descuento)
  - Oneworld Alliance Partner (Alianza Partner)

### About Us Section Design Update (October 16, 2025)
- **Background**: Changed to primary red color (bg-primary)
- **Text**: All text in white for maximum contrast
- **Icons**: White circular backgrounds (bg-white) with red primary icons inside
- **Spacing**: Reduced by ~35-40% for more compact layout
- **Text Alignment**: Description text justified (text-justify)

### FAQ Section Updates (October 16, 2025)

**FAQ Question 1 - Discount Explanation:**
- Updated to emphasize "Oneworld alliance" partnership
- Changed from "guaranteed 40%" to "up to 40%" discount
- Enhanced airline descriptions (13 "important" international carriers)
- Bilingual support maintained (EN/ES)

**FAQ Question 3 - Ticket Delivery:**
- Improved process description: "team takes care of making the reservation by manually purchasing"
- Delivery time reduced from 24 hours to **maximum 6 hours**
- Bilingual support maintained (EN/ES)

**FAQ Question 5 - Airlines Included:**
- Simplified domestic USA description: removed "(USA a USA)" clarification
- Changed "trabajamos con" to "tenemos alianza con" for domestic flights
- Text justified
- Bilingual support maintained (EN/ES)

**FAQ Question 6 - Hidden Fees:**
- Changed "¡Sin cargos ocultos!" to "¡No hay cargos ocultos!"
- Updated extras information: "lo cual podrás modificar al momento de realizar tu Check-in directamente con la aerolínea"
- Text justified
- Bilingual support maintained (EN/ES)

**FAQ Question 4 - Cancellation & Modification Policy:**
- Completely rewritten with two-paragraph format
- **Paragraph 1**: Commitment to customers, 48-hour notice requirement for modifications
- **Paragraph 2**: No refunds policy due to discounted pricing (includes taxes and service fees)
- Text justified with paragraph spacing (space-y-3)
- Component updated to handle multi-paragraph answers using "||" separator
- Bilingual support maintained (EN/ES)

### Footer Updates (October 16, 2025)
- **Tagline**: Already updated to include "desde y hacia USA" / "to and from USA"
- **Customer Support Icon**: Changed from Phone to MessageCircle (Chat icon)
- **Customer Support Text**: Changed from "Atención al Cliente" / "Customer Support" to "Chat Personalizado" / "Personalized Chat"
- **Contact Title**: Added "Contacto" / "Contact" heading above email and chat info
- **Navigation Links**: Connected footer menu to page sections with 80px scroll offset
  - "Sobre Nosotros" → scrolls to About Us section (id="about")
  - "Destinos Populares" / "Popular Destinations" → scrolls to Popular Destinations section (id="destinations")
  - "Ofertas" → scrolls to Hero Section/Flight Search Form (id="home")
  - "Preguntas Frecuentes" / "Frequently Asked Questions" → scrolls to FAQ section (id="faq")
- **Scroll Behavior**: 80px offset from top for better section visibility
- Bilingual support maintained (EN/ES)

### Homepage Section Order Updated
Current homepage structure (October 16, 2025):
1. Header - Navigation and language selector
2. Hero Section - Flight search form
3. Trust Badges - 3 security features
4. Video Strip - Airplane window video
5. Popular Destinations - 8 featured cities
6. **About Us** - Agency credentials and statistics (RED BACKGROUND)
7. Why Choose Us - 4 key benefits
8. Customer Testimonials - 4 reviews
9. FAQ Section - 6 questions (updated policies)
10. Footer - Contact and links (updated with Chat icon and text)
