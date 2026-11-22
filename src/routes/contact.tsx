import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/sections/ContactSection";
import { PageHeader } from "@/components/site/PageHeader";
import { photos } from "@/data/photos";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "Contact & Booking — MA Studio, Faisalabad",
      description: "Book a shoot with MA Studio. Call or WhatsApp 0307 6998873, email us, or send a booking request online.",
      path: "/contact",
    }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHeader
        crumb="Contact"
        eyebrow="Book a shoot"
        title={<>Let's tell <em className="text-gold">your story</em></>}
        intro="Send a booking request, message us on WhatsApp, or call the studio directly."
        image={photos.hero}
      />
      <ContactSection />
    </>
  );
}
