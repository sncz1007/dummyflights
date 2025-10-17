import { readFileSync } from 'fs';
import { join } from 'path';

// Major US cities that should be well-connected
const MAJOR_US_CITIES = [
  // Top AA hubs
  'DFW', 'CLT', 'ORD', 'MIA', 'PHX', 'PHL', 'JFK', 'LAX',
  // Other major hubs
  'ATL', 'DEN', 'SFO', 'SEA', 'BOS', 'MCO', 'LAS', 'SLC',
  // Important cities
  'MSP', 'IAH', 'DTW', 'PDX', 'SAN', 'LGA', 'EWR', 'BWI',
  'AUS', 'SJC', 'OAK', 'TPA', 'FLL', 'PIT', 'CVG', 'CMH',
  'IND', 'MCI', 'BNA', 'MSY', 'RDU', 'SAT', 'SMF', 'HNL',
];

// Read simulatedFlights.ts
const filePath = join(process.cwd(), 'server', 'simulatedFlights.ts');
const fileContent = readFileSync(filePath, 'utf-8');

// Extract domestic routes (USA -> USA)
const routeRegex = /{ from: "([A-Z]{3})", to: "([A-Z]{3})", airline: "[^"]+", airlineCode: "[A-Z]{2,3}", basePrice: \d+, duration: "[^"]+", typical_flights_per_day: \d+, countries: { from: "USA", to: "USA" } }/g;

const existingRoutes = new Set<string>();
let match;

while ((match = routeRegex.exec(fileContent)) !== null) {
  const from = match[1];
  const to = match[2];
  existingRoutes.add(`${from}-${to}`);
}

console.log(`\n📊 Found ${existingRoutes.size} existing domestic USA routes\n`);

// Find missing bidirectional connections between major cities
const missingRoutes: Array<[string, string]> = [];

for (const city1 of MAJOR_US_CITIES) {
  for (const city2 of MAJOR_US_CITIES) {
    if (city1 >= city2) continue; // Avoid duplicates and self-routes
    
    const route1 = `${city1}-${city2}`;
    const route2 = `${city2}-${city1}`;
    
    const has1 = existingRoutes.has(route1);
    const has2 = existingRoutes.has(route2);
    
    if (!has1 && !has2) {
      // Neither direction exists
      missingRoutes.push([city1, city2]);
    } else if (!has1 && has2) {
      // Only reverse exists
      console.log(`⚠️  Unidirectional: ${city2}→${city1} exists, but ${city1}→${city2} missing`);
    } else if (has1 && !has2) {
      // Only forward exists  
      console.log(`⚠️  Unidirectional: ${city1}→${city2} exists, but ${city2}→${city1} missing`);
    }
  }
}

console.log(`\n🔍 MISSING ROUTES (both directions):`);
console.log(`   Total: ${missingRoutes.length} route pairs\n`);

if (missingRoutes.length > 0) {
  missingRoutes.forEach(([from, to], idx) => {
    if (idx < 20) { // Show first 20
      console.log(`   ${from} ↔ ${to}`);
    }
  });
  
  if (missingRoutes.length > 20) {
    console.log(`   ... and ${missingRoutes.length - 20} more\n`);
  }
}

// Export for use in generation script
console.log(`\n📝 Priority missing routes to add:`);
const priorityPairs = [
  ['MSP', 'IAH'], ['MSP', 'ATL'], ['MSP', 'MIA'], ['MSP', 'DEN'],
  ['IAH', 'MSP'], ['IAH', 'SEA'], ['IAH', 'DEN'], ['IAH', 'BOS'],
  ['ATL', 'SEA'], ['ATL', 'SAN'], ['ATL', 'PDX'],
  ['DEN', 'MIA'], ['DEN', 'BOS'], ['DEN', 'MSP'],
  ['SEA', 'IAH'], ['SEA', 'ATL'], ['SEA', 'MIA'],
  ['BOS', 'IAH'], ['BOS', 'DEN'], ['BOS', 'SEA'],
];

priorityPairs.forEach(([from, to]) => {
  const exists = existingRoutes.has(`${from}-${to}`);
  const status = exists ? '✅' : '❌';
  console.log(`   ${status} ${from} → ${to}`);
});

console.log(`\n💡 Recommendation:`);
console.log(`   Add ${priorityPairs.filter(([from, to]) => !existingRoutes.has(`${from}-${to}`)).length} priority routes`);
console.log(`   These connect major hubs that are currently unlinked\n`);
