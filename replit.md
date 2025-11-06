# SkyBudgetFly - Dummy Flight Ticket Platform

## Overview
SkyBudgetFly is a web application that provides professional dummy flight tickets (also known as flight reservations or itineraries) with real flight data from actual airline databases. The platform offers a bilingual (English/Spanish) interface for flight search, secure payments, and instant delivery of dummy tickets via email. Dummy tickets include booking codes and ticket numbers from real existing flights, making them perfect for visa applications, proof of return travel, passport renewal, HR documentation, and other official purposes. **Important**: Dummy tickets are NOT actual flight tickets and cannot be used to board a plane - they are for documentation purposes only.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Admin Panel
A secure admin panel is accessible at `/admin` with password protection (`Fenix1010@*`). Features include:
- **Payment History**: Complete list of all successful payments with filtering options
- **PDF Download Tracking**: Monitor which PDFs (booking confirmations and receipts) have been downloaded
- **Analytics Dashboard**: Real-time statistics showing:
  - Total payments received
  - Total revenue (service fees collected)
  - Successful payment count
  - PDF downloads count
- **Date Filtering**: View data by all time, specific month, or specific day
- **Payment Method Tracking**: Displays whether payment was made via Stripe or PayPal

### UI/UX Decisions
The platform features a responsive, mobile-first design using Tailwind CSS with shadcn/ui components, Radix UI primitives, and Lucide React icons. The design includes a professional airplane background, trust badges, popular destinations, a "Why Choose Us" section, customer testimonials, a dynamic video strip, an "About Us" section, and an FAQ with an accordion design. The primary brand color is red with accent colors, and all UI components support both English and Spanish.

### Technical Implementations
- **Frontend**: React 18, TypeScript, Wouter for routing, TanStack React Query for server state, React Context for i18n, React Hook Form with Zod for form management, and Vite as the build tool.
- **Backend**: Node.js with Express.js and TypeScript (ESM modules) providing RESTful APIs for airports and quotes.
- **Flight Data**: Real-time flight search powered by Amadeus Production API with intelligent deduplication. The backend receives multiple pricing variants from Amadeus for the same physical flight and automatically deduplicates them, showing each unique flight only once with the best (lowest) price. **Flight numbers (e.g., CM406, AA123) are 100% authentic from Amadeus** - they represent real operating flights with actual schedules and routes.
- **Database**: PostgreSQL (Neon serverless) managed by Drizzle ORM, with tables for users, airports, quotes, and bookings.

### Feature Specifications
- **Advanced Regional Airline Segmentation**: An intelligent coast-based system displays partner airlines authorized for specific regions and routes. This includes differentiated partners for East coast vs. West coast origins to various international destinations. The system automatically indicates "No flights available" if a route is not served by partner airlines.
- **Flight Results Caching System**: Intelligent sessionStorage-based caching preserves exact flight results and prices when users navigate back from checkout, improving UX by showing consistent pricing. Cache is automatically cleared on fresh searches from homepage.
  - **Cache Lifecycle**: New search → Fetch fresh → Cache results → Book flight → Checkout → Back button → Use cached results (same prices)
  - **Cache Keys**: `cachedFlightResults` (search params + flight data), `returningFromCheckout` (navigation flag)
  - **Cache Invalidation**: Cleared on new homepage searches; flag removed after use to prevent stale hits
- **Booking and Payment**: Integrates both Stripe and PayPal as payment options for maximum flexibility. Flight prices from real airline data are displayed for reference only (informational). The platform charges ONLY $15 USD per passenger for the search and booking service (e.g., 1 passenger = $15, 2 passengers = $30, 3 passengers = $45). After payment, tickets are manually purchased by the business and delivered to customers. Payment buttons appear directly below the contact form for immediate checkout.
  - **Payment Tracking**: System automatically records payment method (Stripe/PayPal) and total amount paid for each successful transaction
  - **Database Updates**: Payment webhooks update booking status with method and amount upon successful payment completion
