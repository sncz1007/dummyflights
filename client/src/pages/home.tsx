import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TrustBadges from '@/components/TrustBadges';
import PopularDestinations from '@/components/PopularDestinations';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import VideoStrip from '@/components/VideoStrip';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrustBadges />
        <PopularDestinations />
        <WhyChooseUs />
        <Testimonials />
        <VideoStrip />
      </main>
    </div>
  );
}
