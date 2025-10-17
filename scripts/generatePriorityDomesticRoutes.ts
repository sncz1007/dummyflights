import { writeFileSync } from 'fs';
import { join } from 'path';

// Priority routes to add (will be generated bidirectionally)
const PRIORITY_ROUTES = [
  // MSP connections
  { from: 'MSP', to: 'IAH', distance: 1034, hub: 'ORD' },
  { from: 'MSP', to: 'ATL', distance: 906, hub: 'ORD' },
  { from: 'MSP', to: 'MIA', distance: 1511, hub: 'ORD' },
  { from: 'MSP', to: 'DEN', distance: 680, hub: 'ORD' },
  // IAH connections
  { from: 'IAH', to: 'SEA', distance: 1891, hub: 'DEN' },
  { from: 'IAH', to: 'DEN', distance: 879, hub: 'DFW' },
  { from: 'IAH', to: 'BOS', distance: 1589, hub: 'ORD' },
  // ATL connections
  { from: 'ATL', to: 'SAN', distance: 1891, hub: 'DFW' },
  { from: 'ATL', to: 'PDX', distance: 2172, hub: 'DEN' },
  // DEN connections
  { from: 'DEN', to: 'BOS', distance: 1754, hub: 'ORD' },
  // BOS connections
  { from: 'BOS', to: 'SEA', distance: 2496, hub: 'ORD' },
];

interface RouteData {
  from: string;
  to: string;
  airline: string;
  airlineCode: string;
  basePrice: number;
  duration: string;
  typical_flights_per_day: number;
  countries: { from: string; to: string };
}

function calculateFlightDuration(distanceMiles: number): string {
  // Average cruising speed: 500 mph
  // Add 30min for takeoff/landing
  const flightTimeHours = (distanceMiles / 500) + 0.5;
  const hours = Math.floor(flightTimeHours);
  const minutes = Math.round((flightTimeHours - hours) * 60);
  return `${hours}h ${minutes}m`;
}

function calculateBasePrice(distanceMiles: number): number {
  // Pricing formula based on distance
  // Short (<500mi): $120-200
  // Medium (500-1000mi): $200-280
  // Long (1000-1500mi): $250-350
  // Very long (>1500mi): $320-420
  
  let basePrice: number;
  
  if (distanceMiles < 500) {
    basePrice = 120 + (distanceMiles * 0.15);
  } else if (distanceMiles < 1000) {
    basePrice = 180 + (distanceMiles * 0.12);
  } else if (distanceMiles < 1500) {
    basePrice = 220 + (distanceMiles * 0.09);
  } else {
    basePrice = 280 + (distanceMiles * 0.06);
  }
  
  // Round to nearest $5
  return Math.round(basePrice / 5) * 5;
}

function determineFlightsPerDay(distanceMiles: number, isHubRoute: boolean): number {
  // Hub routes have more frequency
  if (isHubRoute) {
    if (distanceMiles < 1000) return 8;
    if (distanceMiles < 1500) return 6;
    return 4;
  } else {
    if (distanceMiles < 1000) return 4;
    if (distanceMiles < 1500) return 3;
    return 2;
  }
}

// Generate routes
const generatedRoutes: RouteData[] = [];

// Major hubs that get more flights
const MAJOR_HUBS = ['DFW', 'CLT', 'ORD', 'MIA', 'PHX', 'ATL', 'DEN', 'LAX', 'JFK'];

for (const route of PRIORITY_ROUTES) {
  const isHubRoute = MAJOR_HUBS.includes(route.from) || MAJOR_HUBS.includes(route.to);
  
  // Generate both directions
  const directions = [
    { from: route.from, to: route.to },
    { from: route.to, to: route.from },
  ];
  
  for (const dir of directions) {
    generatedRoutes.push({
      from: dir.from,
      to: dir.to,
      airline: 'American Airlines',
      airlineCode: 'AA',
      basePrice: calculateBasePrice(route.distance),
      duration: calculateFlightDuration(route.distance),
      typical_flights_per_day: determineFlightsPerDay(route.distance, isHubRoute),
      countries: { from: 'USA', to: 'USA' },
    });
  }
}

console.log(`\n✅ Generated ${generatedRoutes.length} priority domestic routes (bidirectional)\n`);

// Sort by origin city
generatedRoutes.sort((a, b) => a.from.localeCompare(b.from));

// Format as TypeScript code
const routeLines = generatedRoutes.map(route => {
  return `  { from: "${route.from}", to: "${route.to}", airline: "${route.airline}", airlineCode: "${route.airlineCode}", basePrice: ${route.basePrice}, duration: "${route.duration}", typical_flights_per_day: ${route.typical_flights_per_day}, countries: { from: "USA", to: "USA" } },`;
});

const output = `
// ===== PRIORITY DOMESTIC ROUTES (GENERATED) =====
// Added ${new Date().toISOString().split('T')[0]} - Connects major hubs
// These routes fill critical gaps between important US cities

${routeLines.join('\n')}
`;

// Save to file
const outputPath = join(process.cwd(), 'server', 'priorityDomesticRoutes.ts');
writeFileSync(outputPath, output, 'utf-8');

console.log(`💾 Routes saved to: ${outputPath}\n`);
console.log('📊 Sample routes:\n');
routeLines.slice(0, 10).forEach(line => console.log(line));
console.log('...\n');

console.log(`\n🎯 NEXT STEPS:`);
console.log(`   1. Add these routes to DOMESTIC_USA_ROUTES in simulatedFlights.ts`);
console.log(`   2. This will increase total domestic routes from 446 to ${446 + generatedRoutes.length}\n`);