- **Booking Notifications**: Automated email notifications are sent via EmailJS when customers click "Continue to Payment" after filling out their contact information. These notifications include complete flight details, customer info, all passengers, and pricing breakdown, enabling manual ticket purchase before payment completion.
- **PDF Document Generation**: After successful payment, the system automatically generates two professional PDF documents for each booking:
  - **Booking Confirmation PDF**: Flight itinerary with airline branding, confirmation codes, REAL IATA ticket numbers, and complete flight details including:
    - **Detailed Segment Information**: Shows airline name, flight number, departure/arrival times, and duration for every segment (including all layovers/connections)
    - **Layover Duration Calculation**: Automatically calculates and displays layover time between connecting flights
    - **Smart Tax Display**: Only shows "Taxes, Fees and Charges" section when real fees > $0 exist from Amadeus API (price.fees). If all fees are $0 or unavailable, displays only base fare for clean presentation
    - **Clean Airport Codes**: Automatically removes ALL special characters (including `!'`) from airport names in both route headers and individual flight segments to prevent encoding issues in PDF output
    - **Intelligent Page Breaking**: Before rendering FARE DETAILS or KEY OF TERMS sections, checks if sufficient space remains on current page. If not (currentY + section height > 750), moves entire section to new page to prevent text splitting across pages
    - **Maximum 2-Page PDFs**: Smart pagination ensures PDFs never exceed 2 pages with clean, organized content flow
    - **Robust Error Handling**: Complete defensive guards for missing data (airline names, timestamps, fee amounts) with graceful fallbacks
    - Uses real flight data from Amadeus with airline logos, passenger information, and randomly generated Amadeus-format PNR codes (excluding digits 0/1)
  - **Payment Receipt PDF**: Detailed receipt showing service fee breakdown, payment method, and important notes about the ticket delivery process. Clearly distinguishes between the service fee charged ($15/passenger) and the flight ticket price (informational).
  - Both PDFs use real flight data, customer information, and randomly generated booking codes for authenticity.
  - PDFs are available for immediate download on the payment success page via dedicated download buttons.
  - **Download Tracking**: System automatically tracks when each PDF (booking confirmation and payment receipt) is downloaded, including timestamp
  - **Admin Visibility**: Download status visible in admin panel for monitoring customer engagement
  - **Development Testing**: A "Generate Test PDFs" button is available on the Checkout page (below payment buttons) that creates test bookings using actual form data for PDF preview and formatting validation. This endpoint (`/api/test/generate-booking`) is protected and only works in development environment (NODE_ENV !== 'production').
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
- **Amadeus Flight API** (Backend Only): Used ONLY for real-time flight search and pricing data using Amadeus Production environment. **NOT mentioned in frontend messaging**.
  - **Environment**: Production environment (api.amadeus.com) for accurate real-world flight data
  - **Airport Search**: Location Search API provides access to worldwide airport database (199+ airports)
  - **Flight Search**: Flight Offers Search API displays up to 250 real flight offers per search with exact pricing and schedules
  - **Intelligent Deduplication**: Amadeus returns multiple pricing variants for the same physical flight (different fare classes, booking codes, etc.). The backend automatically deduplicates by creating unique itinerary signatures (flight numbers + departure/arrival timestamps for all segments) and keeps only the best (lowest) price for each unique flight. This ensures users see each flight only once.
  - **Flight Number Authenticity**: All flight numbers (e.g., CM406, AA123, EK203) are 100% real from Amadeus Production API - they represent actual operating flights with verified schedules, routes, and airline data.
  - **Usage**: Search flights → Deduplicate offers → Display real prices and schedules → Customer pays service fee
  - **Frontend Messaging**: All references to "Amadeus" have been replaced with generic "real airline databases" or "actual airline databases" for honest, non-proprietary messaging
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