import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { sendBookingNotificationEmail } from '@/lib/emailjs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plane, Shield, ArrowLeft, CreditCard } from 'lucide-react';
import PayPalButton from '@/components/PayPalButton';
import { SiPaypal } from 'react-icons/si';

// Load Stripe (from blueprint:javascript_stripe) - OPTIONAL during migration
let stripePromise: Promise<any> | null = null;

if (import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  console.log('[Payment] Stripe configured on frontend');
} else {
  console.warn('[Payment] Stripe not configured - payment gateway pending configuration');
}

interface FlightData {
  id: string;
  airline: {
    code: string;
    name: string;
    logo: string;
  };
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
  };
  duration: string;
  stops: number;
  class: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  returnFlightOptions?: any;
}

interface SearchParams {
  fromAirport: string;
  toAirport: string;
  departureDate: string;
  returnDate?: string;
  passengers: string;
  flightClass: string;
  tripType: string;
}

interface AdditionalPassenger {
  fullName: string;
  dateOfBirth: string;
}

interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  additionalPassengers: AdditionalPassenger[];
}

// Customer Info Form Component (no Stripe hooks)
const CustomerInfoForm = ({ 
  onPaymentMethodSelect,
  customerInfo,
  setCustomerInfo,
  totalPassengers,
  serviceFee
}: { 
  onPaymentMethodSelect: (method: 'paypal' | 'stripe') => Promise<void>;
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  totalPassengers: number;
  serviceFee: number;
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formValid, setFormValid] = useState(false);

  // Validate form whenever customer info changes
  useEffect(() => {
    const isMainPassengerValid = customerInfo.fullName && customerInfo.email && customerInfo.dateOfBirth;
    const areAdditionalPassengersValid = totalPassengers === 1 || 
      customerInfo.additionalPassengers.every(p => p.fullName && p.dateOfBirth);
    
    setFormValid(!!isMainPassengerValid && areAdditionalPassengersValid);
  }, [customerInfo, totalPassengers]);

  const handlePaymentMethodClick = async (method: 'paypal' | 'stripe') => {
    if (!customerInfo.fullName || !customerInfo.email || !customerInfo.dateOfBirth) {
      toast({
        title: t('checkout.error'),
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Validate additional passengers
    if (totalPassengers > 1) {
      const missingPassengers = customerInfo.additionalPassengers.some(p => !p.fullName || !p.dateOfBirth);
      if (missingPassengers) {
        toast({
          title: t('checkout.error'),
          description: 'Please fill in all passenger information',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsProcessing(true);
    try {
      await onPaymentMethodSelect(method);
    } catch (err: any) {
      toast({
        title: t('checkout.error'),
        description: err.message || t('checkout.errorMessage'),
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  const updateAdditionalPassenger = (index: number, field: keyof AdditionalPassenger, value: string) => {
    const updatedPassengers = [...customerInfo.additionalPassengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setCustomerInfo({ ...customerInfo, additionalPassengers: updatedPassengers });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4" data-testid="text-contact-info">
          {t('checkout.contactInfo')}
        </h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">{t('checkout.name')} *</Label>
            <Input
              id="fullName"
              value={customerInfo.fullName}
              onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
              placeholder="John Doe"
              required
              data-testid="input-fullname"
            />
          </div>
          
          <div>
            <Label htmlFor="email">{t('checkout.email')} *</Label>
            <Input
              id="email"
              type="email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
              placeholder="john@example.com"
              required
              data-testid="input-email"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">{t('checkout.phone')}</Label>
            <Input
              id="phone"
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              data-testid="input-phone"
            />
          </div>
          
          <div>
            <Label htmlFor="dateOfBirth">{t('checkout.dateOfBirth')} *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={customerInfo.dateOfBirth}
              onChange={(e) => setCustomerInfo({ ...customerInfo, dateOfBirth: e.target.value })}
              required
              data-testid="input-dob"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </Card>

      {totalPassengers > 1 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4" data-testid="text-additional-passengers">
            {t('checkout.additionalPassengers')} ({totalPassengers - 1} {totalPassengers - 1 === 1 ? t('checkout.passenger') : t('checkout.passengers')})
          </h3>
          
          <div className="space-y-6">
            {customerInfo.additionalPassengers.map((passenger, index) => (
              <div key={index} className="space-y-4 pb-6 border-b last:border-b-0">
                <h4 className="font-medium text-sm text-muted-foreground">
                  {t('checkout.passenger')} {index + 2}
                </h4>
                
                <div>
                  <Label htmlFor={`passenger-name-${index}`}>{t('checkout.name')} *</Label>
                  <Input
                    id={`passenger-name-${index}`}
                    value={passenger.fullName}
                    onChange={(e) => updateAdditionalPassenger(index, 'fullName', e.target.value)}
                    placeholder="Jane Doe"
                    required
                    data-testid={`input-passenger-name-${index}`}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`passenger-dob-${index}`}>{t('checkout.dateOfBirth')} *</Label>
                  <Input
                    id={`passenger-dob-${index}`}
                    type="date"
                    value={passenger.dateOfBirth}
                    onChange={(e) => updateAdditionalPassenger(index, 'dateOfBirth', e.target.value)}
                    required
                    data-testid={`input-passenger-dob-${index}`}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Payment Section */}
      <Card className="p-6 border-2 border-primary/20">
        <div className="mb-6 text-center">
          <h3 className="text-xl font-semibold mb-2" data-testid="text-service-payment">
            {localStorage.getItem('preferredLanguage') === 'es' 
              ? 'Pago del Servicio' 
              : 'Service Payment'}
          </h3>
          <p className="text-3xl font-bold text-primary mb-1">${serviceFee.toFixed(2)} USD</p>
          <p className="text-sm text-muted-foreground">
            {localStorage.getItem('preferredLanguage') === 'es' 
              ? `Cargo por servicio (${totalPassengers} ${totalPassengers === 1 ? 'pasajero' : 'pasajeros'} × $15)` 
              : `Service fee (${totalPassengers} ${totalPassengers === 1 ? 'passenger' : 'passengers'} × $15)`}
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => handlePaymentMethodClick('paypal')}
            disabled={!formValid || isProcessing}
            className="w-full h-12 text-lg bg-[#0070ba] hover:bg-[#005ea6]"
            data-testid="button-pay-paypal"
          >
            {isProcessing ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing...</>
            ) : (
              <><SiPaypal className="mr-2 h-5 w-5" />
              {localStorage.getItem('preferredLanguage') === 'es' 
                ? 'Pagar con PayPal' 
                : 'Pay with PayPal'}</>
            )}
          </Button>

          <Button
            onClick={() => handlePaymentMethodClick('stripe')}
            disabled={!formValid || isProcessing}
            className="w-full h-12 text-lg"
            variant="outline"
            data-testid="button-pay-stripe"
          >
            {isProcessing ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing...</>
            ) : (
              <><CreditCard className="mr-2 h-5 w-5" />
              {localStorage.getItem('preferredLanguage') === 'es' 
                ? 'Pagar con Tarjeta' 
                : 'Pay with Card'}</>
            )}
          </Button>

          {/* TEST BUTTON - Remove in production */}
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-center text-yellow-600 dark:text-yellow-500 mb-2 font-semibold">
              ⚠️ {localStorage.getItem('preferredLanguage') === 'es' 
                ? 'BOTÓN DE PRUEBA - Solo para desarrollo' 
                : 'TEST BUTTON - Development only'}
            </p>
            <Button
              onClick={async () => {
                if (!formValid) {
                  toast({
                    title: localStorage.getItem('preferredLanguage') === 'es' ? 'Error' : 'Error',
                    description: localStorage.getItem('preferredLanguage') === 'es' 
                      ? 'Por favor completa todos los campos requeridos' 
                      : 'Please fill in all required fields',
                    variant: 'destructive',
                  });
                  return;
                }
                
                setIsProcessing(true);
                try {
                  // Get flight and search data from sessionStorage
                  const flightDataStr = sessionStorage.getItem('selectedFlight');
                  const searchParamsStr = sessionStorage.getItem('searchParams');
                  
                  console.log('Test button: flightDataStr', flightDataStr);
                  console.log('Test button: searchParamsStr', searchParamsStr);
                  
                  if (!flightDataStr || !searchParamsStr) {
                    throw new Error('Missing flight data');
                  }
                  
                  const flightData = JSON.parse(flightDataStr);
                  const searchParams = JSON.parse(searchParamsStr);
                  
                  console.log('Test button: flightData', flightData);
                  console.log('Test button: searchParams', searchParams);
                  
                  // Ensure we have prices
                  let originalPrice = serviceFee;
                  let discountedPrice = serviceFee;
                  
                  if (typeof flightData.originalPrice === 'number') {
                    originalPrice = flightData.originalPrice;
                  } else if (typeof flightData.basePrice === 'number') {
                    originalPrice = flightData.basePrice;
                  }
                  
                  if (typeof flightData.discountedPrice === 'number') {
                    discountedPrice = flightData.discountedPrice;
                  } else if (typeof flightData.basePrice === 'number') {
                    discountedPrice = flightData.basePrice;
                  }
                  
                  console.log('Test button: prices', { originalPrice, discountedPrice });
                  
                  const bookingData = {
                    fullName: customerInfo.fullName,
                    email: customerInfo.email,
                    phone: customerInfo.phone || '',
                    dateOfBirth: customerInfo.dateOfBirth,
                    additionalPassengers: JSON.stringify(customerInfo.additionalPassengers),
                    fromAirport: searchParams.fromAirport,
                    toAirport: searchParams.toAirport,
                    departureDate: searchParams.departureDate,
                    returnDate: searchParams.returnDate || null,
                    passengers: parseInt(searchParams.passengers),
                    flightClass: searchParams.flightClass,
                    tripType: searchParams.tripType,
                    selectedFlightData: JSON.stringify(flightData),
                    originalPrice: originalPrice.toString(),
                    discountedPrice: discountedPrice.toString(),
                    currency: 'USD',
                    stripePaymentIntentId: 'test_' + Date.now(),
                    paymentStatus: 'completed',
                    bookingStatus: 'confirmed',
                    language: localStorage.getItem('preferredLanguage') || 'en'
                  };
                  
                  console.log('Test button: sending bookingData', bookingData);
                  
                  const response: any = await apiRequest('POST', '/api/create-booking', bookingData);
                  
                  console.log('Test button: response', response);
                  
                  // Save booking ID and redirect to success
                  if (response && response.booking && response.booking.id) {
                    sessionStorage.setItem('bookingId', response.booking.id);
                    window.location.href = '/checkout?payment_success=true&test=true';
                  } else {
                    throw new Error('Invalid response from server');
                  }
                } catch (error: any) {
                  console.error('Test button error:', error);
                  toast({
                    title: localStorage.getItem('preferredLanguage') === 'es' ? 'Error' : 'Error',
                    description: error.message || 'Failed to create test booking',
                    variant: 'destructive',
                  });
                  setIsProcessing(false);
                }
              }}
              disabled={!formValid || isProcessing}
              className="w-full h-12 text-lg bg-yellow-600 hover:bg-yellow-700 text-white"
              data-testid="button-test-payment"
            >
              {isProcessing ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {localStorage.getItem('preferredLanguage') === 'es' ? 'Procesando...' : 'Processing...'}</>
              ) : (
                <>🧪 {localStorage.getItem('preferredLanguage') === 'es' 
                  ? 'Simular Pago Exitoso (Ver PDFs)' 
                  : 'Simulate Successful Payment (View PDFs)'}</>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>
            {localStorage.getItem('preferredLanguage') === 'es' 
              ? 'Posterior al pago recibirás tus tickets o código de reserva directamente en tu correo'
              : 'After payment, you will receive your tickets or reservation code directly in your email'}
          </p>
        </div>
      </Card>
    </div>
  );
};

// Payment Form Component (with Stripe hooks)
const PaymentForm = ({ 
  customerInfo 
}: { 
  customerInfo: CustomerInfo;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
          receipt_email: customerInfo.email,
        },
      });

      if (error) {
        toast({
          title: t('checkout.error'),
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      toast({
        title: t('checkout.error'),
        description: err.message || t('checkout.errorMessage'),
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4" data-testid="text-payment-info">
          {t('checkout.paymentInfo')}
        </h3>
        
        <PaymentElement />
        
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <Shield className="h-4 w-4" />
          <span data-testid="text-secure-payment">{t('checkout.securePayment')}</span>
        </div>
      </Card>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
        data-testid="button-confirm-booking"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t('checkout.processing')}
          </>
        ) : (
          t('checkout.confirmBooking')
        )}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [flight, setFlight] = useState<FlightData | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    additionalPassengers: [],
  });

  useEffect(() => {
    // Check for success parameter (payment completed)
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    const storedBookingId = sessionStorage.getItem('bookingId');
    
    if (paymentIntentId && urlParams.get('redirect_status') === 'succeeded' && storedBookingId) {
      setBookingId(storedBookingId);
      setPaymentComplete(true);
      setIsLoading(false);
      
      toast({
        title: t('checkout.success'),
        description: t('checkout.successMessage'),
      });
      
      return;
    }

    // Load flight data from session storage
    const storedFlight = sessionStorage.getItem('selectedFlight');
    const storedSearchParams = sessionStorage.getItem('searchParams');

    if (!storedFlight || !storedSearchParams) {
      toast({
        title: t('toast.error'),
        description: 'No flight selected',
        variant: 'destructive',
      });
      setLocation('/');
      return;
    }

    const flightData = JSON.parse(storedFlight);
    const searchData = JSON.parse(storedSearchParams);
    
    setFlight(flightData);
    setSearchParams(searchData);
    
    // Initialize additional passengers array based on total passengers
    const totalPassengers = Number(searchData.passengers);
    if (totalPassengers > 1) {
      const additionalPassengersArray = Array(totalPassengers - 1).fill(null).map(() => ({
        fullName: '',
        dateOfBirth: '',
      }));
      setCustomerInfo(prev => ({ ...prev, additionalPassengers: additionalPassengersArray }));
    }
    
    setIsLoading(false);
  }, []);

  const handleCreateBooking = async () => {
    if (!flight || !searchParams) {
      throw new Error('Flight or search params not loaded');
    }

    try {
      // Service fee is $15 USD per passenger - THIS IS THE ONLY AMOUNT CHARGED
      const SERVICE_FEE_PER_PASSENGER = 15;
      const numberOfPassengers = Number(searchParams.passengers);
      const totalServiceFee = SERVICE_FEE_PER_PASSENGER * numberOfPassengers;
      
      // Flight prices are informational only (for manual ticket purchase)
      const flightPrice = flight.discountedPrice || flight.originalPrice;
      const returnFlightPrice = flight.returnFlightOptions?.[0]?.basePrice || 0;
      const totalFlightPrice = (flightPrice + returnFlightPrice) * numberOfPassengers;
      
      // Total to pay = ONLY the service fee ($15 × passengers)
      const totalPrice = totalServiceFee;
      
      const bookingData = {
        fullName: customerInfo.fullName,
        email: customerInfo.email,
        phone: customerInfo.phone || '',
        dateOfBirth: customerInfo.dateOfBirth,
        additionalPassengers: customerInfo.additionalPassengers.length > 0 
          ? JSON.stringify(customerInfo.additionalPassengers) 
          : undefined,
        fromAirport: searchParams.fromAirport,
        toAirport: searchParams.toAirport,
        departureDate: searchParams.departureDate,
        returnDate: searchParams.returnDate || undefined,
        passengers: Number(searchParams.passengers),
        flightClass: searchParams.flightClass,
        tripType: searchParams.tripType,
        selectedFlightData: JSON.stringify(flight),
        originalPrice: totalFlightPrice.toString(),
        discountedPrice: totalFlightPrice.toString(),
        currency: 'USD',
        language: localStorage.getItem('preferredLanguage') || 'en',
      };

      const response = await apiRequest('POST', '/api/create-booking', bookingData);
      const data = await response.json();
      
      setClientSecret(data.clientSecret);
      setBookingId(data.booking.id);
      
      // Store booking ID in session storage for PDF downloads
      sessionStorage.setItem('bookingId', data.booking.id);
      
      // Send booking notification email immediately
      try {
        await sendBookingNotificationEmail({
          fromAirport: searchParams.fromAirport,
          toAirport: searchParams.toAirport,
          departureDate: searchParams.departureDate,
          returnDate: searchParams.returnDate,
          passengers: numberOfPassengers,
          flightClass: searchParams.flightClass,
          tripType: searchParams.tripType,
          flightNumber: flight.flightNumber,
          airline: flight.airline.name,
          customerName: customerInfo.fullName,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone || 'Not provided',
          customerDOB: customerInfo.dateOfBirth,
          additionalPassengers: customerInfo.additionalPassengers,
          totalPrice: `$${totalPrice.toFixed(2)}`,
          originalPrice: `$${totalFlightPrice.toFixed(2)}`,
          discount: flight.discount ? `${flight.discount}%` : '0%',
          language: localStorage.getItem('preferredLanguage') || 'en',
        });
        
        console.log('Booking notification email sent successfully');
      } catch (emailError) {
        console.error('Failed to send booking notification email:', emailError);
        // Don't block the checkout process if email fails
      }
      
      toast({
        title: 'Booking Created',
        description: 'Please complete your payment',
      });
    } catch (error: any) {
      console.error('Booking creation error:', error);
      toast({
        title: t('toast.error'),
        description: 'Failed to create booking',
        variant: 'destructive',
      });
      throw error;
    }
  };

  if (isLoading || !flight || !searchParams) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground" data-testid="text-loading">
            {t('checkout.processing')}
          </p>
        </div>
      </div>
    );
  }

  // Calculate pricing
  const SERVICE_FEE_PER_PASSENGER = 15; // $15 service fee per passenger
  const numberOfPassengers = Number(searchParams.passengers);
  const totalServiceFee = SERVICE_FEE_PER_PASSENGER * numberOfPassengers;
  
  // Flight prices are informational only (for manual ticket purchase by business)
  const flightPricePerPassenger = flight.discountedPrice || flight.originalPrice;
  const returnFlightPrice = flight.returnFlightOptions?.[0]?.basePrice || 0;
  const totalFlightPrice = (flightPricePerPassenger + returnFlightPrice) * numberOfPassengers;
  
  // Total to pay = ONLY the service fee ($15 × passengers)
  const totalPrice = totalServiceFee;

  // Show success page with PDF download links
  if (paymentComplete && bookingId) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-green-600 mb-2" data-testid="text-payment-success">
                {t('checkout.success')}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {t('checkout.successMessage')}
              </p>
            </div>

            <div className="bg-muted p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">Download Your Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  asChild
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  data-testid="button-download-booking-confirmation"
                >
                  <a 
                    href={`/api/bookings/${bookingId}/confirmation-pdf`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Plane className="h-6 w-6" />
                    <div>
                      <p className="font-semibold">Booking Confirmation</p>
                      <p className="text-xs text-muted-foreground">Flight details and itinerary</p>
                    </div>
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  data-testid="button-download-receipt"
                >
                  <a 
                    href={`/api/bookings/${bookingId}/receipt-pdf?paymentMethod=${paymentMethod === 'paypal' ? 'PayPal' : 'Card'}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CreditCard className="h-6 w-6" />
                    <div>
                      <p className="font-semibold">Payment Receipt</p>
                      <p className="text-xs text-muted-foreground">Service fee receipt</p>
                    </div>
                  </a>
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Next Steps</h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <li>✓ A confirmation email has been sent to your email address</li>
                <li>✓ We will purchase your flight tickets within 24-48 hours</li>
                <li>✓ Your tickets will be emailed to you once purchased</li>
                <li>✓ Please save the PDFs above for your records</li>
              </ul>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  sessionStorage.removeItem('selectedFlight');
                  sessionStorage.removeItem('searchParams');
                  sessionStorage.removeItem('bookingId');
                  setLocation('/');
                }}
                data-testid="button-back-to-home"
              >
                {t('nav.home')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => {
              // Mark that we're returning to flight results to preserve cached data
              sessionStorage.setItem('returningFromCheckout', 'true');
              
              // Reconstruct the search URL with parameters from sessionStorage
              if (searchParams) {
                const params = new URLSearchParams({
                  from: searchParams.fromAirport,
                  to: searchParams.toAirport,
                  departure: searchParams.departureDate,
                  ...(searchParams.returnDate && { return: searchParams.returnDate }),
                  passengers: searchParams.passengers,
                  class: searchParams.flightClass,
                  type: searchParams.tripType,
                });
                setLocation('/flights?' + params.toString());
              } else {
                setLocation('/');
              }
            }}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('nav.home')}
          </Button>

          <h1 className="text-3xl font-bold" data-testid="text-checkout-title">
            {t('checkout.title')}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flight Summary - Left Column */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4" data-testid="text-flight-summary">
                {t('checkout.flightSummary')}
              </h2>

              <div className="space-y-4 mb-4">
                <div className="flex items-center space-x-4">
                  <img 
                    src={flight.airline.logo} 
                    alt={flight.airline.name} 
                    className="h-10 w-10 object-contain"
                    data-testid="img-airline-logo"
                  />
                  <div>
                    <p className="font-semibold" data-testid="text-airline-name">{flight.airline.name}</p>
                    <p className="text-sm text-muted-foreground" data-testid="text-flight-number">
                      {flight.flightNumber}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">{searchParams.fromAirport}</p>
                  <Plane className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{searchParams.toAirport}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {searchParams.departureDate}
                  {searchParams.returnDate && ` - ${searchParams.returnDate}`}
                </p>
              </div>

              <div className="border-t pt-4 space-y-3">
                {/* Passenger Info */}
                <div className="flex justify-between mb-2 pb-2 border-b">
                  <span className="text-sm text-muted-foreground">
                    {numberOfPassengers} {numberOfPassengers === 1 ? t('checkout.passenger') : t('checkout.passengers')}
                  </span>
                </div>
                
                {/* Flight Price - Informational Only */}
                <div className="bg-muted/30 p-3 rounded-md">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">
                      {localStorage.getItem('preferredLanguage') === 'es' ? 'Precio del vuelo (referencia)' : 'Flight Price (reference)'}
                    </span>
                    <span className="text-muted-foreground" data-testid="text-flight-price">
                      ${totalFlightPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    {localStorage.getItem('preferredLanguage') === 'es' 
                      ? 'Los tickets serán comprados después del pago' 
                      : 'Tickets will be purchased after payment'}
                  </p>
                </div>
                
                {/* Service Fee - What Customer Pays */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <div>
                    <p className="text-lg font-semibold">
                      {localStorage.getItem('preferredLanguage') === 'es' ? 'Total a pagar' : 'Total to pay'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {localStorage.getItem('preferredLanguage') === 'es' 
                        ? `${numberOfPassengers} ${numberOfPassengers === 1 ? 'pasajero' : 'pasajeros'} × $${SERVICE_FEE_PER_PASSENGER}` 
                        : `${numberOfPassengers} ${numberOfPassengers === 1 ? 'passenger' : 'passengers'} × $${SERVICE_FEE_PER_PASSENGER}`}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-primary" data-testid="text-summary-total">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Checkout Form - Right Column */}
          <div className="lg:col-span-2">
            {!paymentMethod ? (
              <CustomerInfoForm 
                onPaymentMethodSelect={async (method: 'paypal' | 'stripe') => {
                  await handleCreateBooking();
                  setPaymentMethod(method);
                }}
                customerInfo={customerInfo}
                setCustomerInfo={setCustomerInfo}
                totalPassengers={Number(searchParams.passengers)}
                serviceFee={totalServiceFee}
              />
            ) : paymentMethod === 'paypal' ? (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  {localStorage.getItem('preferredLanguage') === 'es' 
                    ? 'Pago con PayPal' 
                    : 'PayPal Payment'}
                </h2>
                <div className="mb-4">
                  <p className="text-center text-lg mb-4">
                    {localStorage.getItem('preferredLanguage') === 'es' 
                      ? 'Total a pagar: ' 
                      : 'Total to pay: '}
                    <span className="font-bold text-primary">${totalServiceFee.toFixed(2)} USD</span>
                  </p>
                  <p className="text-center text-sm text-muted-foreground">
                    {localStorage.getItem('preferredLanguage') === 'es' 
                      ? `Cargo por servicio (${numberOfPassengers} ${numberOfPassengers === 1 ? 'pasajero' : 'pasajeros'} × $15)` 
                      : `Service fee (${numberOfPassengers} ${numberOfPassengers === 1 ? 'passenger' : 'passengers'} × $15)`}
                  </p>
                </div>
                <PayPalButton amount={totalServiceFee.toFixed(2)} currency="USD" intent="CAPTURE" />
                <Button
                  onClick={() => setPaymentMethod(null)}
                  variant="ghost"
                  className="w-full mt-4"
                  data-testid="button-back-payment"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {localStorage.getItem('preferredLanguage') === 'es' 
                    ? 'Volver al formulario' 
                    : 'Back to form'}
                </Button>
              </Card>
            ) : paymentMethod === 'stripe' && stripePromise && clientSecret ? (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  {localStorage.getItem('preferredLanguage') === 'es' 
                    ? 'Pago con Tarjeta' 
                    : 'Card Payment'}
                </h2>
                <div className="mb-4">
                  <p className="text-center text-lg mb-4">
                    {localStorage.getItem('preferredLanguage') === 'es' 
                      ? 'Total a pagar: ' 
                      : 'Total to pay: '}
                    <span className="font-bold text-primary">${totalServiceFee.toFixed(2)} USD</span>
                  </p>
                  <p className="text-center text-sm text-muted-foreground">
                    {localStorage.getItem('preferredLanguage') === 'es' 
                      ? `Cargo por servicio (${numberOfPassengers} ${numberOfPassengers === 1 ? 'pasajero' : 'pasajeros'} × $15)` 
                      : `Service fee (${numberOfPassengers} ${numberOfPassengers === 1 ? 'passenger' : 'passengers'} × $15)`}
                  </p>
                </div>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm customerInfo={customerInfo} />
                </Elements>
                <Button
                  onClick={() => setPaymentMethod(null)}
                  variant="ghost"
                  className="w-full mt-4"
                  data-testid="button-back-payment-stripe"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {localStorage.getItem('preferredLanguage') === 'es' 
                    ? 'Volver al formulario' 
                    : 'Back to form'}
                </Button>
              </Card>
            ) : (
              <Card className="p-6">
                <div className="text-center space-y-4">
                  <Shield className="h-12 w-12 mx-auto text-yellow-500" />
                  <h3 className="text-lg font-semibold">
                    {localStorage.getItem('preferredLanguage') === 'es' 
                      ? 'Configuración de pago pendiente' 
                      : 'Payment Configuration Pending'}
                  </h3>
                  <p className="text-muted-foreground">
                    {localStorage.getItem('preferredLanguage') === 'es' 
                      ? 'El sistema de pagos está siendo configurado. Por favor, contacta al soporte.' 
                      : 'Payment system is being configured. Please contact support.'}
                  </p>
                  <Button onClick={() => setPaymentMethod(null)} data-testid="button-retry-payment">
                    {localStorage.getItem('preferredLanguage') === 'es' ? 'Volver al formulario' : 'Back to form'}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
