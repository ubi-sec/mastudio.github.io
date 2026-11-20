import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect } from "react";

export interface LightboxImage {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
}

export function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: LightboxImage[];
  index: number | null;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onIndexChange((index + dir + images.length) % images.length);
    },
    [index, images.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const img = index !== null ? images[index] : null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-0 z-[61] flex flex-col items-center justify-center p-4 outline-none md:p-12">
          <DialogPrimitive.Title className="sr-only">{img?.title ?? "Image preview"}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">Use the arrow keys to browse images.</DialogPrimitive.Description>
          <div className="relative flex h-full w-full items-center justify-center">
            <AnimatePresence mode="wait">
              {img && (
                <motion.img
                  key={img.src + index}
                  src={img.src}
                  alt={img.alt}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                  className="max-h-[80vh] max-w-full border border-gold/30 object-contain shadow-elegant"
                />
              )}
            </AnimatePresence>
          </div>
          {img && (
            <div className="mt-4 flex w-full max-w-5xl items-center justify-between gap-4 text-ivory">
              <div>
                {img.caption && <p className="eyebrow !text-gold">{img.caption}</p>}
                {img.title && <p className="font-serif text-2xl">{img.title}</p>}
              </div>
              <p className="text-sm tabular-nums text-ivory/60">
                {(index ?? 0) + 1} / {images.length}
              </p>
            </div>
          )}
          {images.length > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-ink/60 text-ivory transition-colors hover:border-gold hover:text-gold md:left-8">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next image" className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-ink/60 text-ivory transition-colors hover:border-gold hover:text-gold md:right-8">
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          <DialogPrimitive.Close aria-label="Close preview" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-gold/40 text-ivory transition-colors hover:border-gold hover:text-gold md:right-8 md:top-8">
            <X className="h-5 w-5" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
