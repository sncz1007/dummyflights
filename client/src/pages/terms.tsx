import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-4" data-testid="link-back-home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('nav.home')}
              </Button>
            </Link>
            
            <h1 className="text-4xl font-display font-bold text-foreground mb-4" data-testid="text-terms-title">
              {t('terms.title')}
            </h1>
            <p className="text-muted-foreground mb-8" data-testid="text-last-updated">
              {t('terms.lastUpdated')}
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-foreground">
            <section className="mb-8">
              <p className="mb-6 text-lg text-justify">
                {t('terms.intro')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('terms.services.title')}</h2>
              <p className="mb-4 text-justify">
                {t('terms.services.p1')}
              </p>
              <p className="mb-4 text-justify">
                {t('terms.services.p3')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('terms.quotes.title')}</h2>
              <p className="mb-4 text-justify">
                {t('terms.quotes.text')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('terms.cancellation.title')}</h2>
              <p className="mb-4 text-justify">
                {t('terms.cancellation.p1')}
              </p>
              <p className="mb-4 text-justify">
                {t('terms.cancellation.p2')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('terms.changes.title')}</h2>
              <p className="mb-4 text-justify">
                {t('terms.changes.text')}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t('terms.contact.title')}</h2>
              <p className="mb-4 text-justify">
                {t('terms.contact.text')} <a href="mailto:info@skybudgetfly.vip" className="text-primary hover:underline">info@flightsdummys.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
