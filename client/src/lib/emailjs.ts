import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_quote';
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
