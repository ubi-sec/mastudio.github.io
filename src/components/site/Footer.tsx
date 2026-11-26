import { Link } from "@tanstack/react-router";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { SocialLinks } from "./SocialLinks";
import { navItems } from "@/config/site";
import { useSiteSettings } from "@/lib/public-content";

export function Footer() {
  const settings = useSiteSettings();
  return (
    <footer className="relative border-t border-border bg-surface">
      <div className="absolute inset-x-0 top-0 h-px overflow-hidden">
        <div className="animate-line-sweep h-px w-1/2 bg-gold-gradient" />
      </div>
      <div className="container-lux grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">{settings.footerText}</p>
          <p className="mt-6 font-script text-3xl text-gold-ink">Photography Beyond Ordinary</p>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-5 grid grid-cols-2 gap-3 text-sm">
            {navItems.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-foreground/75 transition-colors hover:text-gold-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Studio</p>
          <ul className="mt-5 space-y-3 text-sm text-foreground/80">
            <li>
              <a href={settings.phoneHref} className="flex items-center gap-3 hover:text-gold-ink">
                <Phone className="h-4 w-4 text-gold-ink" /> {settings.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 break-all hover:text-gold-ink">
                <Mail className="h-4 w-4 shrink-0 text-gold-ink" /> {settings.email}
              </a>
            </li>
            <li>
              <a href={settings.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-gold-ink">
                <MapPin className="h-4 w-4 text-gold-ink" /> {settings.location}
              </a>
            </li>
          </ul>
          <SocialLinks className="mt-6" />
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-lux flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} MA Studio. All rights reserved.</p>
          <p className="flex items-center gap-2">
            {settings.footerSignature} <Heart className="h-3 w-3 text-gold-ink" />
          </p>
          <Link to="/auth" className="transition-colors hover:text-gold-ink">
            Studio admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
