import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, Play } from "lucide-react";
import { useState } from "react";
import { GoldParticles } from "@/components/site/GoldParticles";
import { ShowreelDialog } from "@/components/site/ShowreelDialog";
import { Button } from "@/components/ui/button";
import { site } from "@/config/site";
import { photos } from "@/data/photos";

const ease = [0.2, 0.8, 0.2, 1] as const;

export function Hero() {
  const [reel, setReel] = useState(false);

  return (
    <section className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink text-ivory">
      <motion.img
        src={photos.hero}
        alt="MA Studio photographer framing a shot in warm studio light"
        fetchPriority="high"
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease }}
        className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
      />
      <div className="bg-hero-scrim absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-fade-bottom" />
      <GoldParticles count={50} />

      {/* animated light lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-[22%] h-px w-full -rotate-6 overflow-hidden opacity-60">
          <div className="animate-line-sweep h-px w-2/3 bg-gold-gradient" />
        </div>
        <div className="absolute bottom-[26%] left-0 h-px w-full rotate-3 overflow-hidden opacity-40">
          <div className="animate-line-sweep h-px w-1/2 bg-gold-gradient [animation-delay:2.2s]" />
        </div>
        <div className="absolute left-[3.5%] top-[18%] hidden h-[60%] w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent md:block" />
      </div>

      <div className="container-lux relative z-10 pt-28 md:pt-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.7, ease }}
          className="eyebrow !text-ivory/80"
        >
          Capture <span className="text-gold">·</span> Create <span className="text-gold">·</span> Inspire
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.8, ease }}
          className="mt-4 text-[clamp(4rem,13vw,11rem)] font-medium leading-[0.88] tracking-tight"
        >
          <span className="text-gold-gradient">MA</span> Studio
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2, ease }}
          className="mt-6 max-w-2xl font-serif text-2xl leading-snug text-ivory md:text-4xl"
        >
          {site.tagline}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.1, ease }}
          className="mt-4 flex max-w-xl items-center gap-4 text-base text-ivory/75 md:text-lg"
        >
          {site.description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.25, ease }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <Button asChild variant="gold" size="xl">
            <Link to="/gallery">
              Explore Gallery <ArrowRight />
            </Link>
          </Button>
          <Button variant="onImage" size="xl" onClick={() => setReel(true)}>
            <span className="grid h-6 w-6 place-items-center rounded-full border border-gold">
              <Play className="!h-3 !w-3 fill-current" />
            </span>
            Watch Showreel
          </Button>
          <Button asChild variant="onImage" size="xl">
            <Link to="/contact" hash="booking">
              Book a Shoot <CalendarDays />
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* floating script signature */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.4, delay: 2.4, ease }}
        className="animate-float-slow pointer-events-none absolute right-[6%] top-[22%] hidden rotate-[-8deg] text-right lg:block"
      >
        <p className="font-script text-6xl leading-none text-ivory xl:text-7xl">Photography</p>
        <p className="font-script text-6xl leading-none text-ivory xl:text-7xl">
          Beyond <span className="text-gold">Ordinary</span>
        </p>
        <svg viewBox="0 0 260 24" className="ml-auto mt-2 w-56 text-gold" fill="none" aria-hidden>
          <path d="M2 18 C 80 4, 160 4, 258 10" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </motion.div>

      {/* scroll indicator */}
      <a
        href="#home-gallery"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-4 text-xs uppercase tracking-[0.3em] text-ivory/70 transition-colors hover:text-gold"
      >
        <span className="link-underline">Scroll</span>
        <span className="relative flex h-10 w-6 justify-center rounded-full border border-gold/70 pt-2">
          <span className="animate-scroll-dot h-2 w-0.5 rounded-full bg-gold" />
        </span>
      </a>

      <ShowreelDialog open={reel} onOpenChange={setReel} />
    </section>
  );
}
