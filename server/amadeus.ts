// @ts-ignore - Amadeus doesn't have TypeScript definitions
import Amadeus from 'amadeus';

// Initialize Amadeus client
// Use 'production' for production credentials (real flight data)
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY || '',
  clientSecret: process.env.AMADEUS_API_SECRET || '',
  hostname: 'production', // Using production environment for real flight data
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

// Airline code to name mapping (Oneworld and Alaska Mileage Plan partner airlines)
export const AIRLINE_CODE_TO_NAME: Record<string, string> = {
  // Primary carriers
  'AS': 'Alaska Airlines',
  'AA': 'American Airlines',
  
  // Oneworld alliance partners
  'BA': 'British Airways',
  'CX': 'Cathay Pacific',
  'AY': 'Finnair',
  'IB': 'Iberia', // Note: Currently earn-only, not available for redemption
  'JL': 'Japan Airlines',
  'MH': 'Malaysia Airlines',
  'WY': 'Oman Air',
  'QF': 'Qantas',
  'QR': 'Qatar Airways',
  'AT': 'Royal Air Maroc',
  'RJ': 'Royal Jordanian',
  'FJ': 'Fiji Airways',
  
  // Non-Oneworld partners
  'EI': 'Aer Lingus',
  'HA': 'Hawaiian Airlines',
  'FI': 'Icelandair',
  'DE': 'Condor',
  'JX': 'Starlux Airlines',
  'KE': 'Korean Air',
  'PR': 'Philippine Airlines',
  
  // Common regional and feeder airlines (for connections)
  'DL': 'Delta Air Lines',
  'UA': 'United Airlines',
  'WN': 'Southwest Airlines',
  '9E': 'Endeavor Air',
  'YV': 'Mesa Airlines',
  'G4': 'Allegiant Air',
  'NK': 'Spirit Airlines',
  'F9': 'Frontier Airlines',
  'B6': 'JetBlue Airways',
  'SY': 'Sun Country Airlines',
  'QX': 'Horizon Air',
  'OO': 'SkyWest Airlines',
  'MQ': 'Envoy Air',
  'YX': 'Republic Airways',
  'OH': 'PSA Airlines',
  'PT': 'West Air Sweden',
  'LH': 'Lufthansa',
  'AF': 'Air France',
  'KL': 'KLM',
  'AZ': 'ITA Airways',
  'SK': 'SAS Scandinavian Airlines',
  'LX': 'Swiss International Air Lines',
  'OS': 'Austrian Airlines',
  'SN': 'Brussels Airlines',
  'TP': 'TAP Air Portugal',
  'UX': 'Air Europa',
  'VY': 'Vueling',
  'I2': 'Iberia Express',
  'LA': 'LATAM Airlines',
  'CM': 'Copa Airlines',
  'AM': 'Aeromexico',
  'AV': 'Avianca',
  'AR': 'Aerolineas Argentinas',
  'G3': 'GOL Airlines',
};

// Reverse mapping: name to code (for filtering)
export const AIRLINE_NAME_TO_CODE: Record<string, string> = Object.entries(AIRLINE_CODE_TO_NAME).reduce((acc, [code, name]) => {
  acc[name] = code;
  return acc;
}, {} as Record<string, string>);

// Function to get airline name from code (with fallback to dictionaries)
export function getAirlineNameFromCode(code: string, dictionaries?: Record<string, string>): string | null {
  // First try our mapping
  if (AIRLINE_CODE_TO_NAME[code]) {
    return AIRLINE_CODE_TO_NAME[code];
  }
  
  // Then try Amadeus dictionaries
  if (dictionaries && dictionaries[code]) {
    return dictionaries[code];
  }
  
  return null;
}

// Function to get airline code from name
export function getAirlineCodeFromName(name: string): string | null {
  return AIRLINE_NAME_TO_CODE[name] || null;
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

// Search for airports and cities using Amadeus API
export interface AmadeusLocation {
  type: string;
  subType: string;
  name: string;
  detailedName: string;
  iataCode: string;
  address?: {
    cityName?: string;
    cityCode?: string;
    countryName?: string;
    countryCode?: string;
    stateCode?: string;
    regionCode?: string;
  };
  geoCode?: {
    latitude: number;
    longitude: number;
  };
  timeZoneOffset?: string;
}

export interface AmadeusLocationSearchResponse {
  data: AmadeusLocation[];
  meta?: {
    count: number;
    links?: {
      self: string;
      next?: string;
      previous?: string;
      last?: string;
      first?: string;
    };
  };
}

export async function searchAirports(keyword: string, limit: number = 50): Promise<AmadeusLocation[]> {
  try {
    if (keyword.length < 1) {
      return [];
    }

    console.log(`[Amadeus] Searching airports with keyword: ${keyword}`);
    
    const response = await amadeus.referenceData.locations.get({
      keyword: keyword,
      subType: 'AIRPORT,CITY',
      'page[limit]': limit.toString(),
      sort: 'analytics.travelers.score',
      view: 'FULL'
    });
    
    console.log(`[Amadeus] Airport search response received`);
    
    // Validate response structure
    if (!response || !response.data) {
      console.error('[Amadeus] Invalid response structure:', response);
      throw new Error('Invalid response from Amadeus API');
    }
    
    // Handle different response structures
    const locations = response.data.data || response.data || [];
    console.log(`[Amadeus] Found ${locations.length} locations`);
    
    return locations as AmadeusLocation[];
  } catch (error: any) {
    console.error('[Amadeus] Airport search error:', error.message);
    
    if (error.response) {
      console.error('[Amadeus] Error response:', JSON.stringify(error.response, null, 2));
    }
    
    throw new Error(`Failed to search airports: ${error.message || 'Unknown error'}`);
  }
}

export default amadeus;
