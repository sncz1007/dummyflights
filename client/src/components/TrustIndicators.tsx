import { useTranslation } from '@/hooks/useTranslation';

export default function TrustIndicators() {
  const { t } = useTranslation();

  const stats = [
    {
      value: '500+',
      label: t('trust.airlines'),
      delay: 0,
    },
    {
      value: '40%',
      label: t('trust.savings'),
      delay: 0.1,
    },
    {
      value: '24/7',
      label: t('trust.support'),
      delay: 0.2,
    },
    {
      value: '10k+',
      label: t('trust.customers'),
      delay: 0.3,
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${stat.delay}s` }}
              data-testid={`stat-${index}`}
            >
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2" data-testid={`stat-value-${index}`}>
                {stat.value}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground" data-testid={`stat-label-${index}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
