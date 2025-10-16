// Airline segmentation rules by region

export type Region = 
  | 'domestic_usa'
  | 'americas'
  | 'iberia'
  | 'central_europe'
  | 'eastern_europe'
  | 'nordic'
  | 'russia'
  | 'uk'
  | 'middle_east'
  | 'oceania'
  | 'africa'
  | 'asia';

// Airlines allowed per region (in priority order)
export const REGIONAL_AIRLINES: Record<Region, string[]> = {
  domestic_usa: ['Alaska Airlines', 'American Airlines'],
  americas: ['American Airlines', 'Alaska Airlines'],
  iberia: ['American Airlines', 'Royal Air Maroc', 'Iberia', 'Aer Lingus', 'Qatar Airways'],
  central_europe: ['American Airlines', 'Qatar Airways', 'Royal Air Maroc', 'Aer Lingus'],
  eastern_europe: ['Qatar Airways', 'Finnair', 'Aer Lingus', 'Condor'],
  nordic: ['Finnair', 'Icelandair'],
  russia: ['Alaska Airlines', 'American Airlines'],
  uk: ['American Airlines', 'British Airways'],
  middle_east: ['Qatar Airways', 'Royal Air Maroc'],
  oceania: ['American Airlines', 'Qantas'],
  africa: ['Qatar Airways', 'Royal Air Maroc'],
  asia: ['American Airlines', 'Hawaiian Airlines', 'Qatar Airways', 'Qantas', 'Starlux Airlines']
};

