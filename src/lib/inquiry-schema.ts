import { z } from "zod";

/** YYYY-MM-DD for a Date in local time */
export function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** An event date is valid when empty, or today or later (one day of slack for time zones). */
export function isAllowedEventDate(value: string | undefined, now: Date = new Date()) {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const earliest = toISODate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
  return value >= earliest;
}

const name = z
  .string()
  .trim()
  .min(2, "Please enter your full name")
  .max(100, "Name must be under 100 characters");

const email = z.string().trim().email("Enter a valid email address").max(255);

const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone / WhatsApp number")
  .max(20, "Phone number is too long")
  .regex(/^[+\d\s()-]+$/, "Use digits, spaces, + or - only");

const eventDate = z
  .string()
  .trim()
  .optional()
  .refine((v) => isAllowedEventDate(v), "Please choose today or a future date");

const optionalText = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters`).optional();

/** Hidden anti-spam field — real visitors leave it empty */
const honeypot = z.string().max(0).optional();

export const packageInquirySchema = z.object({
  customerName: name,
  phone,
  email,
  packageName: z.string().trim().min(1, "Choose a package").max(60),
  eventType: z.string().trim().min(1, "Choose an event type").max(80),
  eventDate,
  eventLocation: optionalText(200),
  requirements: optionalText(2000),
  website: honeypot,
});
export type PackageInquiryInput = z.infer<typeof packageInquirySchema>;

export const bookingSchema = z.object({
  fullName: name,
  email,
  phone,
  serviceType: z.string().trim().min(1, "Choose a service").max(80),
  eventDate,
  location: optionalText(200),
  message: optionalText(2000),
  website: honeypot,
});
export type BookingInput = z.infer<typeof bookingSchema>;

export function packageInquiryWhatsAppText(d: Partial<PackageInquiryInput>) {
  return [
    "Hello MA Studio! I'd like to inquire about a package.",
    `• Package: ${d.packageName || "-"}`,
    `• Name: ${d.customerName || "-"}`,
    `• Phone: ${d.phone || "-"}`,
    `• Email: ${d.email || "-"}`,
    `• Event: ${d.eventType || "-"}`,
    `• Date: ${d.eventDate || "-"}`,
    `• Location: ${d.eventLocation || "-"}`,
    d.requirements ? `• Notes: ${d.requirements}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function bookingWhatsAppText(d: Partial<BookingInput>) {
  return [
    "Hello MA Studio! I'd like to book a shoot.",
    `• Service: ${d.serviceType || "-"}`,
    `• Name: ${d.fullName || "-"}`,
    `• Phone: ${d.phone || "-"}`,
    `• Email: ${d.email || "-"}`,
    `• Date: ${d.eventDate || "-"}`,
    `• Location: ${d.location || "-"}`,
    d.message ? `• Message: ${d.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
