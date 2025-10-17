// Lista de aeropuertos principales para mostrar en el buscador
// Solo 1 aeropuerto por ciudad internacional y los más importantes para USA

export const MAIN_AIRPORTS = [
  // === USA - Aeropuertos principales por ciudad ===
  // Costa Este
  "JFK", // New York (principal internacional)
  "LGA", // New York LaGuardia
  "EWR", // Newark (New York área)
  "BOS", // Boston
  "PHL", // Philadelphia  
  "DCA", // Washington DC National
  "IAD", // Washington Dulles
  "BWI", // Baltimore
  "MIA", // Miami
  "FLL", // Fort Lauderdale
  "ATL", // Atlanta
  "CLT", // Charlotte
  "MCO", // Orlando
  
  // Costa Oeste
  "LAX", // Los Angeles (principal internacional)
  "SFO", // San Francisco
  "SAN", // San Diego
  "LAS", // Las Vegas
  "PHX", // Phoenix
  "PDX", // Portland
  "SEA", // Seattle
  "SJC", // San José CA
  
  // Centro
  "ORD", // Chicago (principal)
  "DFW", // Dallas (principal)
  "IAH", // Houston (principal)
  "DEN", // Denver
  "MSP", // Minneapolis
  "DTW", // Detroit
  "AUS", // Austin
  
  // === CANADÁ ===
  "YYZ", // Toronto
  "YUL", // Montreal
  "YVR", // Vancouver
  "YYC", // Calgary
  
  // === MÉXICO ===
  "MEX", // Ciudad de México
  "CUN", // Cancún
  
  // === CENTROAMÉRICA ===
  "SJO", // San José, Costa Rica
  "PTY", // Ciudad de Panamá
  "SDQ", // Santo Domingo
  "PUJ", // Punta Cana
  
  // === SUDAMÉRICA ===
  "BOG", // Bogotá
  "MDE", // Medellín
  "GRU", // São Paulo (principal)
  "GIG", // Río de Janeiro
  "EZE", // Buenos Aires (principal internacional)
  "SCL", // Santiago
  "LIM", // Lima
  "UIO", // Quito
  
  // === EUROPA ===
  "LHR", // Londres (principal)
  "DUB", // Dublín
  "EDI", // Edimburgo
  "CDG", // París (principal)
  "MUC", // Múnich
  "MAD", // Madrid
  "BCN", // Barcelona
  "FCO", // Roma (principal)
  "MXP", // Milán (principal)
  "AMS", // Ámsterdam
  "ZRH", // Zúrich
  "GVA", // Ginebra
  "LIS", // Lisboa
  "ATH", // Atenas
  "CPH", // Copenhague
  "ARN", // Estocolmo
  "OSL", // Oslo
  "HEL", // Helsinki
  "WAW", // Varsovia
  "PRG", // Praga
  "OTP", // Bucarest
  
  // === ASIA ===
  "NRT", // Tokio (principal internacional)
  "HND", // Tokio Haneda
  "KIX", // Osaka
  "ICN", // Seúl
  "PKX", // Beijing (principal nuevo)
  "PVG", // Shanghái Pudong (principal)
  "CAN", // Guangzhou
  "DEL", // Delhi
  "BOM", // Mumbai
  "SIN", // Singapur
  "BKK", // Bangkok
  "HAN", // Hanói
  "DPS", // Bali
  "CGK", // Yakarta (principal)
  "MNL", // Manila
  "KUL", // Kuala Lumpur
  
  // === MEDIO ORIENTE ===
  "DXB", // Dubái (principal)
  "AUH", // Abu Dhabi
  "DOH", // Doha
  "RUH", // Riad
  "JED", // Yeda
  "IST", // Estambul (principal)
  "AMM", // Amán
  "KWI", // Kuwait
  
  // === OCEANÍA ===
  "SYD", // Sídney (principal)
  "MEL", // Melbourne
  "AKL", // Auckland
  "NAN", // Nadi (Fiji)
  
  // === ÁFRICA ===
  "CMN", // Casablanca
  "NBO", // Nairobi
  "TUN", // Túnez
  "ZNZ", // Zanzíbar
  "ACC", // Accra
  "ABV", // Abuja
  "CPT", // Ciudad del Cabo
  "CAI", // El Cairo
  "JNB", // Johannesburgo (principal)
];

// Función para verificar si un aeropuerto es principal
export function isMainAirport(iataCode: string): boolean {
  return MAIN_AIRPORTS.includes(iataCode.toUpperCase());
}
