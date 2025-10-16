import { useState, useRef } from 'react';
import { useLocation, Link } from 'wouter';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AirportSearch from './AirportSearch';
import { Plane, PlaneTakeoff, PlaneLanding, Calendar, Users, Check } from 'lucide-react';
import airplaneBackground from '@assets/descarga_1760624689515.jpg';

export default function HeroSection() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [searchData, setSearchData] = useState({
    fromAirport: '',
    toAirport: '',
    departureDate: '',
    returnDate: '',
    passengers: '1',
    flightClass: 'economy',
    tripType: 'roundtrip'
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Use refs to store current values (for reliable capture during automated testing)
  const currentPassengers = useRef('1');
  const currentFlightClass = useRef('economy');
  const currentTripType = useRef('roundtrip');
  const departureDateRef = useRef<HTMLInputElement>(null);
  const returnDateRef = useRef<HTMLInputElement>(null);

  const handlePassengersChange = (value: string) => {
    currentPassengers.current = value;
    setSearchData(prev => ({ ...prev, passengers: value }));
  };

  const handleClassChange = (value: string) => {
    currentFlightClass.current = value;
    setSearchData(prev => ({ ...prev, flightClass: value }));
  };

  const handleTripTypeChange = (value: string) => {
    currentTripType.current = value;
    setSearchData(prev => ({ ...prev, tripType: value }));
  };

  const handleSearch = () => {
    const completeData = {
      fromAirport: searchData.fromAirport,
      toAirport: searchData.toAirport,
      departureDate: departureDateRef.current?.value || searchData.departureDate,
      returnDate: returnDateRef.current?.value || searchData.returnDate,
      passengers: currentPassengers.current,
      flightClass: currentFlightClass.current,
      tripType: currentTripType.current,
    };
    
    console.log('Flight search validation:', completeData);
    
    // Validate terms acceptance
    if (!acceptedTerms) {
      console.log('Terms and conditions not accepted');
      return;
    }
    
    // Validate required fields
    if (!completeData.fromAirport || !completeData.toAirport || !completeData.departureDate) {
      console.log('Missing required fields for flight search', {
        hasFromAirport: !!completeData.fromAirport,
        hasToAirport: !!completeData.toAirport,
        hasDepartureDate: !!completeData.departureDate,
        fromAirport: completeData.fromAirport,
        toAirport: completeData.toAirport,
        departureDate: completeData.departureDate
      });
      return;
    }
    
    // Navigate to results page with search params
    const params = new URLSearchParams({
      from: completeData.fromAirport,
      to: completeData.toAirport,
      departure: completeData.departureDate,
      ...(completeData.returnDate && { return: completeData.returnDate }),
      passengers: completeData.passengers,
      class: completeData.flightClass,
      type: completeData.tripType,
    });
    
    console.log('Navigating to:', `/flights?${params.toString()}`);
    setLocation(`/flights?${params.toString()}`);
  };

  return (
    <section id="home" className="relative min-h-screen text-white flex items-center justify-center py-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${airplaneBackground})` }}
      />
      {/* Red Overlay Filter */}
      <div className="absolute inset-0 bg-red-600/40" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6" data-testid="text-hero-title">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-4 opacity-90" data-testid="text-hero-subtitle">
            {t('hero.subtitle')}
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm sm:text-base">
            <Check className="h-5 w-5" />
            <span data-testid="text-hero-guarantee">{t('hero.guarantee')}</span>
          </div>
        </div>
        
        {/* Quick Search Form */}
        <div className="max-w-5xl mx-auto">
          <div className="glass-effect rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* From Airport */}
              <div className="relative">
                <Label className="block text-sm font-medium text-foreground mb-2" data-testid="label-from">
                  {t('search.from')}
                </Label>
                <div className="relative">
                  <PlaneTakeoff className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <AirportSearch
                    value={searchData.fromAirport}
                    onChange={(value) => setSearchData(prev => ({ ...prev, fromAirport: value }))}
                    placeholder={t('search.fromPlaceholder')}
                    className="pl-10"
                    data-testid="input-from-airport"
                  />
                </div>
              </div>
              
              {/* To Airport */}
              <div className="relative">
                <Label className="block text-sm font-medium text-foreground mb-2" data-testid="label-to">
                  {t('search.to')}
                </Label>
                <div className="relative">
                  <PlaneLanding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <AirportSearch
                    value={searchData.toAirport}
                    onChange={(value) => setSearchData(prev => ({ ...prev, toAirport: value }))}
                    placeholder={t('search.toPlaceholder')}
                    className="pl-10"
                    data-testid="input-to-airport"
                  />
                </div>
              </div>
              
              {/* Departure Date */}
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2" data-testid="label-departure">
                  {t('search.departure')}
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    ref={departureDateRef}
                    type="date"
                    value={searchData.departureDate}
                    onChange={(e) => setSearchData(prev => ({ ...prev, departureDate: e.target.value }))}
                    className="pl-10"
                    data-testid="input-departure-date"
                  />
                </div>
              </div>
              
              {/* Return Date */}
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2" data-testid="label-return">
                  {t('search.return')}
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    ref={returnDateRef}
                    type="date"
                    value={searchData.returnDate}
                    onChange={(e) => setSearchData(prev => ({ ...prev, returnDate: e.target.value }))}
                    className="pl-10"
                    data-testid="input-return-date"
                  />
                </div>
              </div>
            </div>
            
            {/* Passengers & Class */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2" data-testid="label-passengers">
                  {t('search.passengers')}
                </Label>
                <Select value={searchData.passengers} onValueChange={handlePassengersChange}>
                  <SelectTrigger data-testid="select-passengers">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{t('passengers.1')}</SelectItem>
                    <SelectItem value="2">{t('passengers.2')}</SelectItem>
                    <SelectItem value="3">{t('passengers.3')}</SelectItem>
                    <SelectItem value="4">{t('passengers.4')}</SelectItem>
                    <SelectItem value="5+">{t('passengers.5+')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2" data-testid="label-class">
                  {t('search.class')}
                </Label>
                <Select value={searchData.flightClass} onValueChange={handleClassChange}>
                  <SelectTrigger data-testid="select-class">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="economy">{t('search.economy')}</SelectItem>
                    <SelectItem value="premium">{t('search.premium')}</SelectItem>
                    <SelectItem value="business">{t('search.business')}</SelectItem>
                    <SelectItem value="first">{t('search.first')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block text-sm font-medium text-foreground mb-2" data-testid="label-trip-type">
                  {t('search.type')}
                </Label>
                <Select value={searchData.tripType} onValueChange={handleTripTypeChange}>
                  <SelectTrigger data-testid="select-trip-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roundtrip">{t('search.roundtrip')}</SelectItem>
                    <SelectItem value="oneway">{t('search.oneway')}</SelectItem>
                    <SelectItem value="multicity">{t('search.multicity')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Terms and Conditions Checkbox */}
            <div className="mb-4 flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                data-testid="checkbox-accept-terms"
              />
              <label 
                htmlFor="terms" 
                className="text-sm text-foreground leading-relaxed cursor-pointer"
                data-testid="label-terms"
              >
                {t('search.termsAccept')}{' '}
                <Link to="/terms" className="text-primary hover:underline font-medium" data-testid="link-terms">
                  {t('search.termsLink')}
                </Link>
                {' '}{t('search.termsAnd')}{' '}
                <Link to="/privacy" className="text-primary hover:underline font-medium" data-testid="link-privacy">
                  {t('search.privacyLink')}
                </Link>
              </label>
            </div>
            
            <Button 
              onClick={handleSearch}
              disabled={!acceptedTerms}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-search-flights"
            >
              <Plane className="h-5 w-5" />
              <span>{t('search.button')}</span>
            </Button>
            
            <p className="text-xs text-center mt-3 text-muted-foreground opacity-80">
              ℹ️ {t('search.usaOnly')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
