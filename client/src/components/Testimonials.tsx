import { useTranslation } from '@/hooks/useTranslation';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    {
      id: 'customer1',
      name: t('testimonials.customer1.name'),
      location: t('testimonials.customer1.location'),
      text: t('testimonials.customer1.text'),
      rating: 5
    },
    {
      id: 'customer2',
      name: t('testimonials.customer2.name'),
      location: t('testimonials.customer2.location'),
      text: t('testimonials.customer2.text'),
      rating: 5
    },
    {
      id: 'customer3',
      name: t('testimonials.customer3.name'),
      location: t('testimonials.customer3.location'),
      text: t('testimonials.customer3.text'),
      rating: 5
    },
    {
      id: 'customer4',
      name: t('testimonials.customer4.name'),
      location: t('testimonials.customer4.location'),
      text: t('testimonials.customer4.text'),
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-testimonials-title">
            {t('testimonials.title')}
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-testimonials-subtitle">
            {t('testimonials.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="relative hover:shadow-xl transition-shadow"
              data-testid={`testimonial-card-${testimonial.id}`}
            >
              <CardContent className="pt-6">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-sm text-muted-foreground mb-6 italic" data-testid={`testimonial-text-${testimonial.id}`}>
                  "{testimonial.text}"
                </p>

                <div className="border-t pt-4">
                  <p className="font-semibold text-foreground" data-testid={`testimonial-name-${testimonial.id}`}>
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid={`testimonial-location-${testimonial.id}`}>
                    {testimonial.location}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
