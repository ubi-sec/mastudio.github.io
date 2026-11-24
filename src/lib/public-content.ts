import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { site } from "@/config/site";
import { galleryCategories as defaultCategories, galleryItems as fallbackGallery } from "@/data/gallery";
import { packages as fallbackPackages, type StudioPackage } from "@/data/packages";
import { portfolioProjects as fallbackPortfolio } from "@/data/portfolio";
import { photos } from "@/data/photos";
import { resolveMediaUrls } from "./media";

/* ---------------- Settings & social links ---------------- */

export const socialKeys = ["instagram", "facebook", "youtube", "tiktok", "linkedin"] as const;
export type SocialKey = (typeof socialKeys)[number];
export interface SocialLink {
  url: string;
  enabled: boolean;
}
export type Socials = Record<SocialKey, SocialLink>;

export function parseSocials(raw: unknown): Socials {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out = {} as Socials;
  for (const k of socialKeys) {
    const v = obj[k] as Partial<SocialLink> | string | undefined;
    if (typeof v === "string") out[k] = { url: v, enabled: true };
    else out[k] = { url: typeof v?.url === "string" ? v.url : "", enabled: v?.enabled ?? (k !== "tiktok" && k !== "linkedin") };
  }
  return out;
}

export interface PublicSettings {
  heroHeading: string;
  heroTagline: string;
  heroDescription: string;
  heroImage: string;
  logo: string | null;
  aboutHeading: string;
  aboutIntro: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappNumber: string;
  email: string;
  location: string;
  mapUrl: string;
  footerText: string;
  footerSignature: string;
  socials: Socials;
  galleryCategories: string[];
}

export const fallbackSettings: PublicSettings = {
  heroHeading: site.name,
  heroTagline: site.tagline,
  heroDescription: site.description,
  heroImage: photos.hero,
  logo: null,
  aboutHeading: "More Than Just Photos. We Create Memories.",
  aboutIntro:
    "MA Studio is a creative photography and cinematography studio from Faisalabad, dedicated to capturing life's most beautiful moments with passion, precision and a commitment to quality.",
  phoneDisplay: site.phoneDisplay,
  phoneHref: site.phoneHref,
  whatsappNumber: site.whatsappNumber,
  email: site.email,
  location: site.location,
  mapUrl: site.mapUrl,
  footerText: site.description,
  footerSignature: site.signature,
  socials: parseSocials({
    instagram: { url: site.socials.instagram, enabled: true },
    facebook: { url: site.socials.facebook, enabled: true },
    youtube: { url: site.socials.youtube, enabled: true },
  }),
  galleryCategories: [...defaultCategories],
};

function phoneHref(display: string) {
  const d = display.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) return `tel:${d}`;
  if (d.startsWith("0")) return `tel:+92${d.slice(1)}`;
  return `tel:${d}`;
}

export const settingsQuery = queryOptions({
  queryKey: ["public", "settings"],
  staleTime: 60_000,
  queryFn: async (): Promise<PublicSettings> => {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    if (!data) return fallbackSettings;
    const media = await resolveMediaUrls([data.hero_image_path, data.logo_path]);
    const f = fallbackSettings;
    const location = data.location || f.location;
    return {
      heroHeading: data.hero_heading || f.heroHeading,
      heroTagline: data.hero_tagline || f.heroTagline,
      heroDescription: data.hero_description || f.heroDescription,
      heroImage: (data.hero_image_path && media.get(data.hero_image_path)) || f.heroImage,
      logo: (data.logo_path && media.get(data.logo_path)) || null,
      aboutHeading: data.about_heading || f.aboutHeading,
      aboutIntro: data.about_intro || f.aboutIntro,
      phoneDisplay: data.phone_display || f.phoneDisplay,
      phoneHref: data.phone_display ? phoneHref(data.phone_display) : f.phoneHref,
      whatsappNumber: data.whatsapp_number || f.whatsappNumber,
      email: data.email || f.email,
      location,
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
      footerText: data.footer_text || f.footerText,
      footerSignature: data.footer_signature || f.footerSignature,
      socials: parseSocials(data.socials),
      galleryCategories: data.gallery_categories?.length ? data.gallery_categories : f.galleryCategories,
    };
  },
});

