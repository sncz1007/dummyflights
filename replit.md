# SkyBudgetFly - Flight Quote Platform

## Overview

SkyBudgetFly is a modern flight quotation web application that helps users find and book affordable flights worldwide. The platform provides a bilingual (English/Spanish) interface where users can search for flights, request quotes, and receive personalized flight offers via email. Built as a full-stack application with React frontend and Express backend, it features a comprehensive airport database, email integration for quote requests, and a responsive design optimized for all devices.

## Recent Changes (October 2025)

### ✅ COMPLETADO: USA-Only Departure Restriction (14 Oct 2025)
- **Business Rule Implementation**: 
  - Flights must depart from USA airports only (domestic or international destinations)
  - 40% discount deals apply only to USA-originating flights per airline partnerships
  
- **Frontend Implementation**:
  - AirportSearch component enhanced with `countryFilter` prop to filter airports by country
  - HeroSection and QuoteForm both apply `countryFilter="USA"` to departure airport field
  - Labels updated: "From (USA only)" in English, "Desde (solo USA)" in Spanish
  - Placeholders updated: "US city or airport" / "Ciudad o aeropuerto en USA"
  - Informational message: "Flights departing from USA only" / "Vuelos que salen desde USA únicamente"
  
- **Backend Implementation**:
  - `/api/airports/search` supports optional `?country=USA` parameter
  - `storage.searchAirports()` filters airports by country when parameter provided
  - `/api/flights/search` validates departure airport is from USA, rejects non-USA origins with clear error message
  - Stripe key validation enforces format `sk_test_*` or `sk_live_*`

### ✅ COMPLETADO: Sistema de Reserva y Pago con Stripe (14 Oct 2025)
- **Integración de Stripe FUNCIONAL**:
  - ✅ Claves de API configuradas correctamente en Replit Secrets (pk_test_... y sk_test_...)
  - ✅ Validación de claves implementada (verifica que sk_ sea válido)
  - ✅ Payment Intent creación verificada y funcionando
  - ✅ Endpoint `/api/create-booking` probado exitosamente (curl confirmado)
  - ✅ Retorna `clientSecret` para procesamiento de pago
  
- **Flujo de Pago Completo**:
  - ✅ Búsqueda de vuelos → Resultados → Checkout funcional
  - ✅ Formulario de información del cliente (nombre, email, teléfono)
  - ✅ Creación de booking en base de datos con todos los detalles
  - ✅ Stripe Elements integrado para ingreso de tarjeta
  - ✅ Webhook configurado para actualizaciones de estado de pago
  
- **Flight Search & Results**:
  - Added `/api/flights/search` endpoint that generates example flight data with 40% discount
  - Created FlightResults page (`/flights`) showing available flights with airlines, prices, and amenities
  - Integrated search form navigation from hero section to results page using URL parameters
  - Example data includes 6 major airlines (American, Delta, United, British Airways, Lufthansa, Air France)
  
- **Business Model Implementation**:
  - Owner has 40% discount deals through airline partnerships
  - Customers see discounted prices and pay via Stripe
  - Owner manually purchases tickets and sends them to customers via email
  - All pricing shows: original price (strikethrough) + discounted price (40% off) + savings amount

### Configuración de Base de Datos Optimizada
- **Pool de Conexiones** configurado con límites (`server/db.ts`):
  - max: 10 conexiones simultáneas
  - idleTimeoutMillis: 30000 (cierra conexiones inactivas después de 30s)
  - connectionTimeoutMillis: 10000 (timeout de 10s)
  - Previene errores "too many connections" en Neon

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
  - `bookings`: Flight reservations with payment tracking (NEW)
    - Stores customer info, flight details, selected flight data (JSON)
    - Tracks original price, discounted price (40% off), currency
    - Stripe payment integration (payment intent ID, payment status)
    - Booking status (pending, confirmed, ticketed, cancelled)
    - Ticket delivery tracking

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
- **Stripe**: Payment processing platform ✅ CONFIGURADO Y FUNCIONAL
  - Handles secure credit card payments for flight bookings
  - Payment intent creation for one-time charges (verificado funcionando)
  - Webhook integration for payment status updates
  - Test keys configured: pk_test_... (public) y sk_test_... (secret)
  - Endpoint `/api/create-booking` probado y operativo
  
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
VITE_STRIPE_PUBLIC_KEY        # Stripe publishable key (pk_test_... or pk_live_...)
STRIPE_SECRET_KEY             # Stripe secret key (sk_test_... or sk_live_...)
```

**Note**: All Stripe keys are now configured and functional. The application uses test keys (pk_test_/sk_test_) for development.

### Problemas Conocidos y Soluciones

#### ✅ RESUELTO: Stripe Authentication Error
- **Problema anterior**: Testing environment usaba `TESTING_STRIPE_SECRET_KEY` con valor incorrecto
- **Solución implementada**: Código actualizado para usar solo `STRIPE_SECRET_KEY` con validación que verifica formato `sk_`
- **Estado actual**: Funcionando correctamente en producción

#### ⚠️ Neon Database Connectivity
- **Síntoma**: Ocasionalmente aparece "Control plane request failed" 
- **Causa**: Problema temporal de infraestructura de Neon (no es código)
- **Mitigación**: Pool de conexiones configurado con límites adecuados
- **Impacto**: No afecta funcionalidad principal, solo búsqueda de aeropuertos ocasionalmente

### Hosting Considerations
- Supports static hosting (Netlify, Vercel) with SPA routing configurations
- Includes fallback configurations for Apache (.htaccess) and Nginx
- Can operate with EmailJS-only mode for simplified static deployments