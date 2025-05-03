import ContactSection from '@/components/ContactSection';
import FeatureCard from '@/components/FeatureCard';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import { NavBar } from '@/components/NavBar';
import Stats from '@/components/Stats';
import { Testimonials } from '@/components/Testimonials';

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />
      <FeatureCard />
      <Stats />
      <Testimonials />
      <ContactSection />
      <Footer />
    </>
  );
}
