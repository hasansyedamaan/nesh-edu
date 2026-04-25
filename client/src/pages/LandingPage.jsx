import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import MetricsSection from '../components/MetricsSection';
import CurriculumGrid from '../components/CurriculumGrid';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

const LandingPage = () => (
  <div style={{ background:'var(--background)' }}>
    <Navbar />
    <HeroSection />
    <MetricsSection />
    <CurriculumGrid />
    <CTASection />
    <Footer />
  </div>
);

export default LandingPage;
