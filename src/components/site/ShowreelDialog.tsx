import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { site } from "@/config/site";
import { galleryItems } from "@/data/gallery";

const reel = galleryItems.filter((g) => g.shape !== "tall").slice(0, 7);

export function ShowreelDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!open || site.showreelEmbedUrl) return;
    setI(0);
    const id = setInterval(() => setI((n) => (n + 1) % reel.length), 3200);
    return () => clearInterval(id);
  }, [open]);

  const cur = reel[i % reel.length]!;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl overflow-hidden border-gold/30 bg-ink p-0 text-ivory sm:rounded-none">
        <DialogTitle className="sr-only">MA Studio showreel</DialogTitle>
        <DialogDescription className="sr-only">A cinematic preview of MA Studio's work.</DialogDescription>
        <div className="relative aspect-video w-full overflow-hidden bg-ink">
          {site.showreelEmbedUrl ? (
            <iframe
              src={site.showreelEmbedUrl}
              title="MA Studio showreel"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <>
              <AnimatePresence>
                <motion.img
                  key={cur.id}
                  src={cur.src}
                  alt={cur.alt}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1.12 }}
                  exit={{ opacity: 0 }}
                  transition={{ opacity: { duration: 1.2 }, scale: { duration: 4.5, ease: "linear" } }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              {/* letterbox bars */}
              <div className="absolute inset-x-0 top-0 h-[9%] bg-ink" />
              <div className="absolute inset-x-0 bottom-0 h-[9%] bg-ink" />
              <div className="absolute bottom-[12%] left-6 md:left-10">
                <p className="eyebrow !text-gold">{cur.category}</p>
                <p className="font-serif text-3xl md:text-5xl">{cur.title}</p>
              </div>
              <div className="absolute right-6 top-[12%] text-right text-xs uppercase tracking-[0.3em] text-ivory/70 md:right-10">
                Showreel preview · full film premiering soon
              </div>
              <div className="absolute inset-x-0 bottom-[9%] h-px bg-gold/20">
                <motion.div
                  key={`bar-${i}`}
                  className="h-full origin-left bg-gold"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 3.2, ease: "linear" }}
                />
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
