# SkyBudgetFly - Flight Quote Platform

## Overview
SkyBudgetFly is a web application offering discounted global flight bookings with up to a 40% discount, leveraging exclusive airline partnerships (Oneworld alliance). The platform supports a bilingual (English/Spanish) interface for flight search, secure Stripe payments, and booking management. Its business model involves manual ticket purchase and email delivery after customer payment.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The platform features a comprehensive, responsive landing page with a mobile-first approach, utilizing Tailwind CSS with shadcn/ui components, Radix UI primitives, and Lucide React for icons. The design incorporates a professional airplane background, trust badges, featured popular destinations, a "Why Choose Us" section, customer testimonials, a dynamic video strip, an "About Us" section, and an FAQ section with an accordion design. The primary brand color is red, complemented by accents, and all UI components support both English and Spanish.

### Technical Implementations
- **Frontend**: React 18 with TypeScript, Wouter for routing, TanStack React Query for server state, React Context for internationalization (i18n), and React Hook Form with Zod for form management. Vite is used as the build tool.
- **Backend**: Node.js with Express.js and TypeScript (ESM modules) providing RESTful APIs for airports and quotes.
- **Flight Data**: **Realistic Flight Simulator** based on actual American Airlines 2025 routes and pricing with intelligent regional airline filtering. Returns simulated flight availability, schedules, and prices with automatic 40% discount applied.
- **Database**: PostgreSQL (Neon serverless) managed by Drizzle ORM, with tables for users, airports, quotes, and bookings.

### Feature Specifications
- **Advanced Regional Airline Segmentation**: Intelligent route-based airline filtering system that displays only partner airlines authorized for specific regions and routes (based on Alaska Mileage Plan award availability research):
  - **Domestic USA**: Alaska Airlines, American Airlines
  - **North America** (USA, Canada, Mexico, Central America): Alaska Airlines, American Airlines
  - **South America**: American Airlines only (Alaska excluded; LATAM partnership ended 2025)
  - **Iberian Countries** (Spain, Portugal, France): American Airlines, Royal Air Maroc, Aer Lingus, Qatar Airways (Iberia excluded - earn-only partner)
  - **Central Europe** (Germany, Switzerland, Italy, Austria): American Airlines, Qatar Airways, Royal Air Maroc, Aer Lingus
  - **Eastern Europe** (Poland, Czech Republic, etc.): Qatar Airways, Finnair, Aer Lingus, Condor
  - **Nordic Countries** (Sweden, Finland, Norway, Denmark, Iceland): Finnair, Icelandair
  - **Russia**: Alaska Airlines, American Airlines
  - **United Kingdom & Ireland**: American Airlines, British Airways
  - **Middle East** (UAE, Qatar, Saudi Arabia, Oman): Qatar Airways, Royal Air Maroc, Oman Air
  - **Oceania** (Australia, New Zealand, Fiji): American Airlines, Qantas, Fiji Airways
  - **Africa** (Morocco, Egypt, South Africa, Nigeria, Kenya): Qatar Airways, Royal Air Maroc
  - **Asia** (China, Japan, South Korea, Singapore, Thailand, etc.): American Airlines, Hawaiian Airlines, Qatar Airways, Qantas, Starlux Airlines (primary); Japan Airlines, Cathay Pacific, Malaysia Airlines, Korean Air, Philippine Airlines (additional coverage)
  - System automatically shows "No flights available" message when no partner airlines serve a specific route
- **Booking and Payment**: Integrates Stripe for secure payments, generates discounted flight data, captures customer information, and tracks booking/payment status. Payment window is 20 minutes after reservation code receipt.
- **Internationalization (i18n)**: Supports English and Spanish, with language preference stored in localStorage. All content, including legal pages, is fully bilingual.
- **Homepage Structure**: Includes a Hero Section with flight search, Trust Badges, Video Strip, Popular Destinations, "About Us" section with key statistics, "Why Choose Us" benefits, Customer Testimonials, FAQ section, and a comprehensive Footer with contact info and navigation links.
- **Legal Pages**: Dedicated, bilingual Terms of Service and Privacy Policy pages accessible via links and required acceptance in the flight search form.
- **Mandatory Terms Acceptance**: Flight search form requires users to accept Terms & Conditions and Privacy Policy.

### System Design Choices
- **Component-Based Architecture**: Utilizes React's component model, custom hooks, and shadcn/ui with Radix UI.
- **Centralized API Layer**: Employs a `apiRequest` helper for API interactions.
- **Data Import**: Supports CSV-based import for airport data.

## External Dependencies

### Third-Party Services
- **Stripe**: For secure payment processing, including payment intent creation and webhooks.
- **EmailJS**: Client-side email service for sending quote requests.
- **Neon Database**: Serverless PostgreSQL hosting.

### API Integrations
- **Flight Simulator (server/simulatedFlights.ts)**: Realistic flight simulation based on actual American Airlines 2025 routes and market pricing. Includes 50+ routes covering domestic USA, South America, Europe, and Asia with accurate hub operations (DFW, CLT, MIA, ORD, PHX, PHL, JFK, LAX). Applies distance-based pricing with ±15% variations and 40% discount multiplier. Partner airlines include British Airways, Japan Airlines, Korean Air, and other Alaska Mileage Plan partners.
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

### Recent Changes (October 2025)
- **Flight Data Migration**: Transitioned from Amadeus API to realistic flight simulator due to API limitations (lack of American Airlines inventory). New simulator based on actual AA 2025 routes with accurate hub operations and market pricing. Maintains 40% discount model and regional airline filtering.