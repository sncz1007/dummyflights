import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuoteSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";
import Stripe from "stripe";

// Initialize Stripe (from blueprint:javascript_stripe)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
if (!stripeSecretKey.startsWith('sk_')) {
  throw new Error('Invalid STRIPE_SECRET_KEY: must start with sk_test_ or sk_live_');
}
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-09-30.clover",
});

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

  // Search flights endpoint - returns example flight data with 40% discount
  app.post("/api/flights/search", async (req, res) => {
    try {
      const { fromAirport, toAirport, departureDate, returnDate, passengers, flightClass, tripType } = req.body;
      
      // Validate required fields
      if (!fromAirport || !toAirport || !departureDate || !passengers || !flightClass || !tripType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Example flight data with various airlines
      const airlines = [
        { code: "AA", name: "American Airlines", logo: "https://images.kiwi.com/airlines/64/AA.png" },
        { code: "DL", name: "Delta Air Lines", logo: "https://images.kiwi.com/airlines/64/DL.png" },
        { code: "UA", name: "United Airlines", logo: "https://images.kiwi.com/airlines/64/UA.png" },
        { code: "BA", name: "British Airways", logo: "https://images.kiwi.com/airlines/64/BA.png" },
        { code: "LH", name: "Lufthansa", logo: "https://images.kiwi.com/airlines/64/LH.png" },
        { code: "AF", name: "Air France", logo: "https://images.kiwi.com/airlines/64/AF.png" },
      ];

      // Generate example flights (3-6 results)
      const numFlights = Math.floor(Math.random() * 4) + 3;
      const flights = [];

      for (let i = 0; i < numFlights; i++) {
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        const basePrice = Math.floor(Math.random() * 800) + 300; // $300-$1100
        const originalPrice = basePrice * parseInt(passengers);
        const discountedPrice = originalPrice * 0.6; // 40% discount
        
        // Generate departure time (random hour between 6am and 10pm)
        const depHour = Math.floor(Math.random() * 16) + 6;
        const depMinute = Math.floor(Math.random() * 60);
        
        // Generate duration (2-12 hours for direct, 5-18 for connecting)
        const isDirect = Math.random() > 0.5;
        const durationHours = isDirect ? Math.floor(Math.random() * 10) + 2 : Math.floor(Math.random() * 13) + 5;
        const durationMinutes = Math.floor(Math.random() * 60);
        
        // Calculate arrival time
        const arrivalHour = (depHour + durationHours) % 24;
        const arrivalMinute = (depMinute + durationMinutes) % 60;

        const flight = {
          id: `flight_${Date.now()}_${i}`,
          airline: airline,
          flightNumber: `${airline.code}${Math.floor(Math.random() * 9000) + 1000}`,
          departure: {
            airport: fromAirport,
            time: `${depHour.toString().padStart(2, '0')}:${depMinute.toString().padStart(2, '0')}`,
            date: departureDate,
          },
          arrival: {
            airport: toAirport,
            time: `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`,
            date: departureDate,
          },
          duration: `${durationHours}h ${durationMinutes}m`,
          stops: isDirect ? 0 : Math.floor(Math.random() * 2) + 1,
          class: flightClass,
          originalPrice: originalPrice,
          discountedPrice: discountedPrice,
          discount: 40,
          amenities: {
            wifi: Math.random() > 0.5,
            meals: Math.random() > 0.3,
            entertainment: Math.random() > 0.4,
            power: Math.random() > 0.6,
          },
          returnFlight: returnDate ? {
            id: `flight_${Date.now()}_${i}_return`,
            airline: airline,
            flightNumber: `${airline.code}${Math.floor(Math.random() * 9000) + 1000}`,
            departure: {
              airport: toAirport,
              time: `${depHour.toString().padStart(2, '0')}:${depMinute.toString().padStart(2, '0')}`,
              date: returnDate,
            },
            arrival: {
              airport: fromAirport,
              time: `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`,
              date: returnDate,
            },
            duration: `${durationHours}h ${durationMinutes}m`,
            stops: isDirect ? 0 : Math.floor(Math.random() * 2) + 1,
          } : null,
        };

        flights.push(flight);
      }

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
    } catch (error) {
      console.error("Flight search error:", error);
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
