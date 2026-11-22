import { Mail, MapPin, Phone } from "lucide-react";
import { BookingForm } from "@/components/inquiry/BookingForm";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SocialLinks } from "@/components/site/SocialLinks";
import { WhatsAppIcon } from "@/components/site/WhatsAppFloat";
import { site, whatsappLink } from "@/config/site";

const details = [
  { Icon: Phone, label: "Phone", value: site.phoneDisplay, href: site.phoneHref, external: false },
  { Icon: WhatsAppIcon, label: "WhatsApp", value: site.phoneDisplay, href: whatsappLink("Hello MA Studio!"), external: true },
  { Icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}`, external: false },
  { Icon: MapPin, label: "Studio location", value: site.location, href: site.mapUrl, external: true },
];

export function ContactSection() {
  return (
    <section id="booking" className="relative scroll-mt-24 bg-surface py-24 md:py-32">
      <div className="container-lux grid gap-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeading
            eyebrow="Get in Touch"
            title={
              <>
                Let's create <em className="text-gold-ink">together</em>
              </>
            }
            intro="Have a project in mind? Tell us about your day and we'll get back to you with availability."
          />
          <ul className="mt-10 space-y-4">
            {details.map(({ Icon, label, value, href, external }, i) => (
              <Reveal key={label} delay={i * 0.06}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-5 rounded-lg border border-border p-5 transition-all duration-500 hover:border-hairline hover:bg-accent/40"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-hairline text-gold-ink transition-colors group-hover:bg-gold group-hover:text-ink">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">{label}</span>
                    <span className="block break-all text-foreground">{value}</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
          <div className="mt-10">
            <p className="eyebrow">Follow the studio</p>
            <SocialLinks className="mt-4 flex-col items-start gap-3" withLabels />
          </div>
        </div>

        <Reveal>
          <div className="rounded-2xl border border-hairline bg-card p-6 shadow-elegant md:p-12">
            <p className="eyebrow">Booking form</p>
            <h3 className="mt-3 text-4xl text-foreground">Book a shoot</h3>
            <p className="mt-2 text-sm text-muted-foreground">Fields marked * are required.</p>
            <div className="mt-10">
              <BookingForm />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