// Country to region mapping (ISO 3166-1 alpha-2 codes)
export const COUNTRY_TO_REGION: Record<string, Region> = {
  // USA (domestic)
  'US': 'domestic_usa',
  
  // Americas
  'CA': 'americas', // Canada
  'MX': 'americas', // Mexico
  'BR': 'americas', // Brazil
  'AR': 'americas', // Argentina
  'CL': 'americas', // Chile
  'CO': 'americas', // Colombia
  'PE': 'americas', // Peru
  'VE': 'americas', // Venezuela
  'EC': 'americas', // Ecuador
  'CR': 'americas', // Costa Rica
  'PA': 'americas', // Panama
  'GT': 'americas', // Guatemala
  'DO': 'americas', // Dominican Republic
  'CU': 'americas', // Cuba
  'JM': 'americas', // Jamaica
  'BS': 'americas', // Bahamas
  'TT': 'americas', // Trinidad and Tobago
  'UY': 'americas', // Uruguay
  'PY': 'americas', // Paraguay
  'BO': 'americas', // Bolivia
  
  // Iberian Countries (Spain, Portugal, France)
  'ES': 'iberia', // Spain
  'PT': 'iberia', // Portugal
  'FR': 'iberia', // France
  'AD': 'iberia', // Andorra
  
  // Central Europe (Germany, Switzerland, Italy, Austria, Belgium, Netherlands, Luxembourg)
  'DE': 'central_europe', // Germany
  'CH': 'central_europe', // Switzerland
  'IT': 'central_europe', // Italy
  'AT': 'central_europe', // Austria
  'BE': 'central_europe', // Belgium
  'NL': 'central_europe', // Netherlands
  'LU': 'central_europe', // Luxembourg
  'LI': 'central_europe', // Liechtenstein
  
  // Eastern Europe
  'PL': 'eastern_europe', // Poland
  'CZ': 'eastern_europe', // Czech Republic
  'SK': 'eastern_europe', // Slovakia
  'HU': 'eastern_europe', // Hungary
  'RO': 'eastern_europe', // Romania
  'BG': 'eastern_europe', // Bulgaria
  'SI': 'eastern_europe', // Slovenia
  'HR': 'eastern_europe', // Croatia
  'RS': 'eastern_europe', // Serbia
  'BA': 'eastern_europe', // Bosnia
  'ME': 'eastern_europe', // Montenegro
  'MK': 'eastern_europe', // North Macedonia
  'AL': 'eastern_europe', // Albania
  'GR': 'eastern_europe', // Greece
  'EE': 'eastern_europe', // Estonia
  'LV': 'eastern_europe', // Latvia
  'LT': 'eastern_europe', // Lithuania
  
  // Nordic Countries
  'SE': 'nordic', // Sweden
  'FI': 'nordic', // Finland
  'NO': 'nordic', // Norway
  'DK': 'nordic', // Denmark
  'IS': 'nordic', // Iceland
  
  // Russia
  'RU': 'russia',
  
  // United Kingdom & Ireland
  'GB': 'uk', // United Kingdom
  'IE': 'uk', // Ireland (with UK for airline purposes)
  
  // Middle East
  'AE': 'middle_east', // UAE
  'QA': 'middle_east', // Qatar
  'SA': 'middle_east', // Saudi Arabia
  'OM': 'middle_east', // Oman
  'KW': 'middle_east', // Kuwait
  'BH': 'middle_east', // Bahrain
  'JO': 'middle_east', // Jordan
  'LB': 'middle_east', // Lebanon
  'IL': 'middle_east', // Israel
  'IQ': 'middle_east', // Iraq
  'SY': 'middle_east', // Syria
  'YE': 'middle_east', // Yemen
  
  // Oceania
  'AU': 'oceania', // Australia
  'NZ': 'oceania', // New Zealand
  'FJ': 'oceania', // Fiji
  'PG': 'oceania', // Papua New Guinea
  'NC': 'oceania', // New Caledonia
  'PF': 'oceania', // French Polynesia
  
  // Africa
  'MA': 'africa', // Morocco
  'EG': 'africa', // Egypt
  'ZA': 'africa', // South Africa
  'NG': 'africa', // Nigeria
  'KE': 'africa', // Kenya
  'ET': 'africa', // Ethiopia
  'TN': 'africa', // Tunisia
  'DZ': 'africa', // Algeria
  'GH': 'africa', // Ghana
  'TZ': 'africa', // Tanzania
  'UG': 'africa', // Uganda
  'SN': 'africa', // Senegal
  'CI': 'africa', // Ivory Coast
  'CM': 'africa', // Cameroon
  'AO': 'africa', // Angola
  'RW': 'africa', // Rwanda
  
  // Asia
  'CN': 'asia', // China
  'JP': 'asia', // Japan
  'KR': 'asia', // South Korea
  'TW': 'asia', // Taiwan
  'HK': 'asia', // Hong Kong
  'SG': 'asia', // Singapore
  'TH': 'asia', // Thailand
  'VN': 'asia', // Vietnam
  'MY': 'asia', // Malaysia
  'ID': 'asia', // Indonesia
  'PH': 'asia', // Philippines
  'IN': 'asia', // India
  'PK': 'asia', // Pakistan
  'BD': 'asia', // Bangladesh
  'LK': 'asia', // Sri Lanka
  'NP': 'asia', // Nepal
  'KH': 'asia', // Cambodia
  'LA': 'asia', // Laos
  'MM': 'asia', // Myanmar
  'MN': 'asia', // Mongolia
};

