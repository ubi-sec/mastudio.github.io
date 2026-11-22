import { createFileRoute } from "@tanstack/react-router";
import { AboutSection } from "@/components/sections/AboutSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PageHeader } from "@/components/site/PageHeader";
import { photos } from "@/data/photos";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About MA Studio — More Than Just Photos",
      description: "Meet MA Studio, a Faisalabad photography & cinematography studio: our philosophy, approach and equipment.",
      path: "/about",
    }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader
        crumb="About"
        eyebrow="The Studio"
        title={<>More than just photos. <em className="text-gold">We create memories.</em></>}
        image={photos.studio}
      />
      <AboutSection full />
      <TestimonialsSection />
    </>
  );
}
