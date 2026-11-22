import { createFileRoute } from "@tanstack/react-router";
import { GallerySection } from "@/components/sections/GallerySection";
import { PageHeader } from "@/components/site/PageHeader";
import { photos } from "@/data/photos";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/gallery")({
  head: () =>
    pageHead({
      title: "Gallery — MA Studio Photography",
      description: "Browse MA Studio's wedding, portrait, event, fashion, commercial, product, nature and cinematic work.",
      path: "/gallery",
    }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <>
      <PageHeader
        crumb="Gallery"
        eyebrow="The Collection"
        title={<>A gallery of <em className="text-gold">timeless</em> frames</>}
        intro="Eight disciplines, one signature look. Tap any image to view it full-screen."
        image={photos.events}
      />
      <GallerySection />
    </>
  );
}
