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
              Terms of Service
            </h1>
            <p className="text-muted-foreground mb-8" data-testid="text-last-updated">
              Last updated: October 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-foreground">
            <section className="mb-8">
              <p className="mb-6 text-lg">
                By using SkyBudget's services, you accept these terms and conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Services</h2>
              <p className="mb-4">
                SkyBudget offers assistance services for flight search and booking. We act as intermediaries between customers and airlines. Is it safe to buy with us? Booking with us is completely safe, as we process all payments through Stripe, an internationally verified platform that protects your money with the highest security standards. Additionally, we will only send the payment link to pay for the reservation once our agents confirm the availability of the flight, and if the customer accepts and confirms the reservation by sending us their data, which the airline requests to make the reservation. To give more security to our customers, "Payment is made after receiving the reservation code from the airline". Once the customer receives the confirmation code by email, and the flight itinerary directly from the airline, they will have 20 minutes to make the payment through the payment link provided in the email along with their reservation code. "Important, If the customer does not make the payment within that time period, the reservation will be canceled to prevent fraud against SkyBudget".
              </p>
              <p className="mb-4">
                Additionally, we respect your privacy and are available to answer any questions you may have during the process. Your purchase is protected and backed by trusted technology. What payment methods do we accept? We accept credit or debit card payments, bank transfers, and through our secure Stripe platform. All payments are secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Flight Quotes</h2>
              <p className="mb-4">
                Flight quotes are estimates and may change according to availability and airline policies. Final prices will be confirmed before booking. Currently, we only have agreements with airlines that are members of the oneworld alliance for domestic and international flights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Booking Process</h2>
              <p className="mb-4">
                Complete the "Get Your Flight Quote" form with all the necessary information for your booking, making sure to correctly provide your contact information. Within minutes, you will receive your flight quote with a 40% discount, along with payment and booking instructions, by email. Once you are sure of your reservation and accept our terms and conditions published in the email and on our website and confirm the provided reservation by responding to the email with your personal data which the airlines require to make the reservation, (no financial data is requested) we will proceed to make the reservation and once you receive the code and flight itinerary, you must make the secure payment through our verified Stripe gateway, within a maximum period of 20 minutes, to avoid flight cancellation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Cancellation Policy</h2>
              <p className="mb-4">
                Due to the special discounts we offer through agreements and promotions, we cannot guarantee cancellations or flight refunds, so we recommend being sure of your reservation. However, Sky Budget guarantees that you will get the flight you want. If you need to modify your trip, we offer you a similar flight at no additional cost, as long as there is availability on the chosen date. To manage itinerary changes, it is important that you notify us at least 48 hours in advance of your flight so that we can help you effectively. Our team is here to help you at all times and guarantee a reliable experience. If you have any problems with your reservation, do not hesitate to contact us so we can help you resolve it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="mb-4">
                SkyBudget is not responsible for delays, cancellations, or flight changes made by airlines.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these terms at any time. Changes will be posted on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="mb-4">
                For questions about these terms, contact us at: <a href="mailto:info@skybudgetfly.vip" className="text-primary hover:underline">info@skybudgetfly.vip</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
