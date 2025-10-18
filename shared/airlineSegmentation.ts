// Airline segmentation rules by region

export type Region = 
  | 'domestic_usa'
  | 'north_america'
  | 'south_america'
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
// Primary airlines are based on actual Alaska Mileage Plan award availability research
export const REGIONAL_AIRLINES: Record<Region, string[]> = {
  domestic_usa: ['Alaska Airlines', 'American Airlines'],
  north_america: ['American Airlines', 'Alaska Airlines'], // Canada, Mexico, Central America
  south_america: ['American Airlines'], // South America - NO Alaska, NO LATAM (agreement ended 2025)
  iberia: ['American Airlines', 'Royal Air Maroc', 'Aer Lingus', 'Qatar Airways'], // Spain, Portugal, France - Iberia removed (earn only)
  central_europe: ['American Airlines', 'Qatar Airways', 'Royal Air Maroc', 'Aer Lingus'], // Germany, Switzerland, Italy, Austria
  eastern_europe: ['Qatar Airways', 'Finnair', 'Aer Lingus', 'Condor'], // Poland, Czech Republic, etc.
  nordic: ['Finnair', 'Icelandair'], // Sweden, Finland, Norway, Denmark, Iceland
  russia: ['Alaska Airlines', 'American Airlines'],
  uk: ['American Airlines', 'British Airways'], // United Kingdom & Ireland
  middle_east: ['Qatar Airways', 'Royal Air Maroc', 'Oman Air'], // UAE, Qatar, Saudi Arabia, Oman
  oceania: ['American Airlines', 'Qantas', 'Fiji Airways'], // Australia, New Zealand, Fiji
  africa: ['Qatar Airways', 'Royal Air Maroc'], // Morocco, Egypt, South Africa, etc.
  asia: [
    'American Airlines', 'Hawaiian Airlines', 'Qatar Airways', 'Qantas', 'Starlux Airlines', // Primary carriers
    'Japan Airlines', 'Cathay Pacific', 'Malaysia Airlines', 'Korean Air', 'Philippine Airlines' // Additional Asian carriers
  ]
};

// Country to region mapping (ISO 3166-1 alpha-2 codes)
export const COUNTRY_TO_REGION: Record<string, Region> = {
  // USA (domestic)
  'US': 'domestic_usa',
  
  // North America (Canada, Mexico, Central America, Caribbean)
  'CA': 'north_america', // Canada
  'MX': 'north_america', // Mexico
  'CR': 'north_america', // Costa Rica
  'PA': 'north_america', // Panama
  'GT': 'north_america', // Guatemala
  'HN': 'north_america', // Honduras
  'SV': 'north_america', // El Salvador
  'NI': 'north_america', // Nicaragua
  'BZ': 'north_america', // Belize
  'DO': 'north_america', // Dominican Republic
  'CU': 'north_america', // Cuba
  'JM': 'north_america', // Jamaica
  'BS': 'north_america', // Bahamas
  'TT': 'north_america', // Trinidad and Tobago
  'HT': 'north_america', // Haiti
  'PR': 'north_america', // Puerto Rico
  
  // South America
  'BR': 'south_america', // Brazil
  'AR': 'south_america', // Argentina
  'CL': 'south_america', // Chile
  'CO': 'south_america', // Colombia
  'PE': 'south_america', // Peru
  'VE': 'south_america', // Venezuela
  'EC': 'south_america', // Ecuador
  'UY': 'south_america', // Uruguay
  'PY': 'south_america', // Paraguay
  'BO': 'south_america', // Bolivia
  'GY': 'south_america', // Guyana
  'SR': 'south_america', // Suriname
  'GF': 'south_america', // French Guiana
  
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
  'TR': 'middle_east', // Turkey
  
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
  'Greece': 'GR',
  'Romania': 'RO',
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
  'Turkey': 'TR',
  'Jordan': 'JO',
  'Australia': 'AU',
  'New Zealand': 'NZ',
  'Fiji': 'FJ',
  'Morocco': 'MA',
  'Egypt': 'EG',
  'South Africa': 'ZA',
  'Nigeria': 'NG',
  'Kenya': 'KE',
  'Tunisia': 'TN',
  'Tanzania': 'TZ',
  'Ghana': 'GH',
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
