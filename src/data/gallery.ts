import { photos } from "./photos";

export const galleryCategories = [
  "Wedding",
  "Portrait",
  "Events",
  "Fashion",
  "Commercial",
  "Product",
  "Nature",
  "Cinematography",
] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  alt: string;
  category: GalleryCategory;
  /** Drives the masonry tile height */
  shape: "tall" | "wide" | "square";
}

export const galleryItems: GalleryItem[] = [
  { id: "g1", src: photos.wedding, title: "Garden of Lights", alt: "Bride and groom under warm fairy lights at night", category: "Wedding", shape: "tall" },
  { id: "g2", src: photos.events, title: "The Grand Gala", alt: "Guests in a ballroom lit by crystal chandeliers", category: "Events", shape: "wide" },
  { id: "g3", src: photos.portrait, title: "Quiet Strength", alt: "Low-key portrait of a woman in an embroidered black dupatta", category: "Portrait", shape: "tall" },
  { id: "g4", src: photos.commercial, title: "Midnight Drive", alt: "Red sports car on a wet city street at night", category: "Commercial", shape: "wide" },
  { id: "g5", src: photos.fashion, title: "Black Gold Couture", alt: "Model in a sculptural black and gold couture gown", category: "Fashion", shape: "tall" },
  { id: "g6", src: photos.product, title: "Amber Sky", alt: "Amber perfume bottle with a gold cap in golden smoke", category: "Product", shape: "square" },
  { id: "g7", src: photos.nature, title: "Karakoram Gold", alt: "Snow-capped mountain peaks glowing at golden hour", category: "Nature", shape: "wide" },
  { id: "g8", src: photos.couple, title: "Sunset Vows", alt: "Silhouette of a bride and groom against a sunset window", category: "Wedding", shape: "tall" },
  { id: "g9", src: photos.cinematography, title: "On Set", alt: "Cinematographer operating a cinema camera on a smoky set", category: "Cinematography", shape: "wide" },
  { id: "g10", src: photos.mehndi, title: "Mehndi Night", alt: "Women in marigold outfits dancing at a mehndi celebration", category: "Events", shape: "wide" },
  { id: "g11", src: photos.groom, title: "The Groom", alt: "Groom in a cream sherwani standing in a Mughal archway", category: "Portrait", shape: "tall" },
  { id: "g12", src: photos.equipment, title: "Tools of Light", alt: "Camera bodies, lenses and a drone on a black surface", category: "Product", shape: "wide" },
  { id: "g13", src: photos.studio, title: "The Studio", alt: "Dark photography studio with an octabox and a single chair", category: "Cinematography", shape: "tall" },
];

/** Cover image for each category card */
export const categoryCovers: Record<GalleryCategory, string> = {
  Wedding: photos.wedding,
  Portrait: photos.portrait,
  Events: photos.events,
  Fashion: photos.fashion,
  Commercial: photos.commercial,
  Product: photos.product,
  Nature: photos.nature,
  Cinematography: photos.cinematography,
};
