import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TrustBadges from '@/components/TrustBadges';
import PopularDestinations from '@/components/PopularDestinations';
import AboutUs from '@/components/AboutUs';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import VideoStrip from '@/components/VideoStrip';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrustBadges />
        <VideoStrip />
        <PopularDestinations />
        <AboutUs />
        <WhyChooseUs />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
