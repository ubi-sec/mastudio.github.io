import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal, RevealImage } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/lib/public-content";
import { cn } from "@/lib/utils";

export function PortfolioSection({ limit }: { limit?: number }) {
  const { projects: allProjects } = usePortfolio();
  const projects = limit ? allProjects.slice(0, limit) : allProjects;

  return (
    <section className="relative bg-surface py-24 md:py-32">
      <div className="container-lux">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Our Portfolio"
            title={
              <>
                Featured <em className="text-gold-ink">stories</em>
              </>
            }
            intro="A glimpse of our best work — each project a complete visual story, from first frame to final film."
          />
          {limit && (
            <Button asChild variant="goldOutline" size="pill">
              <Link to="/portfolio">
                View Portfolio <ArrowRight />
              </Link>
            </Button>
          )}
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-12">
          {projects.map((p, i) => {
            const big = i % 3 === 0;
            return (
              <Reveal
                key={p.slug}
                className={cn(big ? "md:col-span-12" : "md:col-span-6", !big && i % 3 === 2 && "md:mt-24")}
              >
                <Link to="/portfolio/$slug" params={{ slug: p.slug }} className="group block" data-cursor="hover">
                  <div className={cn("relative overflow-hidden rounded-lg border border-border", big ? "aspect-[21/9]" : "aspect-[4/5]")}>
                    <RevealImage src={p.cover} alt={p.title} className="absolute inset-0" imgClassName="transition-transform duration-[1.6s] group-hover:scale-105" />
                    <span className="bg-card-scrim absolute inset-0 opacity-70" />
                    <span className="absolute right-5 top-5 grid h-12 w-12 place-items-center rounded-full border border-gold/50 bg-ink/40 text-gold backdrop-blur transition-all duration-500 group-hover:rotate-45 group-hover:bg-gold group-hover:text-ink">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                    {big && (
                      <div className="absolute bottom-8 left-8 right-8 max-w-xl text-ivory">
                        <p className="eyebrow !text-gold">{p.category} · {p.location}</p>
                        <h3 className="mt-3 text-4xl md:text-6xl">{p.title}</h3>
                      </div>
                    )}
                  </div>
                  <div className={cn("mt-6 flex items-start justify-between gap-6", big && "md:max-w-3xl")}>
                    <div>
                      {!big && (
                        <>
                          <p className="eyebrow">{p.category} · {p.location}</p>
                          <h3 className="mt-2 text-3xl text-foreground transition-colors group-hover:text-gold-ink">{p.title}</h3>
                        </>
                      )}
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
                      <span className="link-underline mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold-ink">
                        View Project <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
