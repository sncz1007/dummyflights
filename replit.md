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
4. **Popular Destinations** - 8 featured cities with 40% discount badge and professional images
   - Santorini, Rio de Janeiro, Tokyo, Cusco, Barcelona, Bali, New York, Dubai
5. **Why Choose Us** - 4 key benefits with color-coded icons
   - 40% Guaranteed Discount (red), Worldwide Coverage (blue), Instant Booking (yellow), Expert Support (green)
6. **Customer Testimonials** - 4 customer reviews with 5-star ratings
   - Sarah Johnson (USA), Carlos Méndez (Mexico), Yuki Tanaka (Japan), Emma Williams (UK)
7. **Video Strip** - Looping airplane window view video (Pexels stock)
   - Full-width, responsive heights, auto-play, muted
8. **FAQ Section** - 6 frequently asked questions with accordion UI
   - Covers discount mechanics, ticket delivery, cancellation, airlines, fees
9. **Footer** - Complete footer with all standard elements
   - Logo, contact email (info@skybudgetfly.vip), customer support indicator
   - Company links, legal links (Terms, Privacy, Cookies)
   - Social media links (Facebook, Twitter, Instagram, LinkedIn)
   - Copyright notice

### Design Implementation
- **Stock Images**: 9 professional images (1 airplane background + 8 destinations)
- **Video**: Airplane window view from Pexels (free stock)
- **Icons**: Lucide React icons throughout
- **Colors**: Primary red (#red-600), complementary blue, yellow, green accents
- **Layout**: Responsive grid system (1-2-4 columns based on screen size)
- **Typography**: Bold headings, muted descriptive text
- **Bilingual**: Full English/Spanish support for all components
