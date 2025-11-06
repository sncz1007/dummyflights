import PDFDocument from 'pdfkit';
import type { Booking } from '../shared/schema';
import { readFileSync } from 'fs';
import { join } from 'path';

// IATA Airline Accounting/Prefix Codes (3-digit codes for tickets)
// Official codes from IATA Airline Coding Directory
// Updated with 105 major airlines worldwide
const AIRLINE_ACCOUNTING_CODES: Record<string, string> = {
  // ========================================
  // NORTH AMERICA - Major Full-Service
  // ========================================
  'AA': '001', // American Airlines
  'DL': '006', // Delta Air Lines
  'UA': '016', // United Airlines
  'AS': '027', // Alaska Airlines
  'AC': '014', // Air Canada
  'WS': '838', // WestJet
  'HA': '173', // Hawaiian Airlines
  'TS': '649', // Air Transat
  
  // NORTH AMERICA - Low-Cost Carriers
  'WN': '526', // Southwest Airlines
  'B6': '279', // JetBlue Airways
  'NK': '487', // Spirit Airlines
  'F9': '422', // Frontier Airlines
  'G4': '794', // Allegiant Air
  'MX': '348', // Breeze Airways
  'PD': '451', // Porter Airlines
  
  // ========================================
  // LATIN AMERICA & CARIBBEAN
  // ========================================
  'LA': '045', // LATAM Airlines
  'AV': '134', // Avianca
  'CM': '230', // Copa Airlines
  'AM': '139', // Aeromexico
  'AR': '044', // Aerolineas Argentinas
  'G3': '127', // GOL Airlines
  'AD': '577', // Azul Brazilian Airlines
  'VB': '911', // Viva Aerobus
  'JA': '802', // JetSMART
  'H2': '901', // SKY Airline
  
  // ========================================
  // EUROPE - Major Full-Service
  // ========================================
  'BA': '125', // British Airways
  'IB': '075', // Iberia
  'LH': '020', // Lufthansa
  'AF': '057', // Air France
  'KL': '074', // KLM Royal Dutch Airlines
  'OS': '257', // Austrian Airlines
  'LX': '724', // Swiss International Air Lines
  'SN': '082', // Brussels Airlines
  'SK': '117', // SAS Scandinavian
  'AY': '105', // Finnair
  'EI': '053', // Aer Lingus
  'TP': '047', // TAP Air Portugal
  'AZ': '055', // ITA Airways
  'VS': '932', // Virgin Atlantic
  'LO': '080', // LOT Polish Airlines
  'BT': '657', // Air Baltic
  'JU': '115', // Air Serbia
  'OU': '831', // Croatia Airlines
  'FB': '421', // Bulgaria Air
  'A9': '572', // Georgian Airways
  
  // EUROPE - Low-Cost Carriers
  'FR': '106', // Ryanair
  'U2': '898', // easyJet
  'DY': '328', // Norwegian
  'W6': '284', // Wizz Air
  'BY': '235', // TUI Airways
  'XQ': '564', // SunExpress
  'HV': '979', // Transavia
  'EW': '882', // Eurowings
  'V7': '912', // Volotea
  'LS': '699', // Jet2.com
  'XC': '760', // Corendon Airlines
  
  // ========================================
  // MIDDLE EAST & AFRICA
  // ========================================
  'EK': '176', // Emirates
  'QR': '157', // Qatar Airways
  'EY': '607', // Etihad Airways
  'SV': '065', // Saudi Arabian Airlines
  'WY': '910', // Oman Air
  'FZ': '141', // FlyDubai
  'XY': '128', // Flynas
  'G9': '837', // Air Arabia
  'KU': '229', // Kuwait Airways
  'RJ': '512', // Royal Jordanian
  'AT': '147', // Royal Air Maroc
  'ET': '071', // Ethiopian Airlines
  'SA': '083', // South African Airways
  'MK': '239', // Air Mauritius
  'W5': '537', // Mahan Air
  'IR': '096', // Iran Air
  
  // ========================================
  // ASIA-PACIFIC - Major Full-Service
  // ========================================
  'SQ': '618', // Singapore Airlines
  'CX': '160', // Cathay Pacific Airways
  'NH': '205', // ANA All Nippon Airways
  'JL': '131', // Japan Airlines
  'TK': '235', // Turkish Airlines
  'KE': '180', // Korean Air
  'OZ': '988', // Asiana Airlines
  'TG': '217', // Thai Airways
  'VN': '738', // Vietnam Airlines
  'GA': '126', // Garuda Indonesia
  'MH': '232', // Malaysia Airlines
  'QF': '081', // Qantas Airways
  'NZ': '086', // Air New Zealand
  'FJ': '260', // Fiji Airways
  'PR': '079', // Philippine Airlines
  'AI': '098', // Air India
  'UK': '228', // Vistara
  'UL': '603', // SriLankan Airlines
  'HU': '880', // Hainan Airlines
  'CZ': '784', // China Southern Airlines
  'MU': '781', // China Eastern Airlines
  'CI': '297', // China Airlines
  'BR': '695', // EVA Air
  'JX': '324', // STARLUX Airlines
  'KC': '465', // Air Astana
  'HY': '250', // Uzbekistan Airways
  'J2': '771', // Azerbaijan Airlines
  'PK': '214', // Pakistan International Airlines
  
  // ASIA-PACIFIC - Low-Cost Carriers
  'TR': '618', // Scoot (shares SQ prefix)
  '5J': '203', // Cebu Pacific
  'AK': '807', // AirAsia
  '6E': '312', // IndiGo
  'SG': '775', // SpiceJet
  'JQ': '538', // Jetstar Airways
  'MM': '735', // Peach Aviation
  'DD': '644', // Nok Air
  'QH': '955', // Bamboo Airways
  'OD': '961', // Malindo Air (Batik Air Malaysia)
  
  // ========================================
  // EUROPEAN REGIONAL & CHARTER
  // ========================================
  'A3': '390', // Aegean Airlines
  'FI': '108', // Icelandair
  'PQ': '010', // SkyUp Airlines
};

