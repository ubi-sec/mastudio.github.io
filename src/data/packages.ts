/**
 * Fallback package list, used only if the live packages can't be loaded.
 * The real packages (names, prices, features) are edited in Admin → Packages.
 */
export interface StudioPackage {
  id: string;
  slug: string;
  name: string;
  tier: string;
  description: string;
  /** PKR amount; null shows "Price on request" */
  price: number | null;
  priceNote: string;
  features: string[];
  popular: boolean;
}

export const packages: StudioPackage[] = [
  {
    id: "basic",
    slug: "basic",
    name: "Basic Package",
    tier: "Essential",
    description: "A focused package for intimate moments.",
    price: 20000,
    priceNote: "",
    features: ["1 Cameraman", "3 Days Coverage", "Digital Soft Copy Pictures"],
    popular: false,
  },
  {
    id: "premium",
    slug: "premium",
    name: "Premium Package",
    tier: "Signature",
    description: "Photography and film together, with an edited video.",
    price: 50000,
    priceNote: "",
    features: ["1 Photographer", "1 Videographer", "Edited Video", "Digital Soft Copy Pictures"],
    popular: true,
  },
  {
    id: "luxury",
    slug: "luxury",
    name: "Luxury Package",
    tier: "Couture",
    description: "Multi-day coverage in stills and cinema, finished with a printed album.",
    price: 80000,
    priceNote: "",
    features: ["3 Days Coverage", "1 Cameraman", "1 Videographer", "1 Printed Photo Album"],
    popular: false,
  },
];

export const CUSTOM_PACKAGE = "Custom / Not sure yet";

export function formatPrice(pkg: { price: number | null }) {
  if (pkg.price == null) return "Price on request";
  return `PKR ${String(Math.round(pkg.price)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/** Comparison rows: every feature offered by any package, ticked per package. */
export function buildComparison(list: Pick<StudioPackage, "id" | "features">[]) {
  const seen = new Map<string, string>();
  for (const p of list) for (const f of p.features) if (!seen.has(f.toLowerCase())) seen.set(f.toLowerCase(), f);
  return [...seen.entries()].map(([key, label]) => ({
    label,
    values: Object.fromEntries(list.map((p) => [p.id, p.features.some((f) => f.toLowerCase() === key)])) as Record<string, boolean>,
  }));
}
