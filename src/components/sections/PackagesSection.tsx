import { Check, Crown, Minus, Sparkles } from "lucide-react";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import { GoldParticles } from "@/components/site/GoldParticles";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { buildComparison, formatPrice } from "@/data/packages";
import { usePackages } from "@/lib/public-content";
import { photos } from "@/data/photos";
import { cn } from "@/lib/utils";

export function PackagesSection({ id }: { id?: string }) {
  const { openInquiry } = useInquiry();
  const { packages } = usePackages();
  const packageComparison = buildComparison(packages);

  return (
    <section id={id} className="relative scroll-mt-24 overflow-hidden py-24 md:py-36">
      <img src={photos.couple} alt="" aria-hidden loading="lazy" className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/3 object-cover opacity-20 [mask-image:linear-gradient(to_left,black,transparent)] lg:block" />
      <GoldParticles count={28} />
      <div className="container-lux relative">
        <SectionHeading
          align="center"
          eyebrow="Our Packages"
          title={
            <>
              Choose your <em className="text-gold-ink">perfect package</em>
            </>
          }
          intro="Flexible packages for every story. Send an inquiry and we'll confirm availability for your date."
        />

        <div className="mt-20 grid items-stretch gap-6 lg:grid-cols-3 lg:gap-8">
          {packages.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.12} className={cn(p.popular && "lg:-mt-6")}>
              <article
                className={cn(
                  "group relative flex h-full flex-col rounded-xl border bg-card/80 p-8 backdrop-blur-sm transition-all duration-700 hover:-translate-y-2 md:p-10",
                  p.popular ? "gold-frame border-transparent shadow-glow" : "border-border hover:border-hairline hover:shadow-glow",
                )}
              >
                {p.popular && (
                  <span className="absolute -top-4 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gold-gradient px-4 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ink">
                    <Sparkles className="h-3 w-3" /> Most Popular
                  </span>
                )}
                <div className="flex items-center justify-between">
                  <p className="eyebrow">{p.tier}</p>
                  {p.slug === "luxury" && <Crown className="h-5 w-5 text-gold-ink" />}
                </div>
                <h3 className="mt-4 text-4xl text-foreground">{p.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                <div className="my-8 border-y border-border py-6">
                  <p className={cn("font-serif text-3xl", p.price ? "text-gold-gradient" : "text-gold-ink")}>{formatPrice(p)}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{p.priceNote}</p>
                </div>
                <ul className="flex-1 space-y-4">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-foreground/85">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-hairline">
                        <Check className="h-3 w-3 text-gold-ink" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={p.popular ? "gold" : "goldOutline"}
                  size="xl"
                  className="mt-10 w-full"
                  onClick={() => openInquiry({ packageName: p.name })}
                >
                  Inquiry Now
                </Button>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Comparison */}
        <Reveal className="mt-20">
          <h3 className="text-center text-3xl text-foreground">Compare packages</h3>
          <div className="mt-8 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">Package comparison</caption>
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th scope="col" className="p-5 font-normal text-muted-foreground">What's included</th>
                  {packages.map((p) => (
                    <th key={p.id} scope="col" className={cn("p-5 font-serif text-xl font-medium", p.popular ? "text-gold-ink" : "text-foreground")}>
                      {p.name.replace(" Package", "")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {packageComparison.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0 transition-colors hover:bg-accent/40">
                    <th scope="row" className="p-5 font-normal text-foreground/80">{row.label}</th>
                    {packages.map((p) => {
                      const v = row.values[p.id];
                      return (
                        <td key={p.id} className={cn("p-5", p.popular && "bg-accent/30")}>
                          {v === true ? (
                            <Check className="h-4 w-4 text-gold-ink" aria-label="Included" />
                          ) : v === false ? (
                            <Minus className="h-4 w-4 text-muted-foreground/50" aria-label="Not included" />
                          ) : (
                            <span className="text-foreground/85">{v}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 text-center">
            <Button variant="goldOutline" size="xl" onClick={() => openInquiry({ packageName: "Custom / Not sure yet" })}>
              Need something custom? Ask us
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
