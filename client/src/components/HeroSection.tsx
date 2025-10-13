import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AirportSearch from './AirportSearch';
import { Plane, PlaneTakeoff, PlaneLanding, Calendar, Users, Check } from 'lucide-react';

export default function HeroSection() {
  const { t } = useTranslation();
  const [searchData, setSearchData] = useState({
    fromAirport: '',
    toAirport: '',
    departureDate: '',
    returnDate: '',
    passengers: '1',
    flightClass: 'economy',
    tripType: 'roundtrip'
  });

  const handleSearch = () => {
    console.log('Raw search state:', searchData);
    console.log('Search data:', {
      fromAirport: searchData.fromAirport,
      toAirport: searchData.toAirport,
      departureDate: searchData.departureDate,
      returnDate: searchData.returnDate,
      passengers: searchData.passengers,
      flightClass: searchData.flightClass,
      tripType: searchData.tripType,
    });
  };

  return (
    <section id="home" className="min-h-screen gradient-hero text-white flex items-center justify-center py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    onChange={(value) => setSearchData({ ...searchData, fromAirport: value })}
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
                    onChange={(value) => setSearchData({ ...searchData, toAirport: value })}
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
                    type="date"
                    value={searchData.departureDate}
                    onChange={(e) => setSearchData({ ...searchData, departureDate: e.target.value })}
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
                    type="date"
                    value={searchData.returnDate}
                    onChange={(e) => setSearchData({ ...searchData, returnDate: e.target.value })}
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
                <Select value={searchData.passengers} onValueChange={(value) => setSearchData({ ...searchData, passengers: value })}>
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
                <Select value={searchData.flightClass} onValueChange={(value) => setSearchData({ ...searchData, flightClass: value })}>
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
                <Select value={searchData.tripType} onValueChange={(value) => setSearchData({ ...searchData, tripType: value })}>
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
            
            <Button 
              onClick={handleSearch}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              data-testid="button-search-flights"
            >
              <Plane className="h-5 w-5" />
              <span>{t('search.button')}</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
