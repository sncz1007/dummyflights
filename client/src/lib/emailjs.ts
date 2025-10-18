import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_quote';
const EMAILJS_BOOKING_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_BOOKING_TEMPLATE_ID || 'template_booking';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'default_key';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface QuoteEmailData {
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate?: string;
  passengers: string;
  flightClass: string;
  tripType: string;
  notes?: string;
  language: string;
  quoteNumber: string;
}

export interface AdditionalPassenger {
  fullName: string;
  dateOfBirth: string;
}

export interface BookingNotificationData {
  // Flight data
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  flightClass: string;
  tripType: string;
  flightNumber: string;
  airline: string;
  
  // Customer data
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDOB: string;
  
  // Additional passengers
  additionalPassengers: AdditionalPassenger[];
  
  // Price
  totalPrice: string;
  originalPrice: string;
  discount: string;
  
  // Metadata
  language: string;
}

export const sendQuoteEmail = async (quoteData: QuoteEmailData): Promise<void> => {
  try {
    const templateParams = {
      to_email: 'skybudgetfly@gmail.com',
      from_name: quoteData.fullName,
      from_email: quoteData.email,
      phone: quoteData.phone || 'Not provided',
      country: quoteData.country || 'Not provided',
      from_airport: quoteData.fromAirport,
      to_airport: quoteData.toAirport,
      departure_date: quoteData.departureDate,
      return_date: quoteData.returnDate || 'One way',
      passengers: quoteData.passengers,
      flight_class: quoteData.flightClass,
      trip_type: quoteData.tripType,
      notes: quoteData.notes || 'No additional notes',
      language: quoteData.language,
      quote_number: quoteData.quoteNumber,
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

  } catch (error) {
    console.error('EmailJS error:', error);
    throw new Error('Failed to send quote email');
  }
};

export const sendBookingNotificationEmail = async (bookingData: BookingNotificationData): Promise<void> => {
  try {
    // Format additional passengers list
    const passengersListHtml = bookingData.additionalPassengers.length > 0
      ? bookingData.additionalPassengers
          .map((p, i) => `${i + 2}. ${p.fullName} - DOB: ${p.dateOfBirth}`)
          .join('\n')
      : 'No additional passengers';

    const templateParams = {
      // Flight information
      from_airport: bookingData.fromAirport,
      to_airport: bookingData.toAirport,
      departure_date: bookingData.departureDate,
      return_date: bookingData.returnDate || 'One way',
      trip_type: bookingData.tripType,
      passengers_count: bookingData.passengers.toString(),
      flight_class: bookingData.flightClass,
      flight_number: bookingData.flightNumber,
      airline: bookingData.airline,
      
      // Primary passenger (customer)
      customer_name: bookingData.customerName,
      customer_email: bookingData.customerEmail,
      customer_phone: bookingData.customerPhone,
      customer_dob: bookingData.customerDOB,
      
      // Additional passengers
      additional_passengers: passengersListHtml,
      passengers_count_total: (bookingData.passengers).toString(),
      
      // Pricing
      total_price: bookingData.totalPrice,
      original_price: bookingData.originalPrice,
      discount: bookingData.discount,
      
      // Metadata
      language: bookingData.language,
      booking_date: new Date().toLocaleString(),
    };

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_BOOKING_TEMPLATE_ID,
      templateParams
    );

  } catch (error) {
    console.error('EmailJS booking notification error:', error);
    throw new Error('Failed to send booking notification email');
  }
};
