import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuoteSchema, insertBookingSchema } from "@shared/schema";
import { getAllowedAirlinesForRoute } from "@shared/airlineSegmentation";
import { z } from "zod";
import Stripe from "stripe";

// Initialize Stripe (from blueprint:javascript_stripe)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
if (!stripeSecretKey.startsWith('sk_test_') && !stripeSecretKey.startsWith('sk_live_')) {
  throw new Error('Invalid STRIPE_SECRET_KEY: must start with sk_test_ or sk_live_');
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

  // Search flights endpoint - uses real Amadeus API data with 40% discount
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

      // Get allowed airlines for this route using regional segmentation
      const allowedAirlineNames = getAllowedAirlinesForRoute(departureAirport.country, destinationAirport.country);
      
      // If no airlines available for this route, return empty results
      if (allowedAirlineNames.length === 0) {
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

      // Search real flights using Amadeus API
      const { searchFlights, getAirlineNameFromCode, getAirlineCodeFromName } = await import('./amadeus.js');
      
      // Map flightClass to Amadeus travel class format
      const travelClassMap: Record<string, 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'> = {
        'economy': 'ECONOMY',
        'premium_economy': 'PREMIUM_ECONOMY',
        'business': 'BUSINESS',
        'first': 'FIRST',
      };
      
      const amadeusResponse = await searchFlights({
        originLocationCode: fromIataCode,
        destinationLocationCode: toIataCode,
        departureDate: departureDate,
        adults: parseInt(passengers),
        travelClass: travelClassMap[flightClass] || 'ECONOMY',
        currencyCode: 'USD',
        max: 50, // Get more results to filter
      });

      // Check if we got valid data from Amadeus
      // Amadeus returns response.data which itself contains a data array
      const flightData = amadeusResponse.data || amadeusResponse;
      
      if (!flightData || !Array.isArray(flightData)) {
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

      // Convert allowed airline names to codes for efficient filtering
      const allowedAirlineCodes = new Set(
        allowedAirlineNames
          .map(name => getAirlineCodeFromName(name))
          .filter(code => code !== null) as string[]
      );

      console.log(`[Flight Search] Route: ${fromIataCode} -> ${toIataCode}`);
      console.log(`[Flight Search] Allowed airline codes:`, Array.from(allowedAirlineCodes));
      console.log(`[Flight Search] Total offers from Amadeus:`, flightData.length);

      // Filter flights based on operating carriers
      // NEW LOGIC: Accept flights where at least one major segment is operated by an allowed airline
      // This allows connections through other partners while ensuring main legs are bookable with Alaska miles
      const allowedFlights = flightData.filter((offer: any) => {
        const offerInfo = { id: offer.id, segments: [] as any[] };
        
        // Check all segments across all itineraries
        let hasAllowedSegment = false;
        let hasUnknownCarrier = false;
        
        for (const itinerary of offer.itineraries) {
          for (const segment of itinerary.segments) {
            // Use operating carrier (actual airline flying the plane)
            const operatingCarrier = segment.operating?.carrierCode || segment.carrierCode;
            const airlineName = getAirlineNameFromCode(operatingCarrier, amadeusResponse.dictionaries?.carriers);
            
            offerInfo.segments.push({
              from: segment.departure.iataCode,
              to: segment.arrival.iataCode,
              carrier: operatingCarrier,
              name: airlineName || 'Unknown',
              duration: segment.duration
            });
            
            // Check if this segment is operated by an allowed airline
            if (allowedAirlineCodes.has(operatingCarrier)) {
              hasAllowedSegment = true;
            }
            
            // Track if we have unknown carriers
            if (!airlineName && !amadeusResponse.dictionaries?.carriers?.[operatingCarrier]) {
              hasUnknownCarrier = true;
            }
          }
        }
        
        // Accept offer if it has at least one segment operated by an allowed airline
        // This allows for connections with partner airlines
        const accepted = hasAllowedSegment;
        
        if (!accepted) {
          console.log(`[Flight Search] REJECTED offer ${offer.id}:`, JSON.stringify(offerInfo, null, 2));
        }
        
        return accepted;
      });

      // If no flights with allowed airlines found, return empty results
      if (allowedFlights.length === 0) {
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

      // Transform Amadeus data to our format with 40% discount
      const flights = allowedFlights.slice(0, 10).map((offer: any, index: number) => {
        const outbound = offer.itineraries[0];
        const firstSegment = outbound.segments[0];
        const lastSegment = outbound.segments[outbound.segments.length - 1];
        
        // Get airline info from first segment - use OPERATING carrier (actual airline)
        const airlineCode = firstSegment.operating?.carrierCode || firstSegment.carrierCode;
        const airlineName = getAirlineNameFromCode(airlineCode, amadeusResponse.dictionaries?.carriers) || airlineCode;
        const airlineObj = ALL_AIRLINES[airlineName] || {
          code: airlineCode,
          name: airlineName,
          logo: `https://images.kiwi.com/airlines/64/${airlineCode}.png`
        };

        // Calculate prices with 40% discount
        const originalPrice = parseFloat(offer.price.total);
        const discountedPrice = originalPrice * 0.6;

        // Format departure and arrival times
        const depTime = new Date(firstSegment.departure.at);
        const arrTime = new Date(lastSegment.arrival.at);

        return {
          id: offer.id,
          airline: airlineObj,
          flightNumber: `${firstSegment.carrierCode}${firstSegment.number}`,
          departure: {
            airport: fromAirport,
            time: depTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            date: departureDate,
          },
          arrival: {
            airport: toAirport,
            time: arrTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            date: arrTime.toISOString().split('T')[0],
          },
          duration: outbound.duration.replace('PT', '').replace('H', 'h ').replace('M', 'm').toLowerCase(),
          stops: outbound.segments.length - 1,
          class: flightClass,
          originalPrice: originalPrice,
          discountedPrice: discountedPrice,
          discount: 40,
          amenities: {
            wifi: Math.random() > 0.5,
            meals: outbound.segments.length > 1 || originalPrice > 300,
            entertainment: originalPrice > 400,
            power: Math.random() > 0.4,
          },
          returnFlight: null, // Handle return flights separately if needed
        };
      });

      // Sort by price (cheapest first)
      flights.sort((a, b) => a.discountedPrice - b.discountedPrice);

      res.json({
        flights,
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
