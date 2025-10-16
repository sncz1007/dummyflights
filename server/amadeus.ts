// @ts-ignore - Amadeus doesn't have TypeScript definitions
import Amadeus from 'amadeus';

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY || '',
  clientSecret: process.env.AMADEUS_API_SECRET || '',
  hostname: 'test', // Use 'production' when ready to go live
});

export interface AmadeusFlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      arrival: {
        iataCode: string;
        terminal?: string;
        at: string;
      };
      carrierCode: string;
      number: string;
      aircraft: {
        code: string;
      };
      operating?: {
        carrierCode: string;
      };
      duration: string;
      id: string;
      numberOfStops: number;
      blacklistedInEU: boolean;
    }>;
  }>;
  price: {
    currency: string;
    total: string;
    base: string;
    fees: Array<{
      amount: string;
      type: string;
    }>;
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: Array<{
    travelerId: string;
    fareOption: string;
    travelerType: string;
    price: {
      currency: string;
      total: string;
      base: string;
    };
    fareDetailsBySegment: Array<{
      segmentId: string;
      cabin: string;
      fareBasis: string;
      brandedFare?: string;
      class: string;
      includedCheckedBags: {
        quantity: number;
      };
    }>;
  }>;
}

export interface AmadeusSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  adults: number;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  nonStop?: boolean;
  currencyCode?: string;
  max?: number;
}

export interface AmadeusSearchResponse {
  data: AmadeusFlightOffer[];
  dictionaries: {
    carriers: Record<string, string>;
    aircraft: Record<string, string>;
    currencies: Record<string, string>;
    locations: Record<string, any>;
  };
  meta: {
    count: number;
    links: {
      self: string;
    };
  };
}

// Airline code to name mapping (Oneworld and partner airlines)
export const AIRLINE_CODE_TO_NAME: Record<string, string> = {
  'AS': 'Alaska Airlines',
  'AA': 'American Airlines',
  'BA': 'British Airways',
  'CX': 'Cathay Pacific',
  'AY': 'Finnair',
  'IB': 'Iberia',
  'QF': 'Qantas',
  'QR': 'Qatar Airways',
  'AT': 'Royal Air Maroc',
  'EI': 'Aer Lingus',
  'FJ': 'Fiji Airways',
  'HA': 'Hawaiian Airlines',
  'FI': 'Icelandair',
  'DE': 'Condor',
  'JX': 'Starlux Airlines',
};

// Function to get airline name from code
export function getAirlineNameFromCode(code: string): string | null {
  return AIRLINE_CODE_TO_NAME[code] || null;
}

// Search for flights using Amadeus API
export async function searchFlights(params: AmadeusSearchParams): Promise<AmadeusSearchResponse> {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      adults: params.adults.toString(),
      travelClass: params.travelClass || 'ECONOMY',
      nonStop: params.nonStop ? 'true' : 'false',
      currencyCode: params.currencyCode || 'USD',
      max: (params.max || 20).toString(),
    });
    
    // The SDK returns the response in response.data
    // But response.data is already the AmadeusSearchResponse
    return response.data as AmadeusSearchResponse;
  } catch (error: any) {
    console.error('Amadeus API error:', error);
    
    // If it's a 400 error with response data, log it for debugging
    if (error.response) {
      console.error('Amadeus error response:', JSON.stringify(error.response, null, 2));
    }
    
    throw new Error(`Failed to search flights: ${error.message || 'Unknown error'}`);
  }
}

export default amadeus;