// Download image from URL and return buffer
async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to download image from ${url}: ${response.status}`);
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
    return null;
  }
}

// Generate Amadeus-style PNR/Confirmation code (6 characters, NO 0 or 1)
function generateConfirmationCode(): string {
  // Amadeus PNR excludes 0 and 1 to avoid confusion with O and I
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate realistic ticket number (ETKT) using real airline accounting code
function generateTicketNumber(airlineCode: string): string {
  // Get the official 3-digit airline accounting code
  const accountingCode = AIRLINE_ACCOUNTING_CODES[airlineCode] || '999'; // 999 for unknown airlines
  
  // Generate 10-digit sequential ticket number
  const sequentialNumber = Math.floor(Math.random() * 9000000000 + 1000000000);
  
  // Format: XXX-YYYYYYYYYY (e.g., 001-1234567890 for American Airlines)
  return `${accountingCode}-${sequentialNumber}`;
}

// Generate consecutive seat numbers for multiple passengers
function generateConsecutiveSeats(count: number): string[] {
  const baseRow = Math.floor(Math.random() * 10 + 1); // Rows 1-10 (more realistic range)
  const seats = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  const consecutiveSeats: string[] = [];
  
  // For groups larger than 6, span multiple rows
  for (let i = 0; i < count; i++) {
    const rowOffset = Math.floor(i / seats.length);
    const seatIndex = i % seats.length;
    const row = baseRow + rowOffset;
    
    consecutiveSeats.push(`${row}${seats[seatIndex]}`);
  }
  
  return consecutiveSeats;
}

// Format date
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Format time
function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// Format date for header (e.g., "Oct 12, 2025")
function formatDateShort(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Format duration from ISO 8601 format (e.g., "PT2H30M" -> "2h 30m")
function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return isoDuration;
  
  const hours = match[1] || '0';
  const minutes = match[2] || '0';
  
  if (hours === '0') return `${minutes}m`;
  if (minutes === '0') return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

// Calculate layover time between two segments
function calculateLayoverTime(seg1: any, seg2: any): string {
  try {
    // Defensive guards for missing timestamps
    const arrivalTimeStr = seg1?.arrival?.dateTime || seg1?.arrival?.at;
    const departureTimeStr = seg2?.departure?.dateTime || seg2?.departure?.at;
    
    if (!arrivalTimeStr || !departureTimeStr) {
      return 'N/A';
    }
    
    const arrivalTime = new Date(arrivalTimeStr);
    const departureTime = new Date(departureTimeStr);
    
    // Check for invalid dates
    if (isNaN(arrivalTime.getTime()) || isNaN(departureTime.getTime())) {
      return 'N/A';
    }
    
    const diffMs = departureTime.getTime() - arrivalTime.getTime();
    
    // Guard against negative or invalid time differences
    if (diffMs < 0 || isNaN(diffMs)) {
      return 'N/A';
    }
    
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  } catch (error) {
    // Fallback for any unexpected errors
    return 'N/A';
  }
}

export async function generateBookingConfirmationPDF(booking: Booking): Promise<InstanceType<typeof PDFDocument>> {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  
  const flightData = JSON.parse(booking.selectedFlightData);
  const confirmationCode = booking.pnrCode || generateConfirmationCode();
  
  // Parse passenger data
  const passengers = [];
  passengers.push({ fullName: booking.fullName, dateOfBirth: booking.dateOfBirth });
  if (booking.additionalPassengers) {
    const additionalPassengers = JSON.parse(booking.additionalPassengers);
    passengers.push(...additionalPassengers);
  }
  
  // Generate consecutive seats for all passengers
  const seatNumbers = generateConsecutiveSeats(passengers.length);
  
  // Download and add airline logo (top right)
  if (flightData.airline.logo) {
    const logoBuffer = await downloadImage(flightData.airline.logo);
    if (logoBuffer) {
      try {
        doc.image(logoBuffer, 490, 45, { width: 60, height: 60 });
      } catch (error) {
        console.error('Error adding logo to PDF:', error);
      }
    }
  }
  
  // Date of Purchase
  doc.fontSize(11).font('Helvetica-Bold')
     .text(`Date of Purchase: ${formatDateShort(new Date())}`, 50, 50);
  
  // Title - Include airline name, smaller size, don't cover logo
  const airlineName = flightData.airline.name || 'Flight';
  doc.fontSize(14).font('Helvetica-Bold')
     .text(`${airlineName} Flight Receipt for ${booking.fromAirport} to ${booking.toAirport}`, 50, 80, { width: 420 });
  
  // PASSENGER INFORMATION Section
  doc.fontSize(12).font('Helvetica-Bold')
     .text('PASSENGER INFORMATION', 50, 130);
  
  // Generate unique ticket numbers for all passengers using real airline code
  const airlineCode = flightData.airline.code || 'AA'; // Default to AA if not available
  const baseTicketNumber = generateTicketNumber(airlineCode);
  
  // Display all passengers with their ticket numbers and seats
  let passengerY = 155;
  passengers.forEach((passenger, index) => {
    // Each passenger gets a unique ticket number (incrementing the last digit)
    const ticketParts = baseTicketNumber.split('-');
    const sequentialNumber = parseInt(ticketParts[1]) + index;
    const passengerTicketNumber = `${ticketParts[0]}-${sequentialNumber}`;
    
    doc.fontSize(11).font('Helvetica')
       .text(passenger.fullName.toUpperCase(), 50, passengerY);
    
    if (index === 0) {
      // Show confirmation number only for first passenger
      doc.fontSize(10).font('Helvetica')
         .text(`Confirmation Number: ${confirmationCode}`, 350, passengerY);
    }
    
    doc.fontSize(10).font('Helvetica')
       .text(`Ticket Number: ${passengerTicketNumber}`, 350, passengerY + (index === 0 ? 15 : 0))
       .text(`Seat: ${seatNumbers[index]}`, 350, passengerY + (index === 0 ? 30 : 15));
    
    passengerY += index === 0 ? 60 : 45;
  });
  
  // FLIGHT INFORMATION Section (adjust Y position based on number of passengers)
  let currentY = passengerY + 10;
  doc.fontSize(12).font('Helvetica-Bold')
     .text('FLIGHT INFORMATION', 50, currentY);
  
  currentY += 25;
  
  // Display all seats - join them all with commas
  const seatDisplay = seatNumbers.join(', ');
  
  // OUTBOUND FLIGHT - Detailed segment information
  const departureDate = new Date(booking.departureDate);
  
  // Main route header
  doc.fontSize(11).font('Helvetica-Bold')
     .fillColor('#E53E3E')
     .text(`${booking.fromAirport} → ${booking.toAirport}`, 50, currentY)
     .fillColor('#000000');
  
  doc.fontSize(9).font('Helvetica')
     .fillColor('#666666')
     .text(`${formatDate(departureDate)} • ${flightData.stops === 0 ? 'Nonstop' : `${flightData.stops} stop${flightData.stops > 1 ? 's' : ''}`} • ${formatDuration(flightData.duration)}`, 50, currentY + 15)
     .fillColor('#000000');
  
  currentY += 40;
  
  // Show all segments with details
  if (flightData.segments && flightData.segments.length > 0) {
    flightData.segments.forEach((segment: any, idx: number) => {
      // Defensive guards for missing data
      const airlineName = segment.airline?.name || 'Unknown Airline';
      const flightNumber = segment.flightNumber || 'N/A';
      const depAirport = segment.departure?.airport || 'N/A';
      const arrAirport = segment.arrival?.airport || 'N/A';
      const duration = segment.duration || 'N/A';
      
      // Airline and flight number
      doc.fontSize(10).font('Helvetica-Bold')
         .text(`${airlineName}`, 50, currentY);
      
      doc.fontSize(9).font('Helvetica')
         .fillColor('#666666')
         .text(`Flight ${flightNumber}`, 50, currentY + 12)
         .fillColor('#000000');
      
      // Times and airports with safe date parsing
      try {
        const depTime = new Date(segment.departure?.dateTime || segment.departure?.at);
        const arrTime = new Date(segment.arrival?.dateTime || segment.arrival?.at);
        
        doc.fontSize(9).font('Helvetica')
           .text(`${formatTime(depTime)} ${depAirport}`, 200, currentY)
           .text(`→`, 300, currentY)
           .text(`${formatTime(arrTime)} ${arrAirport}`, 320, currentY);
      } catch (e) {
        // Fallback if date parsing fails
        doc.fontSize(9).font('Helvetica')
           .text(`${depAirport} → ${arrAirport}`, 200, currentY);
      }
      
      // Duration
      doc.fontSize(8).font('Helvetica')
         .fillColor('#666666')
         .text(`Duration: ${formatDuration(duration)}`, 200, currentY + 12)
         .fillColor('#000000');
      
      currentY += 30;
      
      // Show layover if there's another segment
      if (idx < flightData.segments.length - 1) {
        const layoverTime = calculateLayoverTime(segment, flightData.segments[idx + 1]);
        const layoverCity = segment.arrival?.city || 'Unknown';
        doc.fontSize(8).font('Helvetica-Oblique')
           .fillColor('#666666')
           .text(`Layover in ${layoverCity} (${arrAirport}): ${layoverTime}`, 50, currentY)
           .fillColor('#000000');
        currentY += 20;
      }
    });
  }
  
  currentY += 10;
  
  // Return flight (if exists)
  if (booking.tripType === 'roundtrip' && booking.returnDate && flightData.returnFlightOptions) {
    const returnFlight = flightData.returnFlightOptions[0];
    const returnDate = new Date(booking.returnDate);
    
    // Draw separator line
    doc.moveTo(50, currentY)
       .lineTo(545, currentY)
       .stroke();
    
    currentY += 20;
    
    // Main route header for return
    doc.fontSize(11).font('Helvetica-Bold')
       .fillColor('#E53E3E')
       .text(`${booking.toAirport} → ${booking.fromAirport}`, 50, currentY)
       .fillColor('#000000');
    
    doc.fontSize(9).font('Helvetica')
       .fillColor('#666666')
       .text(`${formatDate(returnDate)} • ${returnFlight.stops === 0 ? 'Nonstop' : `${returnFlight.stops} stop${returnFlight.stops > 1 ? 's' : ''}`} • ${formatDuration(returnFlight.duration)}`, 50, currentY + 15)
       .fillColor('#000000');
    
    currentY += 40;
    
    // Show all return segments with details
    if (returnFlight.segments && returnFlight.segments.length > 0) {
      returnFlight.segments.forEach((segment: any, idx: number) => {
        // Defensive guards for missing data
        const airlineName = segment.airline?.name || 'Unknown Airline';
        const flightNumber = segment.flightNumber || 'N/A';
        const depAirport = segment.departure?.airport || 'N/A';
        const arrAirport = segment.arrival?.airport || 'N/A';
        const duration = segment.duration || 'N/A';
        
        // Airline and flight number
        doc.fontSize(10).font('Helvetica-Bold')
           .text(`${airlineName}`, 50, currentY);
        
        doc.fontSize(9).font('Helvetica')
           .fillColor('#666666')
           .text(`Flight ${flightNumber}`, 50, currentY + 12)
           .fillColor('#000000');
        
        // Times and airports with safe date parsing
        try {
          const depTime = new Date(segment.departure?.dateTime || segment.departure?.at);
          const arrTime = new Date(segment.arrival?.dateTime || segment.arrival?.at);
          
          doc.fontSize(9).font('Helvetica')
             .text(`${formatTime(depTime)} ${depAirport}`, 200, currentY)
             .text(`→`, 300, currentY)
             .text(`${formatTime(arrTime)} ${arrAirport}`, 320, currentY);
        } catch (e) {
          // Fallback if date parsing fails
          doc.fontSize(9).font('Helvetica')
             .text(`${depAirport} → ${arrAirport}`, 200, currentY);
        }
        
        // Duration
        doc.fontSize(8).font('Helvetica')
           .fillColor('#666666')
           .text(`Duration: ${formatDuration(duration)}`, 200, currentY + 12)
           .fillColor('#000000');
        
        currentY += 30;
        
        // Show layover if there's another segment
        if (idx < returnFlight.segments.length - 1) {
          const layoverTime = calculateLayoverTime(segment, returnFlight.segments[idx + 1]);
          const layoverCity = segment.arrival?.city || 'Unknown';
          doc.fontSize(8).font('Helvetica-Oblique')
             .fillColor('#666666')
             .text(`Layover in ${layoverCity} (${arrAirport}): ${layoverTime}`, 50, currentY)
             .fillColor('#000000');
          currentY += 20;
        }
      });
    }
    
    currentY += 10;
  }
  
  // Draw horizontal line after flights
  currentY += 20;
  doc.moveTo(50, currentY)
     .lineTo(545, currentY)
     .stroke();
  
  // FARE DETAILS Section
  currentY += 30;
  doc.fontSize(12).font('Helvetica-Bold')
     .text('FARE DETAILS', 50, currentY);
  
  currentY += 30;
  
  // Flight price (from Amadeus data)
  const flightPricePerPerson = flightData.originalPrice || flightData.discountedPrice || 0;
  const returnFlightPrice = flightData.returnFlightOptions?.[0]?.basePrice || 0;
  const baseFarePerPassenger = flightPricePerPerson + returnFlightPrice;
  const totalFlightPrice = baseFarePerPassenger * passengers.length;
  
  // Display base fare per passenger
  doc.fontSize(10).font('Helvetica')
     .text('Base fare per passenger', 50, currentY)
     .text(`$${baseFarePerPassenger.toFixed(2)} USD`, 450, currentY);
  
  currentY += 20;
  
  // Show total base fare if multiple passengers
  if (passengers.length > 1) {
    doc.fontSize(10).font('Helvetica')
       .text(`Total Base Fare (${passengers.length} passengers)`, 50, currentY)
       .text(`$${totalFlightPrice.toFixed(2)} USD`, 450, currentY);
    currentY += 20;
  }
  
  // Taxes and fees (if available from Amadeus)
  let taxesTotal = 0;
  
  // Try to get real tax data from Amadeus price.fees
  const amadeusFees = flightData.amadeusOffer?.price?.fees;
  
  if (amadeusFees && amadeusFees.length > 0) {
    currentY += 5;
    doc.fontSize(10).font('Helvetica-Bold')
       .text('Taxes, Fees and Charges', 50, currentY);
    currentY += 20;
    
    // Show individual fees/taxes from Amadeus with safe parsing
    amadeusFees.forEach((fee: any) => {
      const feeAmount = parseFloat(fee.amount);
      // Skip invalid fee amounts to prevent NaN totals
      if (isNaN(feeAmount) || feeAmount < 0) return;
      
      taxesTotal += feeAmount;
      const feeName = fee.type || 'Fee';
      
      doc.fontSize(9).font('Helvetica')
         .text(feeName, 50, currentY)
         .text(`$${feeAmount.toFixed(2)} USD`, 450, currentY);
      currentY += 15;
    });
    
    currentY += 5;
    doc.fontSize(10).font('Helvetica')
       .text('Total Taxes, Fees & Charges', 50, currentY)
       .text(`$${taxesTotal.toFixed(2)} USD`, 450, currentY);
  } else if (flightData.pricingDetails && flightData.pricingDetails.taxes) {
    // Fallback to legacy pricing details if available
    currentY += 5;
    doc.fontSize(10).font('Helvetica-Bold')
       .text('Taxes, Fees and Charges', 50, currentY);
    currentY += 20;
    
    Object.entries(flightData.pricingDetails.taxes).forEach(([taxName, amount]: [string, any]) => {
      const parsedAmount = parseFloat(amount);
      // Skip invalid amounts
      if (isNaN(parsedAmount) || parsedAmount < 0) return;
      
      taxesTotal += parsedAmount;
      doc.fontSize(9).font('Helvetica')
         .text(taxName, 50, currentY)
         .text(`$${parsedAmount.toFixed(2)} USD`, 450, currentY);
      currentY += 15;
    });
    
    currentY += 5;
    doc.fontSize(10).font('Helvetica')
       .text('Total Taxes, Fees & Charges', 50, currentY)
       .text(`$${taxesTotal.toFixed(2)} USD`, 450, currentY);
  }
  
  // Total - Only show USD price from Amadeus, no miles
  currentY += 30;
  const grandTotal = totalFlightPrice + taxesTotal;
  
  doc.fontSize(11).font('Helvetica-Bold')
     .text(`Total (${passengers.length} Passenger${passengers.length > 1 ? 's' : ''}):`, 50, currentY)
     .text(`$${grandTotal.toFixed(2)} USD`, 450, currentY);
  
  // Payment method
  currentY += 30;
  const lastFourDigits = Math.floor(Math.random() * 9000 + 1000);
  doc.fontSize(10).font('Helvetica')
     .text(`Paid with Visa ************${lastFourDigits}`, 50, currentY);
  
  // Draw horizontal line before moving to page 2
  currentY += 25;
  doc.moveTo(50, currentY)
     .lineTo(545, currentY)
     .stroke();
  
  // Add a new page for KEY OF TERMS to prevent text splitting
  doc.addPage();
  
  // KEY OF TERMS Section - Now on page 2
  currentY = 50; // Reset Y position for new page
  doc.fontSize(12).font('Helvetica-Bold')
     .text('KEY OF TERMS', 50, currentY);
  
  // Draw horizontal line
  doc.moveTo(50, currentY + 18)
     .lineTo(545, currentY + 18)
     .stroke();
  
  // Terms in two columns
  const col1X = 50;
  const col2X = 300;
  let termY = currentY + 28;
  
  const terms = [
    ['# - Arrival date different than departure date', 'F - Food available for purchase'],
    ['** - Check-in required', 'L - Lunch'],
    ['***- Multiple meals', 'LV - Departs'],
    ['*S$ - Multiple seats', 'M - Movie'],
    ['AR - Arrives', 'R - Refreshments, complimentary'],
    ['B - Breakfast', 'S - Snack'],
    ['C - Bagels / Beverages', 'T - Cold meal'],
    ['D - Dinner', 'V - Snacks for sale']
  ];
  
  doc.fontSize(8).font('Helvetica');
  terms.forEach(([term1, term2]) => {
    doc.text(term1, col1X, termY)
       .text(term2, col2X, termY);
    termY += 12;
  });
  
  return doc;
}

export async function generateReceiptPDF(booking: Booking, paymentMethod: string = 'Card'): Promise<InstanceType<typeof PDFDocument>> {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  
  const flightData = JSON.parse(booking.selectedFlightData);
  const confirmationNumber = booking.pnrCode || generateConfirmationCode();
  
  // Parse passenger data
  const passengers = [];
  passengers.push({ fullName: booking.fullName, dateOfBirth: booking.dateOfBirth });
  if (booking.additionalPassengers) {
    const additionalPassengers = JSON.parse(booking.additionalPassengers);
    passengers.push(...additionalPassengers);
  }
  
  // Add Flights Dummys logo
  try {
    const logoPath = join(process.cwd(), 'attached_assets', 'Flights Dummys Logo_1762366606834.png');
    const logoBuffer = readFileSync(logoPath);
    doc.image(logoBuffer, 50, 45, { width: 70, height: 70 });
  } catch (error) {
    console.error('Error adding Flights Dummys logo to receipt PDF:', error);
  }
  
  // Header with Flights Dummys branding
  doc.fontSize(24).font('Helvetica-Bold')
     .fillColor('#E53E3E')
     .text('FLIGHTS DUMMYS', 130, 60)
     .fillColor('#000000');
  
  // Date of purchase
  doc.fontSize(11).font('Helvetica-Bold')
     .text(`Date of Purchase: ${formatDateShort(new Date())}`, 50, 130);
  
  // Title
  doc.fontSize(18).font('Helvetica-Bold')
     .text('Service Payment Receipt', 50, 160);
  
  // Booking information
  doc.fontSize(12).font('Helvetica-Bold')
     .text('BOOKING INFORMATION', 50, 210);
  
  doc.fontSize(11).font('Helvetica')
     .text(`Customer: ${booking.fullName.toUpperCase()}`, 50, 235);
  
  doc.fontSize(10).font('Helvetica')
     .text(`Confirmation Number: ${confirmationNumber}`, 50, 255)
     .text(`Email: ${booking.email}`, 50, 270);
  
  // Flight route information
  doc.fontSize(12).font('Helvetica-Bold')
     .text('FLIGHT RESERVATION DETAILS', 50, 310);
  
  const departureDate = new Date(booking.departureDate);
  doc.fontSize(10).font('Helvetica')
     .text(`Route: ${booking.fromAirport} → ${booking.toAirport}`, 50, 335)
     .text(`Departure: ${formatDate(departureDate)}`, 50, 350)
     .text(`Passengers: ${passengers.length}`, 50, 365)
     .text(`Class: ${booking.flightClass.charAt(0).toUpperCase() + booking.flightClass.slice(1)}`, 50, 380);
  
  if (booking.tripType === 'roundtrip' && booking.returnDate) {
    const returnDate = new Date(booking.returnDate);
    doc.fontSize(10).font('Helvetica')
       .text(`Return: ${formatDate(returnDate)}`, 50, 395);
  }
  
  // Draw horizontal line
  doc.moveTo(50, 425)
     .lineTo(545, 425)
     .stroke();
  
  // Service fee section
  doc.fontSize(12).font('Helvetica-Bold')
     .text('SERVICE FEE BREAKDOWN', 50, 445);
  
  const serviceFeePerPassenger = 15;
  const totalServiceFee = serviceFeePerPassenger * passengers.length;
  
  doc.fontSize(10).font('Helvetica')
     .text('Dummy Ticket Service Fee', 50, 475)
     .text(`${passengers.length} passenger${passengers.length > 1 ? 's' : ''} × $${serviceFeePerPassenger}.00 USD`, 50, 490);
  
  doc.fontSize(10).font('Helvetica')
     .text(`$${totalServiceFee}.00 USD`, 450, 475);
  
  // Draw horizontal line
  doc.moveTo(50, 515)
     .lineTo(545, 515)
     .stroke();
  
  // Total
  doc.fontSize(12).font('Helvetica-Bold')
     .text('TOTAL PAID:', 50, 535);
  
  doc.fontSize(12).font('Helvetica-Bold')
     .text(`$${totalServiceFee}.00 USD`, 450, 535);
  
  // Payment method - use REAL payment method (no random numbers for PayPal)
  let paymentMethodText = '';
  if (paymentMethod.toLowerCase().includes('paypal')) {
    paymentMethodText = 'PayPal';
  } else {
    // For card payments (Stripe, etc.), show masked card number
    const lastFourDigits = Math.floor(Math.random() * 9000 + 1000);
    paymentMethodText = `${paymentMethod} ************${lastFourDigits}`;
  }
  
  doc.fontSize(10).font('Helvetica')
     .text(`Payment Method: ${paymentMethodText}`, 50, 565);
  
  // Important note
  doc.fontSize(9).font('Helvetica')
     .fillColor('#666666')
     .text('Note: This receipt is for the dummy ticket service fee only.', 50, 600)
     .text('The actual flight tickets will be purchased separately after payment.', 50, 615)
     .fillColor('#000000');
  
  // Footer - Thank you message
  doc.fontSize(10).font('Helvetica')
     .fillColor('#666666')
     .text('Thank you for choosing Flights Dummys!', 50, 720)
     .text('For questions or support, contact: info@flightsdummy.com', 50, 735)
     .fillColor('#000000');
  
  return doc;
}
