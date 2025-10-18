// Simulador de vuelos basado en rutas reales de American Airlines y partners Alaska Mileage Plan
// Datos basados en investigación de rutas operadas en 2025 + segmentación manual detallada

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

// Definir aeropuertos de costa este y costa oeste para segmentación
const EAST_COAST_AIRPORTS = ['JFK', 'LGA', 'EWR', 'BOS', 'PHL', 'BWI', 'DCA', 'IAD', 'CLT', 'MIA', 'FLL', 'MCO', 'TPA', 'ATL', 'BNA', 'MSY', 'IAH', 'HOU', 'DFW', 'ORD', 'DTW', 'MSP', 'STL', 'MCI', 'CVG', 'CMH', 'PIT', 'RDU', 'CHS', 'SAV', 'JAX', 'PBI', 'RSW'];
const WEST_COAST_AIRPORTS = ['LAX', 'SFO', 'SAN', 'SEA', 'PDX', 'SLC', 'LAS', 'PHX', 'DEN', 'OAK', 'SJC', 'SMF', 'BUR', 'ONT', 'ANC', 'BOI', 'ABQ', 'TUS', 'RNO', 'FAT', 'SNA'];

export function isEastCoast(iata: string): boolean {
  return EAST_COAST_AIRPORTS.includes(iata);
}

export function isWestCoast(iata: string): boolean {
  return WEST_COAST_AIRPORTS.includes(iata);
}

