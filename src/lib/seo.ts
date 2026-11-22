const SITE_URL = "https://noir-and-gold-gallery.lovable.app";

/** Per-page head tags: title, description, Open Graph, Twitter and canonical. */
export function pageHead({ title, description, path, type = "website" }: { title: string; description: string; path: string; type?: string }) {
  const url = `${SITE_URL}${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
