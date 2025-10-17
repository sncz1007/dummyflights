import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface SimulatedRoute {
  from: string;
  to: string;
  airline: string;
  airlineCode: string;
  basePrice: number;
  duration: string;
  typical_flights_per_day: number;
  countries: {
    from: string;
    to: string;
  };
}

// Read the current simulatedFlights.ts file
const filePath = join(process.cwd(), 'server', 'simulatedFlights.ts');
const fileContent = readFileSync(filePath, 'utf-8');

// Extract international routes (routes where TO country is not USA)
const internationalRoutesRegex = /{ from: "([A-Z]{3})", to: "([A-Z]{3})", airline: "([^"]+)", airlineCode: "([A-Z]{2,3})", basePrice: (\d+), duration: "([^"]+)", typical_flights_per_day: (\d+), countries: { from: "USA", to: "([^"]+)" } }/g;

const internationalRoutes: SimulatedRoute[] = [];
let match;

while ((match = internationalRoutesRegex.exec(fileContent)) !== null) {
  internationalRoutes.push({
    from: match[1],
    to: match[2],
    airline: match[3],
    airlineCode: match[4],
    basePrice: parseInt(match[5]),
    duration: match[6],
    typical_flights_per_day: parseInt(match[7]),
    countries: {
      from: 'USA',
      to: match[8],
    },
  });
}

console.log(`\n📊 Found ${internationalRoutes.length} international routes (USA → World)\n`);

// Generate reverse routes (World → USA)
const reverseRoutes: string[] = [];

for (const route of internationalRoutes) {
  // Swap from/to and countries
  const reverseRoute = `  { from: "${route.to}", to: "${route.from}", airline: "${route.airline}", airlineCode: "${route.airlineCode}", basePrice: ${route.basePrice}, duration: "${route.duration}", typical_flights_per_day: ${route.typical_flights_per_day}, countries: { from: "${route.countries.to}", to: "USA" } },`;
  
  reverseRoutes.push(reverseRoute);
}

console.log(`✅ Generated ${reverseRoutes.length} reverse routes (World → USA)\n`);

// Generate the code to add to simulatedFlights.ts
const reverseRoutesCode = `
// ===== RUTAS INTERNACIONALES INVERSAS (WORLD → USA) =====
// Generadas automáticamente para permitir vuelos de regreso
const INTERNATIONAL_REVERSE_ROUTES: SimulatedRoute[] = [
${reverseRoutes.join('\n')}
];
`;

console.log('📄 REVERSE ROUTES CODE:\n');
console.log(reverseRoutesCode);

// Save to a separate file
const outputPath = join(process.cwd(), 'server', 'internationalReverseRoutes.generated.txt');
writeFileSync(outputPath, reverseRoutesCode, 'utf-8');

console.log(`\n💾 Reverse routes saved to: ${outputPath}`);
console.log('\n📋 NEXT STEPS:');
console.log('1. Review the generated routes in server/internationalReverseRoutes.generated.txt');
console.log('2. Copy the INTERNATIONAL_REVERSE_ROUTES array to server/simulatedFlights.ts');
console.log('3. Add ...INTERNATIONAL_REVERSE_ROUTES to the ALL_SIMULATED_ROUTES array\n');

// Generate summary statistics
const routesByCountry: Record<string, number> = {};
for (const route of internationalRoutes) {
  routesByCountry[route.countries.to] = (routesByCountry[route.countries.to] || 0) + 1;
}

console.log('📊 ROUTES BY DESTINATION COUNTRY:');
Object.entries(routesByCountry)
  .sort((a, b) => b[1] - a[1])
  .forEach(([country, count]) => {
    console.log(`   ${country}: ${count} routes`);
  });

console.log(`\n🎯 TOTAL: ${reverseRoutes.length} reverse routes will be added\n`);
