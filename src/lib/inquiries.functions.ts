import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { bookingSchema, packageInquirySchema } from "./inquiry-schema";

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Inquiry storage is not configured");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      // Opaque sb_ keys are not JWTs: send only apikey, not the default bearer.
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const FAILED = "We couldn't save your request right now. Please try again or message us on WhatsApp.";

export const submitPackageInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => packageInquirySchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const }; // bot
    const { error } = await publicClient()
      .from("package_inquiries")
      .insert({
        customer_name: data.customerName,
        phone: data.phone,
        email: data.email,
        package_name: data.packageName,
        event_type: data.eventType,
        event_date: data.eventDate || null,
        event_location: data.eventLocation || null,
        requirements: data.requirements || null,
      });
    if (error) {
      console.error("package_inquiries insert failed", error.message);
      throw new Error(FAILED);
    }
    return { ok: true as const };
  });

export const submitBookingRequest = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const };
    const { error } = await publicClient()
      .from("booking_requests")
      .insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        service_type: data.serviceType,
        event_date: data.eventDate || null,
        location: data.location || null,
        message: data.message || null,
      });
    if (error) {
      console.error("booking_requests insert failed", error.message);
      throw new Error(FAILED);
    }
    return { ok: true as const };
  });
