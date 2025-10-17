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

// Extract ONLY international routes (routes where FROM = "USA" and TO != "USA")
// This regex matches routes with countries: { from: "USA", to: "SomeCountry" } where SomeCountry != "USA"
const routeRegex = /{ from: "([A-Z]{3})", to: "([A-Z]{3})", airline: "([^"]+)", airlineCode: "([A-Z0-9]{2,3})", basePrice: (\d+), duration: "([^"]+)", typical_flights_per_day: (\d+), countries: { from: "USA", to: "([^"]+)" } }/g;

const internationalRoutes: SimulatedRoute[] = [];
let match;

while ((match = routeRegex.exec(fileContent)) !== null) {
  const fromAirport = match[1];
  const toAirport = match[2];
  const airline = match[3];
  const airlineCode = match[4];
  const basePrice = parseInt(match[5]);
  const duration = match[6];
  const flightsPerDay = parseInt(match[7]);
  const toCountry = match[8];
  
  // ONLY include if destination country is NOT "USA"
  if (toCountry !== 'USA') {
    internationalRoutes.push({
      from: fromAirport,
      to: toAirport,
      airline,
      airlineCode,
      basePrice,
      duration,
      typical_flights_per_day: flightsPerDay,
      countries: {
        from: 'USA',
        to: toCountry,
      },
    });
  }
}

console.log(`\n📊 Found ${internationalRoutes.length} TRUE international routes (USA → World)\n`);

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
// Generadas automáticamente - ${new Date().toISOString().split('T')[0]}
const INTERNATIONAL_REVERSE_ROUTES: SimulatedRoute[] = [
${reverseRoutes.join('\n')}
];
`;

console.log('📄 Sample of generated routes:\n');
console.log(reverseRoutes.slice(0, 10).join('\n'));
console.log('...\n');

// Save to file
const outputPath = join(process.cwd(), 'server', 'internationalReverseRoutes.ts');
writeFileSync(outputPath, reverseRoutesCode, 'utf-8');

console.log(`\n💾 Reverse routes saved to: ${outputPath}`);

// Generate summary statistics
const routesByCountry: Record<string, number> = {};
const routesByOrigin: Record<string, number> = {};

for (const route of internationalRoutes) {
  routesByCountry[route.countries.to] = (routesByCountry[route.countries.to] || 0) + 1;
  routesByOrigin[route.from] = (routesByOrigin[route.from] || 0) + 1;
}

console.log('\n📊 ROUTES BY DESTINATION COUNTRY:');
Object.entries(routesByCountry)
  .sort((a, b) => b[1] - a[1])
  .forEach(([country, count]) => {
    console.log(`   ${country.padEnd(20)} ${count} routes`);
  });

console.log('\n📊 ROUTES BY US ORIGIN CITY:');
Object.entries(routesByOrigin)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .forEach(([city, count]) => {
    console.log(`   ${city.padEnd(10)} ${count} routes`);
  });

console.log(`\n🎯 TOTAL: ${reverseRoutes.length} reverse routes generated`);
console.log('\n📋 NEXT STEP:');
console.log('   The routes have been saved to server/internationalReverseRoutes.ts');
console.log('   They will be automatically imported in the next step.\n');
