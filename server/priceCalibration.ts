import Amadeus from 'amadeus';
import { ALL_SIMULATED_ROUTES } from './simulatedFlights.js';

interface PriceComparison {
  route: string;
  from: string;
  to: string;
  ourBasePrice: number;
  ourDiscountedPrice: number;
  amadeusPrice: number | null;
  amadeusAirline: string | null;
  priceDifference: number | null;
  percentageDifference: number | null;
  recommendedBasePrice: number | null;
}

interface CalibrationReport {
  domestic: PriceComparison[];
  international: PriceComparison[];
  summary: {
    domesticAvgDifference: number;
    internationalAvgDifference: number;
    routesTested: number;
    routesWithData: number;
  };
}

// Initialize Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY!,
  clientSecret: process.env.AMADEUS_API_SECRET!,
});

// Sample routes for calibration (representatives of each category)
const CALIBRATION_ROUTES = [
  // Domestic USA
  { from: 'JFK', to: 'MIA', type: 'domestic' },
  { from: 'JFK', to: 'LAX', type: 'domestic' },
  { from: 'DFW', to: 'JFK', type: 'domestic' },
  { from: 'ORD', to: 'LAX', type: 'domestic' },
  { from: 'ATL', to: 'DFW', type: 'domestic' },
  { from: 'MIA', to: 'ORD', type: 'domestic' },
  { from: 'LAX', to: 'SFO', type: 'domestic' },
  { from: 'BOS', to: 'MIA', type: 'domestic' },
  
  // International - Europe
  { from: 'JFK', to: 'MAD', type: 'international' },
  { from: 'JFK', to: 'LHR', type: 'international' },
  { from: 'JFK', to: 'CDG', type: 'international' },
  { from: 'LAX', to: 'LHR', type: 'international' },
  { from: 'MIA', to: 'CDG', type: 'international' },
  
  // International - Middle East
  { from: 'DFW', to: 'DOH', type: 'international' },
  { from: 'JFK', to: 'DXB', type: 'international' },
  
  // International - Asia
  { from: 'LAX', to: 'NRT', type: 'international' },
  { from: 'JFK', to: 'NRT', type: 'international' },
  
  // International - South America
  { from: 'JFK', to: 'BOG', type: 'international' },
  { from: 'MIA', to: 'GRU', type: 'international' },
];

async function getAmadeusPrice(from: string, to: string, date: string): Promise<{ price: number; airline: string } | null> {
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: from,
      destinationLocationCode: to,
      departureDate: date,
      adults: '1',
      currencyCode: 'USD',
      max: 5,
    });

    if (response.data && response.data.length > 0) {
      // Get the cheapest offer
      const cheapestOffer = response.data.reduce((min: any, offer: any) => 
        parseFloat(offer.price.total) < parseFloat(min.price.total) ? offer : min
      );
      
      const airline = cheapestOffer.validatingAirlineCodes?.[0] || 'Unknown';
      const price = parseFloat(cheapestOffer.price.total);
      
      return { price, airline };
    }
    
    return null;
  } catch (error: any) {
    console.error(`Error fetching Amadeus price for ${from}-${to}:`, error.description || error.message);
    return null;
  }
}

