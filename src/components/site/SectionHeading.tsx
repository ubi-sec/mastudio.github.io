import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      <p className={cn("eyebrow flex items-center gap-3", align === "center" && "justify-center")}>
        <span className="h-px w-8 bg-gold" />
        {eyebrow}
        {align === "center" && <span className="h-px w-8 bg-gold" />}
      </p>
      <h2 className="mt-4 text-4xl leading-[1.05] text-foreground md:text-6xl">{title}</h2>
      {intro && <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">{intro}</p>}
    </Reveal>
  );
}
