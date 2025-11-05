import PDFDocument from 'pdfkit';
import type { Booking } from '../shared/schema';
import { readFileSync } from 'fs';
import { join } from 'path';

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

// Generate random confirmation code
function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate random ticket number
function generateTicketNumber(): string {
  const prefix = Math.floor(Math.random() * 900 + 100); // 3 digits
  const middle = Math.floor(Math.random() * 90000000000 + 10000000000); // 11 digits
  return `${prefix}${middle}`;
}

// Generate consecutive seat numbers for multiple passengers
function generateConsecutiveSeats(count: number): string[] {
  const baseRow = Math.floor(Math.random() * 20 + 10); // Rows 10-29 (avoid front rows)
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
  
  // Generate unique ticket numbers for all passengers
  const baseTicketNumber = generateTicketNumber();
  
  // Display all passengers with their ticket numbers and seats
  let passengerY = 155;
  passengers.forEach((passenger, index) => {
    const passengerTicketNumber = `${baseTicketNumber.substring(0, 11)}${index}`;
    
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
  
  // Table header
  currentY += 30;
  doc.fontSize(10).font('Helvetica-Bold')
     .text('Date and Flight', 50, currentY)
     .text('Status', 280, currentY)
     .text('Class', 340, currentY)
     .text('Seat/Cabin', 420, currentY);
  
  // Draw horizontal line
  doc.moveTo(50, currentY + 15)
     .lineTo(545, currentY + 15)
     .stroke();
  
  // Outbound flight
  currentY += 25;
  const departureDate = new Date(booking.departureDate);
  
  doc.fontSize(10).font('Helvetica-Bold')
     .text(`${booking.fromAirport}-${booking.toAirport}`, 50, currentY);
  doc.fontSize(9).font('Helvetica')
     .text(`${formatDate(departureDate).replace(',', '')} ${flightData.flightNumber}`, 50, currentY + 12);
  
  // Display all seats - join them all with commas
  const seatDisplay = seatNumbers.join(', ');
  
  doc.fontSize(10).font('Helvetica')
     .text('ARPT', 280, currentY)
     .text(booking.flightClass.charAt(0).toUpperCase(), 340, currentY);
  
  // Use smaller font and text wrapping for seats if needed
  doc.fontSize(8).font('Helvetica')
     .text(seatDisplay, 420, currentY, { width: 125, align: 'left' });
  
  // Calculate height of seat text to adjust currentY properly
  const seatTextHeight = doc.heightOfString(seatDisplay, { width: 125 });
  const rowHeight = Math.max(30, seatTextHeight + 10); // At least 30, or seat height + padding
  
  // Show layovers/stops if any
  if (flightData.stops > 0 && flightData.segments && flightData.segments.length > 1) {
    currentY += rowHeight;
    const layoverCities = flightData.segments.slice(0, -1).map((seg: any) => seg.arrival.city).join(', ');
    doc.fontSize(9).font('Helvetica')
       .fillColor('#666666')
       .text(`Via: ${layoverCities} (${flightData.stops} stop${flightData.stops > 1 ? 's' : ''})`, 50, currentY)
       .fillColor('#000000');
    currentY += 30; // Add spacing after layover info
  } else {
    // No layovers, just add the row height
    currentY += rowHeight;
  }
  
  // Return flight (if exists)
  if (booking.tripType === 'roundtrip' && booking.returnDate && flightData.returnFlightOptions) {
    currentY += 10; // Small additional spacing before return flight
    const returnFlight = flightData.returnFlightOptions[0];
    const returnDate = new Date(booking.returnDate);
    
    doc.fontSize(10).font('Helvetica-Bold')
       .text(`${booking.toAirport}-${booking.fromAirport}`, 50, currentY);
    doc.fontSize(9).font('Helvetica')
       .text(`${formatDate(returnDate).replace(',', '')} ${returnFlight.flightNumber}`, 50, currentY + 12);
    
    doc.fontSize(10).font('Helvetica')
       .text('ARPT', 280, currentY)
       .text(booking.flightClass.charAt(0).toUpperCase(), 340, currentY);
    
    // Use smaller font and text wrapping for seats if needed
    doc.fontSize(8).font('Helvetica')
       .text(seatDisplay, 420, currentY, { width: 125, align: 'left' });
    
    // Calculate height of return seat text to adjust currentY properly
    const returnSeatTextHeight = doc.heightOfString(seatDisplay, { width: 125 });
    const returnRowHeight = Math.max(30, returnSeatTextHeight + 10);
    
    // Show return layovers/stops if any
    if (returnFlight.stops > 0 && returnFlight.segments && returnFlight.segments.length > 1) {
      currentY += returnRowHeight;
      const returnLayoverCities = returnFlight.segments.slice(0, -1).map((seg: any) => seg.arrival.city).join(', ');
      doc.fontSize(9).font('Helvetica')
         .fillColor('#666666')
         .text(`Via: ${returnLayoverCities} (${returnFlight.stops} stop${returnFlight.stops > 1 ? 's' : ''})`, 50, currentY)
         .fillColor('#000000');
      currentY += 30; // Add spacing after return layover info
    } else {
      // No layovers, just add the row height
      currentY += returnRowHeight;
    }
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
  const totalFlightPrice = (flightPricePerPerson + returnFlightPrice) * passengers.length;
  
  // Display base fare
  doc.fontSize(10).font('Helvetica')
     .text('Base Fare', 50, currentY)
     .text(`$${totalFlightPrice.toFixed(2)} USD`, 450, currentY);
  
  currentY += 20;
  
  // Taxes and fees (if available from Amadeus)
  let taxesTotal = 0;
  if (flightData.pricingDetails && flightData.pricingDetails.taxes) {
    currentY += 5;
    doc.fontSize(10).font('Helvetica-Bold')
       .text('Taxes, Fees and Charges', 50, currentY);
    currentY += 20;
    
    // Show individual tax breakdown if available
    Object.entries(flightData.pricingDetails.taxes).forEach(([taxName, amount]: [string, any]) => {
      taxesTotal += parseFloat(amount);
      doc.fontSize(9).font('Helvetica')
         .text(taxName, 50, currentY)
         .text(`$${parseFloat(amount).toFixed(2)} USD`, 450, currentY);
      currentY += 15;
    });
    
    currentY += 5;
    doc.fontSize(10).font('Helvetica')
       .text('Total Taxes, Fees & Charges', 50, currentY)
       .text(`$${taxesTotal.toFixed(2)} USD`, 450, currentY);
  }
  
  // Total
  currentY += 30;
  doc.fontSize(11).font('Helvetica-Bold')
     .text(`Total (${passengers.length} Passenger${passengers.length > 1 ? 's' : ''}):`, 50, currentY);
  
  const grandTotal = totalFlightPrice + taxesTotal;
  doc.fontSize(11).font('Helvetica-Bold')
     .text(passengers.length > 1 ? `${passengers.length * 31800} Miles` : '31,800Miles', 450, currentY - 15);
  
  doc.fontSize(11).font('Helvetica-Bold')
     .text(`+`, 500, currentY);
  
  doc.fontSize(11).font('Helvetica-Bold')
     .text(`$${grandTotal.toFixed(2)}USD`, 450, currentY + 2);
  
  // Payment method
  currentY += 30;
  const lastFourDigits = Math.floor(Math.random() * 9000 + 1000);
  doc.fontSize(10).font('Helvetica')
     .text(`Paid with Visa ************${lastFourDigits}`, 50, currentY);
  
  // Draw horizontal line
  currentY += 25;
  doc.moveTo(50, currentY)
     .lineTo(545, currentY)
     .stroke();
  
  // KEY OF TERMS Section
  currentY += 20;
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
