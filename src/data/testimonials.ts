/**
 * SAMPLE testimonials — clearly labelled on the site.
 * Replace with real client reviews (and set `photo` only with the client's permission).
 */
export interface Testimonial {
  id: string;
  name: string;
  context: string;
  rating: number;
  quote: string;
  photo?: string;
  isSample: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sample Client",
    context: "Wedding · Sample review",
    rating: 5,
    quote:
      "MA Studio turned our special day into unforgettable memories. Every frame feels like a scene from a film.",
    isSample: true,
  },
  {
    id: "t2",
    name: "Sample Client",
    context: "Brand campaign · Sample review",
    rating: 5,
    quote:
      "Professional from brief to delivery. Our product imagery finally looks as premium as the product itself.",
    isSample: true,
  },
  {
    id: "t3",
    name: "Sample Client",
    context: "Portrait session · Sample review",
    rating: 5,
    quote:
      "I was nervous in front of the camera, but the direction was so calm and clear. The portraits are stunning.",
    isSample: true,
  },
  {
    id: "t4",
    name: "Sample Client",
    context: "Mehndi event · Sample review",
    rating: 5,
    quote:
      "They captured the energy of the night perfectly — and the highlight reel had our whole family in tears.",
    isSample: true,
  },
];
