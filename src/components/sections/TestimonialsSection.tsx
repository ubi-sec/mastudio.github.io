import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { testimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";

export function TestimonialsSection() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const t = testimonials[i % testimonials.length]!;
  const go = (d: 1 | -1) => setI((n) => (n + d + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((n) => (n + 1) % testimonials.length), 6500);
    return () => clearInterval(id);
  }, [paused]);

  const initials = t.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  return (
    <section className="relative overflow-hidden py-24 md:py-32" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="container-lux">
        <SectionHeading
          align="center"
          eyebrow="Client Testimonials"
          title={
            <>
              What our clients <em className="text-gold-ink">say</em>
            </>
          }
        />
        <p className="mt-4 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Sample reviews shown — real client stories coming soon
        </p>

        <div className="relative mx-auto mt-14 max-w-4xl rounded-2xl border border-border bg-card/60 p-8 text-center backdrop-blur md:p-14" aria-roledescription="carousel" aria-label="Testimonials">
          <Quote className="mx-auto h-10 w-10 text-gold-ink" aria-hidden />
          <div className="relative min-h-[230px] md:min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                aria-live="polite"
              >
                <div className="mt-6 flex justify-center gap-1" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star key={s} className={cn("h-4 w-4", s < t.rating ? "fill-gold text-gold" : "text-muted-foreground/40")} />
                  ))}
                </div>
                <blockquote className="mt-6 font-serif text-2xl leading-snug text-foreground md:text-4xl">“{t.quote}”</blockquote>
                <figcaption className="mt-8 flex items-center justify-center gap-4">
                  {t.photo ? (
                    <img src={t.photo} alt={t.name} className="h-12 w-12 rounded-full border border-gold object-cover" />
                  ) : (
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-hairline font-serif text-lg text-gold-ink" aria-hidden>
                      {initials}
                    </span>
                  )}
                  <span className="text-left">
                    <span className="block font-medium text-foreground">{t.name}</span>
                    <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">{t.context}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6">
            <button type="button" onClick={() => go(-1)} aria-label="Previous review" className="grid h-11 w-11 place-items-center rounded-full border border-border transition-colors hover:border-gold hover:text-gold-ink">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((x, n) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => setI(n)}
                  aria-label={`Show review ${n + 1}`}
                  aria-current={n === i}
                  className={cn("h-1.5 rounded-full transition-all duration-500", n === i ? "w-8 bg-gold" : "w-1.5 bg-muted-foreground/40")}
                />
              ))}
            </div>
            <button type="button" onClick={() => go(1)} aria-label="Next review" className="grid h-11 w-11 place-items-center rounded-full border border-border transition-colors hover:border-gold hover:text-gold-ink">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
