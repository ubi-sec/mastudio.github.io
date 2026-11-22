import { createFileRoute } from "@tanstack/react-router";
import { PackagesSection } from "@/components/sections/PackagesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PageHeader } from "@/components/site/PageHeader";
import { photos } from "@/data/photos";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/packages")({
  head: () =>
    pageHead({
      title: "Packages — Basic, Premium & Luxury | MA Studio",
      description: "Compare MA Studio's Basic, Premium and Luxury photography packages and send an inquiry for your quote.",
      path: "/packages",
    }),
  component: PackagesPage,
});

function PackagesPage() {
  return (
    <>
      <PageHeader
        crumb="Packages"
        eyebrow="Investment"
        title={<>Packages made <em className="text-gold">for you</em></>}
        intro="Three tiers of coverage, each tailored to your date and venue. Pick one and we'll send a personal quote."
        image={photos.couple}
      />
      <PackagesSection />
      <TestimonialsSection />
    </>
  );
}
