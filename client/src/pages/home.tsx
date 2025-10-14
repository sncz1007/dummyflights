import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TrustBadges from '@/components/TrustBadges';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <TrustBadges />
      </main>
    </div>
  );
}
