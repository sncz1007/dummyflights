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
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using SkyBudgetFly services, you accept and agree to be bound by the terms and provisions of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
              <p className="mb-4">
                SkyBudgetFly provides flight quotation and booking assistance services. We help customers find competitive flight prices and facilitate travel arrangements.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Quote Requests</h2>
              <p className="mb-4">
                Quote requests are provided free of charge. Quotes are estimates based on current availability and pricing, and are subject to change until booking is confirmed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Privacy and Data Protection</h2>
              <p className="mb-4">
                We are committed to protecting your personal information. Please refer to our Privacy Policy for detailed information about how we collect, use, and protect your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Booking and Payment</h2>
              <p className="mb-4">
                All bookings are subject to availability and airline terms and conditions. Payment terms and cancellation policies will be clearly communicated before any booking confirmation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
              <p className="mb-4">
                SkyBudgetFly acts as an intermediary between customers and airlines. We are not liable for airline schedule changes, cancellations, or other disruptions beyond our control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
              <p className="mb-4">
                For questions about these Terms of Service, please contact us at:
              </p>
              <ul className="list-disc pl-6">
                <li>Email: skybudgetfly@gmail.com</li>
                <li>Phone: +1 (555) 123-4567</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
