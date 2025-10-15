import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function Privacy() {
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
            
            <h1 className="text-4xl font-display font-bold text-foreground mb-4" data-testid="text-privacy-title">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground mb-8" data-testid="text-last-updated">
              At SkyBudget, we respect your privacy and are committed to protecting your personal information.
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-foreground">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information Collection</h2>
              <p className="mb-4">
                We collect information you provide when requesting flight quotes, including name, email, phone number, and travel preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Use of Information</h2>
              <p className="mb-4">
                We use your information to provide flight quotes, process bookings, and communicate with you about your travel requests.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
              <p className="mb-4">
                We do not sell or share your personal information with third parties except as necessary to provide our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access and disclosure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
              <p className="mb-4">
                We use cookies to improve your browsing experience and analyze website traffic.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="mb-4">
                For questions about this privacy policy, contact us at: <a href="mailto:info@skybudgetfly.vip" className="text-primary hover:underline">info@skybudgetfly.vip</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
