import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Wifi, Utensils, Tv, Zap, ArrowLeft, Loader2 } from 'lucide-react';

interface FlightAmenities {
  wifi: boolean;
  meals: boolean;
  entertainment: boolean;
  power: boolean;
}

interface FlightLeg {
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
  basePrice?: number;
}

interface Flight {
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
  amenities: FlightAmenities;
  returnFlightOptions: FlightLeg[] | null;
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

export default function FlightResults() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [useCachedResults, setUseCachedResults] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromAirport = params.get('from');
    const toAirport = params.get('to');
    const departureDate = params.get('departure');
    const returnDate = params.get('return');
    const passengers = params.get('passengers') || '1';
    const flightClass = params.get('class') || 'economy';
    const tripType = params.get('type') || 'roundtrip';

    if (fromAirport && toAirport && departureDate) {
      const currentSearchParams = {
        fromAirport,
        toAirport,
        departureDate,
        returnDate: returnDate || undefined,
        passengers,
        flightClass,
        tripType,
      };
      
      // Check if we're returning from checkout and have cached results
      const cachedResults = sessionStorage.getItem('cachedFlightResults');
      const returningFromCheckout = sessionStorage.getItem('returningFromCheckout');
      
      if (cachedResults && returningFromCheckout === 'true') {
        try {
          const cached = JSON.parse(cachedResults);
          // Verify cached results match current search parameters
          if (JSON.stringify(cached.searchParams) === JSON.stringify(currentSearchParams)) {
            setUseCachedResults(true);
          }
        } catch (e) {
          console.error('Error parsing cached results:', e);
        }
      }
      
      // Clear the returning flag
      sessionStorage.removeItem('returningFromCheckout');
      
      setSearchParams(currentSearchParams);
    }
  }, []);

  const { data, isLoading, error } = useQuery<{ 
    flights: Flight[]; 
    searchParams: SearchParams;
    noFlightsAvailable?: boolean;
    message?: string;
  }>({
    queryKey: ['/api/flights/search', searchParams],
    enabled: !!searchParams,
    refetchOnMount: !useCachedResults,
    staleTime: 0,
    gcTime: 0,
    queryFn: async () => {
      // Try to use cached results first
      if (useCachedResults) {
        const cachedResults = sessionStorage.getItem('cachedFlightResults');
        if (cachedResults) {
          try {
            const cached = JSON.parse(cachedResults);
            return cached.data;
          } catch (e) {
            console.error('Error using cached results:', e);
          }
        }
      }
      
      // Fetch fresh results from API
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchParams),
      });
      
      if (!response.ok) {
        throw new Error('Failed to search flights');
      }
      
      const result = await response.json();
      
      // Cache the results for potential back navigation
      sessionStorage.setItem('cachedFlightResults', JSON.stringify({
        searchParams,
        data: result,
      }));
      
      return result;
    },
  });

  const handleBookFlight = (flight: Flight) => {
    // Mark that we're going to checkout (so we can detect back navigation)
    sessionStorage.setItem('returningFromCheckout', 'false');
    sessionStorage.setItem('selectedFlight', JSON.stringify(flight));
    sessionStorage.setItem('searchParams', JSON.stringify(searchParams));
    setLocation('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground" data-testid="text-loading">
            {t('results.searching')}
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive mb-4" data-testid="text-error">
            {t('results.noResults')}
          </p>
          <Button onClick={() => setLocation('/')} data-testid="button-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('nav.home')}
          </Button>
        </div>
      </div>
    );
  }

  // Handle no flights available case (no partner airlines for this route)
  if (data.noFlightsAvailable || data.flights.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Plane className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3" data-testid="text-no-flights-title">
              {t('results.noFlightsAvailable')}
            </h2>
            <p className="text-muted-foreground mb-6" data-testid="text-no-flights-message">
              {t('results.noFlightsMessage')}
            </p>
          </div>
          <Button onClick={() => setLocation('/')} size="lg" data-testid="button-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('nav.home')}
          </Button>
        </div>
      </div>
    );
  }

  const { flights } = data;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('nav.home')}
          </Button>
          
          <h1 className="text-3xl font-bold mb-2" data-testid="text-results-title">
            {t('results.title')}
          </h1>
          <p className="text-muted-foreground" data-testid="text-route-info">
            {searchParams?.fromAirport} → {searchParams?.toAirport}
          </p>
          <p className="text-sm text-muted-foreground" data-testid="text-search-details">
            {searchParams?.departureDate} • {searchParams?.passengers} {searchParams?.passengers === '1' ? t('passengers.1') : t('passengers.2')} • {searchParams?.flightClass}
          </p>
        </div>

        {/* Flight Results */}
        <div className="space-y-4">
          {flights.map((flight) => (
            <Card key={flight.id} className="p-6" data-testid={`card-flight-${flight.id}`}>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Flight Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={flight.airline.logo} 
                      alt={flight.airline.name}
                      className="h-12 w-12 object-contain"
                      data-testid={`img-airline-logo-${flight.id}`}
                    />
                    <div>
                      <p className="font-semibold" data-testid={`text-airline-${flight.id}`}>
                        {flight.airline.name}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-flight-number-${flight.id}`}>
                        {flight.flightNumber}
                      </p>
                    </div>
                  </div>

                  {/* Outbound Flight */}
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-center">
                      <p className="text-2xl font-bold" data-testid={`text-departure-time-${flight.id}`}>
                        {flight.departure.time}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-departure-airport-${flight.id}`}>
                        {flight.departure.airport}
                      </p>
                    </div>

                    <div className="flex-1 flex flex-col items-center">
                      <p className="text-sm text-muted-foreground mb-1" data-testid={`text-duration-${flight.id}`}>
                        {flight.duration}
                      </p>
                      <div className="w-full h-px bg-border relative">
                        <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1" data-testid={`text-stops-${flight.id}`}>
                        {flight.stops === 0 ? t('results.direct') : `${flight.stops} ${flight.stops === 1 ? t('results.stop') : t('results.stops')}`}
                      </p>
                    </div>

                    <div className="text-center">
                      <p className="text-2xl font-bold" data-testid={`text-arrival-time-${flight.id}`}>
                        {flight.arrival.time}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`text-arrival-airport-${flight.id}`}>
                        {flight.arrival.airport}
                      </p>
                    </div>
                  </div>

                  {/* Return Flight - Round Trip */}
                  {flight.returnFlightOptions && flight.returnFlightOptions.length > 0 && flight.returnFlightOptions[0] && (
                    <div className="mt-4 pt-4 border-t-2 border-primary">
                      <p className="text-sm font-bold text-primary mb-3 uppercase">
                        ✈ Vuelo de Regreso
                      </p>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold" data-testid={`text-return-departure-time-${flight.id}`}>
                          {flight.returnFlightOptions[0].departure.time}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {flight.returnFlightOptions[0].departure.airport}
                        </p>
                      </div>

                      <div className="flex-1 flex flex-col items-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          {flight.returnFlightOptions[0].duration}
                        </p>
                        <div className="w-full h-px bg-border relative">
                          <Plane className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rotate-180" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {flight.returnFlightOptions[0].stops === 0 ? t('results.direct') : `${flight.returnFlightOptions[0].stops} ${flight.returnFlightOptions[0].stops === 1 ? t('results.stop') : t('results.stops')}`}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-2xl font-bold" data-testid={`text-return-arrival-time-${flight.id}`}>
                          {flight.returnFlightOptions[0].arrival.time}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {flight.returnFlightOptions[0].arrival.airport}
                        </p>
                      </div>
                    </div>
                    </div>
                  )}

                  {/* Amenities */}
                  <div className="flex gap-3 mt-4">
                    {flight.amenities.wifi && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Wifi className="h-4 w-4" />
                        <span>{t('results.wifi')}</span>
                      </div>
                    )}
                    {flight.amenities.meals && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Utensils className="h-4 w-4" />
                        <span>{t('results.meals')}</span>
                      </div>
                    )}
                    {flight.amenities.entertainment && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Tv className="h-4 w-4" />
                        <span>{t('results.entertainment')}</span>
                      </div>
                    )}
                    {flight.amenities.power && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Zap className="h-4 w-4" />
                        <span>{t('results.power')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing & Book */}
                <div className="lg:w-64 flex flex-col items-end gap-3">
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary" data-testid={`text-price-${flight.id}`}>
                      $15.00
                    </p>
                    <p className="text-xs text-muted-foreground italic" data-testid={`text-per-passenger-${flight.id}`}>
                      {localStorage.getItem('preferredLanguage') === 'es' ? 'Precio por pasajero' : 'Price per passenger'}
                    </p>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => handleBookFlight(flight)}
                    data-testid={`button-book-${flight.id}`}
                  >
                    {t('results.bookNow')}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {flights.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground" data-testid="text-no-results">
              {t('results.noResults')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