// Country name to ISO code mapping
export const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  'USA': 'US',
  'United States': 'US',
  'Canada': 'CA',
  'Mexico': 'MX',
  'Brazil': 'BR',
  'Argentina': 'AR',
  'Chile': 'CL',
  'Colombia': 'CO',
  'Peru': 'PE',
  'Venezuela': 'VE',
  'Ecuador': 'EC',
  'Costa Rica': 'CR',
  'Panama': 'PA',
  'Guatemala': 'GT',
  'Dominican Republic': 'DO',
  'Cuba': 'CU',
  'Jamaica': 'JM',
  'Spain': 'ES',
  'Portugal': 'PT',
  'France': 'FR',
  'Germany': 'DE',
  'Switzerland': 'CH',
  'Italy': 'IT',
  'Austria': 'AT',
  'Belgium': 'BE',
  'Netherlands': 'NL',
  'Poland': 'PL',
  'Czech Republic': 'CZ',
  'Czechia': 'CZ',
  'Sweden': 'SE',
  'Finland': 'FI',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Iceland': 'IS',
  'Russia': 'RU',
  'United Kingdom': 'GB',
  'UK': 'GB',
  'Ireland': 'IE',
  'UAE': 'AE',
  'United Arab Emirates': 'AE',
  'Qatar': 'QA',
  'Saudi Arabia': 'SA',
  'Oman': 'OM',
  'Kuwait': 'KW',
  'Australia': 'AU',
  'New Zealand': 'NZ',
  'Fiji': 'FJ',
  'Morocco': 'MA',
  'Egypt': 'EG',
  'South Africa': 'ZA',
  'Nigeria': 'NG',
  'Kenya': 'KE',
  'China': 'CN',
  'Japan': 'JP',
  'South Korea': 'KR',
  'Korea': 'KR',
  'Taiwan': 'TW',
  'Hong Kong': 'HK',
  'Singapore': 'SG',
  'Thailand': 'TH',
  'Vietnam': 'VN',
  'Malaysia': 'MY',
  'Indonesia': 'ID',
  'Philippines': 'PH',
  'India': 'IN',
  'Pakistan': 'PK',
  'Bangladesh': 'BD',
  'Sri Lanka': 'LK',
};

// Helper function to normalize country input to ISO code
function normalizeCountryToCode(country: string): string {
  const upperCountry = country.toUpperCase();
  
  // Check if it's already a 2-letter code
  if (country.length === 2 && COUNTRY_TO_REGION[upperCountry]) {
    return upperCountry;
  }
  
  // Check country name mapping
  const code = COUNTRY_NAME_TO_CODE[country];
  if (code) {
    return code;
  }
  
  // Return as-is if not found (fallback)
  return upperCountry;
}

// Helper function to determine region from country code or name
export function getRegionFromCountry(country: string): Region | null {
  const countryCode = normalizeCountryToCode(country);
  return COUNTRY_TO_REGION[countryCode] || null;
}

// Helper function to check if two locations are both in USA (domestic)
export function isDomesticUSA(fromCountry: string, toCountry: string): boolean {
  const from = normalizeCountryToCode(fromCountry);
  const to = normalizeCountryToCode(toCountry);
  return from === 'US' && to === 'US';
}

// Helper function to get allowed airlines for a route
export function getAllowedAirlinesForRoute(fromCountry: string, toCountry: string): string[] {
  // Normalize country inputs first
  const fromCode = normalizeCountryToCode(fromCountry);
  const toCode = normalizeCountryToCode(toCountry);
  
  // Domestic USA flight
  if (fromCode === 'US' && toCode === 'US') {
    return REGIONAL_AIRLINES.domestic_usa;
  }
  
  // International flight - determine region from non-USA country
  const internationalCountry = fromCode === 'US' ? toCountry : fromCountry;
  const region = getRegionFromCountry(internationalCountry);
  
  if (!region || region === 'domestic_usa') {
    return [];
  }
  
  return REGIONAL_AIRLINES[region] || [];
}

// Helper function to filter flights by allowed airlines
export function filterFlightsByAllowedAirlines(
  flights: any[], 
  fromCountry: string, 
  toCountry: string
): any[] {
  const allowedAirlines = getAllowedAirlinesForRoute(fromCountry, toCountry);
  
  if (allowedAirlines.length === 0) {
    return [];
  }
  
  return flights.filter(flight => 
    allowedAirlines.some(airline => 
      flight.airline.toLowerCase().includes(airline.toLowerCase()) ||
      airline.toLowerCase().includes(flight.airline.toLowerCase())
    )
  );
}
