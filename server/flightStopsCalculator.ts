// Intelligent flight stops/layover calculator
// Calculates realistic number of stops based on flight characteristics

interface StopInfo {
  stops: number;
  layoverAirports?: string[];
}

/**
 * Calculate realistic number of stops for a flight
 * Based on duration, route type, and airline
 */
export function calculateFlightStops(
  duration: string,
  fromCountry: string,
  toCountry: string,
  airline: string
): StopInfo {
  // Parse duration to minutes
  const durationMatch = duration.match(/(\d+)h\s*(\d+)m/);
  if (!durationMatch) {
    return { stops: 0 };
  }
  
  const hours = parseInt(durationMatch[1]);
  const minutes = parseInt(durationMatch[2]);
  const totalMinutes = hours * 60 + minutes;
  
  // === DOMESTIC USA FLIGHTS ===
  // All domestic flights are direct (0 stops)
  const isDomestic = (fromCountry === 'USA' && toCountry === 'USA');
  if (isDomestic) {
    return { stops: 0 };
  }
  
  // === INTERNATIONAL FLIGHTS ===
  // Major alliance carriers (AA, AS, BA, etc.) have more direct routes
  const majorCarriers = ['AA', 'AS', 'BA', 'QF', 'EI', 'AY', 'FI', 'PD'];
  const isMajorCarrier = majorCarriers.includes(airline);
  
  // Short international (< 4 hours) - always direct
  if (totalMinutes < 240) {
    return { stops: 0 };
  }
  
  // Medium international (4-8 hours)
  if (totalMinutes < 480) {
    // Major carriers: direct
    // Regional carriers: 1 stop possible
    return {
      stops: isMajorCarrier ? 0 : (Math.random() > 0.7 ? 1 : 0),
    };
  }
  
  // Long-haul (8-12 hours)
  if (totalMinutes < 720) {
    // Major carriers: mostly direct, rare 1 stop
    // Regional carriers: usually 1 stop
    if (isMajorCarrier) {
      return {
        stops: Math.random() > 0.85 ? 1 : 0,
      };
    } else {
      return {
        stops: Math.random() > 0.3 ? 1 : 0,
      };
    }
  }
  
  // Ultra long-haul (12-18 hours)
  if (totalMinutes < 1080) {
    // These routes usually have 1 stop
    // Major carriers might have some direct options
    if (isMajorCarrier) {
      return {
        stops: Math.random() > 0.6 ? 1 : 0,
      };
    } else {
      return { stops: 1 };
    }
  }
  
  // Extreme long-haul (18+ hours)
  // Almost always 1-2 stops
  return {
    stops: Math.random() > 0.3 ? 2 : 1,
  };
}

/**
 * Determine likely layover airport based on route
 */
export function getLayoverAirport(
  from: string,
  to: string,
  airline: string
): string | null {
  // Major hubs by airline
  const airlineHubs: Record<string, string[]> = {
    'AA': ['DFW', 'CLT', 'ORD', 'MIA', 'PHX', 'JFK', 'LAX'],
    'AS': ['SEA', 'PDX', 'ANC'],
    'BA': ['LHR'],
    'QF': ['SYD', 'MEL'],
    'QR': ['DOH'],
    'EI': ['DUB'],
    'AY': ['HEL'],
    'FI': ['KEF'],
    'PD': ['YYZ'],
  };
  
  const hubs = airlineHubs[airline] || ['DFW', 'ORD'];
  
  // Return first hub that's not origin or destination
  return hubs.find(hub => hub !== from && hub !== to) || hubs[0];
}

/**
 * Adjust flight duration based on stops
 * Each stop adds ~90 minutes (45min ground time + 45min routing inefficiency)
 */
export function adjustDurationForStops(duration: string, stops: number): string {
  if (stops === 0) return duration;
  
  const durationMatch = duration.match(/(\d+)h\s*(\d+)m/);
  if (!durationMatch) return duration;
  
  const hours = parseInt(durationMatch[1]);
  const minutes = parseInt(durationMatch[2]);
  let totalMinutes = hours * 60 + minutes;
  
  // Add 90 minutes per stop
  totalMinutes += stops * 90;
  
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  
  return `${newHours}h ${newMinutes}m`;
}
