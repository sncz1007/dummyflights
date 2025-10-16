import { useTranslation } from '@/hooks/useTranslation';
import { Percent, Globe, Zap, Headset } from 'lucide-react';

export default function WhyChooseUs() {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: Percent,
      title: t('whyChoose.discount.title'),
      description: t('whyChoose.discount.desc'),
      testId: 'benefit-discount',
      color: 'text-primary'
    },
    {
      icon: Globe,
      title: t('whyChoose.worldwide.title'),
      description: t('whyChoose.worldwide.desc'),
      testId: 'benefit-worldwide',
      color: 'text-blue-500'
    },
    {
      icon: Zap,
      title: t('whyChoose.instant.title'),
      description: t('whyChoose.instant.desc'),
      testId: 'benefit-instant',
      color: 'text-yellow-500'
    },
    {
      icon: Headset,
      title: t('whyChoose.support.title'),
      description: t('whyChoose.support.desc'),
      testId: 'benefit-support',
      color: 'text-green-500'
    }
  ];

  return (
    <section id="why-choose-us" className="py-8 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 md:mb-4" data-testid="text-whychoose-title">
            {t('whyChoose.title')}
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="text-whychoose-subtitle">
            {t('whyChoose.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-4 md:p-6 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                data-testid={benefit.testId}
              >
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-3 md:mb-4 shadow-md">
                  <Icon className={`w-8 h-8 ${benefit.color}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2 md:mb-3" data-testid={`${benefit.testId}-title`}>
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground" data-testid={`${benefit.testId}-description`}>
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