/** Live website settings; shows the built-in defaults until loaded. */
export function useSiteSettings(): PublicSettings {
  const { data } = useQuery(settingsQuery);
  return data ?? fallbackSettings;
}

export function waLink(number: string, message?: string) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/* ---------------- Packages ---------------- */

export const packagesQuery = queryOptions({
  queryKey: ["public", "packages"],
  staleTime: 60_000,
  queryFn: async (): Promise<StudioPackage[]> => {
    const { data, error } = await supabase
      .from("packages")
      .select("id, slug, name, tier, description, price, price_note, features, popular")
      .eq("active", true)
      .order("sort_order")
      .order("created_at");
    if (error) throw error;
    return data.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      tier: p.tier,
      description: p.description,
      price: p.price == null ? null : Number(p.price),
      priceNote: p.price_note,
      features: p.features,
      popular: p.popular,
    }));
  },
});

export function usePackages() {
  const q = useQuery(packagesQuery);
  return { packages: q.data ?? (q.isError ? fallbackPackages : []), isLoading: q.isPending };
}

/* ---------------- Gallery ---------------- */

export interface PublicPhoto {
  id: string;
  src: string;
  title: string;
  alt: string;
  category: string;
  shape: "tall" | "wide" | "square";
  featured: boolean;
}

export const galleryQuery = queryOptions({
  queryKey: ["public", "gallery"],
  staleTime: 60_000,
  queryFn: async (): Promise<PublicPhoto[]> => {
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("id, title, description, category, image_path, shape, featured")
      .eq("published", true)
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const media = await resolveMediaUrls(data.map((d) => d.image_path));
    return data
      .filter((d) => media.has(d.image_path))
      .map((d) => ({
        id: d.id,
        src: media.get(d.image_path)!,
        title: d.title,
        alt: d.description || d.title,
        category: d.category,
        shape: (["tall", "wide", "square"].includes(d.shape) ? d.shape : "tall") as PublicPhoto["shape"],
        featured: d.featured,
      }));
  },
});

export function useGallery() {
  const q = useQuery(galleryQuery);
  const fallback: PublicPhoto[] = fallbackGallery.map((g) => ({ ...g, featured: true }));
  return { photos: q.data ?? (q.isError ? fallback : []), isLoading: q.isPending };
}

/* ---------------- Portfolio ---------------- */

export interface PublicProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  summary: string;
  story: string[];
  deliverables: string[];
  cover: string;
  projectDate: string | null;
  images: { src: string; alt: string }[];
}

const fallbackProjects: PublicProject[] = fallbackPortfolio.map((p) => ({
  id: p.slug,
  slug: p.slug,
  title: p.title,
  category: p.category,
  location: p.location,
  summary: p.summary,
  story: p.story,
  deliverables: p.deliverables,
  cover: p.cover,
  projectDate: null,
  images: p.images,
}));

export const portfolioQuery = queryOptions({
  queryKey: ["public", "portfolio"],
  staleTime: 60_000,
  queryFn: async (): Promise<PublicProject[]> => {
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("id, slug, title, category, location, summary, story, deliverables, cover_path, project_date, portfolio_images(image_path, alt, sort_order)")
      .eq("published", true)
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const media = await resolveMediaUrls(
      data.flatMap((p) => [p.cover_path, ...(p.portfolio_images ?? []).map((i) => i.image_path)]),
    );
    return data.map((p) => {
      const images = [...(p.portfolio_images ?? [])]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((i) => ({ src: media.get(i.image_path) ?? "", alt: i.alt || p.title }))
        .filter((i) => i.src);
      const cover = (p.cover_path && media.get(p.cover_path)) || images[0]?.src || photos.studio;
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        category: p.category,
        location: p.location,
        summary: p.summary,
        story: p.story.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
        deliverables: p.deliverables,
        cover,
        projectDate: p.project_date,
        images: images.length ? images : [{ src: cover, alt: p.title }],
      };
    });
  },
});

export function usePortfolio() {
  const q = useQuery(portfolioQuery);
  return { projects: q.data ?? (q.isError ? fallbackProjects : []), isLoading: q.isPending };
}

export function fallbackProject(slug: string) {
  return fallbackProjects.find((p) => p.slug === slug);
}
