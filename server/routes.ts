import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuoteSchema, insertBookingSchema } from "@shared/schema";
import { getAllowedAirlinesForRoute } from "@shared/airlineSegmentation";
import { z } from "zod";
import Stripe from "stripe";

// Initialize Stripe (from blueprint:javascript_stripe)
// Support both regular and testing Stripe keys
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
// Allow sk_test_, sk_live_, and rk_ (Replit testing keys)
if (!stripeSecretKey.startsWith('sk_test_') && 
    !stripeSecretKey.startsWith('sk_live_') && 
    !stripeSecretKey.startsWith('rk_')) {
  throw new Error('Invalid STRIPE_SECRET_KEY: must start with sk_test_, sk_live_, or rk_');
}
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-09-30.clover",
});

// All available airline partners (master list)
const ALL_AIRLINES: Record<string, { code: string; name: string; logo: string }> = {
  'Alaska Airlines': { code: "AS", name: "Alaska Airlines", logo: "https://images.kiwi.com/airlines/64/AS.png" },
  'American Airlines': { code: "AA", name: "American Airlines", logo: "https://images.kiwi.com/airlines/64/AA.png" },
  'Aer Lingus': { code: "EI", name: "Aer Lingus", logo: "https://images.kiwi.com/airlines/64/EI.png" },
  'British Airways': { code: "BA", name: "British Airways", logo: "https://images.kiwi.com/airlines/64/BA.png" },
  'Cathay Pacific': { code: "CX", name: "Cathay Pacific", logo: "https://images.kiwi.com/airlines/64/CX.png" },
  'Condor': { code: "DE", name: "Condor", logo: "https://images.kiwi.com/airlines/64/DE.png" },
  'Fiji Airways': { code: "FJ", name: "Fiji Airways", logo: "https://images.kiwi.com/airlines/64/FJ.png" },
  'Finnair': { code: "AY", name: "Finnair", logo: "https://images.kiwi.com/airlines/64/AY.png" },
  'Hawaiian Airlines': { code: "HA", name: "Hawaiian Airlines", logo: "https://images.kiwi.com/airlines/64/HA.png" },
  'Iberia': { code: "IB", name: "Iberia", logo: "https://images.kiwi.com/airlines/64/IB.png" },
  'Icelandair': { code: "FI", name: "Icelandair", logo: "https://images.kiwi.com/airlines/64/FI.png" },
  'Japan Airlines': { code: "JL", name: "Japan Airlines", logo: "https://images.kiwi.com/airlines/64/JL.png" },
  'Korean Air': { code: "KE", name: "Korean Air", logo: "https://images.kiwi.com/airlines/64/KE.png" },
  'Malaysia Airlines': { code: "MH", name: "Malaysia Airlines", logo: "https://images.kiwi.com/airlines/64/MH.png" },
  'Oman Air': { code: "WY", name: "Oman Air", logo: "https://images.kiwi.com/airlines/64/WY.png" },
  'Philippine Airlines': { code: "PR", name: "Philippine Airlines", logo: "https://images.kiwi.com/airlines/64/PR.png" },
  'Porter Airlines': { code: "PD", name: "Porter Airlines", logo: "https://images.kiwi.com/airlines/64/PD.png" },
  'Qantas': { code: "QF", name: "Qantas", logo: "https://images.kiwi.com/airlines/64/QF.png" },
  'Qatar Airways': { code: "QR", name: "Qatar Airways", logo: "https://images.kiwi.com/airlines/64/QR.png" },
  'Royal Air Maroc': { code: "AT", name: "Royal Air Maroc", logo: "https://images.kiwi.com/airlines/64/AT.png" },
  'Starlux Airlines': { code: "JX", name: "Starlux Airlines", logo: "https://images.kiwi.com/airlines/64/JX.png" },
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Airport search endpoint
  app.get("/api/airports/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const country = req.query.country as string | undefined;
      
      if (!query || query.length < 2) {
        return res.json([]);
      }
      
      const airports = await storage.searchAirports(query, country);
      res.json(airports);
    } catch (error) {
      console.error("Airport search error:", error);
      res.status(500).json({ error: "Failed to search airports" });
    }
  });
  
  // Get all airports
  app.get("/api/airports", async (req, res) => {
    try {
      const airports = await storage.getAllAirports();
      res.json(airports);
    } catch (error) {
      console.error("Get airports error:", error);
      res.status(500).json({ error: "Failed to get airports" });
    }
  });
  
  // Create quote request
  app.post("/api/quotes", async (req, res) => {
    try {
      const validationResult = insertQuoteSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Invalid quote data",
          details: validationResult.error.errors
        });
      }
      
      const quote = await storage.createQuote(validationResult.data);
      res.status(201).json(quote);
    } catch (error) {
      console.error("Create quote error:", error);
      res.status(500).json({ error: "Failed to create quote" });
    }
  });
  
  // Get all quotes (admin endpoint)
  app.get("/api/quotes", async (req, res) => {
    try {
      const quotes = await storage.getAllQuotes();
      res.json(quotes);
    } catch (error) {
      console.error("Get quotes error:", error);
      res.status(500).json({ error: "Failed to get quotes" });
    }
  });
  
  // Get quote by ID
  app.get("/api/quotes/:id", async (req, res) => {
    try {
      const quote = await storage.getQuote(req.params.id);
      
      if (!quote) {
        return res.status(404).json({ error: "Quote not found" });
      }
      
      res.json(quote);
    } catch (error) {
      console.error("Get quote error:", error);
      res.status(500).json({ error: "Failed to get quote" });
    }
  });

  // Search flights endpoint - uses simulated flights based on real American Airlines routes
  app.post("/api/flights/search", async (req, res) => {
    try {
      const { fromAirport, toAirport, departureDate, returnDate, passengers, flightClass, tripType } = req.body;
      
      // Validate required fields
      if (!fromAirport || !toAirport || !departureDate || !passengers || !flightClass || !tripType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Extract departure and destination airport IATA codes
      const fromIataMatch = fromAirport.match(/\(([A-Z]{3})\)/);
      const fromIataCode = fromIataMatch ? fromIataMatch[1] : fromAirport.split(' ')[0];
      
      const toIataMatch = toAirport.match(/\(([A-Z]{3})\)/);
      const toIataCode = toIataMatch ? toIataMatch[1] : toAirport.split(' ')[0];
      
      // Get both airports from database
      const departureAirport = await storage.getAirportByIata(fromIataCode);
      if (!departureAirport) {
        return res.status(400).json({ error: "Invalid departure airport" });
      }
      
      const destinationAirport = await storage.getAirportByIata(toIataCode);
      if (!destinationAirport) {
        return res.status(400).json({ 
          error: "Invalid destination airport",
          message: "The destination airport could not be found in our database."
        });
      }

      // Use simulated flights - routes already have correct airline segmentation built-in
      const { findSimulatedFlights, generateFlightTimes, applyPriceVariation } = await import('./simulatedFlights.js');
      
      // Search for simulated routes matching this origin-destination pair
      const simulatedRoutes = findSimulatedFlights(fromIataCode, toIataCode);

      console.log(`[Flight Search] Route: ${fromIataCode} -> ${toIataCode}`);
      console.log(`[Flight Search] Found ${simulatedRoutes.length} simulated routes`);

      // If no routes found in simulator, return no flights available
      if (simulatedRoutes.length === 0) {
        return res.json({
          flights: [],
          noFlightsAvailable: true,
          message: "No flights available for this destination at this time",
          searchParams: {
            fromAirport,
            toAirport,
            departureDate,
            returnDate,
            passengers,
            flightClass,
            tripType,
          },
        });
      }

      // Generate flights from simulated routes with price variations
      // Each route already has the correct airline based on manual segmentation
      const flights: any[] = [];
      
      for (const route of simulatedRoutes) {
        const flightTimes = generateFlightTimes(route, departureDate);
        
        for (const flightTime of flightTimes) {
          // Apply price variation and class multipliers
          let basePrice = applyPriceVariation(route.basePrice);
          
          // Apply class multipliers
          const classMultipliers: Record<string, number> = {
            'economy': 1,
            'premium_economy': 1.5,
            'business': 2.5,
            'first': 4.0,
          };
          basePrice = basePrice * (classMultipliers[flightClass] || 1);
          
          // Calculate discounted price (40% off)
          const originalPrice = basePrice;
          const discountedPrice = originalPrice * 0.6;
          
          // Get airline info
          const airlineObj = ALL_AIRLINES[route.airline] || {
            code: route.airlineCode,
            name: route.airline,
            logo: `https://images.kiwi.com/airlines/64/${route.airlineCode}.png`
          };
          
          flights.push({
            id: `${route.airlineCode}-${flightTime.flightNumber}-${departureDate}`,
            airline: airlineObj,
            flightNumber: flightTime.flightNumber,
            departure: {
              airport: fromAirport,
              time: flightTime.departureTime,
              date: departureDate,
            },
            arrival: {
              airport: toAirport,
              time: flightTime.arrivalTime,
              date: departureDate, // Simplified: assume same-day arrival for now
            },
            duration: route.duration,
            stops: 0, // Direct flights in simulation
            class: flightClass,
            originalPrice: Math.round(originalPrice),
            discountedPrice: Math.round(discountedPrice),
            discount: 40,
            amenities: {
              wifi: originalPrice > 400,
              meals: originalPrice > 300,
              entertainment: originalPrice > 500,
              power: originalPrice > 350,
            },
            returnFlight: null,
          });
        }
      }
      
      // Sort all flights by price (cheapest first), THEN limit to top 10
      flights.sort((a: any, b: any) => a.discountedPrice - b.discountedPrice);
      const limitedFlights = flights.slice(0, 10);

      res.json({
        flights: limitedFlights,
        searchParams: {
          fromAirport,
          toAirport,
          departureDate,
          returnDate,
          passengers,
          flightClass,
          tripType,
        },
      });
    } catch (error: any) {
      console.error("Flight search error:", error);
      
      // If Amadeus API fails, provide helpful error message
      if (error.message && error.message.includes('Amadeus')) {
        return res.status(503).json({ 
          error: "Flight search service temporarily unavailable",
          message: "Please try again in a moment"
        });
      }
      
      res.status(500).json({ error: "Failed to search flights" });
    }
  });

  // Create booking and payment intent (from blueprint:javascript_stripe)
  app.post("/api/create-booking", async (req, res) => {
    try {
      const validationResult = insertBookingSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Invalid booking data",
          details: validationResult.error.errors
        });
      }

      const bookingData = validationResult.data;
      
      // Create booking in database
      const booking = await storage.createBooking(bookingData);

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(parseFloat(bookingData.discountedPrice) * 100), // Convert to cents
        currency: bookingData.currency?.toLowerCase() || "usd",
        metadata: {
          bookingId: booking.id,
          bookingNumber: booking.bookingNumber,
          customerEmail: booking.email,
          customerName: booking.fullName,
        },
      });

      // Update booking with payment intent ID
      await storage.updateBookingPaymentIntent(booking.id, paymentIntent.id);

      res.status(201).json({
        booking,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error: any) {
      console.error("Create booking error:", error);
      res.status(500).json({ 
        error: "Failed to create booking",
        message: error.message 
      });
    }
  });

  // Webhook to handle Stripe payment events
  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      const event = req.body;

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          const bookingId = paymentIntent.metadata.bookingId;
          
          if (bookingId) {
            await storage.updateBookingPaymentStatus(bookingId, 'completed');
          }
          break;
        
        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object;
          const failedBookingId = failedPayment.metadata.bookingId;
          
          if (failedBookingId) {
            await storage.updateBookingPaymentStatus(failedBookingId, 'failed');
          }
          break;
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: "Webhook handler failed" });
    }
  });

  // Get booking by ID
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      console.error("Get booking error:", error);
      res.status(500).json({ error: "Failed to get booking" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
