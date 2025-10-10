import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TrustIndicators from '@/components/TrustIndicators';
import DestinationsSection from '@/components/DestinationsSection';
import DealsSection from '@/components/DealsSection';
import QuoteForm from '@/components/QuoteForm';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrustIndicators />
        <DestinationsSection />
        <DealsSection />
        <QuoteForm />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