// ===== RUTAS DOMÉSTICAS USA - EXPANDIDAS =====
// Incluye TODAS las capitales de estados y ciudades principales con tráfico aéreo
const DOMESTIC_USA_ROUTES: SimulatedRoute[] = [
  // ===== NEW YORK (JFK, LGA, EWR) =====
  { from: "JFK", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "3h 10m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 380, duration: "6h 15m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 320, duration: "4h 20m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "2h 50m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 15m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 360, duration: "5h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "PHL", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 20m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "BOS", airline: "American Airlines", airlineCode: "AA", basePrice: 160, duration: "1h 15m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 390, duration: "6h 25m", typical_flights_per_day: 5, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "SEA", airline: "American Airlines", airlineCode: "AA", basePrice: 410, duration: "6h 35m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 340, duration: "4h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "LAS", airline: "American Airlines", airlineCode: "AA", basePrice: 370, duration: "5h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "SAN", airline: "American Airlines", airlineCode: "AA", basePrice: 385, duration: "6h 10m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "ATL", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 45m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "MCO", airline: "American Airlines", airlineCode: "AA", basePrice: 230, duration: "3h 5m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "TPA", airline: "American Airlines", airlineCode: "AA", basePrice: 245, duration: "3h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "JFK", to: "SLC", airline: "American Airlines", airlineCode: "AA", basePrice: 350, duration: "5h 20m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  { from: "LGA", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "3h 15m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "LGA", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "4h 25m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "LGA", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 45m", typical_flights_per_day: 14, countries: { from: "USA", to: "USA" } },
  { from: "LGA", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 210, duration: "2h 10m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "LGA", to: "ATL", airline: "American Airlines", airlineCode: "AA", basePrice: 235, duration: "2h 40m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  
  { from: "EWR", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 255, duration: "3h 10m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "EWR", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 325, duration: "4h 20m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "EWR", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 390, duration: "6h 20m", typical_flights_per_day: 5, countries: { from: "USA", to: "USA" } },
  { from: "EWR", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 395, duration: "6h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // ===== ATLANTA (ATL) - Busiest airport in the world =====
  { from: "ATL", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 310, duration: "4h 45m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "ATL", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 25m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "ATL", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 10m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "ATL", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "2h 5m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "ATL", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ATL", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "5h 15m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "ATL", to: "SEA", airline: "American Airlines", airlineCode: "AA", basePrice: 350, duration: "5h 30m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "ATL", to: "LAS", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "4h 20m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // ===== DALLAS/FORT WORTH (DFW) - Largest AA hub =====
  { from: "DFW", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 15m", typical_flights_per_day: 18, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "2h 30m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "LAS", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 50m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 310, duration: "3h 45m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "SEA", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "4h 5m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 15m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "SAN", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "3h 5m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 45m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 300, duration: "3h 25m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 0m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "BOS", airline: "American Airlines", airlineCode: "AA", basePrice: 340, duration: "4h 10m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "PHL", airline: "American Airlines", airlineCode: "AA", basePrice: 310, duration: "3h 35m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // ===== LOS ANGELES (LAX) - #2 busiest =====
  { from: "LAX", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 340, duration: "4h 15m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 25m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 380, duration: "5h 40m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "LAS", airline: "American Airlines", airlineCode: "AA", basePrice: 150, duration: "1h 20m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 170, duration: "1h 30m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "SEA", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 200, duration: "2h 50m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 35m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "ATL", airline: "American Airlines", airlineCode: "AA", basePrice: 320, duration: "4h 30m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "BOS", airline: "American Airlines", airlineCode: "AA", basePrice: 400, duration: "5h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 370, duration: "5h 15m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  // ===== CHICAGO O'HARE (ORD) - #3-5 busiest =====
  { from: "ORD", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 350, duration: "4h 30m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "4h 35m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "3h 20m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 45m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "3h 50m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "SEA", airline: "American Airlines", airlineCode: "AA", basePrice: 340, duration: "4h 25m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "LAS", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 55m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "BOS", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "2h 30m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 15m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  
  // ===== MIAMI (MIA) - Latin America hub =====
  { from: "MIA", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 380, duration: "5h 40m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "3h 20m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 300, duration: "3h 25m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 360, duration: "5h 15m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 410, duration: "6h 25m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "SEA", airline: "American Airlines", airlineCode: "AA", basePrice: 430, duration: "6h 50m", typical_flights_per_day: 1, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "BOS", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 230, duration: "2h 15m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  
  // ===== CHARLOTTE (CLT) - Major East Coast hub =====
  { from: "CLT", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 370, duration: "5h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 380, duration: "5h 55m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "4h 40m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 310, duration: "3h 50m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "SEA", airline: "American Airlines", airlineCode: "AA", basePrice: 400, duration: "6h 15m", typical_flights_per_day: 1, countries: { from: "USA", to: "USA" } },
  
  // ===== SEATTLE (SEA) - Alaska hub =====
  { from: "SEA", to: "LAX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 190, duration: "2h 50m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "SFO", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 170, duration: "2h 15m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "PHX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 210, duration: "2h 55m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "LAS", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 200, duration: "2h 40m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "SAN", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 205, duration: "2h 50m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "DEN", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 220, duration: "2h 50m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "ORD", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 340, duration: "4h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "DFW", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 330, duration: "4h 5m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  // ===== DENVER (DEN) - #4 busiest, fastest growing =====
  { from: "DEN", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "2h 40m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 30m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "1h 55m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "LAS", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 50m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 35m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 320, duration: "3h 55m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // ===== SAN FRANCISCO (SFO) - #9 busiest =====
  { from: "SFO", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 175, duration: "1h 30m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 335, duration: "4h 25m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 315, duration: "3h 40m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 415, duration: "6h 20m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 210, duration: "2h 10m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "LAS", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 40m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  
  // ===== PHOENIX (PHX) - Top 10, AA hub =====
  { from: "PHX", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 185, duration: "1h 30m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 215, duration: "2h 5m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 295, duration: "3h 45m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 205, duration: "2h 25m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "LAS", airline: "American Airlines", airlineCode: "AA", basePrice: 160, duration: "1h 15m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  
  // ===== LAS VEGAS (LAS) - Top 15 =====
  { from: "LAS", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 155, duration: "1h 20m", typical_flights_per_day: 14, countries: { from: "USA", to: "USA" } },
  { from: "LAS", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 185, duration: "1h 35m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "LAS", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 285, duration: "3h 50m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "LAS", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 225, duration: "2h 45m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "LAS", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 340, duration: "5h 10m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  // ===== ORLANDO (MCO) - Top 10, major tourist hub =====
  { from: "MCO", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 360, duration: "5h 35m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "MCO", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 15m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "MCO", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "3h 5m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "MCO", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "4h 50m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  // ===== BOSTON (BOS) - Top 15, major international gateway =====
  { from: "BOS", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 405, duration: "6h 10m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "BOS", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 395, duration: "6h 35m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "BOS", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 265, duration: "2h 55m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "BOS", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 285, duration: "3h 35m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "BOS", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 345, duration: "4h 35m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // ===== PHILADELPHIA (PHL) - Top 15, AA hub =====
  { from: "PHL", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 395, duration: "6h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "PHL", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 385, duration: "6h 30m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "PHL", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 40m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "PHL", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "3h 5m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "PHL", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 315, duration: "3h 50m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  
  // ===== DETROIT (DTW) - Top 15 =====
  { from: "DTW", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 350, duration: "4h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DTW", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "3h 5m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DTW", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 30m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "DTW", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 310, duration: "4h 15m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  // ===== MINNEAPOLIS (MSP) - Top 15, rated best =====
  { from: "MSP", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "4h 10m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "MSP", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 340, duration: "4h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "MSP", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 190, duration: "1h 40m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "MSP", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "MSP", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 300, duration: "3h 35m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  // ===== SALT LAKE CITY (SLC) - Top 20, Delta hub =====
  { from: "SLC", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 5m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "SLC", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 230, duration: "1h 50m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "SLC", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 30m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "SLC", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "1h 45m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  
  // ===== STATE CAPITALS & MAJOR CITIES =====
  // Alabama
  { from: "BHM", to: "ATL", airline: "American Airlines", airlineCode: "AA", basePrice: 150, duration: "1h 10m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "BHM", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 15m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "BHM", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 190, duration: "1h 35m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // Alaska
  { from: "ANC", to: "SEA", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 280, duration: "3h 30m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "ANC", to: "LAX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 340, duration: "5h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ANC", to: "SFO", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 330, duration: "5h 5m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  // Arkansas
  { from: "LIT", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 25m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "LIT", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 0m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  
  // California - Additional cities
  { from: "SAN", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 145, duration: "1h 10m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "SAN", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 35m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "SAN", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 160, duration: "1h 20m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "SAN", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 275, duration: "3h 0m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "SMF", to: "LAX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 170, duration: "1h 30m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "SMF", to: "SEA", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 180, duration: "2h 0m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  
  // Connecticut
  { from: "BDL", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "2h 10m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "BDL", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 35m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  
  // Florida - Additional cities
  { from: "FLL", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 310, duration: "3h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "FLL", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 25m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "TPA", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "3h 10m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "TPA", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 275, duration: "3h 10m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // Georgia - Already covered ATL extensively
  
  // Hawaii
  { from: "HNL", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 420, duration: "5h 50m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "HNL", to: "SFO", airline: "American Airlines", airlineCode: "AA", basePrice: 430, duration: "5h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "HNL", to: "SEA", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 440, duration: "5h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "HNL", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 450, duration: "6h 10m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  // Idaho
  { from: "BOI", to: "SEA", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 160, duration: "1h 40m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "BOI", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 190, duration: "2h 0m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "BOI", to: "LAX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 210, duration: "2h 30m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  
  // Indiana
  { from: "IND", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 150, duration: "1h 10m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "IND", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "2h 40m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "IND", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "1h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // Iowa
  { from: "DSM", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 30m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DSM", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 20m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  
  // Kansas
  { from: "MCI", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "1h 45m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "MCI", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "1h 55m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "MCI", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 310, duration: "3h 50m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  // Kentucky
  { from: "SDF", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 170, duration: "1h 25m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "SDF", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // Louisiana
  { from: "MSY", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 0m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "MSY", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "2h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "MSY", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 10m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // Maryland
  { from: "BWI", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 300, duration: "3h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "BWI", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 25m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "BWI", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 380, duration: "6h 5m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  // Michigan - Already covered DTW
  
  // Minnesota - Already covered MSP
  
  // Mississippi
  { from: "JAN", to: "ATL", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 25m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "JAN", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 210, duration: "1h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // Missouri
  { from: "STL", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 170, duration: "1h 20m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "STL", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 230, duration: "2h 10m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "STL", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 320, duration: "4h 15m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  // Montana
  { from: "BIL", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "1h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "BIL", to: "SEA", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 220, duration: "2h 10m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  // Nebraska
  { from: "OMA", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 190, duration: "1h 35m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "OMA", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 230, duration: "2h 5m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // Nevada - Already covered LAS extensively
  
  // New Hampshire
  { from: "MHT", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 40m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "MHT", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 25m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  
  // New Jersey - Already covered EWR
  
  // New Mexico
  { from: "ABQ", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "2h 0m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "ABQ", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 170, duration: "1h 25m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "ABQ", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ABQ", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 30m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  
  // New York - Already covered extensively
  
  // North Carolina - Already covered CLT, adding RDU
  { from: "RDU", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "RDU", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 20m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "RDU", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 370, duration: "5h 50m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  // North Dakota
  { from: "FAR", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 210, duration: "2h 0m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "FAR", to: "MSP", airline: "American Airlines", airlineCode: "AA", basePrice: 150, duration: "1h 10m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // Ohio
  { from: "CMH", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 170, duration: "1h 20m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "CMH", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 55m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "CMH", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 190, duration: "1h 40m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "CVG", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 165, duration: "1h 20m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "CVG", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "2h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // Oklahoma
  { from: "OKC", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 160, duration: "1h 15m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "OKC", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 230, duration: "2h 20m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "OKC", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 210, duration: "2h 10m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  // Oregon
  { from: "PDX", to: "LAX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 200, duration: "2h 35m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "PDX", to: "SFO", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 180, duration: "2h 5m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "PDX", to: "SEA", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 130, duration: "1h 5m", typical_flights_per_day: 14, countries: { from: "USA", to: "USA" } },
  { from: "PDX", to: "PHX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 220, duration: "2h 50m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "PDX", to: "DEN", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 230, duration: "2h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // Pennsylvania - Already covered PHL, adding PIT
  { from: "PIT", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 30m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "PIT", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "3h 20m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "PIT", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 35m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  
  // Rhode Island
  { from: "PVD", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 35m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "PVD", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 210, duration: "2h 20m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  
  // South Carolina
  { from: "CHS", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 140, duration: "1h 5m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "CHS", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "3h 20m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "CHS", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 210, duration: "2h 5m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  
  // South Dakota
  { from: "FSD", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "1h 50m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "FSD", to: "MSP", airline: "American Airlines", airlineCode: "AA", basePrice: 160, duration: "1h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // Tennessee
  { from: "BNA", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 15m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "BNA", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 0m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "BNA", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "4h 30m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "BNA", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "2h 35m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // Texas - Already covered DFW extensively, adding Austin, Houston, San Antonio
  { from: "AUS", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 140, duration: "1h 5m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "AUS", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "3h 25m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "AUS", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 55m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "AUS", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  { from: "IAH", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 150, duration: "1h 10m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "IAH", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 300, duration: "3h 30m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "IAH", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "2h 50m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "IAH", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  { from: "SAT", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 145, duration: "1h 10m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "SAT", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 5m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "SAT", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 295, duration: "3h 20m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  
  // Utah - Already covered SLC
  
  // Vermont
  { from: "BTV", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "2h 45m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "BTV", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 230, duration: "2h 35m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  // Virginia
  { from: "DCA", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 300, duration: "3h 40m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DCA", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 15m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "DCA", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 390, duration: "6h 15m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "DCA", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "3h 0m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  
  { from: "IAD", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 310, duration: "3h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "IAD", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 395, duration: "6h 20m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "IAD", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 20m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  
  // Washington - Already covered SEA
  
  // West Virginia
  { from: "CRW", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "1h 45m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "CRW", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 160, duration: "1h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // Wisconsin
  { from: "MKE", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 145, duration: "1h 5m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "MKE", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 55m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "MKE", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 340, duration: "4h 35m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  
  // Wyoming
  { from: "JAC", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "JAC", to: "SLC", airline: "American Airlines", airlineCode: "AA", basePrice: 160, duration: "1h 20m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },

  // ===== RUTAS INVERSAS DOMÉSTICAS USA (GENERADAS AUTOMÁTICAMENTE) =====
// === RUTAS INVERSAS GENERADAS AUTOMÁTICAMENTE ===
  { from: "MIA", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "3h 10m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 380, duration: "6h 15m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 320, duration: "4h 20m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "2h 50m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 15m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 360, duration: "5h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "PHL", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 20m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "BOS", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 160, duration: "1h 15m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 390, duration: "6h 25m", typical_flights_per_day: 5, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 410, duration: "6h 35m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 340, duration: "4h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "LAS", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 370, duration: "5h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "SAN", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 385, duration: "6h 10m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "ATL", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 45m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "MCO", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 230, duration: "3h 5m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "TPA", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 245, duration: "3h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "SLC", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 350, duration: "5h 20m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "LGA", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "3h 15m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "LGA", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "4h 25m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "LGA", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 45m", typical_flights_per_day: 14, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "LGA", airline: "American Airlines", airlineCode: "AA", basePrice: 210, duration: "2h 10m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "ATL", to: "LGA", airline: "American Airlines", airlineCode: "AA", basePrice: 235, duration: "2h 40m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "EWR", airline: "American Airlines", airlineCode: "AA", basePrice: 255, duration: "3h 10m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "EWR", airline: "American Airlines", airlineCode: "AA", basePrice: 325, duration: "4h 20m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "EWR", airline: "American Airlines", airlineCode: "AA", basePrice: 390, duration: "6h 20m", typical_flights_per_day: 5, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "EWR", airline: "American Airlines", airlineCode: "AA", basePrice: 395, duration: "6h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "ATL", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 25m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "ATL", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 10m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "ATL", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "2h 5m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "ATL", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "ATL", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "5h 15m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "ATL", airline: "American Airlines", airlineCode: "AA", basePrice: 350, duration: "5h 30m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "LAS", to: "ATL", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "4h 20m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 15m", typical_flights_per_day: 18, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 15m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 45m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 0m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "ORD", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 15m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 360, duration: "5h 15m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 430, duration: "6h 50m", typical_flights_per_day: 1, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 230, duration: "2h 15m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 380, duration: "5h 55m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "4h 40m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 310, duration: "3h 50m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "CLT", airline: "American Airlines", airlineCode: "AA", basePrice: 400, duration: "6h 15m", typical_flights_per_day: 1, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "SEA", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 170, duration: "2h 15m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "SEA", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 210, duration: "2h 55m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "LAS", to: "SEA", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 200, duration: "2h 40m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "SAN", to: "SEA", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 205, duration: "2h 50m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "SEA", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 220, duration: "2h 50m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 30m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "1h 55m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "LAS", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 50m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 320, duration: "3h 55m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "LAS", to: "PHX", airline: "American Airlines", airlineCode: "AA", basePrice: 160, duration: "1h 15m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "LAS", airline: "American Airlines", airlineCode: "AA", basePrice: 340, duration: "5h 10m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "MCO", airline: "American Airlines", airlineCode: "AA", basePrice: 360, duration: "5h 35m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "MCO", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 15m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "MCO", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "3h 5m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "MCO", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "4h 50m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "BOS", airline: "American Airlines", airlineCode: "AA", basePrice: 395, duration: "6h 35m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "PHL", airline: "American Airlines", airlineCode: "AA", basePrice: 395, duration: "6h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "PHL", airline: "American Airlines", airlineCode: "AA", basePrice: 385, duration: "6h 30m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "PHL", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 40m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "PHL", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "3h 5m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "DTW", airline: "American Airlines", airlineCode: "AA", basePrice: 350, duration: "4h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "DTW", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "3h 5m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "DTW", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 30m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "DTW", airline: "American Airlines", airlineCode: "AA", basePrice: 310, duration: "4h 15m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "MSP", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "4h 10m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "MSP", airline: "American Airlines", airlineCode: "AA", basePrice: 340, duration: "4h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "MSP", airline: "American Airlines", airlineCode: "AA", basePrice: 190, duration: "1h 40m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "MSP", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "MSP", airline: "American Airlines", airlineCode: "AA", basePrice: 300, duration: "3h 35m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "SLC", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 5m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "SLC", airline: "American Airlines", airlineCode: "AA", basePrice: 230, duration: "1h 50m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "SLC", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 30m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "SLC", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "1h 45m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "ATL", to: "BHM", airline: "American Airlines", airlineCode: "AA", basePrice: 150, duration: "1h 10m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "BHM", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 15m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "BHM", airline: "American Airlines", airlineCode: "AA", basePrice: 190, duration: "1h 35m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "ANC", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 280, duration: "3h 30m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "ANC", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 340, duration: "5h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "ANC", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 330, duration: "5h 5m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "LIT", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 25m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "LIT", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 0m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "SAN", airline: "American Airlines", airlineCode: "AA", basePrice: 145, duration: "1h 10m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "SAN", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 35m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "SAN", airline: "American Airlines", airlineCode: "AA", basePrice: 160, duration: "1h 20m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "SMF", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 170, duration: "1h 30m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "SMF", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 180, duration: "2h 0m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "BDL", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "2h 10m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "BDL", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 35m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "FLL", airline: "American Airlines", airlineCode: "AA", basePrice: 310, duration: "3h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "FLL", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 25m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "TPA", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "3h 10m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "TPA", airline: "American Airlines", airlineCode: "AA", basePrice: 275, duration: "3h 10m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "HNL", airline: "American Airlines", airlineCode: "AA", basePrice: 420, duration: "5h 50m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "HNL", airline: "American Airlines", airlineCode: "AA", basePrice: 430, duration: "5h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "HNL", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 440, duration: "5h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "HNL", airline: "American Airlines", airlineCode: "AA", basePrice: 450, duration: "6h 10m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "BOI", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 160, duration: "1h 40m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "BOI", airline: "American Airlines", airlineCode: "AA", basePrice: 190, duration: "2h 0m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "BOI", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 210, duration: "2h 30m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "IND", airline: "American Airlines", airlineCode: "AA", basePrice: 150, duration: "1h 10m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "IND", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "2h 40m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "IND", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "1h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "DSM", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 30m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "DSM", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 20m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "MCI", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "1h 45m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "MCI", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "1h 55m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "MCI", airline: "American Airlines", airlineCode: "AA", basePrice: 310, duration: "3h 50m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "SDF", airline: "American Airlines", airlineCode: "AA", basePrice: 170, duration: "1h 25m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "SDF", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "MSY", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 0m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "MSY", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "2h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "MSY", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 10m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "BWI", airline: "American Airlines", airlineCode: "AA", basePrice: 300, duration: "3h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "BWI", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 25m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "BWI", airline: "American Airlines", airlineCode: "AA", basePrice: 380, duration: "6h 5m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "ATL", to: "JAN", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 25m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "JAN", airline: "American Airlines", airlineCode: "AA", basePrice: 210, duration: "1h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "STL", airline: "American Airlines", airlineCode: "AA", basePrice: 170, duration: "1h 20m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "STL", airline: "American Airlines", airlineCode: "AA", basePrice: 230, duration: "2h 10m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "STL", airline: "American Airlines", airlineCode: "AA", basePrice: 320, duration: "4h 15m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "BIL", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "1h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "BIL", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 220, duration: "2h 10m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "OMA", airline: "American Airlines", airlineCode: "AA", basePrice: 190, duration: "1h 35m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "OMA", airline: "American Airlines", airlineCode: "AA", basePrice: 230, duration: "2h 5m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "MHT", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 40m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "MHT", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 25m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "ABQ", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "2h 0m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "ABQ", airline: "American Airlines", airlineCode: "AA", basePrice: 170, duration: "1h 25m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "ABQ", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "ABQ", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 30m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "RDU", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "RDU", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 20m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "RDU", airline: "American Airlines", airlineCode: "AA", basePrice: 370, duration: "5h 50m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "FAR", airline: "American Airlines", airlineCode: "AA", basePrice: 210, duration: "2h 0m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "MSP", to: "FAR", airline: "American Airlines", airlineCode: "AA", basePrice: 150, duration: "1h 10m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "CMH", airline: "American Airlines", airlineCode: "AA", basePrice: 170, duration: "1h 20m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "CMH", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 55m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "CMH", airline: "American Airlines", airlineCode: "AA", basePrice: 190, duration: "1h 40m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "CVG", airline: "American Airlines", airlineCode: "AA", basePrice: 165, duration: "1h 20m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "CVG", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "2h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "OKC", airline: "American Airlines", airlineCode: "AA", basePrice: 160, duration: "1h 15m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "OKC", airline: "American Airlines", airlineCode: "AA", basePrice: 230, duration: "2h 20m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "OKC", airline: "American Airlines", airlineCode: "AA", basePrice: 210, duration: "2h 10m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "PDX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 200, duration: "2h 35m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "SFO", to: "PDX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 180, duration: "2h 5m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "PDX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 130, duration: "1h 5m", typical_flights_per_day: 14, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "PDX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 220, duration: "2h 50m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "PDX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 230, duration: "2h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "PIT", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 30m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "PIT", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "3h 20m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "PIT", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 35m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "PVD", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 35m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "PVD", airline: "American Airlines", airlineCode: "AA", basePrice: 210, duration: "2h 20m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "CHS", airline: "American Airlines", airlineCode: "AA", basePrice: 140, duration: "1h 5m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "CHS", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "3h 20m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "CHS", airline: "American Airlines", airlineCode: "AA", basePrice: 210, duration: "2h 5m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "FSD", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "1h 50m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "MSP", to: "FSD", airline: "American Airlines", airlineCode: "AA", basePrice: 160, duration: "1h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "BNA", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 15m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "BNA", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 0m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "BNA", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "4h 30m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "BNA", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "2h 35m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "AUS", airline: "American Airlines", airlineCode: "AA", basePrice: 140, duration: "1h 5m", typical_flights_per_day: 12, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "AUS", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "3h 25m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "AUS", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 55m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "PHX", to: "AUS", airline: "American Airlines", airlineCode: "AA", basePrice: 220, duration: "2h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "IAH", airline: "American Airlines", airlineCode: "AA", basePrice: 150, duration: "1h 10m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "IAH", airline: "American Airlines", airlineCode: "AA", basePrice: 300, duration: "3h 30m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "IAH", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "2h 50m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "IAH", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "SAT", airline: "American Airlines", airlineCode: "AA", basePrice: 145, duration: "1h 10m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "SAT", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "3h 5m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "SAT", airline: "American Airlines", airlineCode: "AA", basePrice: 295, duration: "3h 20m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "BTV", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "2h 45m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "BTV", airline: "American Airlines", airlineCode: "AA", basePrice: 230, duration: "2h 35m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "DCA", airline: "American Airlines", airlineCode: "AA", basePrice: 300, duration: "3h 40m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "DCA", airline: "American Airlines", airlineCode: "AA", basePrice: 240, duration: "2h 15m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "DCA", airline: "American Airlines", airlineCode: "AA", basePrice: 390, duration: "6h 15m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "DCA", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "3h 0m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "IAD", airline: "American Airlines", airlineCode: "AA", basePrice: 310, duration: "3h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "IAD", airline: "American Airlines", airlineCode: "AA", basePrice: 395, duration: "6h 20m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "IAD", airline: "American Airlines", airlineCode: "AA", basePrice: 250, duration: "2h 20m", typical_flights_per_day: 6, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "CRW", airline: "American Airlines", airlineCode: "AA", basePrice: 200, duration: "1h 45m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "CLT", to: "CRW", airline: "American Airlines", airlineCode: "AA", basePrice: 160, duration: "1h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ORD", to: "MKE", airline: "American Airlines", airlineCode: "AA", basePrice: 145, duration: "1h 5m", typical_flights_per_day: 10, countries: { from: "USA", to: "USA" } },
  { from: "DFW", to: "MKE", airline: "American Airlines", airlineCode: "AA", basePrice: 270, duration: "2h 55m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "LAX", to: "MKE", airline: "American Airlines", airlineCode: "AA", basePrice: 340, duration: "4h 35m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "JAC", airline: "American Airlines", airlineCode: "AA", basePrice: 180, duration: "1h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "SLC", to: "JAC", airline: "American Airlines", airlineCode: "AA", basePrice: 160, duration: "1h 20m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  
  // ===== PRIORITY ROUTES - ADDED 2025-10-17 =====
  // Connects major hubs that were previously unlinked
  { from: "ATL", to: "MSP", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "2h 19m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "ATL", to: "SAN", airline: "American Airlines", airlineCode: "AA", basePrice: 395, duration: "4h 17m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "ATL", to: "PDX", airline: "American Airlines", airlineCode: "AA", basePrice: 410, duration: "4h 51m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "BOS", to: "IAH", airline: "American Airlines", airlineCode: "AA", basePrice: 375, duration: "3h 41m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "BOS", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 385, duration: "4h 0m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "BOS", to: "SEA", airline: "American Airlines", airlineCode: "AA", basePrice: 430, duration: "5h 30m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "MSP", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "1h 52m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "IAH", airline: "American Airlines", airlineCode: "AA", basePrice: 285, duration: "2h 15m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "DEN", to: "BOS", airline: "American Airlines", airlineCode: "AA", basePrice: 385, duration: "4h 0m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "IAH", to: "MSP", airline: "American Airlines", airlineCode: "AA", basePrice: 315, duration: "2h 34m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "IAH", to: "SEA", airline: "American Airlines", airlineCode: "AA", basePrice: 395, duration: "4h 17m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "IAH", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 285, duration: "2h 15m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "IAH", to: "BOS", airline: "American Airlines", airlineCode: "AA", basePrice: 375, duration: "3h 41m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "MIA", to: "MSP", airline: "American Airlines", airlineCode: "AA", basePrice: 370, duration: "3h 31m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "MSP", to: "IAH", airline: "American Airlines", airlineCode: "AA", basePrice: 315, duration: "2h 34m", typical_flights_per_day: 3, countries: { from: "USA", to: "USA" } },
  { from: "MSP", to: "ATL", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "2h 19m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "MSP", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 370, duration: "3h 31m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "MSP", to: "DEN", airline: "American Airlines", airlineCode: "AA", basePrice: 260, duration: "1h 52m", typical_flights_per_day: 8, countries: { from: "USA", to: "USA" } },
  { from: "PDX", to: "ATL", airline: "American Airlines", airlineCode: "AA", basePrice: 410, duration: "4h 51m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "SAN", to: "ATL", airline: "American Airlines", airlineCode: "AA", basePrice: 395, duration: "4h 17m", typical_flights_per_day: 4, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "IAH", airline: "American Airlines", airlineCode: "AA", basePrice: 395, duration: "4h 17m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
  { from: "SEA", to: "BOS", airline: "American Airlines", airlineCode: "AA", basePrice: 430, duration: "5h 30m", typical_flights_per_day: 2, countries: { from: "USA", to: "USA" } },
];

// Continúa en el siguiente mensaje...

// ===== RUTAS INTERNACIONALES =====

// === SUDAMÉRICA (Solo American Airlines) ===
const SOUTH_AMERICA_ROUTES: SimulatedRoute[] = [
  // Colombia
  { from: "JFK", to: "BOG", airline: "American Airlines", airlineCode: "AA", basePrice: 450, duration: "5h 30m", typical_flights_per_day: 5, countries: { from: "USA", to: "Colombia" } },
  { from: "MIA", to: "BOG", airline: "American Airlines", airlineCode: "AA", basePrice: 450, duration: "5h 30m", typical_flights_per_day: 5, countries: { from: "USA", to: "Colombia" } },
  { from: "DFW", to: "BOG", airline: "American Airlines", airlineCode: "AA", basePrice: 450, duration: "5h 30m", typical_flights_per_day: 5, countries: { from: "USA", to: "Colombia" } },
  { from: "MIA", to: "MDE", airline: "American Airlines", airlineCode: "AA", basePrice: 400, duration: "4h 0m", typical_flights_per_day: 4, countries: { from: "USA", to: "Colombia" } },
  
  // Brasil
  { from: "JFK", to: "GRU", airline: "American Airlines", airlineCode: "AA", basePrice: 650, duration: "10h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "Brazil" } },
  { from: "MIA", to: "GRU", airline: "American Airlines", airlineCode: "AA", basePrice: 650, duration: "10h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "Brazil" } },
  { from: "DFW", to: "GRU", airline: "American Airlines", airlineCode: "AA", basePrice: 650, duration: "10h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "Brazil" } },
  { from: "MIA", to: "GIG", airline: "American Airlines", airlineCode: "AA", basePrice: 580, duration: "8h 55m", typical_flights_per_day: 4, countries: { from: "USA", to: "Brazil" } },
  
  // Argentina
  { from: "JFK", to: "EZE", airline: "American Airlines", airlineCode: "AA", basePrice: 700, duration: "10h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "Argentina" } },
  { from: "MIA", to: "EZE", airline: "American Airlines", airlineCode: "AA", basePrice: 700, duration: "10h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "Argentina" } },
  
  // Chile
  { from: "MIA", to: "SCL", airline: "American Airlines", airlineCode: "AA", basePrice: 680, duration: "9h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "Chile" } },
  { from: "DFW", to: "SCL", airline: "American Airlines", airlineCode: "AA", basePrice: 720, duration: "10h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "Chile" } },
  
  // Perú
  { from: "JFK", to: "LIM", airline: "American Airlines", airlineCode: "AA", basePrice: 500, duration: "8h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "Peru" } },
  { from: "MIA", to: "LIM", airline: "American Airlines", airlineCode: "AA", basePrice: 450, duration: "6h 35m", typical_flights_per_day: 4, countries: { from: "USA", to: "Peru" } },
  
  // Ecuador
  { from: "MIA", to: "UIO", airline: "American Airlines", airlineCode: "AA", basePrice: 480, duration: "5h 25m", typical_flights_per_day: 3, countries: { from: "USA", to: "Ecuador" } },
  { from: "DFW", to: "UIO", airline: "American Airlines", airlineCode: "AA", basePrice: 520, duration: "7h 10m", typical_flights_per_day: 3, countries: { from: "USA", to: "Ecuador" } },
];

// === NORTEAMÉRICA (Canadá, México) ===
const NORTH_AMERICA_ROUTES: SimulatedRoute[] = [
  // Canadá
  { from: "JFK", to: "YYZ", airline: "Porter Airlines", airlineCode: "PD", basePrice: 220, duration: "1h 45m", typical_flights_per_day: 6, countries: { from: "USA", to: "Canada" } },
  { from: "BOS", to: "YYZ", airline: "Porter Airlines", airlineCode: "PD", basePrice: 210, duration: "1h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "Canada" } },
  { from: "LAX", to: "YVR", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 240, duration: "2h 50m", typical_flights_per_day: 8, countries: { from: "USA", to: "Canada" } },
  { from: "SEA", to: "YVR", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 150, duration: "1h 0m", typical_flights_per_day: 12, countries: { from: "USA", to: "Canada" } },
  { from: "JFK", to: "YUL", airline: "Porter Airlines", airlineCode: "PD", basePrice: 210, duration: "1h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "Canada" } },
  { from: "LAX", to: "YUL", airline: "American Airlines", airlineCode: "AA", basePrice: 420, duration: "5h 45m", typical_flights_per_day: 2, countries: { from: "USA", to: "Canada" } },
  { from: "JFK", to: "YYC", airline: "Porter Airlines", airlineCode: "PD", basePrice: 280, duration: "2h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "Canada" } },
  { from: "LAX", to: "YYC", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 280, duration: "2h 45m", typical_flights_per_day: 6, countries: { from: "USA", to: "Canada" } },
  { from: "SEA", to: "YYC", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 180, duration: "1h 30m", typical_flights_per_day: 8, countries: { from: "USA", to: "Canada" } },
  
  // México
  { from: "JFK", to: "MEX", airline: "American Airlines", airlineCode: "AA", basePrice: 380, duration: "5h 15m", typical_flights_per_day: 3, countries: { from: "USA", to: "Mexico" } },
  { from: "MIA", to: "MEX", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "3h 25m", typical_flights_per_day: 4, countries: { from: "USA", to: "Mexico" } },
  { from: "DFW", to: "MEX", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "2h 45m", typical_flights_per_day: 8, countries: { from: "USA", to: "Mexico" } },
  { from: "LAX", to: "MEX", airline: "American Airlines", airlineCode: "AA", basePrice: 340, duration: "4h 10m", typical_flights_per_day: 6, countries: { from: "USA", to: "Mexico" } },
  { from: "MIA", to: "CUN", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "2h 10m", typical_flights_per_day: 6, countries: { from: "USA", to: "Mexico" } },
  { from: "DFW", to: "CUN", airline: "American Airlines", airlineCode: "AA", basePrice: 320, duration: "3h 20m", typical_flights_per_day: 4, countries: { from: "USA", to: "Mexico" } },
];

// === CENTRO AMÉRICA Y CARIBE ===
const CENTRAL_AMERICA_ROUTES: SimulatedRoute[] = [
  // Costa Rica
  { from: "MIA", to: "SJO", airline: "American Airlines", airlineCode: "AA", basePrice: 320, duration: "3h 10m", typical_flights_per_day: 4, countries: { from: "USA", to: "Costa Rica" } },
  { from: "DFW", to: "SJO", airline: "American Airlines", airlineCode: "AA", basePrice: 360, duration: "4h 25m", typical_flights_per_day: 2, countries: { from: "USA", to: "Costa Rica" } },
  
  // Panamá
  { from: "MIA", to: "PTY", airline: "American Airlines", airlineCode: "AA", basePrice: 340, duration: "3h 20m", typical_flights_per_day: 4, countries: { from: "USA", to: "Panama" } },
  { from: "DFW", to: "PTY", airline: "American Airlines", airlineCode: "AA", basePrice: 380, duration: "4h 35m", typical_flights_per_day: 2, countries: { from: "USA", to: "Panama" } },
  
  // República Dominicana
  { from: "MIA", to: "SDQ", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "2h 35m", typical_flights_per_day: 4, countries: { from: "USA", to: "Dominican Republic" } },
  { from: "JFK", to: "SDQ", airline: "American Airlines", airlineCode: "AA", basePrice: 320, duration: "3h 55m", typical_flights_per_day: 2, countries: { from: "USA", to: "Dominican Republic" } },
  { from: "MIA", to: "PUJ", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "2h 25m", typical_flights_per_day: 6, countries: { from: "USA", to: "Dominican Republic" } },
  { from: "JFK", to: "PUJ", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "3h 50m", typical_flights_per_day: 3, countries: { from: "USA", to: "Dominican Republic" } },
];

// === EUROPA ===
const EUROPE_ROUTES: SimulatedRoute[] = [
  // Reino Unido
  { from: "JFK", to: "LHR", airline: "American Airlines", airlineCode: "AA", basePrice: 550, duration: "7h 15m", typical_flights_per_day: 7, countries: { from: "USA", to: "United Kingdom" } },
  { from: "BOS", to: "LHR", airline: "American Airlines", airlineCode: "AA", basePrice: 550, duration: "7h 15m", typical_flights_per_day: 7, countries: { from: "USA", to: "United Kingdom" } },
  { from: "PHL", to: "LHR", airline: "American Airlines", airlineCode: "AA", basePrice: 550, duration: "7h 15m", typical_flights_per_day: 7, countries: { from: "USA", to: "United Kingdom" } },
  { from: "LAX", to: "LHR", airline: "American Airlines", airlineCode: "AA", basePrice: 550, duration: "7h 15m", typical_flights_per_day: 7, countries: { from: "USA", to: "United Kingdom" } },
  
  // Irlanda
  { from: "JFK", to: "DUB", airline: "Aer Lingus", airlineCode: "EI", basePrice: 520, duration: "6h 50m", typical_flights_per_day: 5, countries: { from: "USA", to: "Ireland" } },
  { from: "BOS", to: "DUB", airline: "Aer Lingus", airlineCode: "EI", basePrice: 520, duration: "6h 50m", typical_flights_per_day: 5, countries: { from: "USA", to: "Ireland" } },
  { from: "LAX", to: "DUB", airline: "Aer Lingus", airlineCode: "EI", basePrice: 520, duration: "6h 50m", typical_flights_per_day: 5, countries: { from: "USA", to: "Ireland" } },
  
  // Escocia
  { from: "JFK", to: "EDI", airline: "Aer Lingus", airlineCode: "EI", basePrice: 540, duration: "7h 5m", typical_flights_per_day: 4, countries: { from: "USA", to: "United Kingdom" } },
  { from: "LAX", to: "EDI", airline: "British Airways", airlineCode: "BA", basePrice: 650, duration: "10h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "United Kingdom" } },
  
  // Francia
  { from: "JFK", to: "CDG", airline: "Aer Lingus", airlineCode: "EI", basePrice: 570, duration: "7h 55m", typical_flights_per_day: 6, countries: { from: "USA", to: "France" } },
  { from: "BOS", to: "CDG", airline: "Aer Lingus", airlineCode: "EI", basePrice: 570, duration: "7h 55m", typical_flights_per_day: 6, countries: { from: "USA", to: "France" } },
  { from: "LAX", to: "CDG", airline: "American Airlines", airlineCode: "AA", basePrice: 640, duration: "11h 15m", typical_flights_per_day: 6, countries: { from: "USA", to: "France" } },
  
  // Alemania
  { from: "JFK", to: "MUC", airline: "British Airways", airlineCode: "BA", basePrice: 600, duration: "8h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "Germany" } },
  { from: "LAX", to: "MUC", airline: "American Airlines", airlineCode: "AA", basePrice: 680, duration: "11h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "Germany" } },
  
  // España
  { from: "JFK", to: "MAD", airline: "American Airlines", airlineCode: "AA", basePrice: 560, duration: "7h 45m", typical_flights_per_day: 6, countries: { from: "USA", to: "Spain" } },
  { from: "MIA", to: "MAD", airline: "American Airlines", airlineCode: "AA", basePrice: 560, duration: "7h 45m", typical_flights_per_day: 6, countries: { from: "USA", to: "Spain" } },
  { from: "JFK", to: "BCN", airline: "American Airlines", airlineCode: "AA", basePrice: 580, duration: "8h 0m", typical_flights_per_day: 5, countries: { from: "USA", to: "Spain" } },
  
  // Italia
  { from: "JFK", to: "FCO", airline: "British Airways", airlineCode: "BA", basePrice: 590, duration: "8h 50m", typical_flights_per_day: 5, countries: { from: "USA", to: "Italy" } },
  { from: "LAX", to: "FCO", airline: "American Airlines", airlineCode: "AA", basePrice: 670, duration: "12h 20m", typical_flights_per_day: 5, countries: { from: "USA", to: "Italy" } },
  { from: "JFK", to: "MXP", airline: "British Airways", airlineCode: "BA", basePrice: 580, duration: "8h 40m", typical_flights_per_day: 4, countries: { from: "USA", to: "Italy" } },
  { from: "LAX", to: "MXP", airline: "American Airlines", airlineCode: "AA", basePrice: 660, duration: "12h 10m", typical_flights_per_day: 4, countries: { from: "USA", to: "Italy" } },
  
  // Países Bajos
  { from: "JFK", to: "AMS", airline: "British Airways", airlineCode: "BA", basePrice: 580, duration: "7h 50m", typical_flights_per_day: 5, countries: { from: "USA", to: "Netherlands" } },
  { from: "LAX", to: "AMS", airline: "American Airlines", airlineCode: "AA", basePrice: 650, duration: "11h 20m", typical_flights_per_day: 5, countries: { from: "USA", to: "Netherlands" } },
  
  // Suiza
  { from: "JFK", to: "ZRH", airline: "British Airways", airlineCode: "BA", basePrice: 600, duration: "8h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "Switzerland" } },
  { from: "LAX", to: "ZRH", airline: "American Airlines", airlineCode: "AA", basePrice: 680, duration: "11h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "Switzerland" } },
  { from: "JFK", to: "GVA", airline: "British Airways", airlineCode: "BA", basePrice: 590, duration: "8h 5m", typical_flights_per_day: 4, countries: { from: "USA", to: "Switzerland" } },
  { from: "LAX", to: "GVA", airline: "American Airlines", airlineCode: "AA", basePrice: 670, duration: "11h 40m", typical_flights_per_day: 4, countries: { from: "USA", to: "Switzerland" } },
  
  // Portugal
  { from: "JFK", to: "LIS", airline: "British Airways", airlineCode: "BA", basePrice: 570, duration: "7h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "Portugal" } },
  { from: "LAX", to: "LIS", airline: "American Airlines", airlineCode: "AA", basePrice: 660, duration: "12h 0m", typical_flights_per_day: 4, countries: { from: "USA", to: "Portugal" } },
  
  // Grecia
  { from: "JFK", to: "ATH", airline: "British Airways", airlineCode: "BA", basePrice: 620, duration: "10h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "Greece" } },
  { from: "LAX", to: "ATH", airline: "American Airlines", airlineCode: "AA", basePrice: 720, duration: "14h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "Greece" } },
  
  // Dinamarca
  { from: "JFK", to: "CPH", airline: "Finnair", airlineCode: "AY", basePrice: 610, duration: "8h 20m", typical_flights_per_day: 4, countries: { from: "USA", to: "Denmark" } },
  { from: "LAX", to: "CPH", airline: "Qatar Airways", airlineCode: "QR", basePrice: 880, duration: "17h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "Denmark" } },
  
  // Suecia
  { from: "JFK", to: "ARN", airline: "British Airways", airlineCode: "BA", basePrice: 630, duration: "8h 45m", typical_flights_per_day: 3, countries: { from: "USA", to: "Sweden" } },
  { from: "LAX", to: "ARN", airline: "Icelandair", airlineCode: "FI", basePrice: 700, duration: "12h 30m", typical_flights_per_day: 3, countries: { from: "USA", to: "Sweden" } },
  
  // Noruega
  { from: "JFK", to: "OSL", airline: "Icelandair", airlineCode: "FI", basePrice: 620, duration: "8h 30m", typical_flights_per_day: 3, countries: { from: "USA", to: "Norway" } },
  { from: "LAX", to: "OSL", airline: "Icelandair", airlineCode: "FI", basePrice: 690, duration: "12h 15m", typical_flights_per_day: 3, countries: { from: "USA", to: "Norway" } },
  
  // Finlandia
  { from: "JFK", to: "HEL", airline: "Icelandair", airlineCode: "FI", basePrice: 650, duration: "8h 45m", typical_flights_per_day: 3, countries: { from: "USA", to: "Finland" } },
  { from: "LAX", to: "HEL", airline: "Icelandair", airlineCode: "FI", basePrice: 720, duration: "13h 0m", typical_flights_per_day: 3, countries: { from: "USA", to: "Finland" } },
  
  // Polonia
  { from: "JFK", to: "WAW", airline: "Qatar Airways", airlineCode: "QR", basePrice: 750, duration: "16h 45m", typical_flights_per_day: 3, countries: { from: "USA", to: "Poland" } },
  { from: "LAX", to: "WAW", airline: "Qatar Airways", airlineCode: "QR", basePrice: 850, duration: "20h 30m", typical_flights_per_day: 3, countries: { from: "USA", to: "Poland" } },
  
  // República Checa
  { from: "JFK", to: "PRG", airline: "Condor", airlineCode: "DE", basePrice: 620, duration: "9h 0m", typical_flights_per_day: 3, countries: { from: "USA", to: "Czech Republic" } },
  { from: "LAX", to: "PRG", airline: "Condor", airlineCode: "DE", basePrice: 710, duration: "13h 15m", typical_flights_per_day: 3, countries: { from: "USA", to: "Czech Republic" } },
  
  // Rumanía
  { from: "JFK", to: "OTP", airline: "Qatar Airways", airlineCode: "QR", basePrice: 780, duration: "17h 20m", typical_flights_per_day: 3, countries: { from: "USA", to: "Romania" } },
  { from: "LAX", to: "OTP", airline: "Qatar Airways", airlineCode: "QR", basePrice: 880, duration: "21h 0m", typical_flights_per_day: 3, countries: { from: "USA", to: "Romania" } },
  
  // Rusia (Moscú) - Alaska Airlines opera desde ambas costas
  { from: "JFK", to: "SVO", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 850, duration: "10h 30m", typical_flights_per_day: 3, countries: { from: "USA", to: "Russia" } },
  { from: "BOS", to: "SVO", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 840, duration: "10h 15m", typical_flights_per_day: 3, countries: { from: "USA", to: "Russia" } },
  { from: "PHL", to: "SVO", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 860, duration: "10h 45m", typical_flights_per_day: 2, countries: { from: "USA", to: "Russia" } },
  { from: "MIA", to: "SVO", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 900, duration: "12h 0m", typical_flights_per_day: 2, countries: { from: "USA", to: "Russia" } },
  { from: "LAX", to: "SVO", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 950, duration: "13h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "Russia" } },
  { from: "SFO", to: "SVO", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 940, duration: "13h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "Russia" } },
  { from: "SEA", to: "SVO", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 920, duration: "12h 45m", typical_flights_per_day: 5, countries: { from: "USA", to: "Russia" } },
];

// === ÁFRICA ===
const AFRICA_ROUTES: SimulatedRoute[] = [
  // Sudáfrica
  { from: "JFK", to: "JNB", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1150, duration: "20h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "South Africa" } },
  { from: "LAX", to: "JNB", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1200, duration: "24h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "South Africa" } },
  { from: "JFK", to: "CPT", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1180, duration: "21h 15m", typical_flights_per_day: 3, countries: { from: "USA", to: "South Africa" } },
  
  // Egipto
  { from: "JFK", to: "CAI", airline: "Qatar Airways", airlineCode: "QR", basePrice: 980, duration: "17h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "Egypt" } },
  { from: "LAX", to: "CAI", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1080, duration: "21h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "Egypt" } },
  
  // Marruecos
  { from: "JFK", to: "CMN", airline: "Royal Air Maroc", airlineCode: "AT", basePrice: 720, duration: "7h 50m", typical_flights_per_day: 4, countries: { from: "USA", to: "Morocco" } },
  { from: "LAX", to: "CMN", airline: "Qatar Airways", airlineCode: "QR", basePrice: 920, duration: "18h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "Morocco" } },
  
  // Kenia
  { from: "JFK", to: "NBO", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1100, duration: "19h 45m", typical_flights_per_day: 3, countries: { from: "USA", to: "Kenya" } },
  { from: "LAX", to: "NBO", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1180, duration: "23h 30m", typical_flights_per_day: 3, countries: { from: "USA", to: "Kenya" } },
  
  // Túnez
  { from: "JFK", to: "TUN", airline: "Qatar Airways", airlineCode: "QR", basePrice: 950, duration: "18h 0m", typical_flights_per_day: 3, countries: { from: "USA", to: "Tunisia" } },
  { from: "LAX", to: "TUN", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1050, duration: "21h 45m", typical_flights_per_day: 3, countries: { from: "USA", to: "Tunisia" } },
  
  // Tanzania
  { from: "JFK", to: "ZNZ", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1150, duration: "20h 30m", typical_flights_per_day: 3, countries: { from: "USA", to: "Tanzania" } },
  { from: "LAX", to: "ZNZ", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1230, duration: "24h 15m", typical_flights_per_day: 3, countries: { from: "USA", to: "Tanzania" } },
  
  // Ghana
  { from: "JFK", to: "ACC", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1020, duration: "18h 45m", typical_flights_per_day: 3, countries: { from: "USA", to: "Ghana" } },
  { from: "LAX", to: "ACC", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1120, duration: "22h 30m", typical_flights_per_day: 3, countries: { from: "USA", to: "Ghana" } },
  
  // Nigeria
  { from: "JFK", to: "ABV", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1050, duration: "19h 15m", typical_flights_per_day: 3, countries: { from: "USA", to: "Nigeria" } },
  { from: "LAX", to: "ABV", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1150, duration: "23h 0m", typical_flights_per_day: 3, countries: { from: "USA", to: "Nigeria" } },
];

// === ASIA ===
const ASIA_ROUTES: SimulatedRoute[] = [
  // Japón
  { from: "LAX", to: "NRT", airline: "Hawaiian Airlines", airlineCode: "HA", basePrice: 820, duration: "11h 30m", typical_flights_per_day: 6, countries: { from: "USA", to: "Japan" } },
  { from: "LAX", to: "HND", airline: "American Airlines", airlineCode: "AA", basePrice: 870, duration: "11h 25m", typical_flights_per_day: 6, countries: { from: "USA", to: "Japan" } },
  { from: "LAX", to: "KIX", airline: "Hawaiian Airlines", airlineCode: "HA", basePrice: 890, duration: "12h 0m", typical_flights_per_day: 5, countries: { from: "USA", to: "Japan" } },
  { from: "JFK", to: "NRT", airline: "American Airlines", airlineCode: "AA", basePrice: 950, duration: "14h 0m", typical_flights_per_day: 5, countries: { from: "USA", to: "Japan" } },
  { from: "JFK", to: "HND", airline: "American Airlines", airlineCode: "AA", basePrice: 980, duration: "13h 55m", typical_flights_per_day: 5, countries: { from: "USA", to: "Japan" } },
  
  // Corea del Sur
  { from: "LAX", to: "ICN", airline: "Hawaiian Airlines", airlineCode: "HA", basePrice: 850, duration: "12h 15m", typical_flights_per_day: 6, countries: { from: "USA", to: "South Korea" } },
  { from: "JFK", to: "ICN", airline: "American Airlines", airlineCode: "AA", basePrice: 970, duration: "14h 30m", typical_flights_per_day: 5, countries: { from: "USA", to: "South Korea" } },
  
  // China
  { from: "JFK", to: "PKX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1100, duration: "19h 30m", typical_flights_per_day: 1, countries: { from: "USA", to: "China" } },
  { from: "JFK", to: "PVG", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 880, duration: "13h 0m", typical_flights_per_day: 5, countries: { from: "USA", to: "China" } },
  { from: "LAX", to: "PVG", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 880, duration: "13h 0m", typical_flights_per_day: 5, countries: { from: "USA", to: "China" } },
  { from: "JFK", to: "CAN", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1080, duration: "19h 0m", typical_flights_per_day: 4, countries: { from: "USA", to: "China" } },
  { from: "LAX", to: "CAN", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 950, duration: "13h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "China" } },
  
  // India
  { from: "JFK", to: "DEL", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1050, duration: "18h 45m", typical_flights_per_day: 5, countries: { from: "USA", to: "India" } },
  { from: "LAX", to: "DEL", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1150, duration: "22h 30m", typical_flights_per_day: 5, countries: { from: "USA", to: "India" } },
  { from: "JFK", to: "BOM", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1070, duration: "19h 15m", typical_flights_per_day: 5, countries: { from: "USA", to: "India" } },
  { from: "LAX", to: "BOM", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1170, duration: "23h 0m", typical_flights_per_day: 5, countries: { from: "USA", to: "India" } },
  
  // Singapur
  { from: "JFK", to: "SIN", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1100, duration: "21h 30m", typical_flights_per_day: 5, countries: { from: "USA", to: "Singapore" } },
  { from: "LAX", to: "SIN", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 980, duration: "17h 45m", typical_flights_per_day: 5, countries: { from: "USA", to: "Singapore" } },
  
  // Tailandia
  { from: "JFK", to: "BKK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1080, duration: "22h 15m", typical_flights_per_day: 5, countries: { from: "USA", to: "Thailand" } },
  { from: "LAX", to: "BKK", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 960, duration: "18h 30m", typical_flights_per_day: 5, countries: { from: "USA", to: "Thailand" } },
  
  // Vietnam
  { from: "JFK", to: "HAN", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1120, duration: "22h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "Vietnam" } },
  { from: "LAX", to: "HAN", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 990, duration: "19h 0m", typical_flights_per_day: 4, countries: { from: "USA", to: "Vietnam" } },
  
  // Indonesia
  { from: "JFK", to: "DPS", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1200, duration: "24h 30m", typical_flights_per_day: 5, countries: { from: "USA", to: "Indonesia" } },
  { from: "LAX", to: "DPS", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 1050, duration: "20h 45m", typical_flights_per_day: 5, countries: { from: "USA", to: "Indonesia" } },
  { from: "JFK", to: "CGK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1180, duration: "24h 0m", typical_flights_per_day: 4, countries: { from: "USA", to: "Indonesia" } },
  { from: "LAX", to: "CGK", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 1030, duration: "20h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "Indonesia" } },
  
  // Filipinas
  { from: "JFK", to: "MNL", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1150, duration: "23h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "Philippines" } },
  { from: "LAX", to: "MNL", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 990, duration: "14h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "Philippines" } },
  
  // Malasia
  { from: "JFK", to: "KUL", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1130, duration: "23h 0m", typical_flights_per_day: 4, countries: { from: "USA", to: "Malaysia" } },
  { from: "LAX", to: "KUL", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 1000, duration: "18h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "Malaysia" } },
];

// === MEDIO ORIENTE ===
const MIDDLE_EAST_ROUTES: SimulatedRoute[] = [
  // Emiratos Árabes Unidos
  { from: "JFK", to: "DXB", airline: "Qatar Airways", airlineCode: "QR", basePrice: 920, duration: "14h 30m", typical_flights_per_day: 5, countries: { from: "USA", to: "United Arab Emirates" } },
  { from: "LAX", to: "DXB", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1000, duration: "18h 15m", typical_flights_per_day: 5, countries: { from: "USA", to: "United Arab Emirates" } },
  { from: "JFK", to: "AUH", airline: "Qatar Airways", airlineCode: "QR", basePrice: 930, duration: "14h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "United Arab Emirates" } },
  { from: "LAX", to: "AUH", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1010, duration: "18h 30m", typical_flights_per_day: 4, countries: { from: "USA", to: "United Arab Emirates" } },
  
  // Qatar
  { from: "JFK", to: "DOH", airline: "Qatar Airways", airlineCode: "QR", basePrice: 900, duration: "13h 10m", typical_flights_per_day: 5, countries: { from: "USA", to: "Qatar" } },
  { from: "LAX", to: "DOH", airline: "Qatar Airways", airlineCode: "QR", basePrice: 950, duration: "16h 20m", typical_flights_per_day: 5, countries: { from: "USA", to: "Qatar" } },
  
  // Arabia Saudita
  { from: "JFK", to: "RUH", airline: "Qatar Airways", airlineCode: "QR", basePrice: 940, duration: "15h 0m", typical_flights_per_day: 4, countries: { from: "USA", to: "Saudi Arabia" } },
  { from: "LAX", to: "RUH", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1020, duration: "18h 45m", typical_flights_per_day: 4, countries: { from: "USA", to: "Saudi Arabia" } },
  { from: "JFK", to: "JED", airline: "Qatar Airways", airlineCode: "QR", basePrice: 950, duration: "15h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "Saudi Arabia" } },
  { from: "LAX", to: "JED", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1030, duration: "19h 0m", typical_flights_per_day: 4, countries: { from: "USA", to: "Saudi Arabia" } },
  
  // Turquía
  { from: "JFK", to: "IST", airline: "Qatar Airways", airlineCode: "QR", basePrice: 850, duration: "16h 30m", typical_flights_per_day: 5, countries: { from: "USA", to: "Turkey" } },
  { from: "LAX", to: "IST", airline: "Qatar Airways", airlineCode: "QR", basePrice: 950, duration: "20h 15m", typical_flights_per_day: 5, countries: { from: "USA", to: "Turkey" } },
  
  // Jordania
  { from: "JFK", to: "AMM", airline: "Qatar Airways", airlineCode: "QR", basePrice: 920, duration: "16h 0m", typical_flights_per_day: 3, countries: { from: "USA", to: "Jordan" } },
  { from: "LAX", to: "AMM", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1010, duration: "19h 45m", typical_flights_per_day: 3, countries: { from: "USA", to: "Jordan" } },
  
  // Kuwait
  { from: "JFK", to: "KWI", airline: "Qatar Airways", airlineCode: "QR", basePrice: 930, duration: "15h 30m", typical_flights_per_day: 3, countries: { from: "USA", to: "Kuwait" } },
  { from: "LAX", to: "KWI", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1020, duration: "19h 15m", typical_flights_per_day: 3, countries: { from: "USA", to: "Kuwait" } },
];

// === OCEANÍA ===
const OCEANIA_ROUTES: SimulatedRoute[] = [
  // Australia
  { from: "JFK", to: "SYD", airline: "American Airlines", airlineCode: "AA", basePrice: 1300, duration: "21h 30m", typical_flights_per_day: 5, countries: { from: "USA", to: "Australia" } },
  { from: "LAX", to: "SYD", airline: "Qantas", airlineCode: "QF", basePrice: 1250, duration: "15h 5m", typical_flights_per_day: 5, countries: { from: "USA", to: "Australia" } },
  { from: "JFK", to: "MEL", airline: "American Airlines", airlineCode: "AA", basePrice: 1320, duration: "22h 0m", typical_flights_per_day: 4, countries: { from: "USA", to: "Australia" } },
  { from: "LAX", to: "MEL", airline: "Qantas", airlineCode: "QF", basePrice: 1270, duration: "15h 35m", typical_flights_per_day: 4, countries: { from: "USA", to: "Australia" } },
  
  // Nueva Zelanda
  { from: "JFK", to: "AKL", airline: "American Airlines", airlineCode: "AA", basePrice: 1350, duration: "19h 15m", typical_flights_per_day: 4, countries: { from: "USA", to: "New Zealand" } },
  { from: "LAX", to: "AKL", airline: "American Airlines", airlineCode: "AA", basePrice: 1280, duration: "13h 0m", typical_flights_per_day: 4, countries: { from: "USA", to: "New Zealand" } },
  
  // Fiji
  { from: "LAX", to: "NAN", airline: "Fiji Airways", airlineCode: "FJ", basePrice: 980, duration: "11h 15m", typical_flights_per_day: 3, countries: { from: "USA", to: "Fiji" } },
];

// ===== RUTAS INTERNACIONALES INVERSAS (WORLD → USA) =====
// Generadas automáticamente - 2025-10-17
const INTERNATIONAL_REVERSE_ROUTES: SimulatedRoute[] = [
{ from: "BOG", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 450, duration: "5h 30m", typical_flights_per_day: 5, countries: { from: "Colombia", to: "USA" } },
  { from: "BOG", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 450, duration: "5h 30m", typical_flights_per_day: 5, countries: { from: "Colombia", to: "USA" } },
  { from: "BOG", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 450, duration: "5h 30m", typical_flights_per_day: 5, countries: { from: "Colombia", to: "USA" } },
  { from: "MDE", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 400, duration: "4h 0m", typical_flights_per_day: 4, countries: { from: "Colombia", to: "USA" } },
  { from: "GRU", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 650, duration: "10h 15m", typical_flights_per_day: 4, countries: { from: "Brazil", to: "USA" } },
  { from: "GRU", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 650, duration: "10h 15m", typical_flights_per_day: 4, countries: { from: "Brazil", to: "USA" } },
  { from: "GRU", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 650, duration: "10h 15m", typical_flights_per_day: 4, countries: { from: "Brazil", to: "USA" } },
  { from: "GIG", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 580, duration: "8h 55m", typical_flights_per_day: 4, countries: { from: "Brazil", to: "USA" } },
  { from: "EZE", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 700, duration: "10h 50m", typical_flights_per_day: 4, countries: { from: "Argentina", to: "USA" } },
  { from: "EZE", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 700, duration: "10h 50m", typical_flights_per_day: 4, countries: { from: "Argentina", to: "USA" } },
  { from: "SCL", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 680, duration: "9h 45m", typical_flights_per_day: 4, countries: { from: "Chile", to: "USA" } },
  { from: "SCL", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 720, duration: "10h 30m", typical_flights_per_day: 4, countries: { from: "Chile", to: "USA" } },
  { from: "LIM", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 500, duration: "8h 15m", typical_flights_per_day: 4, countries: { from: "Peru", to: "USA" } },
  { from: "LIM", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 450, duration: "6h 35m", typical_flights_per_day: 4, countries: { from: "Peru", to: "USA" } },
  { from: "UIO", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 480, duration: "5h 25m", typical_flights_per_day: 3, countries: { from: "Ecuador", to: "USA" } },
  { from: "UIO", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 520, duration: "7h 10m", typical_flights_per_day: 3, countries: { from: "Ecuador", to: "USA" } },
  { from: "YYZ", to: "JFK", airline: "Porter Airlines", airlineCode: "PD", basePrice: 220, duration: "1h 45m", typical_flights_per_day: 6, countries: { from: "Canada", to: "USA" } },
  { from: "YYZ", to: "BOS", airline: "Porter Airlines", airlineCode: "PD", basePrice: 210, duration: "1h 50m", typical_flights_per_day: 4, countries: { from: "Canada", to: "USA" } },
  { from: "YVR", to: "LAX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 240, duration: "2h 50m", typical_flights_per_day: 8, countries: { from: "Canada", to: "USA" } },
  { from: "YVR", to: "SEA", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 150, duration: "1h 0m", typical_flights_per_day: 12, countries: { from: "Canada", to: "USA" } },
  { from: "YUL", to: "JFK", airline: "Porter Airlines", airlineCode: "PD", basePrice: 210, duration: "1h 30m", typical_flights_per_day: 4, countries: { from: "Canada", to: "USA" } },
  { from: "YUL", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 420, duration: "5h 45m", typical_flights_per_day: 2, countries: { from: "Canada", to: "USA" } },
  { from: "YYC", to: "JFK", airline: "Porter Airlines", airlineCode: "PD", basePrice: 280, duration: "2h 50m", typical_flights_per_day: 4, countries: { from: "Canada", to: "USA" } },
  { from: "YYC", to: "LAX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 280, duration: "2h 45m", typical_flights_per_day: 6, countries: { from: "Canada", to: "USA" } },
  { from: "YYC", to: "SEA", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 180, duration: "1h 30m", typical_flights_per_day: 8, countries: { from: "Canada", to: "USA" } },
  { from: "MEX", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 380, duration: "5h 15m", typical_flights_per_day: 3, countries: { from: "Mexico", to: "USA" } },
  { from: "MEX", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "3h 25m", typical_flights_per_day: 4, countries: { from: "Mexico", to: "USA" } },
  { from: "MEX", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "2h 45m", typical_flights_per_day: 8, countries: { from: "Mexico", to: "USA" } },
  { from: "MEX", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 340, duration: "4h 10m", typical_flights_per_day: 6, countries: { from: "Mexico", to: "USA" } },
  { from: "CUN", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "2h 10m", typical_flights_per_day: 6, countries: { from: "Mexico", to: "USA" } },
  { from: "CUN", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 320, duration: "3h 20m", typical_flights_per_day: 4, countries: { from: "Mexico", to: "USA" } },
  { from: "SJO", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 320, duration: "3h 10m", typical_flights_per_day: 4, countries: { from: "Costa Rica", to: "USA" } },
  { from: "SJO", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 360, duration: "4h 25m", typical_flights_per_day: 2, countries: { from: "Costa Rica", to: "USA" } },
  { from: "PTY", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 340, duration: "3h 20m", typical_flights_per_day: 4, countries: { from: "Panama", to: "USA" } },
  { from: "PTY", to: "DFW", airline: "American Airlines", airlineCode: "AA", basePrice: 380, duration: "4h 35m", typical_flights_per_day: 2, countries: { from: "Panama", to: "USA" } },
  { from: "SDQ", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 280, duration: "2h 35m", typical_flights_per_day: 4, countries: { from: "Dominican Republic", to: "USA" } },
  { from: "SDQ", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 320, duration: "3h 55m", typical_flights_per_day: 2, countries: { from: "Dominican Republic", to: "USA" } },
  { from: "PUJ", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 290, duration: "2h 25m", typical_flights_per_day: 6, countries: { from: "Dominican Republic", to: "USA" } },
  { from: "PUJ", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 330, duration: "3h 50m", typical_flights_per_day: 3, countries: { from: "Dominican Republic", to: "USA" } },
  { from: "LHR", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 550, duration: "7h 15m", typical_flights_per_day: 7, countries: { from: "United Kingdom", to: "USA" } },
  { from: "LHR", to: "BOS", airline: "American Airlines", airlineCode: "AA", basePrice: 550, duration: "7h 15m", typical_flights_per_day: 7, countries: { from: "United Kingdom", to: "USA" } },
  { from: "LHR", to: "PHL", airline: "American Airlines", airlineCode: "AA", basePrice: 550, duration: "7h 15m", typical_flights_per_day: 7, countries: { from: "United Kingdom", to: "USA" } },
  { from: "LHR", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 550, duration: "7h 15m", typical_flights_per_day: 7, countries: { from: "United Kingdom", to: "USA" } },
  { from: "DUB", to: "JFK", airline: "Aer Lingus", airlineCode: "EI", basePrice: 520, duration: "6h 50m", typical_flights_per_day: 5, countries: { from: "Ireland", to: "USA" } },
  { from: "DUB", to: "BOS", airline: "Aer Lingus", airlineCode: "EI", basePrice: 520, duration: "6h 50m", typical_flights_per_day: 5, countries: { from: "Ireland", to: "USA" } },
  { from: "DUB", to: "LAX", airline: "Aer Lingus", airlineCode: "EI", basePrice: 520, duration: "6h 50m", typical_flights_per_day: 5, countries: { from: "Ireland", to: "USA" } },
  { from: "EDI", to: "JFK", airline: "Aer Lingus", airlineCode: "EI", basePrice: 540, duration: "7h 5m", typical_flights_per_day: 4, countries: { from: "United Kingdom", to: "USA" } },
  { from: "EDI", to: "LAX", airline: "British Airways", airlineCode: "BA", basePrice: 650, duration: "10h 50m", typical_flights_per_day: 4, countries: { from: "United Kingdom", to: "USA" } },
  { from: "CDG", to: "JFK", airline: "Aer Lingus", airlineCode: "EI", basePrice: 570, duration: "7h 55m", typical_flights_per_day: 6, countries: { from: "France", to: "USA" } },
  { from: "CDG", to: "BOS", airline: "Aer Lingus", airlineCode: "EI", basePrice: 570, duration: "7h 55m", typical_flights_per_day: 6, countries: { from: "France", to: "USA" } },
  { from: "CDG", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 640, duration: "11h 15m", typical_flights_per_day: 6, countries: { from: "France", to: "USA" } },
  { from: "MUC", to: "JFK", airline: "British Airways", airlineCode: "BA", basePrice: 600, duration: "8h 30m", typical_flights_per_day: 4, countries: { from: "Germany", to: "USA" } },
  { from: "MUC", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 680, duration: "11h 45m", typical_flights_per_day: 4, countries: { from: "Germany", to: "USA" } },
  { from: "MAD", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 560, duration: "7h 45m", typical_flights_per_day: 6, countries: { from: "Spain", to: "USA" } },
  { from: "MAD", to: "MIA", airline: "American Airlines", airlineCode: "AA", basePrice: 560, duration: "7h 45m", typical_flights_per_day: 6, countries: { from: "Spain", to: "USA" } },
  { from: "BCN", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 580, duration: "8h 0m", typical_flights_per_day: 5, countries: { from: "Spain", to: "USA" } },
  { from: "FCO", to: "JFK", airline: "British Airways", airlineCode: "BA", basePrice: 590, duration: "8h 50m", typical_flights_per_day: 5, countries: { from: "Italy", to: "USA" } },
  { from: "FCO", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 670, duration: "12h 20m", typical_flights_per_day: 5, countries: { from: "Italy", to: "USA" } },
  { from: "MXP", to: "JFK", airline: "British Airways", airlineCode: "BA", basePrice: 580, duration: "8h 40m", typical_flights_per_day: 4, countries: { from: "Italy", to: "USA" } },
  { from: "MXP", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 660, duration: "12h 10m", typical_flights_per_day: 4, countries: { from: "Italy", to: "USA" } },
  { from: "AMS", to: "JFK", airline: "British Airways", airlineCode: "BA", basePrice: 580, duration: "7h 50m", typical_flights_per_day: 5, countries: { from: "Netherlands", to: "USA" } },
  { from: "AMS", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 650, duration: "11h 20m", typical_flights_per_day: 5, countries: { from: "Netherlands", to: "USA" } },
  { from: "ZRH", to: "JFK", airline: "British Airways", airlineCode: "BA", basePrice: 600, duration: "8h 15m", typical_flights_per_day: 4, countries: { from: "Switzerland", to: "USA" } },
  { from: "ZRH", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 680, duration: "11h 50m", typical_flights_per_day: 4, countries: { from: "Switzerland", to: "USA" } },
  { from: "GVA", to: "JFK", airline: "British Airways", airlineCode: "BA", basePrice: 590, duration: "8h 5m", typical_flights_per_day: 4, countries: { from: "Switzerland", to: "USA" } },
  { from: "GVA", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 670, duration: "11h 40m", typical_flights_per_day: 4, countries: { from: "Switzerland", to: "USA" } },
  { from: "LIS", to: "JFK", airline: "British Airways", airlineCode: "BA", basePrice: 570, duration: "7h 30m", typical_flights_per_day: 4, countries: { from: "Portugal", to: "USA" } },
  { from: "LIS", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 660, duration: "12h 0m", typical_flights_per_day: 4, countries: { from: "Portugal", to: "USA" } },
  { from: "ATH", to: "JFK", airline: "British Airways", airlineCode: "BA", basePrice: 620, duration: "10h 15m", typical_flights_per_day: 4, countries: { from: "Greece", to: "USA" } },
  { from: "ATH", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 720, duration: "14h 30m", typical_flights_per_day: 4, countries: { from: "Greece", to: "USA" } },
  { from: "CPH", to: "JFK", airline: "Finnair", airlineCode: "AY", basePrice: 610, duration: "8h 20m", typical_flights_per_day: 4, countries: { from: "Denmark", to: "USA" } },
  { from: "CPH", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 880, duration: "17h 45m", typical_flights_per_day: 4, countries: { from: "Denmark", to: "USA" } },
  { from: "ARN", to: "JFK", airline: "British Airways", airlineCode: "BA", basePrice: 630, duration: "8h 45m", typical_flights_per_day: 3, countries: { from: "Sweden", to: "USA" } },
  { from: "ARN", to: "LAX", airline: "Icelandair", airlineCode: "FI", basePrice: 700, duration: "12h 30m", typical_flights_per_day: 3, countries: { from: "Sweden", to: "USA" } },
  { from: "OSL", to: "JFK", airline: "Icelandair", airlineCode: "FI", basePrice: 620, duration: "8h 30m", typical_flights_per_day: 3, countries: { from: "Norway", to: "USA" } },
  { from: "OSL", to: "LAX", airline: "Icelandair", airlineCode: "FI", basePrice: 690, duration: "12h 15m", typical_flights_per_day: 3, countries: { from: "Norway", to: "USA" } },
  { from: "HEL", to: "JFK", airline: "Icelandair", airlineCode: "FI", basePrice: 650, duration: "8h 45m", typical_flights_per_day: 3, countries: { from: "Finland", to: "USA" } },
  { from: "HEL", to: "LAX", airline: "Icelandair", airlineCode: "FI", basePrice: 720, duration: "13h 0m", typical_flights_per_day: 3, countries: { from: "Finland", to: "USA" } },
  { from: "WAW", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 750, duration: "16h 45m", typical_flights_per_day: 3, countries: { from: "Poland", to: "USA" } },
  { from: "WAW", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 850, duration: "20h 30m", typical_flights_per_day: 3, countries: { from: "Poland", to: "USA" } },
  { from: "PRG", to: "JFK", airline: "Condor", airlineCode: "DE", basePrice: 620, duration: "9h 0m", typical_flights_per_day: 3, countries: { from: "Czech Republic", to: "USA" } },
  { from: "PRG", to: "LAX", airline: "Condor", airlineCode: "DE", basePrice: 710, duration: "13h 15m", typical_flights_per_day: 3, countries: { from: "Czech Republic", to: "USA" } },
  { from: "OTP", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 780, duration: "17h 20m", typical_flights_per_day: 3, countries: { from: "Romania", to: "USA" } },
  { from: "OTP", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 880, duration: "21h 0m", typical_flights_per_day: 3, countries: { from: "Romania", to: "USA" } },
  { from: "JNB", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1150, duration: "20h 45m", typical_flights_per_day: 4, countries: { from: "South Africa", to: "USA" } },
  { from: "JNB", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1200, duration: "24h 30m", typical_flights_per_day: 4, countries: { from: "South Africa", to: "USA" } },
  { from: "CPT", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1180, duration: "21h 15m", typical_flights_per_day: 3, countries: { from: "South Africa", to: "USA" } },
  { from: "CAI", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 980, duration: "17h 30m", typical_flights_per_day: 4, countries: { from: "Egypt", to: "USA" } },
  { from: "CAI", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1080, duration: "21h 15m", typical_flights_per_day: 4, countries: { from: "Egypt", to: "USA" } },
  { from: "CMN", to: "JFK", airline: "Royal Air Maroc", airlineCode: "AT", basePrice: 720, duration: "7h 50m", typical_flights_per_day: 4, countries: { from: "Morocco", to: "USA" } },
  { from: "CMN", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 920, duration: "18h 30m", typical_flights_per_day: 4, countries: { from: "Morocco", to: "USA" } },
  { from: "NBO", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1100, duration: "19h 45m", typical_flights_per_day: 3, countries: { from: "Kenya", to: "USA" } },
  { from: "NBO", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1180, duration: "23h 30m", typical_flights_per_day: 3, countries: { from: "Kenya", to: "USA" } },
  { from: "TUN", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 950, duration: "18h 0m", typical_flights_per_day: 3, countries: { from: "Tunisia", to: "USA" } },
  { from: "TUN", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1050, duration: "21h 45m", typical_flights_per_day: 3, countries: { from: "Tunisia", to: "USA" } },
  { from: "ZNZ", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1150, duration: "20h 30m", typical_flights_per_day: 3, countries: { from: "Tanzania", to: "USA" } },
  { from: "ZNZ", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1230, duration: "24h 15m", typical_flights_per_day: 3, countries: { from: "Tanzania", to: "USA" } },
  { from: "ACC", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1020, duration: "18h 45m", typical_flights_per_day: 3, countries: { from: "Ghana", to: "USA" } },
  { from: "ACC", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1120, duration: "22h 30m", typical_flights_per_day: 3, countries: { from: "Ghana", to: "USA" } },
  { from: "ABV", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1050, duration: "19h 15m", typical_flights_per_day: 3, countries: { from: "Nigeria", to: "USA" } },
  { from: "ABV", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1150, duration: "23h 0m", typical_flights_per_day: 3, countries: { from: "Nigeria", to: "USA" } },
  { from: "NRT", to: "LAX", airline: "Hawaiian Airlines", airlineCode: "HA", basePrice: 820, duration: "11h 30m", typical_flights_per_day: 6, countries: { from: "Japan", to: "USA" } },
  { from: "NRT", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 950, duration: "14h 0m", typical_flights_per_day: 5, countries: { from: "Japan", to: "USA" } },
  { from: "HND", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 870, duration: "11h 25m", typical_flights_per_day: 6, countries: { from: "Japan", to: "USA" } },
  { from: "HND", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 980, duration: "13h 55m", typical_flights_per_day: 5, countries: { from: "Japan", to: "USA" } },
  { from: "KIX", to: "LAX", airline: "Hawaiian Airlines", airlineCode: "HA", basePrice: 890, duration: "12h 0m", typical_flights_per_day: 5, countries: { from: "Japan", to: "USA" } },
  { from: "ICN", to: "LAX", airline: "Hawaiian Airlines", airlineCode: "HA", basePrice: 850, duration: "12h 15m", typical_flights_per_day: 6, countries: { from: "South Korea", to: "USA" } },
  { from: "ICN", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 970, duration: "14h 30m", typical_flights_per_day: 5, countries: { from: "South Korea", to: "USA" } },
  { from: "PKX", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1100, duration: "19h 30m", typical_flights_per_day: 1, countries: { from: "China", to: "USA" } },
  { from: "PVG", to: "JFK", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 880, duration: "13h 0m", typical_flights_per_day: 5, countries: { from: "China", to: "USA" } },
  { from: "PVG", to: "LAX", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 880, duration: "13h 0m", typical_flights_per_day: 5, countries: { from: "China", to: "USA" } },
  { from: "CAN", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1080, duration: "19h 0m", typical_flights_per_day: 4, countries: { from: "China", to: "USA" } },
  { from: "CAN", to: "LAX", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 950, duration: "13h 30m", typical_flights_per_day: 4, countries: { from: "China", to: "USA" } },
  { from: "DEL", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1050, duration: "18h 45m", typical_flights_per_day: 5, countries: { from: "India", to: "USA" } },
  { from: "DEL", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1150, duration: "22h 30m", typical_flights_per_day: 5, countries: { from: "India", to: "USA" } },
  { from: "BOM", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1070, duration: "19h 15m", typical_flights_per_day: 5, countries: { from: "India", to: "USA" } },
  { from: "BOM", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1170, duration: "23h 0m", typical_flights_per_day: 5, countries: { from: "India", to: "USA" } },
  { from: "SIN", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1100, duration: "21h 30m", typical_flights_per_day: 5, countries: { from: "Singapore", to: "USA" } },
  { from: "SIN", to: "LAX", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 980, duration: "17h 45m", typical_flights_per_day: 5, countries: { from: "Singapore", to: "USA" } },
  { from: "BKK", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1080, duration: "22h 15m", typical_flights_per_day: 5, countries: { from: "Thailand", to: "USA" } },
  { from: "BKK", to: "LAX", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 960, duration: "18h 30m", typical_flights_per_day: 5, countries: { from: "Thailand", to: "USA" } },
  { from: "HAN", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1120, duration: "22h 45m", typical_flights_per_day: 4, countries: { from: "Vietnam", to: "USA" } },
  { from: "HAN", to: "LAX", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 990, duration: "19h 0m", typical_flights_per_day: 4, countries: { from: "Vietnam", to: "USA" } },
  { from: "DPS", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1200, duration: "24h 30m", typical_flights_per_day: 5, countries: { from: "Indonesia", to: "USA" } },
  { from: "DPS", to: "LAX", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 1050, duration: "20h 45m", typical_flights_per_day: 5, countries: { from: "Indonesia", to: "USA" } },
  { from: "CGK", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1180, duration: "24h 0m", typical_flights_per_day: 4, countries: { from: "Indonesia", to: "USA" } },
  { from: "CGK", to: "LAX", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 1030, duration: "20h 15m", typical_flights_per_day: 4, countries: { from: "Indonesia", to: "USA" } },
  { from: "MNL", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1150, duration: "23h 30m", typical_flights_per_day: 4, countries: { from: "Philippines", to: "USA" } },
  { from: "MNL", to: "LAX", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 990, duration: "14h 45m", typical_flights_per_day: 4, countries: { from: "Philippines", to: "USA" } },
  { from: "KUL", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1130, duration: "23h 0m", typical_flights_per_day: 4, countries: { from: "Malaysia", to: "USA" } },
  { from: "KUL", to: "LAX", airline: "Cathay Pacific", airlineCode: "CX", basePrice: 1000, duration: "18h 30m", typical_flights_per_day: 4, countries: { from: "Malaysia", to: "USA" } },
  { from: "DXB", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 920, duration: "14h 30m", typical_flights_per_day: 5, countries: { from: "United Arab Emirates", to: "USA" } },
  { from: "DXB", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1000, duration: "18h 15m", typical_flights_per_day: 5, countries: { from: "United Arab Emirates", to: "USA" } },
  { from: "AUH", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 930, duration: "14h 45m", typical_flights_per_day: 4, countries: { from: "United Arab Emirates", to: "USA" } },
  { from: "AUH", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1010, duration: "18h 30m", typical_flights_per_day: 4, countries: { from: "United Arab Emirates", to: "USA" } },
  { from: "DOH", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 900, duration: "13h 10m", typical_flights_per_day: 5, countries: { from: "Qatar", to: "USA" } },
  { from: "DOH", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 950, duration: "16h 20m", typical_flights_per_day: 5, countries: { from: "Qatar", to: "USA" } },
  { from: "RUH", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 940, duration: "15h 0m", typical_flights_per_day: 4, countries: { from: "Saudi Arabia", to: "USA" } },
  { from: "RUH", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1020, duration: "18h 45m", typical_flights_per_day: 4, countries: { from: "Saudi Arabia", to: "USA" } },
  { from: "JED", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 950, duration: "15h 15m", typical_flights_per_day: 4, countries: { from: "Saudi Arabia", to: "USA" } },
  { from: "JED", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1030, duration: "19h 0m", typical_flights_per_day: 4, countries: { from: "Saudi Arabia", to: "USA" } },
  { from: "IST", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 850, duration: "16h 30m", typical_flights_per_day: 5, countries: { from: "Turkey", to: "USA" } },
  { from: "IST", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 950, duration: "20h 15m", typical_flights_per_day: 5, countries: { from: "Turkey", to: "USA" } },
  { from: "AMM", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 920, duration: "16h 0m", typical_flights_per_day: 3, countries: { from: "Jordan", to: "USA" } },
  { from: "AMM", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1010, duration: "19h 45m", typical_flights_per_day: 3, countries: { from: "Jordan", to: "USA" } },
  { from: "KWI", to: "JFK", airline: "Qatar Airways", airlineCode: "QR", basePrice: 930, duration: "15h 30m", typical_flights_per_day: 3, countries: { from: "Kuwait", to: "USA" } },
  { from: "KWI", to: "LAX", airline: "Qatar Airways", airlineCode: "QR", basePrice: 1020, duration: "19h 15m", typical_flights_per_day: 3, countries: { from: "Kuwait", to: "USA" } },
  { from: "SYD", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 1300, duration: "21h 30m", typical_flights_per_day: 5, countries: { from: "Australia", to: "USA" } },
  { from: "SYD", to: "LAX", airline: "Qantas", airlineCode: "QF", basePrice: 1250, duration: "15h 5m", typical_flights_per_day: 5, countries: { from: "Australia", to: "USA" } },
  { from: "MEL", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 1320, duration: "22h 0m", typical_flights_per_day: 4, countries: { from: "Australia", to: "USA" } },
  { from: "MEL", to: "LAX", airline: "Qantas", airlineCode: "QF", basePrice: 1270, duration: "15h 35m", typical_flights_per_day: 4, countries: { from: "Australia", to: "USA" } },
  { from: "AKL", to: "JFK", airline: "American Airlines", airlineCode: "AA", basePrice: 1350, duration: "19h 15m", typical_flights_per_day: 4, countries: { from: "New Zealand", to: "USA" } },
  { from: "AKL", to: "LAX", airline: "American Airlines", airlineCode: "AA", basePrice: 1280, duration: "13h 0m", typical_flights_per_day: 4, countries: { from: "New Zealand", to: "USA" } },
  { from: "NAN", to: "LAX", airline: "Fiji Airways", airlineCode: "FJ", basePrice: 980, duration: "11h 15m", typical_flights_per_day: 3, countries: { from: "Fiji", to: "USA" } },
  
  { from: "SVO", to: "JFK", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 850, duration: "10h 30m", typical_flights_per_day: 3, countries: { from: "Russia", to: "USA" } },
  { from: "SVO", to: "BOS", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 840, duration: "10h 15m", typical_flights_per_day: 3, countries: { from: "Russia", to: "USA" } },
  { from: "SVO", to: "PHL", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 860, duration: "10h 45m", typical_flights_per_day: 2, countries: { from: "Russia", to: "USA" } },
  { from: "SVO", to: "MIA", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 900, duration: "12h 0m", typical_flights_per_day: 2, countries: { from: "Russia", to: "USA" } },
  { from: "SVO", to: "LAX", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 950, duration: "13h 30m", typical_flights_per_day: 4, countries: { from: "Russia", to: "USA" } },
  { from: "SVO", to: "SFO", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 940, duration: "13h 15m", typical_flights_per_day: 4, countries: { from: "Russia", to: "USA" } },
  { from: "SVO", to: "SEA", airline: "Alaska Airlines", airlineCode: "AS", basePrice: 920, duration: "12h 45m", typical_flights_per_day: 5, countries: { from: "Russia", to: "USA" } },
];

// Consolidar todas las rutas
export const ALL_SIMULATED_ROUTES = [
  ...DOMESTIC_USA_ROUTES,
  ...SOUTH_AMERICA_ROUTES,
  ...NORTH_AMERICA_ROUTES,
  ...CENTRAL_AMERICA_ROUTES,
  ...EUROPE_ROUTES,
  ...AFRICA_ROUTES,
  ...ASIA_ROUTES,
  ...MIDDLE_EAST_ROUTES,
  ...OCEANIA_ROUTES,
  ...INTERNATIONAL_REVERSE_ROUTES, // ← 151 rutas inversas añadidas
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
