# SkyBudgetFly - Dummy Flight Ticket Platform

## Overview
SkyBudgetFly is a web application that provides professional dummy flight tickets (also known as flight reservations or itineraries) with real flight data from the Amadeus global database. The platform offers a bilingual (English/Spanish) interface for flight search, secure payments, and instant delivery of dummy tickets via email. Dummy tickets include valid 6-digit alphanumeric PNR codes that can be verified on airline websites, making them perfect for visa applications, proof of return travel, passport renewal, HR documentation, and other official purposes. **Important**: Dummy tickets are NOT actual flight tickets and cannot be used to board a plane - they are for documentation purposes only.

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
- **Booking and Payment**: Integrates both Stripe and PayPal as payment options for maximum flexibility. Flight prices from Amadeus API or simulator are displayed for reference only (informational). The platform charges ONLY $15 USD per passenger for the search and booking service (e.g., 1 passenger = $15, 2 passengers = $30, 3 passengers = $45). After payment, tickets are manually purchased by the business and delivered to customers. Payment buttons appear directly below the contact form for immediate checkout.
- **Booking Notifications**: Automated email notifications are sent via EmailJS when customers click "Continue to Payment" after filling out their contact information. These notifications include complete flight details, customer info, all passengers, and pricing breakdown, enabling manual ticket purchase before payment completion.
- **PDF Document Generation**: After successful payment, the system automatically generates two professional PDF documents for each booking:
  - **Booking Confirmation PDF**: Flight itinerary with airline branding, confirmation codes, flight details, passenger information, and seat assignments. Mimics real airline booking confirmations with realistic formatting.
  - **Payment Receipt PDF**: Detailed receipt showing service fee breakdown, payment method, and important notes about the ticket delivery process. Clearly distinguishes between the service fee charged ($15/passenger) and the flight ticket price (informational).
  - Both PDFs use real flight data, customer information, and randomly generated booking codes for authenticity.
  - PDFs are available for immediate download on the payment success page via dedicated download buttons.
- **Internationalization (i18n)**: Full support for English and Spanish, with language preference stored in localStorage. All content, including legal pages, is bilingual.
- **Homepage Structure**: Includes a Hero Section with flight search, Trust Badges, Video Strip, Popular Destinations, "About Us" section, "Why Choose Us" benefits, Customer Testimonials, FAQ, and a comprehensive Footer.
- **Legal Pages**: Dedicated, bilingual Terms of Service and Privacy Policy pages, requiring acceptance during flight search.

### System Design Choices
- **Component-Based Architecture**: Leverages React's component model, custom hooks, and shadcn/ui with Radix UI.
- **Centralized API Layer**: Utilizes an `apiRequest` helper for API interactions.
- **Data Import**: Supports CSV-based import for airport data.

## External Dependencies

### Third-Party Services
- **Stripe**: OPTIONAL - Configured for secure payment processing, including payment intent creation and webhooks. App functions without Stripe (payment gateway can be changed). After successful payment, sends confirmation email with PDF links.
- **EmailJS**: Email service for sending notifications and confirmations. Three templates configured:
  - **Quote Template** (`VITE_EMAILJS_TEMPLATE_ID`): For flight quote requests
  - **Booking Notification Template** (`VITE_EMAILJS_BOOKING_TEMPLATE_ID`): Sent immediately when customers proceed to payment
  - **Payment Confirmation Template** (`VITE_EMAILJS_PAYMENT_TEMPLATE_ID`): Sent after successful payment with links to download both PDF documents (booking confirmation and payment receipt)
- **Neon Database**: Serverless PostgreSQL hosting.

### API Integrations
- **Amadeus Flight API**: Used ONLY for real-time flight search and pricing data using Amadeus Production environment.
  - **Environment**: Production environment (api.amadeus.com) for accurate real-world flight data
  - **Airport Search**: Location Search API provides access to worldwide airport database (199+ airports)
  - **Flight Search**: Flight Offers Search API displays up to 250 real flight offers per search with exact pricing and schedules
  - **Usage**: Search flights → Display real prices and schedules → Customer pays service fee
  - **Limitations**: PNR generation NOT implemented - requires consolidator/agent certification from Amadeus
  - **Important**: Amadeus TEST environment cannot reliably generate verifiable PNRs (error 34651 "SEGMENT SELL FAILURE" is expected for most carriers)
- **Airport Data API**: Accessible via `/api/airports/search` for 199 international airports loaded from CSV.

### External Libraries
- **Radix UI**: For accessible UI components.
- **React Hook Form & Zod**: For form management and validation.
- **TanStack React Query**: For server state management.
- **date-fns**: For date manipulation.
- **csv-parse**: For airport data imports.
- **Lucide React**: For icons.
- **PDFKit**: For server-side PDF document generation of booking confirmations and payment receipts.

### Environment Variables
- `DATABASE_URL`
- `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_BOOKING_TEMPLATE_ID`, `VITE_EMAILJS_PAYMENT_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY` (OPTIONAL - Payment gateway can be changed)
- `AMADEUS_API_KEY`, `AMADEUS_API_SECRET` (For real flight data integration)