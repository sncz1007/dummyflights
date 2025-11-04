import PDFDocument from 'pdfkit';
import type { Booking } from '../shared/schema';

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

// Generate seat number
function generateSeatNumber(): string {
  const row = Math.floor(Math.random() * 30 + 1); // Rows 1-30
  const seat = String.fromCharCode(65 + Math.floor(Math.random() * 6)); // A-F
  return `${row}${seat}`;
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

export async function generateBookingConfirmationPDF(booking: Booking): Promise<InstanceType<typeof PDFDocument>> {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  
  const flightData = JSON.parse(booking.selectedFlightData);
  // Use real PNR from Amadeus if available, otherwise use generated code
  const confirmationCode = booking.pnrCode || generateConfirmationCode();
  const ticketNumber = generateTicketNumber();
  const seatNumber = generateSeatNumber();
  
  // Parse passenger data
  const passengers = [];
  passengers.push({ fullName: booking.fullName, dateOfBirth: booking.dateOfBirth });
  if (booking.additionalPassengers) {
    const additionalPassengers = JSON.parse(booking.additionalPassengers);
    passengers.push(...additionalPassengers);
  }
  
  // Download and add airline logo
  if (flightData.airline.logo) {
    const logoBuffer = await downloadImage(flightData.airline.logo);
    if (logoBuffer) {
      try {
        doc.image(logoBuffer, 50, 45, { width: 60, height: 60 });
      } catch (error) {
        console.error('Error adding logo to PDF:', error);
      }
    }
  }
  
  // Header with airline branding
  doc.fontSize(24).font('Helvetica-Bold')
     .text(flightData.airline.name.toUpperCase(), 120, 50);
  
  // Confirmation code section
  doc.fontSize(12).font('Helvetica')
     .text('Confirmation code', 50, 120);
  
  doc.fontSize(32).font('Helvetica-Bold')
     .text(confirmationCode, 50, 140);
  
  // Flight route header
  const departureDate = new Date(booking.departureDate);
  doc.fontSize(18).font('Helvetica-Bold')
     .text(`${booking.fromAirport} ➔ ${booking.toAirport}`, 50, 200);
  
  doc.fontSize(11).font('Helvetica')
     .text(`${formatTime(departureDate)} | ${flightData.stops === 0 ? 'Nonstop' : `${flightData.stops} stop(s)`} | ${flightData.duration}`, 50, 225);
  
  // Flight number
  doc.fontSize(14).font('Helvetica-Bold')
     .text(flightData.flightNumber, 50, 260);
  
  // Flight details box
  const boxY = 290;
  doc.fontSize(10).font('Helvetica-Bold')
     .text('Departs', 50, boxY);
  doc.fontSize(14).font('Helvetica-Bold')
     .text(formatTime(departureDate), 50, boxY + 15);
  doc.fontSize(10).font('Helvetica')
     .text(formatDate(departureDate), 50, boxY + 35)
     .text(booking.fromAirport, 50, boxY + 50)
     .text(flightData.departure.airport, 50, boxY + 65);
  
  doc.fontSize(10).font('Helvetica-Bold')
     .text('Arrives', 300, boxY);
  
  const arrivalDate = new Date(departureDate);
  const [hours, minutes] = flightData.arrival.time.split(':');
  arrivalDate.setHours(parseInt(hours), parseInt(minutes));
  
  doc.fontSize(14).font('Helvetica-Bold')
     .text(formatTime(arrivalDate), 300, boxY + 15);
  doc.fontSize(10).font('Helvetica')
     .text(formatDate(arrivalDate), 300, boxY + 35)
     .text(booking.toAirport, 300, boxY + 50)
     .text(flightData.arrival.airport, 300, boxY + 65);
  
  // Class information
  doc.fontSize(10).font('Helvetica-Bold')
     .text(`${booking.flightClass.charAt(0).toUpperCase() + booking.flightClass.slice(1)} (${booking.flightClass.charAt(0).toUpperCase()})`, 50, boxY + 95);
  
  // Seat assignment note
  doc.fontSize(9).font('Helvetica')
     .fillColor('#666666')
     .text('Seat assignments listed below with passenger information.', 50, boxY + 115)
     .text(`For changes, visit airline website with booking confirmation ${confirmationCode}.`, 50, boxY + 127)
     .fillColor('#000000');
  
  // Return flight section (if exists)
  if (booking.tripType === 'roundtrip' && booking.returnDate && flightData.returnFlightOptions) {
    const returnFlight = flightData.returnFlightOptions[0];
    const returnDate = new Date(booking.returnDate);
    const returnBoxY = boxY + 180;
    
    doc.fontSize(18).font('Helvetica-Bold')
       .text(`${booking.toAirport} ➔ ${booking.fromAirport}`, 50, returnBoxY - 30);
    
    doc.fontSize(11).font('Helvetica')
       .text(`${returnFlight.departure.time} | ${returnFlight.stops === 0 ? 'Nonstop' : `${returnFlight.stops} stop(s)`} | ${returnFlight.duration}`, 50, returnBoxY - 5);
    
    doc.fontSize(14).font('Helvetica-Bold')
       .text(returnFlight.flightNumber, 50, returnBoxY + 25);
    
    doc.fontSize(10).font('Helvetica-Bold')
       .text('Departs', 50, returnBoxY + 55);
    doc.fontSize(14).font('Helvetica-Bold')
       .text(returnFlight.departure.time, 50, returnBoxY + 70);
    doc.fontSize(10).font('Helvetica')
       .text(formatDate(returnDate), 50, returnBoxY + 90)
       .text(booking.toAirport, 50, returnBoxY + 105)
       .text(returnFlight.departure.airport, 50, returnBoxY + 120);
    
    doc.fontSize(10).font('Helvetica-Bold')
       .text('Arrives', 300, returnBoxY + 55);
    
    const returnArrivalDate = new Date(returnDate);
    const [retHours, retMinutes] = returnFlight.arrival.time.split(':');
    returnArrivalDate.setHours(parseInt(retHours), parseInt(retMinutes));
    
    doc.fontSize(14).font('Helvetica-Bold')
       .text(returnFlight.arrival.time, 300, returnBoxY + 70);
    doc.fontSize(10).font('Helvetica')
       .text(formatDate(returnArrivalDate), 300, returnBoxY + 90)
       .text(booking.fromAirport, 300, returnBoxY + 105)
       .text(returnFlight.arrival.airport, 300, returnBoxY + 120);
  }
  
  // Passengers section
  const passengersY = booking.tripType === 'roundtrip' ? 650 : 480;
  doc.fontSize(16).font('Helvetica-Bold')
     .text('Passengers', 50, passengersY);
  
  let currentY = passengersY + 30;
  passengers.forEach((passenger, index) => {
    const passengerSeat = generateSeatNumber();
    const passengerTicket = `${ticketNumber}${index}`;
    
    doc.fontSize(12).font('Helvetica-Bold')
       .text(passenger.fullName, 50, currentY);
    
    doc.fontSize(10).font('Helvetica')
       .fillColor('#666666')
       .text(`Ticket: ${passengerTicket}`, 300, currentY + 5)
       .text(`Seat: ${passengerSeat}`, 450, currentY + 5)
       .fillColor('#000000');
    
    currentY += 35;
  });
  
  // Footer
  doc.fontSize(9).font('Helvetica')
     .fillColor('#666666')
     .text('This is your booking confirmation. Please save this for your records.', 50, 750)
     .text('For changes or cancellations, contact SkyBudgetFly customer service.', 50, 765)
     .fillColor('#000000');
  
  return doc;
}

export async function generateReceiptPDF(booking: Booking, paymentMethod: string = 'Card'): Promise<InstanceType<typeof PDFDocument>> {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  
  const flightData = JSON.parse(booking.selectedFlightData);
  // Use real PNR from Amadeus if available, otherwise use generated code
  const confirmationNumber = booking.pnrCode || generateConfirmationCode();
  const ticketNumber = generateTicketNumber();
  
  // Parse passenger data
  const passengers = [];
  passengers.push({ fullName: booking.fullName, dateOfBirth: booking.dateOfBirth });
  if (booking.additionalPassengers) {
    const additionalPassengers = JSON.parse(booking.additionalPassengers);
    passengers.push(...additionalPassengers);
  }
  
  // Download and add airline logo
  if (flightData.airline.logo) {
    const logoBuffer = await downloadImage(flightData.airline.logo);
    if (logoBuffer) {
      try {
        doc.image(logoBuffer, 50, 45, { width: 60, height: 60 });
      } catch (error) {
        console.error('Error adding logo to PDF:', error);
      }
    }
  }
  
  // Header with airline branding
  doc.fontSize(24).font('Helvetica-Bold')
     .fillColor('#003366')
     .text(flightData.airline.name.toUpperCase(), 120, 50)
     .fillColor('#000000');
  
  // Date of purchase
  doc.fontSize(11).font('Helvetica-Bold')
     .text(`Date of Purchase: ${formatDate(new Date())}`, 50, 100);
  
  // Title
  doc.fontSize(18).font('Helvetica-Bold')
     .text(`Flight Receipt for ${booking.fromAirport} to ${booking.toAirport}`, 50, 130);
  
  // Passenger information section
  doc.fontSize(12).font('Helvetica-Bold')
     .text('PASSENGER INFORMATION', 50, 180);
  
  doc.fontSize(11).font('Helvetica')
     .text(booking.fullName.toUpperCase(), 50, 205);
  
  doc.fontSize(10).font('Helvetica')
     .text(`Confirmation Number: ${confirmationNumber}`, 350, 205)
     .text(`Ticket Number: ${ticketNumber}`, 350, 220);
  
  // Flight information section
  doc.fontSize(12).font('Helvetica-Bold')
     .text('FLIGHT INFORMATION', 50, 260);
  
  // Draw table header
  const tableTop = 290;
  doc.fontSize(10).font('Helvetica-Bold')
     .text('Date and Flight', 50, tableTop)
     .text('Status', 330, tableTop)
     .text('Class', 400, tableTop)
     .text('Seat/Cabin', 470, tableTop);
  
  // Draw horizontal line
  doc.moveTo(50, tableTop + 15)
     .lineTo(545, tableTop + 15)
     .stroke();
  
  // Outbound flight row
  const departureDate = new Date(booking.departureDate);
  const rowY1 = tableTop + 25;
  
  doc.fontSize(10).font('Helvetica-Bold')
     .text(`${booking.fromAirport}-${booking.toAirport}`, 50, rowY1);
  doc.fontSize(9).font('Helvetica')
     .text(formatDate(departureDate) + ' ' + flightData.flightNumber, 50, rowY1 + 12);
  
  doc.fontSize(10).font('Helvetica')
     .text('ARPT', 330, rowY1)
     .text(booking.flightClass.charAt(0).toUpperCase(), 400, rowY1)
     .text(generateSeatNumber(), 470, rowY1);
  
  // Return flight row (if exists)
  let rowY2 = rowY1 + 40;
  if (booking.tripType === 'roundtrip' && booking.returnDate && flightData.returnFlightOptions) {
    const returnFlight = flightData.returnFlightOptions[0];
    const returnDate = new Date(booking.returnDate);
    
    doc.fontSize(10).font('Helvetica-Bold')
       .text(`${booking.toAirport}-${booking.fromAirport}`, 50, rowY2);
    doc.fontSize(9).font('Helvetica')
       .text(formatDate(returnDate) + ' ' + returnFlight.flightNumber, 50, rowY2 + 12);
    
    doc.fontSize(10).font('Helvetica')
       .text('ARPT', 330, rowY2)
       .text(booking.flightClass.charAt(0).toUpperCase(), 400, rowY2)
       .text(generateSeatNumber(), 470, rowY2);
    
    rowY2 += 40;
  }
  
  // Draw horizontal line
  doc.moveTo(50, rowY2)
     .lineTo(545, rowY2)
     .stroke();
  
  // Fare details section
  const fareY = rowY2 + 30;
  doc.fontSize(12).font('Helvetica-Bold')
     .text('FARE DETAILS', 50, fareY);
  
  // Service fee breakdown
  const detailsY = fareY + 30;
  doc.fontSize(10).font('Helvetica')
     .text('SkyBudgetFly Service Fee', 50, detailsY);
  
  doc.fontSize(10).font('Helvetica')
     .text(`$${parseFloat(booking.discountedPrice).toFixed(2)} USD`, 450, detailsY);
  
  // Draw horizontal line
  doc.moveTo(50, detailsY + 20)
     .lineTo(545, detailsY + 20)
     .stroke();
  
  // Total
  doc.fontSize(11).font('Helvetica-Bold')
     .text(`Total (${booking.passengers} Passenger${booking.passengers > 1 ? 's' : ''}):`, 50, detailsY + 35);
  
  doc.fontSize(11).font('Helvetica-Bold')
     .text(`$${parseFloat(booking.discountedPrice).toFixed(2)} USD`, 450, detailsY + 35);
  
  // Payment method
  doc.fontSize(10).font('Helvetica')
     .text(`Paid with ${paymentMethod} ************${Math.floor(Math.random() * 9000 + 1000)}`, 50, detailsY + 60);
  
  // Key of terms section
  const termsY = detailsY + 100;
  doc.fontSize(12).font('Helvetica-Bold')
     .text('KEY OF TERMS', 50, termsY);
  
  // Draw horizontal line
  doc.moveTo(50, termsY + 18)
     .lineTo(545, termsY + 18)
     .stroke();
  
  // Terms in two columns
  const col1X = 50;
  const col2X = 300;
  let termY = termsY + 28;
  
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
  
  // Footer
  doc.fontSize(9).font('Helvetica')
     .fillColor('#666666')
     .text('Thank you for choosing SkyBudgetFly for your travel booking needs.', 50, 740)
     .text('For questions about this receipt, contact support@skybudgetfly.com', 50, 755)
     .fillColor('#000000');
  
  return doc;
}
