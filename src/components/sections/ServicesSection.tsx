import { ArrowUpRight, Check, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { services, type Service } from "@/data/services";

export function ServicesSection() {
  const { openInquiry } = useInquiry();
  const [active, setActive] = useState<Service | null>(null);

  return (
    <section className="relative bg-surface py-24 md:py-32">
      <div className="container-lux">
        <SectionHeading
          eyebrow="Our Services"
          title={
            <>
              Professional photography <br className="hidden md:block" />
              for <em className="text-gold-ink">every moment</em>
            </>
          }
          intro="From intimate portraits to grand events, we bring your vision to life with creativity and cinematic craft."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.1}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-700 hover:-translate-y-1 hover:border-hairline hover:shadow-glow">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={s.image} alt={s.title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110" />
                  <span className="bg-card-scrim absolute inset-0" />
                  <span className="absolute left-5 top-5 font-serif text-sm text-ivory/80">0{i + 1}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-2xl text-foreground">{s.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{s.short}</p>
                  <div className="mt-6 flex gap-2">
                    <Button variant="goldOutline" size="pill" onClick={() => setActive(s)}>
                      View Details <ArrowUpRight />
                    </Button>
                    <Button variant="quiet" size="pill" onClick={() => openInquiry({ eventType: s.eventType })}>
                      <MessageSquare /> Inquiry
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl overflow-hidden border-hairline bg-surface-raised p-0 sm:rounded-xl">
          {active && (
            <div className="grid md:grid-cols-2">
              <img src={active.image} alt={active.title} className="h-56 w-full object-cover md:h-full" />
              <div className="p-8">
                <p className="eyebrow">Service</p>
                <DialogTitle className="mt-2 font-serif text-3xl font-medium text-foreground">{active.title}</DialogTitle>
                <DialogDescription className="mt-4 text-sm leading-relaxed text-muted-foreground">{active.description}</DialogDescription>
                <ul className="mt-6 space-y-2">
                  {active.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-3 text-sm text-foreground/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" /> {inc}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="gold"
                  size="xl"
                  className="mt-8 w-full"
                  onClick={() => {
                    const ev = active.eventType;
                    setActive(null);
                    openInquiry({ eventType: ev });
                  }}
                >
                  Inquire about this service
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
