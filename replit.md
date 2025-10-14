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