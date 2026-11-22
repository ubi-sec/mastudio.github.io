import { createFileRoute } from "@tanstack/react-router";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { PageHeader } from "@/components/site/PageHeader";
import { photos } from "@/data/photos";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/portfolio/")({
  head: () =>
    pageHead({
      title: "Portfolio — Featured Projects | MA Studio",
      description: "Featured MA Studio projects: weddings, mehndi nights, fashion editorials, product campaigns and films.",
      path: "/portfolio",
    }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <>
      <PageHeader
        crumb="Portfolio"
        eyebrow="Selected work"
        title={<>Stories we're <em className="text-gold">proud of</em></>}
        intro="Each project is a complete visual story. Open one to see the full set and how it came together."
        image={photos.fashion}
      />
      <PortfolioSection />
    </>
  );
}
