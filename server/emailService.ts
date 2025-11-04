import emailjs from '@emailjs/nodejs';
import type { Booking } from '../shared/schema';

// EmailJS configuration from environment variables
const EMAILJS_SERVICE_ID = process.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_PUBLIC_KEY = process.env.VITE_EMAILJS_PUBLIC_KEY || '';

// Template ID for payment confirmation email (you'll need to create this in EmailJS dashboard)
const PAYMENT_CONFIRMATION_TEMPLATE_ID = process.env.VITE_EMAILJS_PAYMENT_TEMPLATE_ID || 'template_payment';

export interface SendPaymentConfirmationEmailParams {
  booking: Booking;
  pdfLinks: {
    confirmationPdfUrl: string;
    receiptPdfUrl: string;
  };
}

export async function sendPaymentConfirmationEmail(params: SendPaymentConfirmationEmailParams): Promise<void> {
  const { booking, pdfLinks } = params;
  
  try {
    const flightData = JSON.parse(booking.selectedFlightData);
    const language = booking.language || 'en';
    const isSpanish = language === 'es';
    
    // Parse additional passengers
    let additionalPassengers: any[] = [];
    if (booking.additionalPassengers) {
      try {
        additionalPassengers = JSON.parse(booking.additionalPassengers);
      } catch (e) {
        console.error('Error parsing additional passengers:', e);
      }
    }
    
    // Format passenger list
    const passengersListText = additionalPassengers.length > 0
      ? additionalPassengers.map((p, i) => `${i + 2}. ${p.fullName} - DOB: ${p.dateOfBirth}`).join('\n')
      : (isSpanish ? 'Ninguno' : 'None');
    
    const templateParams = {
      // Customer info
      to_email: booking.email,
      customer_name: booking.fullName,
      
      // Flight info
      from_airport: booking.fromAirport,
      to_airport: booking.toAirport,
      departure_date: booking.departureDate,
      return_date: booking.returnDate || (isSpanish ? 'Solo ida' : 'One way'),
      trip_type: booking.tripType,
      airline: flightData.airline.name,
      flight_number: flightData.flightNumber,
      flight_class: booking.flightClass,
      
      // Passengers
      passengers_count: booking.passengers.toString(),
      primary_passenger: `${booking.fullName} - DOB: ${booking.dateOfBirth}`,
      additional_passengers: passengersListText,
      
      // Pricing
      service_fee: `$${parseFloat(booking.discountedPrice).toFixed(2)} USD`,
      flight_price: `$${parseFloat(booking.originalPrice).toFixed(2)} USD`,
      
      // PDF download links
      confirmation_pdf_link: pdfLinks.confirmationPdfUrl,
      receipt_pdf_link: pdfLinks.receiptPdfUrl,
      
      // Booking reference
      booking_number: booking.bookingNumber,
      booking_id: booking.id.substring(0, 8).toUpperCase(),
      
      // Language
      language: language,
      
      // Date
      payment_date: new Date().toLocaleDateString(isSpanish ? 'es-ES' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
    };

    console.log('[Email Service] Sending payment confirmation email to:', booking.email);
    console.log('[Email Service] PDF Links:', pdfLinks);

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      PAYMENT_CONFIRMATION_TEMPLATE_ID,
      templateParams,
      {
        publicKey: EMAILJS_PUBLIC_KEY,
      }
    );

    console.log('[Email Service] Payment confirmation email sent successfully to:', booking.email);
  } catch (error) {
    console.error('[Email Service] Error sending payment confirmation email:', error);
    // Don't throw error - we don't want to fail the payment if email fails
    // Just log it for debugging
  }
}
