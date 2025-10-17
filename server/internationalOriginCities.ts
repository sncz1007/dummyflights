// Ciudades de origen de USA que pueden ofrecer vuelos internacionales
// Basado en hubs de American Airlines y Alaska Airlines

export interface OriginCityInfo {
  iata: string;
  city: string;
  coast: "east" | "west" | "central";
  isHub: boolean; // Hub principal de AA o AS
  hasDirectInternational: boolean; // Tiene vuelos directos internacionales
  connectsThrough?: string[]; // Hace conexión a través de estos hubs
}

// Hubs principales de American Airlines: DFW, CLT, MIA, ORD, PHX, PHL, JFK
// Hubs de Alaska Airlines: SEA, PDX, LAX, SFO

export const INTERNATIONAL_ORIGIN_CITIES: Record<string, OriginCityInfo> = {
  // === COSTA ESTE ===
  "JFK": { iata: "JFK", city: "New York", coast: "east", isHub: true, hasDirectInternational: true },
  "BOS": { iata: "BOS", city: "Boston", coast: "east", isHub: false, hasDirectInternational: true },
  "PHL": { iata: "PHL", city: "Philadelphia", coast: "east", isHub: true, hasDirectInternational: true },
  "DCA": { iata: "DCA", city: "Washington DC", coast: "east", isHub: false, hasDirectInternational: true, connectsThrough: ["JFK", "PHL"] },
  "MIA": { iata: "MIA", city: "Miami", coast: "east", isHub: true, hasDirectInternational: true },
  "CLT": { iata: "CLT", city: "Charlotte", coast: "east", isHub: true, hasDirectInternational: true },
  "ATL": { iata: "ATL", city: "Atlanta", coast: "east", isHub: false, hasDirectInternational: true, connectsThrough: ["JFK", "MIA"] },
  "MCO": { iata: "MCO", city: "Orlando", coast: "east", isHub: false, hasDirectInternational: false, connectsThrough: ["MIA", "JFK"] },
  
  // === COSTA OESTE ===
  "LAX": { iata: "LAX", city: "Los Angeles", coast: "west", isHub: true, hasDirectInternational: true },
  "SFO": { iata: "SFO", city: "San Francisco", coast: "west", isHub: true, hasDirectInternational: true },
  "SAN": { iata: "SAN", city: "San Diego", coast: "west", isHub: false, hasDirectInternational: false, connectsThrough: ["LAX", "SFO"] },
  "LAS": { iata: "LAS", city: "Las Vegas", coast: "west", isHub: false, hasDirectInternational: false, connectsThrough: ["LAX", "PHX"] },
  "PHX": { iata: "PHX", city: "Phoenix", coast: "west", isHub: true, hasDirectInternational: true },
  "PDX": { iata: "PDX", city: "Portland", coast: "west", isHub: true, hasDirectInternational: true },
  "SEA": { iata: "SEA", city: "Seattle", coast: "west", isHub: true, hasDirectInternational: true },
  "SJC": { iata: "SJC", city: "San Jose CA", coast: "west", isHub: false, hasDirectInternational: false, connectsThrough: ["SFO", "LAX"] },
  
  // === CENTRO ===
  "ORD": { iata: "ORD", city: "Chicago", coast: "central", isHub: true, hasDirectInternational: true },
  "DFW": { iata: "DFW", city: "Dallas", coast: "central", isHub: true, hasDirectInternational: true },
  "IAH": { iata: "IAH", city: "Houston", coast: "central", isHub: false, hasDirectInternational: true, connectsThrough: ["DFW", "MIA"] },
  "DEN": { iata: "DEN", city: "Denver", coast: "central", isHub: false, hasDirectInternational: true, connectsThrough: ["LAX", "ORD"] },
  "MSP": { iata: "MSP", city: "Minneapolis", coast: "central", isHub: false, hasDirectInternational: false, connectsThrough: ["ORD", "DFW"] },
  "DTW": { iata: "DTW", city: "Detroit", coast: "central", isHub: false, hasDirectInternational: false, connectsThrough: ["ORD", "JFK"] },
  "AUS": { iata: "AUS", city: "Austin", coast: "central", isHub: false, hasDirectInternational: false, connectsThrough: ["DFW", "IAH"] },
};

// Determinar la costa de una ciudad (para saber qué aerolíneas usar)
export function getCityCoast(iataCode: string): "east" | "west" | "central" | null {
  const cityInfo = INTERNATIONAL_ORIGIN_CITIES[iataCode.toUpperCase()];
  return cityInfo ? cityInfo.coast : null;
}

// Verificar si una ciudad puede ofrecer vuelos internacionales
export function canOfferInternationalFlights(iataCode: string): boolean {
  const cityInfo = INTERNATIONAL_ORIGIN_CITIES[iataCode.toUpperCase()];
  return cityInfo !== undefined;
}

// Obtener información de la ciudad de origen
export function getOriginCityInfo(iataCode: string): OriginCityInfo | null {
  return INTERNATIONAL_ORIGIN_CITIES[iataCode.toUpperCase()] || null;
}
