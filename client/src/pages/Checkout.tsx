import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useTranslation } from '@/hooks/useTranslation';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plane, Shield, ArrowLeft } from 'lucide-react';

// Load Stripe (from blueprint:javascript_stripe)
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

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

interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
}

// Customer Info Form Component (no Stripe hooks)
const CustomerInfoForm = ({ 
  onSubmit,
  customerInfo,
  setCustomerInfo
}: { 
  onSubmit: () => Promise<void>;
  customerInfo: CustomerInfo;
  setCustomerInfo: (info: CustomerInfo) => void;
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.fullName || !customerInfo.email) {
      toast({
        title: t('checkout.error'),
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
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
        </div>
      </Card>

      <Button
        type="submit"
        disabled={isProcessing || !customerInfo.fullName || !customerInfo.email}
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
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
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
    setIsLoading(false);
  }, []);

  const handleCreateBooking = async () => {
    if (!flight || !searchParams) {
      throw new Error('Flight or search params not loaded');
    }

    try {
      const bookingData = {
        fullName: customerInfo.fullName,
        email: customerInfo.email,
        phone: customerInfo.phone || '',
        fromAirport: searchParams.fromAirport,
        toAirport: searchParams.toAirport,
        departureDate: searchParams.departureDate,
        returnDate: searchParams.returnDate || undefined,
        passengers: Number(searchParams.passengers),
        flightClass: searchParams.flightClass,
        tripType: searchParams.tripType,
        selectedFlightData: JSON.stringify(flight),
        originalPrice: flight.originalPrice.toString(),
        discountedPrice: flight.discountedPrice.toString(),
        currency: 'USD',
        language: localStorage.getItem('preferredLanguage') || 'en',
      };

      const response = await apiRequest('POST', '/api/create-booking', bookingData);
      const data = await response.json();
      
      setClientSecret(data.clientSecret);
      
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

  const savings = flight.originalPrice - flight.discountedPrice;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/flights' + window.location.search)}
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
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('checkout.originalPrice')}
                  </span>
                  <span className="text-sm line-through" data-testid="text-summary-original-price">
                    ${flight.originalPrice.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between text-green-600">
                  <span className="text-sm font-medium">
                    {t('checkout.discount')}
                  </span>
                  <span className="text-sm font-medium" data-testid="text-summary-discount">
                    -${savings.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-lg font-semibold">
                    {t('checkout.youPay')}
                  </span>
                  <span className="text-2xl font-bold text-primary" data-testid="text-summary-total">
                    ${flight.discountedPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <Badge variant="default" className="w-full justify-center bg-green-600 hover:bg-green-700">
                {flight.discount}% {t('results.discount')}
              </Badge>
            </Card>
          </div>

          {/* Checkout Form - Right Column */}
          <div className="lg:col-span-2">
            {!clientSecret ? (
              <CustomerInfoForm 
                onSubmit={handleCreateBooking}
                customerInfo={customerInfo}
                setCustomerInfo={setCustomerInfo}
              />
            ) : (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm customerInfo={customerInfo} />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
