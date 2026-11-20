/**
 * Central package configuration.
 * Set `price` to a display string (e.g. "PKR 45,000") when final pricing is decided.
 * While `price` is null the card shows "Price on request".
 */
export type PackageId = "basic" | "premium" | "luxury";

export interface StudioPackage {
  id: PackageId;
  name: string;
  tier: string;
  tagline: string;
  price: string | null;
  priceNote: string;
  features: string[];
  popular?: boolean;
}

export const packages: StudioPackage[] = [
  {
    id: "basic",
    name: "Basic Package",
    tier: "Essential",
    tagline: "A focused session for intimate moments.",
    price: null,
    priceNote: "Tailored to your date & location",
    features: [
      "Basic photography session",
      "Defined shooting duration",
      "Edited photographs",
      "Digital delivery",
    ],
  },
  {
    id: "premium",
    name: "Premium Package",
    tier: "Signature",
    tagline: "Extended coverage with a polished, editorial finish.",
    price: null,
    priceNote: "Tailored to your date & location",
    popular: true,
    features: [
      "Extended photography session",
      "More edited photographs",
      "Professional editing",
      "Highlight video option",
      "Priority booking",
    ],
  },
  {
    id: "luxury",
    name: "Luxury Package",
    tier: "Couture",
    tagline: "Full-day storytelling in stills and cinema.",
    price: null,
    priceNote: "Tailored to your date & location",
    features: [
      "Full-day coverage",
      "Premium photo editing",
      "Cinematic video",
      "Exclusive deliverables",
      "Priority support",
    ],
  },
];

/** Side-by-side comparison rows. `true` = included, `false` = not included, string = detail. */
export const packageComparison: { label: string; values: Record<PackageId, string | boolean> }[] = [
  { label: "Coverage", values: { basic: "Defined session", premium: "Extended session", luxury: "Full day" } },
  { label: "Edited photographs", values: { basic: "Selected set", premium: "Larger set", luxury: "Complete premium set" } },
  { label: "Editing", values: { basic: "Standard", premium: "Professional", luxury: "Premium retouching" } },
  { label: "Video", values: { basic: false, premium: "Highlight option", luxury: "Cinematic film" } },
  { label: "Digital delivery", values: { basic: true, premium: true, luxury: true } },
  { label: "Priority booking", values: { basic: false, premium: true, luxury: true } },
  { label: "Exclusive deliverables", values: { basic: false, premium: false, luxury: true } },
  { label: "Priority support", values: { basic: false, premium: false, luxury: true } },
];

export const CUSTOM_PACKAGE = "Custom / Not sure yet";
export const packageOptions = [...packages.map((p) => p.name), CUSTOM_PACKAGE];

export function formatPrice(pkg: StudioPackage) {
  return pkg.price ?? "Price on request";
}
