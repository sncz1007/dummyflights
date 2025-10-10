import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';

export default function DealsSection() {
  const { t } = useTranslation();

  const scrollToQuote = () => {
    const quoteSection = document.getElementById('quote');
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="deals" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4" data-testid="text-deals-title">
            {t('deals.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-deals-subtitle">
            {t('deals.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Flash Sale Card */}
          <div className="relative bg-gradient-to-br from-primary to-destructive rounded-2xl p-8 text-white overflow-hidden" data-testid="card-flash-deal">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
            <div className="relative z-10">
              <div className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm font-medium mb-4" data-testid="badge-flash-limited">
                {t('deals.limited')}
              </div>
              <h3 className="text-3xl font-display font-bold mb-3" data-testid="text-flash-title">
                {t('deals.flash.title')}
              </h3>
              <p className="text-lg mb-6 opacity-90" data-testid="text-flash-description">
                {t('deals.flash.description')}
              </p>
              <Button 
                onClick={scrollToQuote}
                className="bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                data-testid="button-flash-cta"
              >
                {t('deals.flash.cta')}
              </Button>
            </div>
          </div>
          
          {/* Early Bird Card */}
          <div className="relative bg-gradient-to-br from-secondary to-accent rounded-2xl p-8 text-white overflow-hidden" data-testid="card-earlybird-deal">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
            <div className="relative z-10">
              <div className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm font-medium mb-4" data-testid="badge-earlybird-exclusive">
                {t('deals.exclusive')}
              </div>
              <h3 className="text-3xl font-display font-bold mb-3" data-testid="text-earlybird-title">
                {t('deals.earlybird.title')}
              </h3>
              <p className="text-lg mb-6 opacity-90" data-testid="text-earlybird-description">
                {t('deals.earlybird.description')}
              </p>
              <Button 
                onClick={scrollToQuote}
                className="bg-white text-secondary font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                data-testid="button-earlybird-cta"
              >
                {t('deals.earlybird.cta')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
