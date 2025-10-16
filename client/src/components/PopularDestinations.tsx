import { useTranslation } from '@/hooks/useTranslation';
import { Badge } from '@/components/ui/badge';
import santoriniImg from '@assets/stock_images/santorini_greece_whi_d6b63cba.jpg';
import rioImg from '@assets/stock_images/rio_de_janeiro_chris_c5372d1a.jpg';
import tokyoImg from '@assets/stock_images/tokyo_japan_cityscap_b9fbb6d9.jpg';
import cuscoImg from '@assets/stock_images/cusco_peru_machu_pic_708ff904.jpg';
import barcelonaImg from '@assets/stock_images/barcelona_spain_sagr_b97060b7.jpg';
import baliImg from '@assets/stock_images/bali_indonesia_tropi_294a66b7.jpg';
import newyorkImg from '@assets/stock_images/new_york_city_skylin_3e399d76.jpg';
import dubaiImg from '@assets/stock_images/dubai_uae_burj_khali_0cec8afb.jpg';

export default function PopularDestinations() {
  const { t } = useTranslation();

  const destinations = [
    { id: 'santorini', name: t('destinations.santorini'), image: santoriniImg },
    { id: 'rio', name: t('destinations.rio'), image: rioImg },
    { id: 'tokyo', name: t('destinations.tokyo'), image: tokyoImg },
    { id: 'cusco', name: t('destinations.cusco'), image: cuscoImg },
    { id: 'barcelona', name: t('destinations.barcelona'), image: barcelonaImg },
    { id: 'bali', name: t('destinations.bali'), image: baliImg },
    { id: 'newyork', name: t('destinations.newyork'), image: newyorkImg },
    { id: 'dubai', name: t('destinations.dubai'), image: dubaiImg },
  ];

  return (
    <section id="destinations" className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-destinations-title">
            {t('destinations.title')}
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-destinations-subtitle">
            {t('destinations.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              data-testid={`destination-card-${destination.id}`}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  data-testid={`destination-image-${destination.id}`}
                />
              </div>

              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-bold mb-2" data-testid={`destination-name-${destination.id}`}>
                  {destination.name}
                </h3>
                <Badge 
                  className="bg-primary hover:bg-primary text-primary-foreground font-semibold"
                  data-testid={`destination-badge-${destination.id}`}
                >
                  {t('destinations.discount')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
