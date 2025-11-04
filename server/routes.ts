import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuoteSchema, insertBookingSchema } from "@shared/schema";
import { getAllowedAirlinesForRoute } from "@shared/airlineSegmentation";
import { z } from "zod";
import Stripe from "stripe";

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

  // Search flights endpoint - uses Amadeus API for real flight data
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

      // Check if Amadeus API is configured
      const hasAmadeusKeys = process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET;
      let useAmadeus = false;
      
      if (hasAmadeusKeys) {
        try {
          // Use Amadeus API for real flight data
          console.log(`[Amadeus] Searching flights: ${fromIataCode} -> ${toIataCode}`);
          
          const { searchFlights, getAirlineNameFromCode } = await import('./amadeus.js');
          
          // Map flight class to Amadeus format
          const travelClassMap: Record<string, 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'> = {
            'economy': 'ECONOMY',
            'premium_economy': 'PREMIUM_ECONOMY',
            'business': 'BUSINESS',
            'first': 'FIRST',
          };
          
          const amadeusClass = travelClassMap[flightClass] || 'ECONOMY';
          
          // Search outbound flights
          const outboundResults = await searchFlights({
          originLocationCode: fromIataCode,
          destinationLocationCode: toIataCode,
          departureDate: departureDate,
          adults: Number(passengers),
          travelClass: amadeusClass,
          nonStop: false,
          currencyCode: 'USD',
          max: 50,
        });

        console.log(`[Amadeus] Found ${outboundResults.data.length} outbound flights`);

        // If Amadeus returns 0 results, fall back to simulated flights
        if (outboundResults.data.length === 0) {
          console.log('[Amadeus] No flights found, falling back to simulated flights');
          throw new Error('No flights available from Amadeus');
        }

        // Search return flights if round-trip
        let returnResults: any = null;
        if ((tripType === 'round-trip' || tripType === 'roundtrip') && returnDate) {
          returnResults = await searchFlights({
            originLocationCode: toIataCode,
            destinationLocationCode: fromIataCode,
            departureDate: returnDate,
            adults: Number(passengers),
            travelClass: amadeusClass,
            nonStop: false,
            currencyCode: 'USD',
            max: 50,
          });
          console.log(`[Amadeus] Found ${returnResults.data.length} return flights`);
        }

        // Transform Amadeus data to our format
        const flights: any[] = [];
        
        for (const offer of outboundResults.data.slice(0, 10)) {
          const firstItinerary = offer.itineraries[0];
          const firstSegment = firstItinerary.segments[0];
          const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1];
          
          // Get airline info
          const airlineCode = firstSegment.carrierCode;
          const airlineName = getAirlineNameFromCode(airlineCode, outboundResults.dictionaries.carriers) || outboundResults.dictionaries.carriers[airlineCode] || airlineCode;
          
          // Calculate duration in hours and minutes
          const durationMatch = firstItinerary.duration.match(/PT(\d+)H(\d+)?M?/);
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
          const stops = firstItinerary.segments.length - 1;
          
          // Get price
          const basePrice = parseFloat(offer.price.total);
          const originalPrice = basePrice;
          const discountedPrice = basePrice; // No discount applied
          
          // Prepare return flight options if round-trip
          let returnFlightOptions: any[] | null = null;
          if (returnResults && returnResults.data.length > 0) {
            returnFlightOptions = returnResults.data.slice(0, 3).map((returnOffer: any) => {
              const returnItinerary = returnOffer.itineraries[0];
              const returnFirstSegment = returnItinerary.segments[0];
              const returnLastSegment = returnItinerary.segments[returnItinerary.segments.length - 1];
              
              const returnAirlineCode = returnFirstSegment.carrierCode;
              const returnAirlineName = getAirlineNameFromCode(returnAirlineCode, returnResults.dictionaries.carriers) || returnResults.dictionaries.carriers[returnAirlineCode] || returnAirlineCode;
              
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
              const returnBasePrice = parseFloat(returnOffer.price.total); // No discount applied
              
              return {
                id: `${returnAirlineCode}-${returnFirstSegment.number}-${returnDate}`,
                airline: {
                  code: returnAirlineCode,
                  name: returnAirlineName,
                  logo: `https://images.kiwi.com/airlines/64/${returnAirlineCode}.png`
                },
                flightNumber: `${returnAirlineCode}${returnFirstSegment.number}`,
                departure: {
                  airport: toAirport,
                  time: returnDepartureTime,
                  date: returnDate,
                },
                arrival: {
                  airport: fromAirport,
                  time: returnArrivalTime,
                  date: returnDate,
                },
                duration: returnDuration,
                stops: returnStops,
                basePrice: returnBasePrice,
              };
            });
          }
          
          flights.push({
            id: `${airlineCode}-${firstSegment.number}-${departureDate}`,
            airline: {
              code: airlineCode,
              name: airlineName,
              logo: `https://images.kiwi.com/airlines/64/${airlineCode}.png`
            },
            flightNumber: `${airlineCode}${firstSegment.number}`,
            departure: {
              airport: fromAirport,
              time: departureTime,
              date: departureDate,
            },
            arrival: {
              airport: toAirport,
              time: arrivalTime,
              date: departureDate,
            },
            duration: duration,
            stops: stops,
            class: flightClass,
            originalPrice: Math.round(originalPrice),
            discountedPrice: Math.round(discountedPrice),
            discount: 0,
            amenities: {
              wifi: basePrice > 400,
              meals: basePrice > 300,
              entertainment: basePrice > 500,
              power: basePrice > 350,
            },
            returnFlightOptions: returnFlightOptions,
          });
        }

          useAmadeus = true;
          return res.json({
            flights: flights,
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
          console.error('[Amadeus] API error, falling back to simulated flights:', {
            message: error.message,
            code: error.code,
            description: error.description
          });
          // Continue to fallback (simulated flights)
        }
      }

      // FALLBACK: Use simulated flights if Amadeus is not configured or failed
      if (!useAmadeus) {
        console.log(`[Flight Search] Using simulated flights${hasAmadeusKeys ? ' (Amadeus failed)' : ' (Amadeus not configured)'}`);
        const { findSimulatedFlights, generateFlightTimes, applyPriceVariation } = await import('./simulatedFlights.js');
      const { getOriginCityInfo } = await import('./internationalOriginCities.js');
      const { calculateFlightStops } = await import('./flightStopsCalculator.js');
      
      // Search for simulated routes matching this origin-destination pair
      let simulatedRoutes = findSimulatedFlights(fromIataCode, toIataCode);

      console.log(`[Flight Search] Route: ${fromIataCode} -> ${toIataCode}`);
      console.log(`[Flight Search] Found ${simulatedRoutes.length} direct simulated routes`);

      // If no routes found, try to find routes from reference hubs (JFK for east, LAX for west, ORD for central)
      const isUSAOrigin = departureAirport.country === 'United States' || departureAirport.country === 'USA';
      const isInternationalDestination = destinationAirport.country !== 'United States' && destinationAirport.country !== 'USA';
      
      if (simulatedRoutes.length === 0 && isUSAOrigin) {
        const originInfo = getOriginCityInfo(fromIataCode);
        
        if (originInfo && isInternationalDestination) {
          // This is an international flight from a city that might have connections
          let referenceHub: string;
          let hubRoutes: any[] = [];
          
          if (originInfo.coast === 'east') {
            referenceHub = 'JFK';
            hubRoutes = findSimulatedFlights(referenceHub, toIataCode);
          } else if (originInfo.coast === 'west') {
            referenceHub = 'LAX';
            hubRoutes = findSimulatedFlights(referenceHub, toIataCode);
          } else {
            // Central - try JFK first (for Europe, Africa, Middle East), then LAX (for Asia, Oceania)
            referenceHub = 'JFK';
            hubRoutes = findSimulatedFlights(referenceHub, toIataCode);
            if (hubRoutes.length === 0) {
              referenceHub = 'LAX';
              hubRoutes = findSimulatedFlights(referenceHub, toIataCode);
            }
          }
          
          if (hubRoutes.length > 0) {
            // Adapt routes from hub to this city
            simulatedRoutes = hubRoutes.map(route => ({
              ...route,
              from: fromIataCode,
              // Adjust price slightly for connection
              basePrice: route.basePrice * 1.15, // 15% more for connection
              // Adjust duration for connection
              duration: route.duration.replace(/(\d+)h/, (_match: string, hours: string) => `${parseInt(hours) + 2}h`), // Add 2 hours
            }));
            console.log(`[Flight Search] Using ${simulatedRoutes.length} routes from ${referenceHub} hub with connection`);
          }
        }
      }

      // If still no routes found, return no flights available
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

      // === ROUND-TRIP SUPPORT ===
      // Search for return flights if trip is round-trip
      let returnRoutes: any[] = [];
      if ((tripType === 'round-trip' || tripType === 'roundtrip') && returnDate) {
        returnRoutes = findSimulatedFlights(toIataCode, fromIataCode);
        
        // If no direct return routes, try hub connections
        // CRITICAL: For return flights, we need toIataCode (international) → hub → fromIataCode (USA)
        const isUSAOrigin = departureAirport.country === 'United States' || departureAirport.country === 'USA';
        const isInternationalDestination = destinationAirport.country !== 'United States' && destinationAirport.country !== 'USA';
        
        if (returnRoutes.length === 0 && isUSAOrigin && isInternationalDestination) {
          // Return flights need to go FROM international destination TO USA
          // Try both major hubs (JFK for east coast final dest, LAX for west coast final dest)
          let referenceHub: string;
          let hubRoutes: any[] = [];
          
          // Determine hub based on USA FINAL destination (fromIataCode)
          const finalDestInfo = getOriginCityInfo(fromIataCode);
          
          if (finalDestInfo && finalDestInfo.coast === 'west') {
            // Final destination is west coast USA, use LAX hub
            referenceHub = 'LAX';
            hubRoutes = findSimulatedFlights(toIataCode, referenceHub);
            
            // If no LAX routes, try JFK as fallback
            if (hubRoutes.length === 0) {
              referenceHub = 'JFK';
              hubRoutes = findSimulatedFlights(toIataCode, referenceHub);
            }
          } else {
            // Final destination is east/central USA, use JFK hub
            referenceHub = 'JFK';
            hubRoutes = findSimulatedFlights(toIataCode, referenceHub);
            
            // If no JFK routes, try LAX as fallback
            if (hubRoutes.length === 0) {
              referenceHub = 'LAX';
              hubRoutes = findSimulatedFlights(toIataCode, referenceHub);
            }
          }
          
          if (hubRoutes.length > 0) {
            // Construct proper return routes: International → Hub → Final USA destination
            returnRoutes = hubRoutes.map(route => ({
              ...route,
              from: toIataCode, // FROM international destination
              to: fromIataCode, // TO USA origin (final destination)
              // countries remain unchanged: route goes International → USA (correct for returns)
              basePrice: route.basePrice * 1.15, // 15% more for connection
              duration: route.duration.replace(/(\d+)h/, (_match: string, hours: string) => `${parseInt(hours) + 2}h`), // Add 2 hours
            }));
            console.log(`[Flight Search] Using ${returnRoutes.length} return routes from ${referenceHub} hub with connection`);
          }
        }
        
        console.log(`[Flight Search] Return Route: ${toIataCode} -> ${fromIataCode}`);
        console.log(`[Flight Search] Found ${returnRoutes.length} return routes`);
      }

      // Generate flights from simulated routes with price variations
      // Each route already has the correct airline based on manual segmentation
      const flights: any[] = [];
      
      const classMultipliers: Record<string, number> = {
        'economy': 1,
        'premium_economy': 1.5,
        'business': 2.5,
        'first': 4.0,
      };
      
      for (const route of simulatedRoutes) {
        const flightTimes = generateFlightTimes(route, departureDate);
        
        for (const flightTime of flightTimes) {
          // Apply price variation and class multipliers
          let outboundBasePrice = applyPriceVariation(route.basePrice);
          outboundBasePrice = outboundBasePrice * (classMultipliers[flightClass] || 1);
          
          // Get airline info
          const airlineObj = ALL_AIRLINES[route.airline] || {
            code: route.airlineCode,
            name: route.airline,
            logo: `https://images.kiwi.com/airlines/64/${route.airlineCode}.png`
          };
          
          // === ROUND-TRIP PRICING ===
          // For round-trip: generate return flight options and calculate combined price
          let returnFlightOptions: any[] = [];
          
          if ((tripType === 'round-trip' || tripType === 'roundtrip') && returnRoutes.length > 0 && returnDate) {
            console.log(`[Return Flights] Processing return flights. returnRoutes: ${returnRoutes.length}`);
            // Generate up to 3 return flight options per outbound flight
            const selectedReturnRoutes = returnRoutes.slice(0, 3);
            
            for (const returnRoute of selectedReturnRoutes) {
              const returnFlightTimes = generateFlightTimes(returnRoute, returnDate);
              const returnFlightTime = returnFlightTimes[0]; // Take first return time
              
              if (returnFlightTime) {
                let returnBasePrice = applyPriceVariation(returnRoute.basePrice);
                returnBasePrice = returnBasePrice * (classMultipliers[flightClass] || 1);
                
                const returnAirlineObj = ALL_AIRLINES[returnRoute.airline] || {
                  code: returnRoute.airlineCode,
                  name: returnRoute.airline,
                  logo: `https://images.kiwi.com/airlines/64/${returnRoute.airlineCode}.png`
                };
                
                returnFlightOptions.push({
                  id: `${returnRoute.airlineCode}-${returnFlightTime.flightNumber}-${returnDate}`,
                  airline: returnAirlineObj,
                  flightNumber: returnFlightTime.flightNumber,
                  departure: {
                    airport: toAirport,
                    time: returnFlightTime.departureTime,
                    date: returnDate,
                  },
                  arrival: {
                    airport: fromAirport,
                    time: returnFlightTime.arrivalTime,
                    date: returnDate,
                  },
                  duration: returnRoute.duration,
                  stops: calculateFlightStops(returnRoute.duration, returnRoute.countries.from, returnRoute.countries.to, returnRoute.airlineCode).stops,
                  basePrice: returnBasePrice,
                });
              }
            }
            console.log(`[Return Flights] Generated ${returnFlightOptions.length} return flight options`);
          }
          
          // Calculate total price
          let originalPrice: number;
          let discountedPrice: number;
          
          if ((tripType === 'round-trip' || tripType === 'roundtrip') && returnFlightOptions.length > 0) {
            // Use the cheapest return flight for pricing
            const cheapestReturn = returnFlightOptions.reduce((min, flight) => 
              flight.basePrice < min.basePrice ? flight : min
            );
            
            // Sum outbound + return for total price
            const totalPrice = outboundBasePrice + cheapestReturn.basePrice;
            originalPrice = totalPrice;
            discountedPrice = totalPrice; // No discount applied
          } else {
            // One-way pricing
            originalPrice = outboundBasePrice;
            discountedPrice = outboundBasePrice; // No discount applied
          }
          
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
              date: departureDate,
            },
            duration: route.duration,
            stops: calculateFlightStops(route.duration, route.countries.from, route.countries.to, route.airlineCode).stops,
            class: flightClass,
            originalPrice: Math.round(originalPrice),
            discountedPrice: Math.round(discountedPrice),
            discount: 0,
            amenities: {
              wifi: originalPrice > 400,
              meals: originalPrice > 300,
              entertainment: originalPrice > 500,
              power: originalPrice > 350,
            },
            returnFlightOptions: (tripType === 'round-trip' || tripType === 'roundtrip') ? returnFlightOptions : null,
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
      }
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
