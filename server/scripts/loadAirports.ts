import { parse } from 'csv-parse';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from '../db.js';
import { airports } from '../../shared/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface AirportData {
  iataCode: string;
  icaoCode: string;
  name: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  timezone: string;
}

export async function loadAirports() {
  try {
    console.log('Loading airports from CSV...');
    
    const csvFilePath = join(__dirname, '../data/airports.csv');
    const csvContent = readFileSync(csvFilePath, 'utf-8');
    
    const records: AirportData[] = await new Promise((resolve, reject) => {
      parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
      }, (err, data: unknown) => {
        if (err) reject(err);
        else resolve(data as AirportData[]);
      });
    });
    
    console.log(`Found ${records.length} airports to import`);
    
    // Clear existing airports (optional - comment out to preserve existing data)
    // await db.delete(airports);
    
    // Insert airports in batches
    const batchSize = 50;
    let imported = 0;
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      
      const airportData = batch.map(record => ({
        iataCode: record.iataCode.toUpperCase(),
        icaoCode: record.icaoCode || null,
        name: record.name,
        city: record.city,
        country: record.country,
        latitude: record.latitude ? record.latitude : null,
        longitude: record.longitude ? record.longitude : null,
        timezone: record.timezone || null,
      }));
      
      await db.insert(airports)
        .values(airportData)
        .onConflictDoNothing();
      
      imported += batch.length;
      console.log(`Imported ${imported}/${records.length} airports`);
    }
    
    console.log('Airport import completed successfully!');
  } catch (error) {
    console.error('Error loading airports:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  loadAirports()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
