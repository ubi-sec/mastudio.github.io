import { photos } from "./photos";

export interface Service {
  id: string;
  title: string;
  eventType: string;
  image: string;
  short: string;
  description: string;
  includes: string[];
}

export const services: Service[] = [
  {
    id: "wedding",
    title: "Wedding Photography",
    eventType: "Wedding",
    image: photos.wedding,
    short: "Barat, walima, mehndi and nikkah — every ritual told with cinematic grace.",
    description:
      "From the first glance to the final rukhsati, we document your wedding as a timeless film in stills — candid emotion, elegant portraits and the grandeur of every venue.",
    includes: ["Pre-event planning call", "Candid & posed coverage", "Couple portrait session", "Curated, colour-graded gallery"],
  },
  {
    id: "portrait",
    title: "Portrait Photography",
    eventType: "Portrait",
    image: photos.portrait,
    short: "Editorial portraits sculpted with light — personal, family or professional.",
    description:
      "Studio or on-location portraits directed with intention. We guide every pose and shape the light to reveal character, confidence and calm.",
    includes: ["Styling & posing direction", "Studio or location", "Low-key or natural light looks", "Retouched hero images"],
  },
  {
    id: "events",
    title: "Event Photography",
    eventType: "Event",
    image: photos.events,
    short: "Galas, launches, birthdays and celebrations captured as they unfold.",
    description:
      "Discreet, fast and fully prepared — we capture the atmosphere, the people and the details that make your event worth remembering.",
    includes: ["Venue & schedule walkthrough", "Guest and detail coverage", "Fast preview selection", "High-resolution delivery"],
  },
  {
    id: "commercial",
    title: "Commercial Photography",
    eventType: "Commercial",
    image: photos.commercial,
    short: "Campaign-grade imagery for brands, automotive and corporate stories.",
    description:
      "Concept-driven commercial shoots built around your brand. We handle art direction, lighting and post-production for imagery that sells.",
    includes: ["Creative brief & moodboard", "Art-directed shoot", "Brand-consistent grading", "Web & print-ready files"],
  },
  {
    id: "product",
    title: "Product Photography",
    eventType: "Product",
    image: photos.product,
    short: "Luxury still life and e-commerce imagery with flawless detail.",
    description:
      "From perfume to jewellery to everyday products, we light every surface with precision so your product looks as premium as it feels.",
    includes: ["Hero & lifestyle shots", "Clean e-commerce sets", "Reflections & texture control", "Detailed retouching"],
  },
  {
    id: "cinematography",
    title: "Cinematic Videography",
    eventType: "Cinematography",
    image: photos.cinematography,
    short: "Wedding films, brand films and reels with a true cinematic look.",
    description:
      "Story-led films shot on cinema-grade equipment, with licensed music, careful sound and a signature warm colour grade.",
    includes: ["Story & shot planning", "Cinema camera & gimbal", "Drone footage where permitted", "Highlight film & reels"],
  },
];

export const eventTypes = [
  "Wedding",
  "Mehndi / Mayun",
  "Engagement",
  "Portrait",
  "Event",
  "Fashion",
  "Commercial",
  "Product",
  "Cinematography",
  "Other",
];
