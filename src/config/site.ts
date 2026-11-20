/**
 * Central business details for MA Studio.
 * Update values here and every page, button and form picks them up.
 */
export const site = {
  name: "MA Studio",
  subtitle: "Photography",
  tagline: "Capturing Moments. Creating Timeless Stories.",
  description: "Professional Photography & Cinematography for Your Most Precious Moments.",
  signature: "Capture Today, Cherish Forever",

  phoneDisplay: "0307 6998873",
  phoneHref: "tel:+923076998873",
  /** International format, digits only — used for wa.me links */
  whatsappNumber: "923076998873",
  email: "mujahidameen8@gmail.com",
  location: "Faisalabad, Pakistan",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Faisalabad%2C%20Pakistan",

  /** Add full profile URLs when ready; empty entries show as "coming soon". */
  socials: {
    instagram: "",
    facebook: "",
    youtube: "",
  },

  /** YouTube/Vimeo embed URL for the showreel. Empty = cinematic photo reel preview. */
  showreelEmbedUrl: "",
} as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const navItems = [
  { to: "/", label: "Home" },
  { to: "/gallery", label: "Gallery" },
  { to: "/services", label: "Services" },
  { to: "/packages", label: "Packages" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;