export async function runPriceCalibration(): Promise<CalibrationReport> {
  console.log('🔍 Starting price calibration with Amadeus API...\n');
  
  const domesticComparisons: PriceComparison[] = [];
  const internationalComparisons: PriceComparison[] = [];
  
  // Use a future date for price checks (30 days from now)
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  const dateStr = futureDate.toISOString().split('T')[0];
  
  let totalRoutes = 0;
  let successfulRoutes = 0;
  
  for (const calibRoute of CALIBRATION_ROUTES) {
    totalRoutes++;
    
    // Find the route in our simulator
    const simulatedRoute = ALL_SIMULATED_ROUTES.find(
      r => r.from === calibRoute.from && r.to === calibRoute.to
    );
    
    if (!simulatedRoute) {
      console.log(`⚠️  Route ${calibRoute.from}-${calibRoute.to} not found in simulator`);
      continue;
    }
    
    console.log(`Checking ${calibRoute.from} → ${calibRoute.to}...`);
    
    // Get Amadeus price (with delay to avoid rate limiting)
    await new Promise(resolve => setTimeout(resolve, 1000));
    const amadeusData = await getAmadeusPrice(calibRoute.from, calibRoute.to, dateStr);
    
    const ourBasePrice = simulatedRoute.basePrice;
    const ourDiscountedPrice = Math.round(ourBasePrice * 0.6); // Apply 40% discount
    
    let priceDifference = null;
    let percentageDifference = null;
    let recommendedBasePrice = null;
    
    if (amadeusData) {
      successfulRoutes++;
      priceDifference = ourDiscountedPrice - amadeusData.price;
      percentageDifference = ((ourDiscountedPrice - amadeusData.price) / amadeusData.price) * 100;
      
      // Recommend base price that would result in a discounted price matching Amadeus
      // Target: our discounted price should be close to Amadeus price
      recommendedBasePrice = Math.round(amadeusData.price / 0.6); // Reverse the 40% discount
      
      console.log(`  ✅ Amadeus: $${amadeusData.price} (${amadeusData.airline}), Our price: $${ourDiscountedPrice}, Diff: ${percentageDifference.toFixed(1)}%`);
    } else {
      console.log(`  ❌ No Amadeus data available`);
    }
    
    const comparison: PriceComparison = {
      route: `${calibRoute.from}-${calibRoute.to}`,
      from: calibRoute.from,
      to: calibRoute.to,
      ourBasePrice,
      ourDiscountedPrice,
      amadeusPrice: amadeusData?.price || null,
      amadeusAirline: amadeusData?.airline || null,
      priceDifference,
      percentageDifference,
      recommendedBasePrice,
    };
    
    if (calibRoute.type === 'domestic') {
      domesticComparisons.push(comparison);
    } else {
      internationalComparisons.push(comparison);
    }
  }
  
  // Calculate averages
  const domesticWithData = domesticComparisons.filter(c => c.percentageDifference !== null);
  const internationalWithData = internationalComparisons.filter(c => c.percentageDifference !== null);
  
  const domesticAvgDifference = domesticWithData.length > 0
    ? domesticWithData.reduce((sum, c) => sum + c.percentageDifference!, 0) / domesticWithData.length
    : 0;
    
  const internationalAvgDifference = internationalWithData.length > 0
    ? internationalWithData.reduce((sum, c) => sum + c.percentageDifference!, 0) / internationalWithData.length
    : 0;
  
  return {
    domestic: domesticComparisons,
    international: internationalComparisons,
    summary: {
      domesticAvgDifference,
      internationalAvgDifference,
      routesTested: totalRoutes,
      routesWithData: successfulRoutes,
    },
  };
}

