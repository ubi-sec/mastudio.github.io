import { Link } from "@tanstack/react-router";
import { Aperture, ArrowRight, Camera, Clapperboard, Plane, Sparkles, Sun } from "lucide-react";
import { Reveal, RevealImage } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { photos } from "@/data/photos";
import { useSiteSettings } from "@/lib/public-content";

const pillars = [
  { Icon: Sparkles, title: "Creative philosophy", text: "Every frame should feel like a memory — honest emotion, elevated by deliberate, cinematic light." },
  { Icon: Aperture, title: "Our approach", text: "We plan with you, direct gently, and stay invisible when the real moments unfold." },
  { Icon: Sun, title: "Signature finish", text: "A warm, timeless colour grade and meticulous retouching, delivered with care." },
];

const equipment = [
  { Icon: Camera, label: "Full-frame mirrorless bodies" },
  { Icon: Aperture, label: "Fast prime & G-master lenses" },
  { Icon: Clapperboard, label: "Cinema lenses & gimbal rigs" },
  { Icon: Plane, label: "Aerial drone coverage" },
];

export function AboutSection({ full = false }: { full?: boolean }) {
  const settings = useSiteSettings();
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-lux grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <RevealImage src={photos.studio} alt="Inside the MA Studio photography studio" className="aspect-[4/5] rounded-lg border border-border" />
          <Reveal delay={0.3} className="absolute -bottom-8 -right-4 w-1/2 md:-right-10">
            <RevealImage src={photos.groom} alt="Editorial portrait from MA Studio" className="aspect-[3/4] rounded-lg border-4 border-background shadow-elegant" />
          </Reveal>
        </div>

        <div>
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-gold" /> About MA Studio
            </p>
            <h2 className="mt-4 text-4xl leading-[1.05] text-foreground md:text-6xl">
              {settings.aboutHeading}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {settings.aboutIntro}
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {pillars.map(({ Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.1} className="rounded-lg border border-border p-5 transition-colors duration-500 hover:border-hairline">
                <Icon className="h-5 w-5 text-gold-ink" />
                <h3 className="mt-4 font-serif text-xl text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </Reveal>
            ))}
          </div>

          {!full && (
            <Reveal className="mt-10">
              <Button asChild variant="goldOutline" size="xl">
                <Link to="/about">
                  Learn More <ArrowRight />
                </Link>
              </Button>
            </Reveal>
          )}
        </div>
      </div>

      {full && (
        <>
          <div className="container-lux mt-32 grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
            <RevealImage src={photos.equipment} alt="MA Studio camera and lens kit" className="aspect-[16/10] rounded-lg border border-border" />
            <Reveal>
              <p className="eyebrow">Professional equipment</p>
              <h3 className="mt-3 text-4xl text-foreground">Cinema-grade tools, artist's eye</h3>
              <p className="mt-4 text-muted-foreground">
                We shoot on professional, redundant kit so nothing is left to chance — and choose every lens for the story, not the spec sheet.
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {equipment.map(({ Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 rounded-md border border-border p-4 text-sm text-foreground/85">
                    <Icon className="h-5 w-5 shrink-0 text-gold-ink" /> {label}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal className="container-lux mt-32 text-center">
            <p className="font-script text-5xl text-gold-ink md:text-6xl">Photography Beyond Ordinary</p>
            <blockquote className="mx-auto mt-8 max-w-4xl font-serif text-3xl leading-snug text-foreground md:text-5xl">
              “We don't just take pictures. We preserve the feeling of a moment — so you can return to it, forever.”
            </blockquote>
            <p className="eyebrow mt-8">The MA Studio promise</p>
          </Reveal>
        </>
      )}
    </section>
  );
}
