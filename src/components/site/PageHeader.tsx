import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { GoldParticles } from "./GoldParticles";

export function PageHeader({
  eyebrow,
  title,
  intro,
  image,
  crumb,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  image: string;
  crumb: string;
}) {
  return (
    <section className="grain relative flex min-h-[62vh] items-end overflow-hidden bg-ink pb-16 pt-40">
      <img src={image} alt="" aria-hidden className="animate-ken-burns absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className="bg-hero-scrim absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-fade-bottom" />
      <GoldParticles count={24} />
      <div className="container-lux relative">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-ivory/60">
          <Link to="/" className="hover:text-gold">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gold">{crumb}</span>
        </nav>
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="eyebrow !text-gold">
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="mt-4 max-w-4xl text-5xl leading-[1.02] text-ivory md:text-7xl"
        >
          {title}
        </motion.h1>
        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-ivory/75"
          >
            {intro}
          </motion.p>
        )}
      </div>
    </section>
  );
}
