import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Maximize2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Lightbox } from "@/components/site/Lightbox";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { categoryCovers } from "@/data/gallery";
import { photos as samplePhotos } from "@/data/photos";
import { useGallery, useSiteSettings } from "@/lib/public-content";
import { cn } from "@/lib/utils";

const heights = { tall: "aspect-[3/4.4]", wide: "aspect-[4/3]", square: "aspect-square" };

export function GallerySection({ limit, id }: { limit?: number; id?: string }) {
  const [filter, setFilter] = useState<string>("All");
  const [index, setIndex] = useState<number | null>(null);
  const { photos, isLoading } = useGallery();
  const { galleryCategories } = useSiteSettings();

  const items = useMemo(() => {
    let list = filter === "All" ? photos : photos.filter((g) => g.category === filter);
    if (limit) list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, limit);
    return list;
  }, [filter, limit, photos]);

  const cover = (c: string) =>
    photos.find((p) => p.category === c && p.featured)?.src ??
    photos.find((p) => p.category === c)?.src ??
    (categoryCovers as Record<string, string>)[c] ??
    samplePhotos.studio;

  const lightboxImages = items.map((g) => ({ src: g.src, alt: g.alt, title: g.title, caption: g.category }));

  return (
    <section id={id} className="relative scroll-mt-24 py-24 md:py-32">
      <div className="container-lux">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Our Gallery"
            title={
              <>
                Stories in <em className="text-gold-ink">light & shadow</em>
              </>
            }
            intro="Explore our collection of stunning visuals — filter by the moments that matter to you."
          />
          {limit && (
            <Button asChild variant="goldOutline" size="pill">
              <Link to="/gallery">
                Full gallery <ArrowRight />
              </Link>
            </Button>
          )}
        </div>

        {/* category cards */}
        <div className="-mx-5 mt-12 flex snap-x gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-flow-col md:auto-cols-fr md:overflow-visible md:px-0">
          {galleryCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter((f) => (f === c ? "All" : c))}
              aria-pressed={filter === c}
              className={cn(
                "group relative aspect-[3/4] w-32 shrink-0 snap-start overflow-hidden rounded-md border text-left transition-all duration-500 md:w-auto",
                filter === c ? "border-gold shadow-glow" : "border-border hover:border-hairline",
              )}
            >
              <img src={cover(c)} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <span className="bg-card-scrim absolute inset-0" />
              <span className="absolute inset-x-0 bottom-3 text-center font-serif text-lg text-ivory">{c}</span>
            </button>
          ))}
        </div>

        {/* filter pills */}
        <div role="tablist" aria-label="Filter gallery" className="mt-8 flex flex-wrap gap-2">
          {["All", ...galleryCategories].map((c) => (
            <button
              key={c}
              role="tab"
              type="button"
              aria-selected={filter === c}
              onClick={() => setFilter(c)}
              className={cn(
                "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-all duration-300",
                filter === c ? "border-gold bg-gold text-ink" : "border-border text-foreground/70 hover:border-gold hover:text-gold-ink",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="masonry mt-10">
            {Array.from({ length: limit ?? 9 }).map((_, i) => (
              <Skeleton key={i} className={cn("w-full rounded-md", i % 2 ? heights.wide : heights.tall)} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">New work in this category is coming soon.</p>
        ) : (
          <motion.div layout className="masonry mt-10">
            <AnimatePresence mode="popLayout">
              {items.map((g, i) => (
                <motion.figure
                  key={g.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, delay: (i % 6) * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Open ${g.title}`}
                    className={cn("group relative block w-full overflow-hidden rounded-md border border-border", heights[g.shape])}
                  >
                    <img src={g.src} alt={g.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
                    <span className="bg-card-scrim absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="absolute inset-3 rounded-sm border border-gold/0 transition-all duration-700 group-hover:inset-4 group-hover:border-gold/60" />
                    <figcaption className="absolute inset-x-6 bottom-6 flex translate-y-3 items-end justify-between text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <span>
                        <span className="eyebrow block !text-gold">{g.category}</span>
                        <span className="font-serif text-2xl text-ivory">{g.title}</span>
                      </span>
                      <Maximize2 className="h-5 w-5 text-gold" />
                    </figcaption>
                  </button>
                </motion.figure>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
      <Lightbox images={lightboxImages} index={index} onIndexChange={setIndex} onClose={() => setIndex(null)} />
    </section>
  );
}