export function generateCalibrationReport(report: CalibrationReport): string {
  let output = '\n' + '='.repeat(80) + '\n';
  output += '📊 PRICE CALIBRATION REPORT\n';
  output += '='.repeat(80) + '\n\n';
  
  output += `Summary:\n`;
  output += `- Routes tested: ${report.summary.routesTested}\n`;
  output += `- Routes with Amadeus data: ${report.summary.routesWithData}\n`;
  output += `- Domestic avg difference: ${report.summary.domesticAvgDifference.toFixed(1)}%\n`;
  output += `- International avg difference: ${report.summary.internationalAvgDifference.toFixed(1)}%\n\n`;
  
  output += '🏠 DOMESTIC ROUTES\n';
  output += '-'.repeat(80) + '\n';
  output += 'Route'.padEnd(15) + 'Our Base'.padEnd(12) + 'Our Disc'.padEnd(12) + 'Amadeus'.padEnd(12) + 'Diff %'.padEnd(12) + 'Recommended\n';
  output += '-'.repeat(80) + '\n';
  
  for (const comp of report.domestic) {
    const route = comp.route.padEnd(15);
    const ourBase = `$${comp.ourBasePrice}`.padEnd(12);
    const ourDisc = `$${comp.ourDiscountedPrice}`.padEnd(12);
    const amadeus = comp.amadeusPrice ? `$${comp.amadeusPrice}`.padEnd(12) : 'N/A'.padEnd(12);
    const diff = comp.percentageDifference !== null ? `${comp.percentageDifference > 0 ? '+' : ''}${comp.percentageDifference.toFixed(1)}%`.padEnd(12) : 'N/A'.padEnd(12);
    const rec = comp.recommendedBasePrice ? `$${comp.recommendedBasePrice}` : 'N/A';
    
    output += route + ourBase + ourDisc + amadeus + diff + rec + '\n';
  }
  
  output += '\n🌍 INTERNATIONAL ROUTES\n';
  output += '-'.repeat(80) + '\n';
  output += 'Route'.padEnd(15) + 'Our Base'.padEnd(12) + 'Our Disc'.padEnd(12) + 'Amadeus'.padEnd(12) + 'Diff %'.padEnd(12) + 'Recommended\n';
  output += '-'.repeat(80) + '\n';
  
  for (const comp of report.international) {
    const route = comp.route.padEnd(15);
    const ourBase = `$${comp.ourBasePrice}`.padEnd(12);
    const ourDisc = `$${comp.ourDiscountedPrice}`.padEnd(12);
    const amadeus = comp.amadeusPrice ? `$${comp.amadeusPrice}`.padEnd(12) : 'N/A'.padEnd(12);
    const diff = comp.percentageDifference !== null ? `${comp.percentageDifference > 0 ? '+' : ''}${comp.percentageDifference.toFixed(1)}%`.padEnd(12) : 'N/A'.padEnd(12);
    const rec = comp.recommendedBasePrice ? `$${comp.recommendedBasePrice}` : 'N/A';
    
    output += route + ourBase + ourDisc + amadeus + diff + rec + '\n';
  }
  
  output += '\n' + '='.repeat(80) + '\n';
  output += '💡 RECOMMENDATIONS\n';
  output += '='.repeat(80) + '\n\n';
  
  if (report.summary.domesticAvgDifference > 20) {
    output += `⚠️  DOMESTIC ROUTES are ${report.summary.domesticAvgDifference.toFixed(1)}% TOO EXPENSIVE\n`;
    output += `   Recommendation: Reduce domestic base prices by ~${Math.abs(report.summary.domesticAvgDifference).toFixed(0)}%\n\n`;
  } else if (report.summary.domesticAvgDifference < -20) {
    output += `⚠️  DOMESTIC ROUTES are ${Math.abs(report.summary.domesticAvgDifference).toFixed(1)}% TOO CHEAP\n`;
    output += `   Recommendation: Increase domestic base prices by ~${Math.abs(report.summary.domesticAvgDifference).toFixed(0)}%\n\n`;
  } else {
    output += `✅ DOMESTIC ROUTES are reasonably priced\n\n`;
  }
  
  if (report.summary.internationalAvgDifference > 20) {
    output += `⚠️  INTERNATIONAL ROUTES are ${report.summary.internationalAvgDifference.toFixed(1)}% TOO EXPENSIVE\n`;
    output += `   Recommendation: Reduce international base prices by ~${Math.abs(report.summary.internationalAvgDifference).toFixed(0)}%\n\n`;
  } else if (report.summary.internationalAvgDifference < -20) {
    output += `⚠️  INTERNATIONAL ROUTES are ${Math.abs(report.summary.internationalAvgDifference).toFixed(1)}% TOO CHEAP\n`;
    output += `   Recommendation: Increase international base prices by ~${Math.abs(report.summary.internationalAvgDifference).toFixed(0)}%\n\n`;
  } else {
    output += `✅ INTERNATIONAL ROUTES are reasonably priced\n\n`;
  }
  
  return output;
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  runPriceCalibration()
    .then(report => {
      const reportText = generateCalibrationReport(report);
      console.log(reportText);
      
      // Save to file
      const fs = require('fs');
      fs.writeFileSync('price_calibration_report.txt', reportText);
      console.log('\n📄 Report saved to: price_calibration_report.txt\n');
    })
    .catch(error => {
      console.error('Error running calibration:', error);
      process.exit(1);
    });
}
