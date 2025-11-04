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
  onSubmit,
  customerInfo,
  setCustomerInfo,
  totalPassengers
}: { 
  onSubmit: () => Promise<void>;
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
  totalPassengers: number;
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      await onSubmit();
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

  const updateAdditionalPassenger = (index: number, field: keyof AdditionalPassenger, value: string) => {
    const updatedPassengers = [...customerInfo.additionalPassengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setCustomerInfo({ ...customerInfo, additionalPassengers: updatedPassengers });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <Button
        type="submit"
        disabled={isProcessing || !customerInfo.fullName || !customerInfo.email || !customerInfo.dateOfBirth}
        className="w-full"
        size="lg"
        data-testid="button-continue-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {t('checkout.processing')}
          </>
        ) : (
          'Continue to Payment'
        )}
      </Button>
      
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>
          {localStorage.getItem('preferredLanguage') === 'es' 
            ? 'Posterior al pago recibirás tus tickets o código de reserva directamente en tu correo'
            : 'After payment, you will receive your tickets or reservation code directly in your email'}
        </p>
      </div>
    </form>
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
    if (paymentIntentId && urlParams.get('redirect_status') === 'succeeded') {
      toast({
        title: t('checkout.success'),
        description: t('checkout.successMessage'),
      });
      
      // Clear session storage
      sessionStorage.removeItem('selectedFlight');
      sessionStorage.removeItem('searchParams');
      
      // Redirect to home after a delay
      setTimeout(() => {
        setLocation('/');
      }, 3000);
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
      // Fixed price: Always $15 USD
      const totalPrice = 15;
      
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
        originalPrice: totalPrice.toString(),
        discountedPrice: totalPrice.toString(),
        currency: 'USD',
        language: localStorage.getItem('preferredLanguage') || 'en',
      };

      const response = await apiRequest('POST', '/api/create-booking', bookingData);
      const data = await response.json();
      
      setClientSecret(data.clientSecret);
      
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
          originalPrice: `$${totalPrice.toFixed(2)}`,
          discount: '0%',
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

  // Fixed price: Always $15 USD regardless of passengers or route
  const totalPrice = 15;

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

              <div className="border-t pt-4 space-y-2">
                {numberOfPassengers > 1 && (
                  <div className="flex justify-between mb-2 pb-2 border-b">
                    <span className="text-xs text-muted-foreground">
                      {numberOfPassengers} {numberOfPassengers === 1 ? t('checkout.passenger') : t('checkout.passengers')}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-semibold">
                    {t('checkout.totalPrice')}
                  </span>
                  <span className="text-2xl font-bold text-primary" data-testid="text-summary-total">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Checkout Form - Right Column */}
          <div className="lg:col-span-2">
            {!clientSecret && !paymentMethod ? (
              <CustomerInfoForm 
                onSubmit={handleCreateBooking}
                customerInfo={customerInfo}
                setCustomerInfo={setCustomerInfo}
                totalPassengers={Number(searchParams.passengers)}
              />
            ) : !paymentMethod ? (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6" data-testid="text-payment-method-title">
                  {localStorage.getItem('preferredLanguage') === 'es' 
                    ? 'Selecciona método de pago' 
                    : 'Select Payment Method'}
                </h2>
                
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <p className="text-3xl font-bold text-primary">$15.00 USD</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {localStorage.getItem('preferredLanguage') === 'es' 
                        ? 'Precio total de tu vuelo' 
                        : 'Total flight price'}
                    </p>
                  </div>

                  <Button
                    onClick={() => setPaymentMethod('paypal')}
                    className="w-full h-12 text-lg bg-[#0070ba] hover:bg-[#005ea6]"
                    data-testid="button-select-paypal"
                  >
                    <SiPaypal className="mr-2 h-5 w-5" />
                    {localStorage.getItem('preferredLanguage') === 'es' 
                      ? 'Pagar con PayPal' 
                      : 'Pay with PayPal'}
                  </Button>

                  <Button
                    onClick={() => setPaymentMethod('stripe')}
                    className="w-full h-12 text-lg"
                    variant="outline"
                    data-testid="button-select-stripe"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    {localStorage.getItem('preferredLanguage') === 'es' 
                      ? 'Pagar con Tarjeta' 
                      : 'Pay with Card'}
                  </Button>
                </div>
              </Card>
            ) : paymentMethod === 'paypal' ? (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">PayPal Payment</h2>
                <div className="mb-4">
                  <p className="text-center text-lg mb-4">
                    {localStorage.getItem('preferredLanguage') === 'es' 
                      ? 'Total a pagar: ' 
                      : 'Total to pay: '}
                    <span className="font-bold text-primary">$15.00 USD</span>
                  </p>
                </div>
                <PayPalButton amount="15.00" currency="USD" intent="CAPTURE" />
                <Button
                  onClick={() => setPaymentMethod(null)}
                  variant="ghost"
                  className="w-full mt-4"
                  data-testid="button-back-payment"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {localStorage.getItem('preferredLanguage') === 'es' 
                    ? 'Cambiar método de pago' 
                    : 'Change payment method'}
                </Button>
              </Card>
            ) : paymentMethod === 'stripe' && stripePromise && clientSecret ? (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  {localStorage.getItem('preferredLanguage') === 'es' 
                    ? 'Pago con Tarjeta' 
                    : 'Card Payment'}
                </h2>
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
                    ? 'Cambiar método de pago' 
                    : 'Change payment method'}
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
                    {localStorage.getItem('preferredLanguage') === 'es' ? 'Intentar de nuevo' : 'Try Again'}
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
