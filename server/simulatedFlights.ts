// Simulador de vuelos basado en rutas reales de American Airlines y partners Alaska Mileage Plan
// Datos basados en investigación de rutas operadas en 2025

export interface SimulatedRoute {
  from: string;
  to: string;
  airline: string;
  airlineCode: string;
  basePrice: number; // Precio base en USD para clase economy
  duration: string; // Formato: "5h 30m"
  typical_flights_per_day: number;
  countries: { from: string; to: string };
}

// Rutas domésticas USA - American Airlines y Alaska Airlines
const DOMESTIC_USA_ROUTES: SimulatedRoute[] = [
  // New York routes
  { from: "JFK", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "3h 10m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 380, duration: "6h 15m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 320, duration: "4h 20m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "2h 50m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 15m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 360, duration: "5h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "PHL", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 20m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  
  { from: "LGA", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "3h 15m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "LGA", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "4h 25m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "LGA", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 45m", typical_flights_per_day: 14, countries: { from: "USA", to: "USA" } },
  { from: "LGA", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 210, duration: "2h 10m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  
  { from: "EWR", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 255, duration: "3h 10m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "EWR", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 325, duration: "4h 20m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "EWR", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 390, duration: "6h 20m", typical_flights_per_day: 5, countries: { from: "USA", to: "USA" } },
  
  // DFW hub routes (largest AA hub)
  { from: "DFW", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 15m", typical_flights_per_day: 18, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "2h 30m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "LAS", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 50m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 310, duration: "3h 45m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  
  // Miami hub routes
  { from: "MIA", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 380, duration: "5h 40m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "3h 20m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 300, duration: "3h 25m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  
  // Popular routes
  { from: "LAX", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 340, duration: "4h 15m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 25m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 350, duration: "4h 30m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  
  // Alaska Airlines domestic routes
  { from: "SEA", to: "LAX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 190, duration: "2h 50m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "SFO", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 170, duration: "2h 15m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "PHX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 210, duration: "2h 55m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
];

// Rutas internacionales - Sudamérica (Solo American Airlines)
const SOUTH_AMERICA_ROUTES: SimulatedRoute[] = [
  { from: "JFK", to: "BOG", airline: "American Airlines", airlineCode: "AA", basePrice: 450, duration: "5h 30m", typical_flights_per_day: 2, countries: { from: "USA", to: "Colombia" } },
  { from: "JFK", to: "GRU", airline: "American Airlines", airlineCode: "AA", basePrice: 650, duration: "10h 15m", typical_flights_per_day: 1, countries: { from: "USA", to: "Brazil" } },
  { from: "JFK", to: "EZE", airline: "American Airlines", airlineCode: "AA", basePrice: 700, duration: "10h 50m", typical_flights_per_day: 1, countries: { from: "USA", to: "Argentina" } },
  { from: "JFK", to: "LIM", airline: "American Airlines", airlineCode: "AA", basePrice: 500, duration: "8h 15m", typical_flights_per_day: 1, countries: { from: "USA", to: "Peru" } },
  
  { from: "MIA", to: "BOG", airline: "American Airlines", airlineCode: "AA", basePrice: 380, duration: "3h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "Colombia" } },
  { from: "MIA", to: "GRU", airline: "American Airlines", airlineCode: "AA", basePrice: 550, duration: "8h 40m", typical_flights_per_day: 2, countries: { from: "USA", to: "Brazil" } },
  { from: "MIA", to: "EZE", airline: "American Airlines", airlineCode: "AA", basePrice: 620, duration: "9h 10m", typical_flights_per_day: 1, countries: { from: "USA", to: "Argentina" } },
  { from: "MIA", to: "SCL", airline: "American Airlines", airlineCode: "AA", basePrice: 680, duration: "9h 45m", typical_flights_per_day: 1, countries: { from: "USA", to: "Chile" } },
  
  { from: "DFW", to: "BOG", airline: "American Airlines", airlineCode: "AA", basePrice: 430, duration: "5h 15m", typical_flights_per_day: 1, countries: { from: "USA", to: "Colombia" } },
  { from: "DFW", to: "GRU", airline: "American Airlines", airlineCode: "AA", basePrice: 600, duration: "10h 5m", typical_flights_per_day: 1, countries: { from: "USA", to: "Brazil" } },
];

// Rutas Europa
const EUROPE_ROUTES: SimulatedRoute[] = [
  // Reino Unido & Irlanda (American Airlines, British Airways, Aer Lingus)
  { from: "JFK", to: "LHR", airline: "American Airlines", airlineCode: "AA", basePrice: 550, duration: "7h 15m", typical_flights_per_day: 3, countries: { from: "USA", to: "United Kingdom" } },
  { from: "JFK", to: "LHR", airline: "British Airways", airlineCode: "BA", basePrice: 580, duration: "7h 10m", typical_flights_per_day: 5, countries: { from: "USA", to: "United Kingdom" } },
  { from: "DFW", to: "LHR", airline: "American Airlines", airlineCode: "AA", basePrice: 620, duration: "9h 15m", typical_flights_per_day: 2, countries: { from: "USA", to: "United Kingdom" } },
  { from: "JFK", to: "DUB", airline: "Aer Lingus", airlineCode: "EI", basePrice: 520, duration: "6h 50m", typical_flights_per_day: 2, countries: { from: "USA", to: "Ireland" } },
  { from: "ORD", to: "DUB", airline: "Aer Lingus", airlineCode: "EI", basePrice: 560, duration: "7h 30m", typical_flights_per_day: 1, countries: { from: "USA", to: "Ireland" } },
  
  // Alemania - Central Europe (American Airlines, Qatar Airways, Aer Lingus)
  { from: "JFK", to: "FRA", airline: "American Airlines", airlineCode: "AA", basePrice: 580, duration: "8h 10m", typical_flights_per_day: 2, countries: { from: "USA", to: "Germany" } },
  { from: "JFK", to: "MUC", airline: "American Airlines", airlineCode: "AA", basePrice: 600, duration: "8h 30m", typical_flights_per_day: 1, countries: { from: "USA", to: "Germany" } },
  { from: "LGA", to: "MUC", airline: "American Airlines", airlineCode: "AA", basePrice: 610, duration: "8h 35m", typical_flights_per_day: 1, countries: { from: "USA", to: "Germany" } },
  { from: "PHL", to: "MUC", airline: "American Airlines", airlineCode: "AA", basePrice: 590, duration: "8h 20m", typical_flights_per_day: 1, countries: { from: "USA", to: "Germany" } },
  { from: "JFK", to: "FRA", airline: "Qatar Airways", airlineCode: "QR", basePrice: 650, duration: "14h 20m", typical_flights_per_day: 1, countries: { from: "USA", to: "Germany" } }, // vía Doha
  
  // España - Iberia (American Airlines, Qatar Airways, Royal Air Maroc, Aer Lingus)
  { from: "JFK", to: "MAD", airline: "American Airlines", airlineCode: "AA", basePrice: 560, duration: "7h 45m", typical_flights_per_day: 2, countries: { from: "USA", to: "Spain" } },
  { from: "PHL", to: "MAD", airline: "American Airlines", airlineCode: "AA", basePrice: 540, duration: "7h 30m", typical_flights_per_day: 1, countries: { from: "USA", to: "Spain" } },
  { from: "ORD", to: "MAD", airline: "American Airlines", airlineCode: "AA", basePrice: 600, duration: "8h 45m", typical_flights_per_day: 1, countries: { from: "USA", to: "Spain" } },
  { from: "JFK", to: "MAD", airline: "Qatar Airways", airlineCode: "QR", basePrice: 680, duration: "15h 10m", typical_flights_per_day: 1, countries: { from: "USA", to: "Spain" } }, // vía Doha
  { from: "JFK", to: "BCN", airline: "Royal Air Maroc", airlineCode: "AT", basePrice: 620, duration: "12h 30m", typical_flights_per_day: 1, countries: { from: "USA", to: "Spain" } }, // vía Casablanca
  
  // Italia - Central Europe
  { from: "JFK", to: "FCO", airline: "American Airlines", airlineCode: "AA", basePrice: 590, duration: "8h 50m", typical_flights_per_day: 2, countries: { from: "USA", to: "Italy" } },
  { from: "PHL", to: "MXP", airline: "American Airlines", airlineCode: "AA", basePrice: 570, duration: "8h 35m", typical_flights_per_day: 1, countries: { from: "USA", to: "Italy" } },
  { from: "MIA", to: "FCO", airline: "American Airlines", airlineCode: "AA", basePrice: 610, duration: "10h 15m", typical_flights_per_day: 1, countries: { from: "USA", to: "Italy" } },
  { from: "JFK", to: "FCO", airline: "Qatar Airways", airlineCode: "QR", basePrice: 670, duration: "15h 5m", typical_flights_per_day: 1, countries: { from: "USA", to: "Italy" } },
  
  // Francia - Iberia
  { from: "JFK", to: "CDG", airline: "American Airlines", airlineCode: "AA", basePrice: 570, duration: "7h 55m", typical_flights_per_day: 2, countries: { from: "USA", to: "France" } },
  { from: "PHL", to: "CDG", airline: "American Airlines", airlineCode: "AA", basePrice: 550, duration: "7h 40m", typical_flights_per_day: 1, countries: { from: "USA", to: "France" } },
  { from: "MIA", to: "CDG", airline: "American Airlines", airlineCode: "AA", basePrice: 600, duration: "9h 25m", typical_flights_per_day: 1, countries: { from: "USA", to: "France" } },
  { from: "JFK", to: "CDG", airline: "Royal Air Maroc", airlineCode: "AT", basePrice: 640, duration: "12h 15m", typical_flights_per_day: 1, countries: { from: "USA", to: "France" } },
  
  // Grecia - Eastern Europe (American Airlines, Qatar Airways, Finnair)
  { from: "CLT", to: "ATH", airline: "American Airlines", airlineCode: "AA", basePrice: 640, duration: "10h 30m", typical_flights_per_day: 1, countries: { from: "USA", to: "Greece" } },
  { from: "JFK", to: "ATH", airline: "American Airlines", airlineCode: "AA", basePrice: 620, duration: "10h 15m", typical_flights_per_day: 1, countries: { from: "USA", to: "Greece" } },
  { from: "JFK", to: "ATH", airline: "Qatar Airways", airlineCode: "QR", basePrice: 720, duration: "16h 20m", typical_flights_per_day: 1, countries: { from: "USA", to: "Greece" } },
  
  // Nordic Countries (Finnair, Icelandair)
  { from: "JFK", to: "HEL", airline: "Finnair", airlineCode: "AY", basePrice: 650, duration: "8h 45m", typical_flights_per_day: 2, countries: { from: "USA", to: "Finland" } },
  { from: "ORD", to: "HEL", airline: "Finnair", airlineCode: "AY", basePrice: 680, duration: "9h 15m", typical_flights_per_day: 1, countries: { from: "USA", to: "Finland" } },
  { from: "JFK", to: "KEF", airline: "Icelandair", airlineCode: "FI", basePrice: 480, duration: "5h 30m", typical_flights_per_day: 3, countries: { from: "USA", to: "Iceland" } },
  { from: "ORD", to: "KEF", airline: "Icelandair", airlineCode: "FI", basePrice: 520, duration: "6h 10m", typical_flights_per_day: 1, countries: { from: "USA", to: "Iceland" } },
  
  // Eastern Europe (Qatar Airways, Finnair, Aer Lingus, Condor)
  { from: "JFK", to: "WAW", airline: "Qatar Airways", airlineCode: "QR", basePrice: 750, duration: "16h 45m", typical_flights_per_day: 1, countries: { from: "USA", to: "Poland" } }, // vía Doha
  { from: "EWR", to: "FRA", airline: "Condor", airlineCode: "DE", basePrice: 590, duration: "8h 15m", typical_flights_per_day: 1, countries: { from: "USA", to: "Germany" } },
];

// Rutas Asia (American Airlines, Hawaiian Airlines, Qatar Airways, Qantas, Starlux, JAL, Cathay Pacific, Malaysia Airlines, Korean Air, Philippine Airlines)
const ASIA_ROUTES: SimulatedRoute[] = [
  // Japón (American Airlines, Japan Airlines)
  { from: "JFK", to: "NRT", airline: "American Airlines", airlineCode: "AA", basePrice: 950, duration: "14h 10m", typical_flights_per_day: 1, countries: { from: "USA", to: "Japan" } },
  { from: "JFK", to: "NRT", airline: "Japan Airlines", airlineCode: "JL", basePrice: 980, duration: "14h 5m", typical_flights_per_day: 1, countries: { from: "USA", to: "Japan" } },
  { from: "DFW", to: "NRT", airline: "American Airlines", airlineCode: "AA", basePrice: 900, duration: "13h 15m", typical_flights_per_day: 1, countries: { from: "USA", to: "Japan" } },
  { from: "DFW", to: "HND", airline: "American Airlines", airlineCode: "AA", basePrice: 920, duration: "13h 20m", typical_flights_per_day: 1, countries: { from: "USA", to: "Japan" } },
  { from: "LAX", to: "NRT", airline: "American Airlines", airlineCode: "AA", basePrice: 850, duration: "11h 30m", typical_flights_per_day: 2, countries: { from: "USA", to: "Japan" } },
  { from: "LAX", to: "HND", airline: "Japan Airlines", airlineCode: "JL", basePrice: 870, duration: "11h 25m", typical_flights_per_day: 2, countries: { from: "USA", to: "Japan" } },
  
  // Corea del Sur (Korean Air)
  { from: "JFK", to: "ICN", airline: "Korean Air", airlineCode: "KE", basePrice: 980, duration: "14h 30m", typical_flights_per_day: 1, countries: { from: "USA", to: "South Korea" } },
  { from: "LAX", to: "ICN", airline: "Korean Air", airlineCode: "KE", basePrice: 880, duration: "12h 15m", typical_flights_per_day: 2, countries: { from: "USA", to: "South Korea" } },
  
  // China (American Airlines)
  { from: "JFK", to: "PEK", airline: "American Airlines", airlineCode: "AA", basePrice: 1000, duration: "14h 45m", typical_flights_per_day: 1, countries: { from: "USA", to: "China" } },
  { from: "DFW", to: "PVG", airline: "American Airlines", airlineCode: "AA", basePrice: 950, duration: "15h 10m", typical_flights_per_day: 1, countries: { from: "USA", to: "China" } },
  { from: "LAX", to: "PVG", airline: "American Airlines", airlineCode: "AA", basePrice: 880, duration: "12h 50m", typical_flights_per_day: 1, countries: { from: "USA", to: "China" } },
  
  // Hong Kong (Cathay Pacific)
  { from: "JFK", to: "HKG", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 1050, duration: "16h 15m", typical_flights_per_day: 1, countries: { from: "USA", to: "China" } },
  { from: "LAX", to: "HKG", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 920, duration: "14h 20m", typical_flights_per_day: 2, countries: { from: "USA", to: "China" } },
  
  // Singapur (Qatar Airways vía Doha)
  { from: "JFK", to: "SIN", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1100, duration: "21h 30m", typical_flights_per_day: 1, countries: { from: "USA", to: "Singapore" } },
  
  // Tailandia (Qatar Airways vía Doha)
  { from: "JFK", to: "BKK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1080, duration: "22h 15m", typical_flights_per_day: 1, countries: { from: "USA", to: "Thailand" } },
  
  // Filipinas (Philippine Airlines)
  { from: "LAX", to: "MNL", airline: "Philippine Airlines", airlineCode: "PR", basePrice: 950, duration: "14h 45m", typical_flights_per_day: 1, countries: { from: "USA", to: "Philippines" } },
  
  // Malasia (Malaysia Airlines)
  { from: "LAX", to: "KUL", airline: "Malaysia Airlines", airlineCode: "MH", basePrice: 980, duration: "18h 30m", typical_flights_per_day: 1, countries: { from: "USA", to: "Malaysia" } },
  
  // Taiwán (Starlux Airlines)
  { from: "LAX", to: "TPE", airline: "Starlux Airlines", airlineCode: "JX", basePrice: 890, duration: "13h 50m", typical_flights_per_day: 1, countries: { from: "USA", to: "Taiwan" } },
];

// Rutas Middle East (Qatar Airways, Royal Air Maroc, Oman Air)
const MIDDLE_EAST_ROUTES: SimulatedRoute[] = [
  // Qatar (Qatar Airways)
  { from: "JFK", to: "DOH", airline: "Qatar Airways", airlineCode: "QR", basePrice: 900, duration: "13h 10m", typical_flights_per_day: 2, countries: { from: "USA", to: "Qatar" } },
  { from: "LAX", to: "DOH", airline: "Qatar Airways", airlineCode: "QR", basePrice: 950, duration: "16h 20m", typical_flights_per_day: 1, countries: { from: "USA", to: "Qatar" } },
  
  // UAE (Qatar Airways vía Doha)
  { from: "JFK", to: "DXB", airline: "Qatar Airways", airlineCode: "QR", basePrice: 920, duration: "14h 30m", typical_flights_per_day: 1, countries: { from: "USA", to: "United Arab Emirates" } },
  
  // Omán (Oman Air)
  { from: "JFK", to: "MCT", airline: "Oman Air", airlineCode: "WY", basePrice: 950, duration: "15h 45m", typical_flights_per_day: 1, countries: { from: "USA", to: "Oman" } },
];

// Rutas Oceanía (American Airlines, Qantas, Fiji Airways)
const OCEANIA_ROUTES: SimulatedRoute[] = [
  // Australia (American Airlines, Qantas)
  { from: "LAX", to: "SYD", airline: "American Airlines", airlineCode: "AA", basePrice: 1200, duration: "15h 10m", typical_flights_per_day: 1, countries: { from: "USA", to: "Australia" } },
  { from: "LAX", to: "SYD", airline: "Qantas", airlineCode: "QF", basePrice: 1250, duration: "15h 5m", typical_flights_per_day: 2, countries: { from: "USA", to: "Australia" } },
  { from: "DFW", to: "SYD", airline: "Qantas", airlineCode: "QF", basePrice: 1300, duration: "17h 20m", typical_flights_per_day: 1, countries: { from: "USA", to: "Australia" } },
  
  // Nueva Zelanda (Qantas vía Sydney)
  { from: "LAX", to: "AKL", airline: "Qantas", airlineCode: "QF", basePrice: 1280, duration: "16h 30m", typical_flights_per_day: 1, countries: { from: "USA", to: "New Zealand" } },
  
  // Fiji (Fiji Airways)
  { from: "LAX", to: "NAN", airline: "Fiji Airways", airlineCode: "FJ", basePrice: 980, duration: "11h 15m", typical_flights_per_day: 1, countries: { from: "USA", to: "Fiji" } },
];

// Rutas África (Qatar Airways, Royal Air Maroc)
const AFRICA_ROUTES: SimulatedRoute[] = [
  // Marruecos (Royal Air Maroc)
  { from: "JFK", to: "CMN", airline: "Royal Air Maroc", airlineCode: "AT", basePrice: 720, duration: "7h 50m", typical_flights_per_day: 2, countries: { from: "USA", to: "Morocco" } },
  { from: "MIA", to: "CMN", airline: "Royal Air Maroc", airlineCode: "AT", basePrice: 780, duration: "9h 15m", typical_flights_per_day: 1, countries: { from: "USA", to: "Morocco" } },
  
  // Sudáfrica (Qatar Airways vía Doha)
  { from: "JFK", to: "JNB", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1150, duration: "20h 45m", typical_flights_per_day: 1, countries: { from: "USA", to: "South Africa" } },
  
  // Egipto (Qatar Airways vía Doha)
  { from: "JFK", to: "CAI", airline: "Qatar Airways", airlineCode: "QR", basePrice: 980, duration: "17h 30m", typical_flights_per_day: 1, countries: { from: "USA", to: "Egypt" } },
];

// Consolidar todas las rutas
export const ALL_SIMULATED_ROUTES = [
  ...DOMESTIC_USA_ROUTES,
  ...SOUTH_AMERICA_ROUTES,
  ...EUROPE_ROUTES,
  ...ASIA_ROUTES,
  ...MIDDLE_EAST_ROUTES,
  ...OCEANIA_ROUTES,
  ...AFRICA_ROUTES,
];

// Función para buscar rutas simuladas
export function findSimulatedFlights(fromIata: string, toIata: string): SimulatedRoute[] {
  return ALL_SIMULATED_ROUTES.filter(route => 
    route.from === fromIata && route.to === toIata
  );
}

// Función para generar variaciones de horarios realistas
export function generateFlightTimes(baseRoute: SimulatedRoute, date: string): Array<{
  departureTime: string;
  arrivalTime: string;
  flightNumber: string;
}> {
  const flights: Array<{ departureTime: string; arrivalTime: string; flightNumber: string }> = [];
  const flightCount = Math.min(baseRoute.typical_flights_per_day, 8); // Máximo 8 vuelos por día
  
  // Horarios típicos de salida (distribuidos a lo largo del día)
  const typicalDepartures = ['06:30', '09:15', '12:00', '14:45', '17:30', '19:15', '21:00', '23:30'];
  
  for (let i = 0; i < flightCount; i++) {
    const depTime = typicalDepartures[i];
    const [hours, minutes] = depTime.split(':').map(Number);
    
    // Calcular tiempo de llegada basado en duración
    const durationMatch = baseRoute.duration.match(/(\d+)h\s*(\d+)m/);
    if (durationMatch) {
      const durationHours = parseInt(durationMatch[1]);
      const durationMinutes = parseInt(durationMatch[2]);
      
      const depDate = new Date(`${date}T${depTime}:00`);
      const arrDate = new Date(depDate.getTime() + (durationHours * 60 + durationMinutes) * 60000);
      
      const arrTime = `${String(arrDate.getHours()).padStart(2, '0')}:${String(arrDate.getMinutes()).padStart(2, '0')}`;
      
      // Generar número de vuelo realista
      const flightNumber = `${baseRoute.airlineCode}${Math.floor(Math.random() * 3000) + 1000}`;
      
      flights.push({
        departureTime: depTime,
        arrivalTime: arrTime,
        flightNumber
      });
    }
  }
  
  return flights;
}

// Función para agregar variación de precio (+/- 15%)
export function applyPriceVariation(basePrice: number): number {
  const variation = (Math.random() * 0.3 - 0.15); // -15% a +15%
  return Math.round(basePrice * (1 + variation));
}
