import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/sections/AboutSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { Hero } from "@/components/sections/Hero";
import { PackagesSection } from "@/components/sections/PackagesSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "MA Studio — Capturing Moments. Creating Timeless Stories.",
      description:
        "Luxury wedding, portrait, event, fashion and commercial photography & cinematography by MA Studio, Faisalabad.",
      path: "/",
    }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <GallerySection id="home-gallery" limit={9} />
      <ServicesSection />
      <PackagesSection />
      <PortfolioSection limit={3} />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
