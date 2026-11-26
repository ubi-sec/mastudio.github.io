import { describe, expect, it } from "vitest";
import { answerLead, type BookingDraft } from "@/lib/assistant-rules";

const packages = [
  { name: "Basic Package", price: 20000, features: ["1 Cameraman", "3 Days Coverage"] },
  { name: "Premium Package", price: 50000, features: ["1 Photographer", "1 Videographer"] },
  { name: "Luxury Package", price: 80000, features: ["1 Printed Photo Album"] },
];

describe("WhatsApp lead assistant", () => {
  it("quotes the owner's Premium price as PKR 50,000", () => {
    const result = answerLead("How much is Premium?", packages, null, "2026-11-26");
    expect(result.reply).toContain("PKR 50,000");
    expect(result.handoff).toBe(false);
  });

  it("starts a booking request without confirming it", () => {
    const result = answerLead("I want to book", packages, null, "2026-11-26");
    expect(result.draft?.step).toBe("name");
    expect(result.booking).toBeNull();
    expect(result.reply).toContain("full name");
  });

  it("rejects a past event date", () => {
    const draft: BookingDraft = { step: "date", name: "Ayesha" };
    const result = answerLead("2026-11-01", packages, draft, "2026-11-26");
    expect(result.draft).toEqual(draft);
    expect(result.reply).toContain("future date");
  });

  it("saves the completed date and package as a request for owner confirmation", () => {
    const draft: BookingDraft = { step: "package", name: "Ayesha", date: "2026-12-15", time: "2:00 PM", eventType: "Wedding", location: "Faisalabad" };
    const result = answerLead("2", packages, draft, "2026-11-26");
    expect(result.booking).toEqual({ fullName: "Ayesha", eventDate: "2026-12-15", eventTime: "2:00 PM", eventType: "Wedding", location: "Faisalabad", packageName: "Premium Package" });
    expect(result.reply).toContain("not a confirmation");
  });

  it("hands an unknown request to the owner", () => {
    const result = answerLead("Can you design a drone light show?", packages, null, "2026-11-26");
    expect(result.handoff).toBe(true);
    expect(result.reply).toContain("handed this conversation");
  });

  it("hands off immediately when the lead asks for a person", () => {
    const result = answerLead("Can I talk to someone?", packages, null, "2026-11-26");
    expect(result.handoff).toBe(true);
  });

  it("never invents a missing package price", () => {
    const result = answerLead("Custom price", [{ name: "Custom Package", price: null, features: [] }], null, "2026-11-26");
    expect(result.reply).toContain("Price on request");
  });
});
