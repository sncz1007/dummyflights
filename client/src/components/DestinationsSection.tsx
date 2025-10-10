import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';

export default function DestinationsSection() {
  const { t } = useTranslation();

  const destinations = [
    {
      city: 'Paris',
      country: 'France',
      code: 'CDG',
      price: '$449',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
      alt: 'A stunning aerial view of Paris with the Eiffel Tower prominently featured at sunset'
    },
    {
      city: 'Tokyo',
      country: 'Japan',
      code: 'NRT',
      price: '$589',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
      alt: 'A beautiful view of Tokyo cityscape with Mount Fuji in the background during cherry blossom season'
    },
    {
      city: 'New York',
      country: 'USA',
      code: 'JFK',
      price: '$299',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop',
      alt: 'A panoramic view of New York City skyline featuring the Empire State Building and Manhattan'
    },
    {
      city: 'Barcelona',
      country: 'Spain',
      code: 'BCN',
      price: '$399',
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop',
      alt: 'A breathtaking coastal view of Barcelona showing the Mediterranean Sea and colorful architecture'
    },
    {
      city: 'Dubai',
      country: 'UAE',
      code: 'DXB',
      price: '$529',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop',
      alt: 'A vibrant image of Dubai featuring the Burj Khalifa and modern skyline at golden hour'
    },
    {
      city: 'Sydney',
      country: 'Australia',
      code: 'SYD',
      price: '$799',
      image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&h=400&fit=crop',
      alt: 'A scenic view of Sydney Opera House and Harbor Bridge with clear blue skies'
    },
  ];

  const scrollToQuote = () => {
    const quoteSection = document.getElementById('quote');
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="destinations" className="py-16 lg:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4" data-testid="text-destinations-title">
            {t('destinations.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-destinations-subtitle">
            {t('destinations.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow-md hover-lift" data-testid={`card-destination-${index}`}>
              <img 
                src={destination.image}
                alt={destination.alt}
                className="w-full h-48 object-cover"
                data-testid={`img-destination-${index}`}
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-display font-semibold text-foreground" data-testid={`text-destination-name-${index}`}>
                    {destination.city}, {destination.country}
                  </h3>
                  <span className="text-primary font-bold" data-testid={`text-destination-code-${index}`}>
                    {destination.code}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4" data-testid={`text-destination-price-${index}`}>
                  From <span className="text-2xl font-bold text-foreground">{destination.price}</span>
                </p>
                <Button 
                  onClick={scrollToQuote}
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium py-2 rounded-lg transition-colors"
                  data-testid={`button-destination-deals-${index}`}
                >
                  View Deals
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
