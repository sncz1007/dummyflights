import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Read the reverse routes file
const reverseRoutesPath = join(process.cwd(), 'server', 'internationalReverseRoutes.ts');
const reverseContent = readFileSync(reverseRoutesPath, 'utf-8');

// Extract the routes array content (between [ and ])
const match = reverseContent.match(/const INTERNATIONAL_REVERSE_ROUTES: SimulatedRoute\[\] = \[([\s\S]*)\];/);
if (!match) {
  console.error('❌ Could not find routes array in internationalReverseRoutes.ts');
  process.exit(1);
}

const routesArrayContent = match[1].trim();

// Read the main simulated flights file
const simulatedFlightsPath = join(process.cwd(), 'server', 'simulatedFlights.ts');
const simulatedContent = readFileSync(simulatedFlightsPath, 'utf-8');

// Find and replace the INTERNATIONAL_REVERSE_ROUTES section
const pattern = /(\/\/ ===== RUTAS INTERNACIONALES INVERSAS[\s\S]*?const INTERNATIONAL_REVERSE_ROUTES: SimulatedRoute\[\] = \[)([\s\S]*?)(\];[\s\S]*?\/\/ Consolidar todas las rutas)/;

const replacement = `$1\n${routesArrayContent}\n$3`;

const newContent = simulatedContent.replace(pattern, replacement);

if (newContent === simulatedContent) {
  console.error('❌ No changes made - pattern did not match');
  process.exit(1);
}

// Write back
writeFileSync(simulatedFlightsPath, newContent, 'utf-8');

console.log('✅ Successfully injected all 151 reverse routes into simulatedFlights.ts');
console.log(`📊 File updated: ${simulatedFlightsPath}`);
