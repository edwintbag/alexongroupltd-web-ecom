import { Hero } from '@/components/home/hero';
import { Metrics } from '@/components/home/metrics';
import { CategoryShowcase } from '@/components/home/category-showcase';
import { FeaturedProducts } from '@/components/home/featured-products';
import { ProjectJourney } from '@/components/home/project-journey';
import { ServiceShowcase } from '@/components/home/service-showcase';
import { EquipmentShowcase } from '@/components/home/equipment-showcase';
import { GalleryPreview } from '@/components/home/gallery-preview';
import { WhyAlexon } from '@/components/home/why-alexon';
import { CareersTeaser } from '@/components/home/careers-teaser';
import { QuoteCTA } from '@/components/home/quote-cta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Metrics />
      <CategoryShowcase />
      <FeaturedProducts />
      <ProjectJourney />
      <ServiceShowcase />
      <EquipmentShowcase />
      <WhyAlexon />
      <GalleryPreview />
      <CareersTeaser />
      <QuoteCTA />
    </>
  );
}
