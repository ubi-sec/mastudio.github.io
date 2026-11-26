import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Maximize2 } from "lucide-react";
import { useState } from "react";
import { useInquiry } from "@/components/inquiry/InquiryProvider";
import { Lightbox } from "@/components/site/Lightbox";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal, RevealImage } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { Busy, EmptyState } from "@/components/admin/ui";
import { fallbackProject, usePortfolio } from "@/lib/public-content";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/portfolio/$slug")({
  head: ({ params }) => {
    const project = fallbackProject(params.slug);
    if (!project) {
      return pageHead({
        title: "Photography project | MA Studio Portfolio",
        description: "Explore this photography story from MA Studio.",
        path: `/portfolio/${params.slug}`,
        type: "article",
      });
    }
    return pageHead({
      title: `${project.title} — ${project.category} | MA Studio Portfolio`,
      description: project.summary,
      path: `/portfolio/${params.slug}`,
      type: "article",
    });
  },
  notFoundComponent: () => <ProjectMissing />,
  component: ProjectPage,
});

function ProjectMissing() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 pt-32 text-center">
      <p className="eyebrow">Portfolio</p>
      <h1 className="text-5xl text-foreground">Project not found</h1>
      <Button asChild variant="gold" size="xl">
        <Link to="/portfolio">Back to portfolio</Link>
      </Button>
    </div>
  );
}

function ProjectPage() {
  const { slug } = Route.useParams();
  const { projects, isLoading } = usePortfolio();
  const { openInquiry } = useInquiry();
  const [index, setIndex] = useState<number | null>(null);
  const project = projects.find((item) => item.slug === slug);

  if (isLoading) return <div className="min-h-screen pt-32"><Busy label="Opening the project…" /></div>;
  if (!project) return <ProjectMissing />;

  const pos = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(pos + 1) % projects.length] ?? project;

  return (
    <>
      <PageHeader crumb="Portfolio" eyebrow={`${project.category} · ${project.location}`} title={project.title} intro={project.summary} image={project.cover} />

      <section className="py-20 md:py-28">
        <div className="container-lux grid gap-14 lg:grid-cols-[1.3fr_1fr]">
          <Reveal className="space-y-6">
            <p className="eyebrow">The story</p>
            {project.story.map((para) => (
              <p key={para.slice(0, 24)} className="font-serif text-2xl leading-relaxed text-foreground/90 md:text-3xl">
                {para}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.15} className="h-fit rounded-xl border border-border bg-card p-8">
            <p className="eyebrow">Deliverables</p>
            {project.deliverables.length ? (
              <ul className="mt-6 space-y-3">
                {project.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-foreground/85">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-gold-ink" /> {d}
                  </li>
                ))}
              </ul>
            ) : <EmptyState title="Project details coming soon" />}
            <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 text-sm">
              <div>
                <dt className="text-muted-foreground">Category</dt>
                <dd className="mt-1 text-foreground">{project.category}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Location</dt>
                <dd className="mt-1 text-foreground">{project.location}</dd>
              </div>
            </dl>
            <Button variant="gold" size="xl" className="mt-8 w-full" onClick={() => openInquiry({ eventType: project.category === "Events" ? "Event" : project.category })}>
              Plan a shoot like this
            </Button>
          </Reveal>
        </div>

        <div className="container-lux mt-20 grid gap-6 md:grid-cols-2">
          {project.images.map((img, i) => (
            <button
              key={img.src + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View ${img.alt} full-screen`}
              className={"group relative overflow-hidden rounded-lg border border-border " + (i === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/5]")}
            >
              <RevealImage src={img.src} alt={img.alt} className="absolute inset-0" imgClassName="transition-transform duration-[1.4s] group-hover:scale-105" />
              <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-ink/50 text-gold opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                <Maximize2 className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>

        <div className="container-lux mt-20 flex flex-col items-center justify-between gap-6 border-t border-border pt-10 sm:flex-row">
          <Link to="/portfolio" className="link-underline inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-foreground/80 hover:text-gold-ink">
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>
          <Link to="/portfolio/$slug" params={{ slug: next.slug }} className="group text-right">
            <span className="eyebrow block">Next project</span>
            <span className="mt-1 inline-flex items-center gap-3 font-serif text-3xl text-foreground transition-colors group-hover:text-gold-ink">
              {next.title} <ArrowRight className="h-5 w-5" />
            </span>
          </Link>
        </div>
      </section>

      <Lightbox
        images={project.images.map((im) => ({ ...im, title: project.title, caption: project.category }))}
        index={index}
        onIndexChange={setIndex}
        onClose={() => setIndex(null)}
      />
    </>
  );
}
