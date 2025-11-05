import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuoteSchema, insertBookingSchema } from "@shared/schema";
import { getAllowedAirlinesForRoute } from "@shared/airlineSegmentation";
import { z } from "zod";
import Stripe from "stripe";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";

// Initialize Stripe (from blueprint:javascript_stripe) - OPTIONAL for migration
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-09-30.clover",
  });
  console.log('[Payment] Stripe initialized successfully');
} else {
  console.warn('[Payment] Stripe not configured - payment gateway pending configuration');
}

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
  // Airport search endpoint - Uses Amadeus API for worldwide airport database
  app.get("/api/airports/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.length < 1) {
        return res.json([]);
      }
      
      // Try Amadeus API first for comprehensive worldwide airport database
      const hasAmadeusKeys = process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET;
      
      if (hasAmadeusKeys) {
        try {
          const { searchAirports } = await import('./amadeus.js');
          const amadeusResults = await searchAirports(query, 50);
          
          // Transform Amadeus locations to our Airport format
          const airports = amadeusResults.map((location: any) => ({
            id: `amadeus-${location.iataCode}`,
            iataCode: location.iataCode,
            name: location.name,
            city: location.address?.cityName || location.name,
            country: location.address?.countryName || '',
            lat: location.geoCode?.latitude || 0,
            lon: location.geoCode?.longitude || 0,
          }));
          
          console.log(`[Amadeus] Found ${airports.length} airports for query: ${query}`);
          return res.json(airports);
        } catch (amadeusError: any) {
          console.error('[Amadeus] Airport search failed, falling back to database:', amadeusError.message);
        }
      }
      
      // Fallback to local database
      const airports = await storage.searchAirports(query, undefined);
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

  // Search flights endpoint - uses Amadeus API for real flight data
  app.post("/api/flights/search", async (req, res) => {
    try {
      const { fromAirport, toAirport, departureDate, returnDate, passengers, tripType } = req.body;
      
      // Validate required fields (class is now optional, defaults to economy)
      if (!fromAirport || !toAirport || !departureDate || !passengers || !tripType) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Extract departure and destination airport IATA codes
      const fromIataMatch = fromAirport.match(/\(([A-Z]{3})\)/);
      const fromIataCode = fromIataMatch ? fromIataMatch[1] : fromAirport.split(' ')[0];
      
      const toIataMatch = toAirport.match(/\(([A-Z]{3})\)/);
      const toIataCode = toIataMatch ? toIataMatch[1] : toAirport.split(' ')[0];
      
      // Validate IATA codes format (3-letter codes)
      if (!fromIataCode || fromIataCode.length !== 3) {
        return res.status(400).json({ error: "Invalid departure airport code" });
      }
      
      if (!toIataCode || toIataCode.length !== 3) {
        return res.status(400).json({ error: "Invalid destination airport code" });
      }

      // Amadeus API is REQUIRED - no fallback to simulator
      const hasAmadeusKeys = process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET;
      
      if (!hasAmadeusKeys) {
        return res.status(503).json({ 
          error: "Flight search service not configured",
          message: "Amadeus API credentials are required for real flight data"
        });
      }
      
      try {
        // Use Amadeus API for real flight data - NO SIMULATOR FALLBACK
        console.log(`[Amadeus] Searching flights: ${fromIataCode} -> ${toIataCode}`);
        
        const { searchFlights, getAirlineNameFromCode } = await import('./amadeus.js');
          
          // Always use ECONOMY class for simplicity
          const amadeusClass = 'ECONOMY';
          
          // Determine if this is a round-trip search
          const isRoundTrip = (tripType === 'round-trip' || tripType === 'roundtrip') && returnDate;
          
          // Request maximum results from Amadeus (250 is the max allowed)
          console.log('[Amadeus] Requesting maximum flight results (250)...');
          
          const searchResults = await searchFlights({
            originLocationCode: fromIataCode,
            destinationLocationCode: toIataCode,
            departureDate: departureDate,
            returnDate: isRoundTrip ? returnDate : undefined,
            adults: Number(passengers),
            travelClass: amadeusClass,
            nonStop: false, // Allow flights with stops to get more variety
            currencyCode: 'USD',
            max: 250, // Maximum allowed by Amadeus
          });

        console.log(`[Amadeus] Received ${searchResults.data.length} flight offers (${isRoundTrip ? 'round-trip' : 'one-way'})`);

        // If Amadeus returns 0 results, return error
        if (searchResults.data.length === 0) {
          console.log('[Amadeus] No flights found');
          throw new Error('No flights available from Amadeus');
        }

        // Transform ALL Amadeus flight offers to our format with complete information
        const flights: any[] = [];
        
        for (const offer of searchResults.data) {
          // For round-trip, itineraries[0] = outbound, itineraries[1] = return
          // For one-way, only itineraries[0] exists
          const outboundItinerary = offer.itineraries[0];
          const returnItinerary = isRoundTrip ? offer.itineraries[1] : null;
          
          const firstSegment = outboundItinerary.segments[0];
          const lastSegment = outboundItinerary.segments[outboundItinerary.segments.length - 1];
          
          // Get airline info from operating carrier (real airline operating the flight)
          const operatingCarrier = firstSegment.operating?.carrierCode || firstSegment.carrierCode;
          const airlineCode = operatingCarrier;
          const airlineName = getAirlineNameFromCode(airlineCode, searchResults.dictionaries.carriers) || searchResults.dictionaries.carriers[airlineCode] || airlineCode;
          
          // Calculate duration in hours and minutes
          const durationMatch = outboundItinerary.duration.match(/PT(\d+)H(\d+)?M?/);
          const hours = durationMatch ? parseInt(durationMatch[1]) : 0;
          const minutes = durationMatch && durationMatch[2] ? parseInt(durationMatch[2]) : 0;
          const duration = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
          
          // Parse departure and arrival times
          const departureTime = new Date(firstSegment.departure.at).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
          
          const arrivalTime = new Date(lastSegment.arrival.at).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          });
          
          // Calculate number of stops
          const stops = outboundItinerary.segments.length - 1;
          
          // Use EXACT flight prices from Amadeus API (DO NOT ROUND)
          // For round-trip, grandTotal includes BOTH outbound and return flights
          // We split the price approximately in half for display purposes
          const totalPrice = parseFloat(offer.price.grandTotal);
          const originalPrice = isRoundTrip ? totalPrice / 2 : totalPrice;
          const discountedPrice = isRoundTrip ? totalPrice / 2 : totalPrice;
          
          // Debug: Log Amadeus prices to verify uniqueness
          console.log(`[Amadeus Price] ${airlineCode} ${firstSegment.carrierCode}${firstSegment.number}: $${totalPrice} ${offer.price.currency} (${isRoundTrip ? 'round-trip total' : 'one-way'})`);
          
          // Extract ALL segments/stops information with city names
          const segmentsInfo = outboundItinerary.segments.map((seg: any, index: number) => {
            const segAirlineCode = seg.operating?.carrierCode || seg.carrierCode;
            const segAirlineName = getAirlineNameFromCode(segAirlineCode, searchResults.dictionaries.carriers) || searchResults.dictionaries.carriers[segAirlineCode] || segAirlineCode;
            
            // Get city names from Amadeus dictionaries
            const departureCity = searchResults.dictionaries.locations?.[seg.departure.iataCode]?.cityCode || seg.departure.iataCode;
            const arrivalCity = searchResults.dictionaries.locations?.[seg.arrival.iataCode]?.cityCode || seg.arrival.iataCode;
            
            return {
              segmentNumber: index + 1,
              airline: {
                code: segAirlineCode,
                name: segAirlineName
              },
              flightNumber: `${seg.carrierCode}${seg.number}`,
              departure: {
                airport: seg.departure.iataCode,
                city: departureCity,
                terminal: seg.departure.terminal,
                time: new Date(seg.departure.at).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                }),
                dateTime: seg.departure.at
              },
              arrival: {
                airport: seg.arrival.iataCode,
                city: arrivalCity,
                terminal: seg.arrival.terminal,
                time: new Date(seg.arrival.at).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                }),
                dateTime: seg.arrival.at
              },
              duration: seg.duration,
              aircraft: {
                code: seg.aircraft?.code
              }
            };
          });
          
          // Build complete flight object with ALL Amadeus data
          flights.push({
            id: offer.id, // Use Amadeus unique offer ID
            amadeusOfferId: offer.id, // Store for booking reference
            amadeusOffer: offer, // Store complete Amadeus offer for creating reservation after payment
            airline: {
              code: airlineCode,
              name: airlineName,
              logo: `https://images.kiwi.com/airlines/64/${airlineCode}.png`
            },
            flightNumber: `${firstSegment.carrierCode}${firstSegment.number}`,
            departure: {
              airport: fromAirport,
              iataCode: firstSegment.departure.iataCode,
              terminal: firstSegment.departure.terminal,
              time: departureTime,
              date: departureDate,
              dateTime: firstSegment.departure.at
            },
            arrival: {
              airport: toAirport,
              iataCode: lastSegment.arrival.iataCode,
              terminal: lastSegment.arrival.terminal,
              time: arrivalTime,
              date: departureDate,
              dateTime: lastSegment.arrival.at
            },
            duration: duration,
            stops: stops,
            segments: segmentsInfo, // Complete segments information with all stops
            class: 'economy',
            originalPrice: originalPrice, // EXACT price from Amadeus (not rounded)
            discountedPrice: discountedPrice, // EXACT price from Amadeus (not rounded)
            discount: 0,
            currency: offer.price.currency,
            priceBreakdown: {
              base: parseFloat(offer.price.base),
              total: parseFloat(offer.price.total),
              grandTotal: parseFloat(offer.price.grandTotal),
              currency: offer.price.currency
            },
            bookingDetails: {
              validatingAirlines: offer.validatingAirlineCodes,
              lastTicketingDate: offer.lastTicketingDate,
              numberOfBookableSeats: offer.numberOfBookableSeats,
              instantTicketingRequired: offer.instantTicketingRequired
            },
            amenities: {
              wifi: false,
              meals: true,
              entertainment: false,
              power: false,
            },
            returnFlightOptions: null, // Will be populated below if this is a round-trip offer
          });
          
          // Process return flight if this is a round-trip offer
          if (returnItinerary) {
            const currentFlight = flights[flights.length - 1]; // Get the flight we just added
            
            const returnFirstSegment = returnItinerary.segments[0];
            const returnLastSegment = returnItinerary.segments[returnItinerary.segments.length - 1];
            
            const returnAirlineCode = returnFirstSegment.operating?.carrierCode || returnFirstSegment.carrierCode;
            const returnAirlineName = getAirlineNameFromCode(returnAirlineCode, searchResults.dictionaries.carriers) || searchResults.dictionaries.carriers[returnAirlineCode] || returnAirlineCode;
            
            const returnDurationMatch = returnItinerary.duration.match(/PT(\d+)H(\d+)?M?/);
            const returnHours = returnDurationMatch ? parseInt(returnDurationMatch[1]) : 0;
            const returnMinutes = returnDurationMatch && returnDurationMatch[2] ? parseInt(returnDurationMatch[2]) : 0;
            const returnDuration = returnMinutes > 0 ? `${returnHours}h ${returnMinutes}m` : `${returnHours}h`;
            
            const returnDepartureTime = new Date(returnFirstSegment.departure.at).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            });
            
            const returnArrivalTime = new Date(returnLastSegment.arrival.at).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            });
            
            const returnStops = returnItinerary.segments.length - 1;
            // Price is already included in the total offer price (grandTotal includes both ways)
            // We use the same split as outbound (totalPrice / 2)
            const returnBasePrice = totalPrice / 2; // Approximate split
            
            // Extract return flight segments with city names
            const returnSegmentsInfo = returnItinerary.segments.map((seg: any, index: number) => {
              const segAirlineCode = seg.operating?.carrierCode || seg.carrierCode;
              const segAirlineName = getAirlineNameFromCode(segAirlineCode, searchResults.dictionaries.carriers) || searchResults.dictionaries.carriers[segAirlineCode] || segAirlineCode;
              
              const departureCity = searchResults.dictionaries.locations?.[seg.departure.iataCode]?.cityCode || seg.departure.iataCode;
              const arrivalCity = searchResults.dictionaries.locations?.[seg.arrival.iataCode]?.cityCode || seg.arrival.iataCode;
              
              return {
                segmentNumber: index + 1,
                airline: {
                  code: segAirlineCode,
                  name: segAirlineName
                },
                flightNumber: `${seg.carrierCode}${seg.number}`,
                departure: {
                  airport: seg.departure.iataCode,
                  city: departureCity,
                  terminal: seg.departure.terminal,
                  time: new Date(seg.departure.at).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  }),
                  dateTime: seg.departure.at
                },
                arrival: {
                  airport: seg.arrival.iataCode,
                  city: arrivalCity,
                  terminal: seg.arrival.terminal,
                  time: new Date(seg.arrival.at).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  }),
                  dateTime: seg.arrival.at
                },
                duration: seg.duration,
                aircraft: {
                  code: seg.aircraft?.code
                }
              };
            });
            
            currentFlight.returnFlightOptions = [{
              id: `${offer.id}-return`,
              amadeusOfferId: offer.id,
              airline: {
                code: returnAirlineCode,
                name: returnAirlineName,
                logo: `https://images.kiwi.com/airlines/64/${returnAirlineCode}.png`
              },
              flightNumber: `${returnFirstSegment.carrierCode}${returnFirstSegment.number}`,
              departure: {
                airport: toAirport,
                iataCode: returnFirstSegment.departure.iataCode,
                terminal: returnFirstSegment.departure.terminal,
                time: returnDepartureTime,
                date: returnDate!,
                dateTime: returnFirstSegment.departure.at
              },
              arrival: {
                airport: fromAirport,
                iataCode: returnLastSegment.arrival.iataCode,
                terminal: returnLastSegment.arrival.terminal,
                time: returnArrivalTime,
                date: returnDate!,
                dateTime: returnLastSegment.arrival.at
              },
              duration: returnDuration,
              stops: returnStops,
              segments: returnSegmentsInfo, // Complete segments information for return flight
              basePrice: returnBasePrice,
              currency: offer.price.currency,
            }];
          }
        }
        
        console.log(`[Amadeus] Transformed ${flights.length} flight offers with complete data`);

        // Count airlines for logging
        const airlineDistribution = new Map<string, number>();
        for (const flight of flights) {
          const code = flight.airline.code;
          airlineDistribution.set(code, (airlineDistribution.get(code) || 0) + 1);
        }
        
        console.log(`[Amadeus] Airline distribution (${airlineDistribution.size} airlines):`, 
          Array.from(airlineDistribution.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([code, count]) => `${code}: ${count}`)
            .join(', '));

        // Return ALL Amadeus results - NO FILTERING, NO DIVERSIFICATION
        console.log(`[Amadeus] Returning ALL ${flights.length} flight offers to user`);
        
        return res.json({
          flights: flights,
          searchParams: {
            fromAirport,
            toAirport,
            departureDate,
            returnDate,
            passengers,
            tripType,
          },
        });
      } catch (error: any) {
        console.error('[Amadeus] API error:', {
          message: error.message,
          code: error.code,
          description: error.description
        });
        
        // Return error - NO FALLBACK
        return res.status(503).json({ 
          error: "Flight search service unavailable",
          message: "Unable to connect to flight data service. Please check your Amadeus API credentials and try again.",
          details: error.message
        });
      }
    } catch (error: any) {
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

      // Check if Stripe is configured
      if (!stripe) {
        console.warn('[Payment] Stripe not configured - booking created without payment');
        return res.status(201).json({
          booking,
          clientSecret: null,
          paymentGatewayNotConfigured: true,
          message: "Booking created successfully. Payment gateway configuration pending."
        });
      }

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
            console.log('[Payment Success] Payment completed for booking:', bookingId);
            // Note: PNR generation removed - Amadeus Production requires consolidator certification
            // PDFs will use generated confirmation codes instead
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

  // Generate and download booking confirmation PDF
  app.get("/api/bookings/:id/confirmation-pdf", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      const { generateBookingConfirmationPDF } = await import('./pdfGenerator');
      const doc = await generateBookingConfirmationPDF(booking);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=booking-confirmation-${booking.bookingNumber}.pdf`);
      
      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.error("Generate confirmation PDF error:", error);
      res.status(500).json({ error: "Failed to generate confirmation PDF" });
    }
  });

  // Generate and download receipt PDF
  app.get("/api/bookings/:id/receipt-pdf", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      const { generateReceiptPDF } = await import('./pdfGenerator');
      const paymentMethod = req.query.paymentMethod as string || 'Card';
      const doc = await generateReceiptPDF(booking, paymentMethod);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=receipt-${booking.bookingNumber}.pdf`);
      
      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.error("Generate receipt PDF error:", error);
      res.status(500).json({ error: "Failed to generate receipt PDF" });
    }
  });

  // Send payment confirmation email with PDFs
  app.post("/api/bookings/:id/send-confirmation-email", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      
      const { sendPaymentConfirmationEmail } = await import('./emailService');
      const domain = process.env.REPLIT_DEV_DOMAIN || req.get('host');
      const protocol = req.protocol;
      const baseUrl = `${protocol}://${domain}`;
      
      await sendPaymentConfirmationEmail({
        booking,
        pdfLinks: {
          confirmationPdfUrl: `${baseUrl}/api/bookings/${booking.id}/confirmation-pdf`,
          receiptPdfUrl: `${baseUrl}/api/bookings/${booking.id}/receipt-pdf?paymentMethod=${req.body.paymentMethod || 'Card'}`,
        },
      });
      
      res.json({ success: true, message: "Confirmation email sent successfully" });
    } catch (error) {
      console.error("Send confirmation email error:", error);
      res.status(500).json({ error: "Failed to send confirmation email" });
    }
  });

  // Test endpoint to generate booking with form data for PDF preview (DEVELOPMENT ONLY)
  app.post("/api/test/generate-booking", async (req, res) => {
    // Restrict to development environment only
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: "Test endpoints are disabled in production" });
    }
    
    try {
      const { customerInfo, flightData, searchParams } = req.body;
      
      // Use form data to create test booking
      const testBooking = {
        bookingNumber: `TEST${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        customerInfo,
        flightData,
        searchParams,
        totalPrice: (parseInt(searchParams.passengers) || 1) * 15,
        totalFlightPrice: flightData.originalPrice * (parseInt(searchParams.passengers) || 1),
        status: "completed",
        paymentIntentId: "test_payment_intent",
        createdAt: new Date().toISOString()
      };

      // Save the test booking
      const savedBooking = await storage.createBooking(testBooking as any);
      
      res.json({ 
        success: true, 
        bookingId: savedBooking.id,
        message: "Test booking created successfully"
      });
    } catch (error) {
      console.error("Generate test booking error:", error);
      res.status(500).json({ error: "Failed to generate test booking" });
    }
  });

  // PayPal integration routes (from blueprint:javascript_paypal)
  app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/paypal/order", async (req, res) => {
    // Request body should contain: { intent, amount, currency }
    await createPaypalOrder(req, res);
  });

  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  const httpServer = createServer(app);
  return httpServer;
}
