import { useTranslation } from '@/hooks/useTranslation';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: 'Maria Johnson',
      location: 'New York, USA',
      initials: 'MJ',
      testimonial: 'Saved over $600 on my family trip to Europe! The customer service was exceptional and the booking process was seamless.',
      rating: 5,
    },
    {
      name: 'Carlos Rodriguez',
      location: 'Miami, USA',
      initials: 'CR',
      testimonial: 'Best flight booking experience ever! Found tickets to Colombia at prices I couldn\'t believe. Highly recommend!',
      rating: 5,
    },
    {
      name: 'Sarah Thompson',
      location: 'London, UK',
      initials: 'ST',
      testimonial: 'Professional service and amazing deals! They helped me find business class tickets at economy prices. Will use again!',
      rating: 5,
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4" data-testid="text-testimonials-title">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-testimonials-subtitle">
            {t('testimonials.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-muted rounded-xl p-6 hover-lift" data-testid={`card-testimonial-${index}`}>
              <div className="flex items-center mb-4" data-testid={`rating-${index}`}>
                <div className="flex">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              <p className="text-foreground mb-4" data-testid={`text-testimonial-${index}`}>
                "{testimonial.testimonial}"
              </p>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold"
                  data-testid={`avatar-${index}`}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <div className="font-semibold text-foreground" data-testid={`text-testimonial-name-${index}`}>
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground" data-testid={`text-testimonial-location-${index}`}>
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
