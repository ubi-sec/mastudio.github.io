import { Facebook, Instagram, Linkedin, Music2, Youtube } from "lucide-react";
import { useSiteSettings, type SocialKey } from "@/lib/public-content";
import { cn } from "@/lib/utils";

const items: { key: SocialKey; label: string; Icon: typeof Instagram }[] = [
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "facebook", label: "Facebook", Icon: Facebook },
  { key: "youtube", label: "YouTube", Icon: Youtube },
  { key: "tiktok", label: "TikTok", Icon: Music2 },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
];

export function SocialLinks({ className, withLabels = false }: { className?: string; withLabels?: boolean }) {
  const settings = useSiteSettings();
  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {items.map(({ key, label, Icon }) => {
        const social = settings.socials[key];
        if (!social.enabled) return null;
        const href = social.url.trim();
        const body = (
          <>
            <span className="grid h-10 w-10 place-items-center rounded-full border border-border transition-all duration-500 group-hover:border-gold group-hover:text-gold-ink">
              <Icon className="h-4 w-4" />
            </span>
            {withLabels && (
              <span className="text-sm">
                {label}
                {!href && <span className="ml-2 text-xs text-muted-foreground">· coming soon</span>}
              </span>
            )}
          </>
        );
        return (
          <li key={key}>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="group flex items-center gap-3 text-foreground/80">
                {body}
              </a>
            ) : (
              <span title={`${label} — coming soon`} className="group flex items-center gap-3 text-foreground/50">
                {body}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
