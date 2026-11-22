import { createFileRoute } from "@tanstack/react-router";
import { PackagesSection } from "@/components/sections/PackagesSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { PageHeader } from "@/components/site/PageHeader";
import { photos } from "@/data/photos";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/services")({
  head: () =>
    pageHead({
      title: "Services — Wedding, Portrait, Event & Cinematic Videography | MA Studio",
      description: "Wedding, portrait, event, commercial and product photography plus cinematic videography from MA Studio.",
      path: "/services",
    }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHeader
        crumb="Services"
        eyebrow="What we do"
        title={<>Crafted for <em className="text-gold">every story</em></>}
        intro="From intimate portraits to full-day wedding films — choose a service to see the details or send an inquiry."
        image={photos.cinematography}
      />
      <ServicesSection />
      <PackagesSection />
    </>
  );
}
