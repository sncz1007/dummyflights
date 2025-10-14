import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Airport } from '@shared/schema';

interface AirportSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  'data-testid'?: string;
  countryFilter?: string; // Optional country filter (e.g., "USA")
}

export default function AirportSearch({ 
  value, 
  onChange, 
  placeholder = "City or airport", 
  className,
  'data-testid': dataTestId,
  countryFilter
}: AirportSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch airports based on search query
  const { data: airports = [], isLoading } = useQuery<Airport[]>({
    queryKey: ['/api/airports/search', searchQuery, countryFilter],
    queryFn: async () => {
      if (searchQuery.length < 2) return [];
      
      const params = new URLSearchParams({ q: searchQuery });
      if (countryFilter) {
        params.append('country', countryFilter);
      }
      
      const response = await fetch(`/api/airports/search?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to search airports');
      return response.json();
    },
    enabled: searchQuery.length >= 2,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onChange(newValue);
    setIsOpen(newValue.length >= 2);
  };

  const handleAirportSelect = (airport: Airport) => {
    const selectedValue = `${airport.city} (${airport.iataCode})`;
    onChange(selectedValue);
    setSearchQuery(selectedValue);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update search query when value changes externally
  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  // Group airports by city
  const groupedAirports = airports.reduce((groups: Record<string, Airport[]>, airport) => {
    const key = airport.city;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(airport);
    return groups;
  }, {});

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={cn("w-full", className)}
        data-testid={dataTestId}
        autoComplete="off"
      />
      
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-border search-dropdown"
          data-testid="dropdown-airport-results"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-center text-muted-foreground">
              <div className="loading-spinner mx-auto mb-2"></div>
              Searching...
            </div>
          ) : airports.length === 0 && searchQuery.length >= 2 ? (
            <div className="px-4 py-3 text-center text-muted-foreground">
              No airports found
            </div>
          ) : (
            Object.entries(groupedAirports).map(([city, cityAirports]) => (
              <div key={city}>
                {cityAirports.length > 1 && (
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted">
                    {city}, {cityAirports[0].country}
                  </div>
                )}
                {cityAirports.map((airport) => (
                  <div
                    key={airport.id}
                    className="px-4 py-3 hover:bg-muted cursor-pointer transition-colors"
                    onClick={() => handleAirportSelect(airport)}
                    data-testid={`airport-option-${airport.iataCode}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">
                          {airport.city}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {airport.name}
                        </div>
                      </div>
                      <div className="text-primary font-bold ml-2 flex-shrink-0">
                        {airport.iataCode}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
