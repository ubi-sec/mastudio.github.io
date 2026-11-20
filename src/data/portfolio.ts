import { photos } from "./photos";
import type { GalleryCategory } from "./gallery";

export interface PortfolioProject {
  slug: string;
  title: string;
  category: GalleryCategory;
  location: string;
  summary: string;
  story: string[];
  cover: string;
  images: { src: string; alt: string }[];
  deliverables: string[];
}

// Sample projects — replace with real MA Studio stories as they are published.
export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "golden-hour-vows",
    title: "Golden Hour Vows",
    category: "Wedding",
    location: "Faisalabad",
    summary: "A candle-lit garden wedding told through warm light, quiet glances and grand portraits.",
    story: [
      "The couple wanted their wedding to feel like a film — intimate, warm and unhurried. We planned the day around the light, saving the golden hour for portraits beneath the garden canopy.",
      "As night fell, fairy lights and lanterns became our key light. The result is a gallery that moves from soft daylight elegance to rich, cinematic evening frames.",
    ],
    cover: photos.wedding,
    images: [
      { src: photos.wedding, alt: "Bride and groom beneath garden fairy lights" },
      { src: photos.couple, alt: "Couple silhouetted against a sunset window" },
      { src: photos.groom, alt: "Groom in a cream sherwani in a stone archway" },
    ],
    deliverables: ["Full-day photography", "Couple portrait session", "Cinematic highlight film"],
  },
  {
    slug: "noor-a-mehndi-story",
    title: "Noor — A Mehndi Story",
    category: "Events",
    location: "Punjab",
    summary: "Marigolds, henna and candlelight — a celebration captured in motion and colour.",
    story: [
      "Mehndi nights are pure energy. We moved with the dancers, keeping shutter speeds fast and colours true to the marigold and gold palette of the evening.",
      "Between the dances we found the quiet details — henna patterns, laughter, and the glow of a hundred candles.",
    ],
    cover: photos.mehndi,
    images: [
      { src: photos.mehndi, alt: "Bride dancing at her mehndi surrounded by friends" },
      { src: photos.events, alt: "Guests in a chandelier-lit ballroom" },
    ],
    deliverables: ["Event coverage", "Candid storytelling set", "Social media reels"],
  },
  {
    slug: "black-gold-couture",
    title: "Black Gold Couture",
    category: "Fashion",
    location: "MA Studio",
    summary: "A high-contrast fashion editorial sculpted with a single hard light.",
    story: [
      "Built around one sculptural gown, this editorial uses deep shadow and a single golden rim light to let the silhouette speak.",
      "Every frame was lit and graded to echo the studio's signature black-and-gold language.",
    ],
    cover: photos.fashion,
    images: [
      { src: photos.fashion, alt: "Model in black and gold couture" },
      { src: photos.portrait, alt: "Low-key portrait in an embroidered dupatta" },
    ],
    deliverables: ["Editorial lookbook", "Campaign hero images", "Retouched selects"],
  },
  {
    slug: "amber-sky-campaign",
    title: "Amber Sky Campaign",
    category: "Product",
    location: "MA Studio",
    summary: "Luxury fragrance still life with smoke, reflection and liquid gold light.",
    story: [
      "The brief: make a fragrance feel like a sunset. We layered backlight, haze and a mirrored base to give the bottle depth and glow.",
      "Alongside the hero shot we produced clean e-commerce frames and detail crops for the brand's launch.",
    ],
    cover: photos.product,
    images: [
      { src: photos.product, alt: "Amber perfume bottle in golden smoke" },
      { src: photos.equipment, alt: "Camera equipment flat lay" },
    ],
    deliverables: ["Hero campaign image", "E-commerce set", "Detail crops"],
  },
  {
    slug: "karakoram-light",
    title: "Karakoram Light",
    category: "Nature",
    location: "Northern Pakistan",
    summary: "A landscape series chasing the first and last light across the northern peaks.",
    story: [
      "Shot over several mornings and evenings, this series waits for the moment the sun turns the ridges to gold.",
      "Large-format prints from this series are available on request.",
    ],
    cover: photos.nature,
    images: [{ src: photos.nature, alt: "Snow-capped peaks at golden hour" }],
    deliverables: ["Fine-art landscape series", "Print-ready files"],
  },
  {
    slug: "behind-the-frame",
    title: "Behind the Frame",
    category: "Cinematography",
    location: "MA Studio",
    summary: "A short brand film and stills shot on a moody, practical-lit set.",
    story: [
      "We built a candle-lit set inside the studio and shot both film and stills in one session, keeping the look consistent across formats.",
      "The final cut pairs slow camera movement with natural haze for a warm, cinematic feel.",
    ],
    cover: photos.cinematography,
    images: [
      { src: photos.cinematography, alt: "Cinematographer filming on a smoky set" },
      { src: photos.studio, alt: "MA Studio interior with an octabox" },
    ],
    deliverables: ["Brand film", "Behind-the-scenes stills", "Vertical reels"],
  },
];

export function getProject(slug: string) {
  return portfolioProjects.find((p) => p.slug === slug);
}
