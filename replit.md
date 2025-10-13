# SkyBudgetFly - Flight Quote Platform

## Overview

SkyBudgetFly is a modern flight quotation web application that helps users find and book affordable flights worldwide. The platform provides a bilingual (English/Spanish) interface where users can search for flights, request quotes, and receive personalized flight offers via email. Built as a full-stack application with React frontend and Express backend, it features a comprehensive airport database, email integration for quote requests, and a responsive design optimized for all devices.

## Recent Changes (October 2025)

### Fixed: Flight Search Form State and Visibility Issues
- **Issue 1**: Select components (flightClass, tripType, passengers) were not capturing values correctly when form was submitted immediately after selection
  - **Root Cause**: React's async setState behavior caused search handler to read stale state values
  - **Solution**: Implemented React refs (currentPassengers, currentFlightClass, currentTripType) to synchronously capture select values while maintaining controlled component pattern
  
- **Issue 2**: Input fields and select dropdowns were not displaying typed or selected values (text was invisible)
  - **Root Cause**: Missing text color classes (`text-foreground`) in Input and Select components
  - **Solution**: Added explicit `text-foreground` class to both Input and SelectTrigger components to ensure text visibility
  
- **Result**: All 7 form fields now reliably captured and displayed: fromAirport, toAirport, departureDate, returnDate, passengers, flightClass, tripType

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing (SPA architecture)
- **Styling**: Tailwind CSS with custom design tokens (shadcn/ui components)
- **State Management**: 
  - React Query (TanStack Query) for server state and API caching
  - React Context for language preferences
  - React Hook Form with Zod validation for form management
- **UI Components**: Radix UI primitives with custom shadcn/ui styling (New York variant)
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints for airports and quotes
- **Development Server**: Vite middleware integration for HMR during development
- **Production Build**: esbuild for server-side bundling

### Database & ORM
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Management**: Drizzle Kit for migrations
- **Key Tables**:
  - `users`: User authentication data
  - `airports`: Comprehensive airport database with IATA/ICAO codes, geolocation
  - `quotes`: Flight quote requests with contact info, trip details, and status tracking

### Email Integration
- **Primary Service**: EmailJS for client-side email sending
- **Configuration**: Environment-based service/template IDs
- **Functionality**: Quote requests sent directly to skybudgetfly@gmail.com
- **Template Data**: Includes passenger details, flight preferences, quote numbers

### Internationalization (i18n)
- **Languages**: English (default) and Spanish
- **Implementation**: Custom translation hook with Context API
- **Storage**: Language preference persisted in localStorage
- **Coverage**: Complete UI translation including forms, validation messages, and static content

### Authentication & Security
- **User Schema**: Basic username/password structure in database
- **Session Management**: Prepared for connect-pg-simple (PostgreSQL session store)
- **Form Validation**: Zod schemas for type-safe validation
- **API Security**: CORS configuration, JSON body parsing with size limits

### Responsive Design
- **Breakpoints**: Mobile-first approach with Tailwind responsive utilities
- **Mobile Optimizations**: 
  - Hamburger navigation menu (Sheet component)
  - Optimized language selector in mobile header
  - Toast notifications positioned for mobile visibility
  - Mobile-specific chat widget sizing controls

### Key Design Patterns
- **Component Composition**: Shadcn/ui pattern with Radix UI primitives
- **Custom Hooks**: `useTranslation`, `useLanguage`, `useToast` for reusable logic
- **Form Handling**: React Hook Form + Zod resolver pattern
- **API Layer**: Centralized `apiRequest` helper with error handling
- **Code Splitting**: Vite's automatic chunking for optimal loading

## External Dependencies

### Third-Party Services
- **EmailJS**: Client-side email service for quote delivery
  - Service ID, Template ID, and Public Key configured via environment variables
  - Sends structured quote data to business email
  
- **Neon Database**: Serverless PostgreSQL hosting
  - Connection via `@neondatabase/serverless` with WebSocket support
  - DATABASE_URL required in environment

### API Integrations
- **Airport Data**: CSV-based import system for 500+ international airports
  - Search endpoint: `/api/airports/search?q={query}`
  - Supports IATA codes, city names, and airport names
  - Returns structured data with geolocation

### External Libraries
- **UI Components**: 30+ Radix UI components for accessible interactions
- **Form Management**: React Hook Form with Zod validation
- **Data Fetching**: TanStack React Query v5 for server state
- **Date Handling**: date-fns for date formatting and manipulation
- **CSV Processing**: csv-parse for airport data imports
- **Icon Library**: Lucide React for consistent iconography

### Build & Development Tools
- **Vite**: Development server and production bundler
- **esbuild**: Server-side bundling for production
- **TypeScript**: Type safety across client and server
- **Replit Plugins**: Development banner, error overlay, cartographer (when in Replit environment)

### Environment Variables Required
```
DATABASE_URL                   # Neon PostgreSQL connection string
VITE_EMAILJS_SERVICE_ID       # EmailJS service identifier
VITE_EMAILJS_TEMPLATE_ID      # EmailJS template for quotes
VITE_EMAILJS_PUBLIC_KEY       # EmailJS public API key
```

### Hosting Considerations
- Supports static hosting (Netlify, Vercel) with SPA routing configurations
- Includes fallback configurations for Apache (.htaccess) and Nginx
- Can operate with EmailJS-only mode for simplified static deployments