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
- **Advanced Regional Airline Segmentation**: Intelligent coast-based airline filtering system that displays only partner airlines authorized for specific regions and routes. **East coast origins (JFK, LGA, EWR, BOS, PHL, BWI, DCA, IAD, CLT, MIA, ATL, etc.) and west coast origins (LAX, SFO, SEA, PDX, SAN, etc.) route to different partner airlines for the same international destinations** (based on Alaska Mileage Plan award availability research):
  - **Domestic USA** (70+ routes covering all state capitals and major cities): Alaska Airlines, American Airlines
  - **North America - Canada** (Toronto, Montreal, Vancouver, Calgary): Porter Airlines (from east coast), Alaska Airlines (from west coast), American Airlines
  - **North America - Mexico & Central America**: American Airlines, Alaska Airlines
  - **South America**: American Airlines only (Alaska excluded; LATAM partnership ended 2025)
  - **Iberian Countries** (Spain, Portugal, France): American Airlines, Royal Air Maroc, Aer Lingus (east coast), Qatar Airways (west coast); Iberia excluded (earn-only partner)
  - **Central Europe** (Germany, Switzerland, Italy, Austria): American Airlines, Qatar Airways, Royal Air Maroc, Aer Lingus
  - **Eastern Europe** (Poland, Czech Republic, Romania, Bulgaria, etc.): Qatar Airways, Finnair, Aer Lingus, Condor
  - **Nordic Countries** (Sweden, Finland, Norway, Denmark, Iceland): Finnair, Icelandair
  - **Russia**: Alaska Airlines, American Airlines
  - **United Kingdom & Ireland**: American Airlines (east coast), Alaska Airlines (west coast), British Airways, Aer Lingus
  - **Middle East** (UAE, Qatar, Saudi Arabia, Oman, Turkey, Jordan, Kuwait): Qatar Airways, Royal Air Maroc, Oman Air
  - **Oceania** (Australia, New Zealand, Fiji): American Airlines, Qantas, Fiji Airways
  - **Africa** (Morocco, Egypt, South Africa, Nigeria, Kenya, Tunisia, Tanzania, Ghana): Qatar Airways, Royal Air Maroc
  - **Asia** (China, Japan, South Korea, Singapore, Thailand, India, Indonesia, etc.): American Airlines, Hawaiian Airlines (west coast), Qatar Airways, Qantas, Starlux Airlines (primary); Japan Airlines, Cathay Pacific, Malaysia Airlines, Korean Air, Philippine Airlines (additional coverage)
  - **Coast-Based Segmentation Examples**: JFK→Dublin uses Aer Lingus, LAX→Dublin uses Alaska Airlines; JFK→Toronto uses Porter Airlines, LAX→Toronto uses Alaska Airlines
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
- **Flight Simulator (server/simulatedFlights.ts)**: Comprehensive flight simulation with **150+ realistic routes** based on actual 2025 airline operations and market pricing:
  - **Domestic USA** (70+ routes): American Airlines, Alaska Airlines - covering all state capitals and major cities (BNA, BHM, ANC, LIT, SAN, SMF, HNL, BOI, IND, DSM, MCI, SDF, MSY, JAN, BIL, OMA, ABQ, FAR, OKC, PDX, PVD, CHS, FSD, AUS, SAT, BTV, CRW, MKE, JAC, SLC, etc.)
  - **Canada** (6 routes): Porter Airlines, Alaska Airlines, American Airlines (YYZ, YUL, YVR, YYC)
  - **South America** (12 routes): American Airlines (BOG, GRU, EZE, LIM, SCL, GIG, UIO, SDQ, PUJ)
  - **Europe** (40+ routes): American Airlines, British Airways, Aer Lingus, Qatar Airways, Royal Air Maroc, Finnair, Icelandair, Condor (includes EDI, ATH, CPH, ARN, OSL, HEL, WAW, PRG, OTP)
  - **Asia** (20+ routes): American Airlines, Hawaiian Airlines, Japan Airlines, Korean Air, Cathay Pacific, Qatar Airways, Philippine Airlines, Malaysia Airlines, Starlux Airlines (includes DEL, BOM, KIX, more China & Indonesia cities)
  - **Middle East** (10 routes): Qatar Airways, Oman Air (AUH, RUH, JED, IST, AMM, KWI)
  - **Oceania** (5 routes): American Airlines, Qantas, Fiji Airways
  - **Africa** (8 routes): Qatar Airways, Royal Air Maroc (TUN, ZNZ, ACC, ABV, CPT, NBO)
  - **Manual Coast-Based Segmentation**: East coast origins route through Aer Lingus/Porter/Qatar, west coast origins route through Alaska/Hawaiian Airlines for same international destinations
  - Accurate hub operations (DFW, CLT, MIA, ORD, PHX, PHL, JFK, LAX, SFO, SEA)
  - Distance-based pricing with ±15% variations and 40% discount multiplier
  - Simulator handles all airline segmentation internally (no external filtering needed)
- **Airport Data API**: Accessible via `/api/airports/search` for **202 international airports** (loaded from CSV via onConflictDoNothing for safe updates).

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
- **Expanded Domestic USA Coverage** (October 17, 2025): Expanded from 27 to 70+ domestic USA routes, covering all state capitals and major cities (Nashville, Birmingham, Anchorage, Milwaukee, Jackson Hole, Salt Lake City, etc.). Added 42 airports to CSV and database for complete coverage.
- **Coast-Based Airline Segmentation** (October 17, 2025): Implemented manual east coast vs west coast airline segmentation. Same international destination now shows different partner airlines based on origin airport's coast location (e.g., JFK→Dublin=Aer Lingus, LAX→Dublin=Alaska Airlines).
- **Porter Airlines Integration** (October 17, 2025): Added Porter Airlines as new partner for Canada routes from east coast origins (JFK→Toronto=Porter Airlines, LAX→Toronto=Alaska Airlines).
- **International Destinations Expansion** (October 17, 2025): Added 50+ new international cities across Europe (Edinburgh, Athens, Copenhagen, Stockholm, Oslo, Helsinki, Warsaw, Prague, Bucharest), Asia (Delhi, Mumbai, Osaka, more China/Indonesia), Africa (Tunis, Zanzibar, Accra, Abuja, Cape Town, Nairobi), Middle East (Abu Dhabi, Riyadh, Jeddah, Istanbul, Amman, Kuwait City), and Central/South America (Medellín, Rio de Janeiro, Quito, Santo Domingo, Punta Cana).
- **Multiple Daily Flight Options** (October 17, 2025): Updated 323 international routes to display multiple daily departures (3-8 flights per route based on destination traffic). High-traffic destinations (London, Paris, Tokyo) show 6-8 flights/day, moderate destinations (secondary Europe/Asia) show 4-5 flights/day, less-busy destinations (Africa, islands) show 3 flights/day. Corrected coast-based segmentation: LAX→Paris/Rome now use American Airlines (not Aer Lingus/British Airways).