import { Shield, CreditCard, Headphones } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function TrustBadges() {
  const { t } = useTranslation();

  const badges = [
    {
      icon: Shield,
      title: t('trust.secureBooking'),
      description: t('trust.secureBookingDesc'),
      testId: 'badge-secure-booking'
    },
    {
      icon: CreditCard,
      title: t('trust.securePayment'),
      description: t('trust.securePaymentDesc'),
      testId: 'badge-secure-payment'
    },
    {
      icon: Headphones,
      title: t('trust.support247'),
      description: t('trust.support247Desc'),
      testId: 'badge-support-247'
    }
  ];

  return (
    <section className="py-4 md:py-6 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div 
                key={index}
                className="flex flex-col items-center text-center space-y-1 md:space-y-2"
                data-testid={badge.testId}
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground" data-testid={`${badge.testId}-title`}>
                  {badge.title}
                </h3>
                <p className="text-xs text-muted-foreground" data-testid={`${badge.testId}-description`}>
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
