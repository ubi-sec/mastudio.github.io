import { describe, expect, it } from "vitest";
import { bookingSchema, isAllowedEventDate, packageInquirySchema } from "@/lib/inquiry-schema";
import { packages, formatPrice } from "@/data/packages";
import { whatsappLink } from "@/config/site";

const valid = {
  customerName: "Ayesha Khan",
  phone: "0307 6998873",
  email: "ayesha@example.com",
  packageName: "Premium Package",
  eventType: "Wedding",
};

describe("inquiry rules", () => {
  it("accepts a complete package inquiry", () => {
    expect(packageInquirySchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an inquiry without a phone number", () => {
    expect(packageInquirySchema.safeParse({ ...valid, phone: "" }).success).toBe(false);
  });

  it("rejects an event date in the past", () => {
    const now = new Date(2026, 10, 20);
    expect(isAllowedEventDate("2026-11-01", now)).toBe(false);
    expect(isAllowedEventDate("2026-12-05", now)).toBe(true);
  });

  it("requires a service type on booking requests", () => {
    const r = bookingSchema.safeParse({ fullName: "Ali", email: "a@b.co", phone: "03001234567", serviceType: "" });
    expect(r.success).toBe(false);
  });
});

describe("packages", () => {
  it("has Basic, Premium and Luxury with Premium marked most popular", () => {
    expect(packages.map((p) => p.id)).toEqual(["basic", "premium", "luxury"]);
    expect(packages.filter((p) => p.popular).map((p) => p.id)).toEqual(["premium"]);
  });

  it("shows 'Price on request' until a price is configured", () => {
    expect(formatPrice({ ...packages[0], price: null })).toBe("Price on request");
    expect(formatPrice({ ...packages[0], price: "PKR 10,000" })).toBe("PKR 10,000");
  });
});

describe("whatsapp", () => {
  it("opens the studio's WhatsApp number 03076998873", () => {
    expect(whatsappLink()).toBe("https://wa.me/923076998873");
  });
});
