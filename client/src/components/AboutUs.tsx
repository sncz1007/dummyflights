import { useTranslation } from '@/hooks/useTranslation';
import { Award, Users, TrendingDown, Plane } from 'lucide-react';

export default function AboutUs() {
  const { t } = useTranslation();

  const stats = [
    {
      icon: Award,
      value: '5+',
      label: t('about.stat.experience'),
      testId: 'stat-experience'
    },
    {
      icon: Users,
      value: '9,000+',
      label: t('about.stat.bookings'),
      testId: 'stat-bookings'
    },
    {
      icon: TrendingDown,
      value: '95%',
      label: t('about.stat.discount'),
      testId: 'stat-discount'
    },
    {
      icon: Plane,
      value: t('about.stat.realFlights'),
      label: t('about.stat.alliance'),
      testId: 'stat-alliance'
    }
  ];

  return (
    <section id="about" className="py-6 md:py-10 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 md:mb-4" data-testid="text-about-title">
            {t('about.title')}
          </h2>
          <p className="text-base md:text-lg text-white/90 max-w-4xl mx-auto leading-relaxed text-justify" data-testid="text-about-description">
            {t('about.description')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-6 md:mt-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-3 md:p-4"
                data-testid={stat.testId}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center mb-2 md:mb-3">
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1" data-testid={`${stat.testId}-value`}>
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-white/80" data-testid={`${stat.testId}-label`}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
