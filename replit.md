# SkyBudgetFly - Flight Quote Platform

## Overview
SkyBudgetFly is a web application that facilitates global flight bookings through exclusive airline partnerships. The platform provides a bilingual (English/Spanish) interface for flight search, secure payments, and booking management. The business model involves manual ticket purchase and email delivery to customers after payment.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The platform features a responsive, mobile-first design using Tailwind CSS with shadcn/ui components, Radix UI primitives, and Lucide React icons. The design includes a professional airplane background, trust badges, popular destinations, a "Why Choose Us" section, customer testimonials, a dynamic video strip, an "About Us" section, and an FAQ with an accordion design. The primary brand color is red with accent colors, and all UI components support both English and Spanish.

### Technical Implementations
- **Frontend**: React 18, TypeScript, Wouter for routing, TanStack React Query for server state, React Context for i18n, React Hook Form with Zod for form management, and Vite as the build tool.
- **Backend**: Node.js with Express.js and TypeScript (ESM modules) providing RESTful APIs for airports and quotes.
- **Flight Data**: A realistic flight simulator based on actual American Airlines 2025 routes and pricing, featuring intelligent regional airline filtering. It provides simulated flight availability, schedules, and realistic market prices.
- **Database**: PostgreSQL (Neon serverless) managed by Drizzle ORM, with tables for users, airports, quotes, and bookings.

### Feature Specifications
- **Advanced Regional Airline Segmentation**: An intelligent coast-based system displays partner airlines authorized for specific regions and routes. This includes differentiated partners for East coast vs. West coast origins to various international destinations. The system automatically indicates "No flights available" if a route is not served by partner airlines.
- **Flight Results Caching System**: Intelligent sessionStorage-based caching preserves exact flight results and prices when users navigate back from checkout, improving UX by showing consistent pricing. Cache is automatically cleared on fresh searches from homepage.
  - **Cache Lifecycle**: New search → Fetch fresh → Cache results → Book flight → Checkout → Back button → Use cached results (same prices)
  - **Cache Keys**: `cachedFlightResults` (search params + flight data), `returningFromCheckout` (navigation flag)
  - **Cache Invalidation**: Cleared on new homepage searches; flag removed after use to prevent stale hits
- **Booking and Payment**: Integrates both Stripe and PayPal as payment options for maximum flexibility. Flight prices are displayed in USD at real market rates from Amadeus API or simulator. A fixed $15 USD service fee is charged per booking (regardless of passengers or route) for the search and reservation service. Payment buttons appear directly below the contact form for immediate checkout.
- **Booking Notifications**: Automated email notifications are sent via EmailJS when customers click "Continue to Payment" after filling out their contact information. These notifications include complete flight details, customer info, all passengers, and pricing breakdown, enabling manual ticket purchase before payment completion.
- **Internationalization (i18n)**: Full support for English and Spanish, with language preference stored in localStorage. All content, including legal pages, is bilingual.
- **Homepage Structure**: Includes a Hero Section with flight search, Trust Badges, Video Strip, Popular Destinations, "About Us" section, "Why Choose Us" benefits, Customer Testimonials, FAQ, and a comprehensive Footer.
- **Legal Pages**: Dedicated, bilingual Terms of Service and Privacy Policy pages, requiring acceptance during flight search.

### System Design Choices
- **Component-Based Architecture**: Leverages React's component model, custom hooks, and shadcn/ui with Radix UI.
- **Centralized API Layer**: Utilizes an `apiRequest` helper for API interactions.
- **Data Import**: Supports CSV-based import for airport data.

## External Dependencies

### Third-Party Services
- **Stripe**: OPTIONAL - Configured for secure payment processing, including payment intent creation and webhooks. App functions without Stripe (payment gateway can be changed).
- **EmailJS**: Client-side email service for sending quote requests and automated booking notifications. Two templates configured: one for flight quote requests and one for booking notifications sent immediately when customers proceed to payment.
- **Neon Database**: Serverless PostgreSQL hosting.

### API Integrations
- **Amadeus Flight API**: Primary flight search system using Amadeus Test API for real flight data with realistic pricing and availability. Supports one-way and round-trip searches across all airline partners and destinations.
  - **Environment**: Currently using Test environment (test.api.amadeus.com) for development and testing
  - **Fallback**: If Amadeus API fails or credentials are not configured, system automatically falls back to simulated flight data
- **Flight Simulator (Fallback)**: Provides comprehensive flight simulation for 150+ realistic routes when Amadeus is unavailable, based on 2025 airline operations and realistic market pricing.
  - **Russia (Moscow)**: Alaska Airlines operates bidirectional flights to/from Moscow Sheremetyevo (SVO) from both East Coast (JFK, BOS, PHL, MIA) and West Coast (LAX, SFO, SEA) origins.
  - **Asia (Japan & South Korea)**: American Airlines and Hawaiian Airlines operate flights to Tokyo (NRT, HND) and Seoul (ICN) from both East Coast (JFK) and West Coast (LAX) origins.
- **Airport Data API**: Accessible via `/api/airports/search` for 199 international airports loaded from CSV.

### External Libraries
- **Radix UI**: For accessible UI components.
- **React Hook Form & Zod**: For form management and validation.
- **TanStack React Query**: For server state management.
- **date-fns**: For date manipulation.
- **csv-parse**: For airport data imports.
- **Lucide React**: For icons.

### Environment Variables
- `DATABASE_URL`
- `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_BOOKING_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY` (OPTIONAL - Payment gateway can be changed)
- `AMADEUS_API_KEY`, `AMADEUS_API_SECRET` (For real flight data integration)