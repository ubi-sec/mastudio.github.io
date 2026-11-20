import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { DateField, Field, SelectField, inputClass } from "./fields";
import { SuccessPanel } from "./SuccessPanel";
import { WhatsAppIcon } from "@/components/site/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/config/site";
import { services } from "@/data/services";
import { submitBookingRequest } from "@/lib/inquiries.functions";
import { bookingSchema, bookingWhatsAppText, type BookingInput } from "@/lib/inquiry-schema";

const serviceOptions = [...services.map((s) => s.title), "Other"];

const empty: BookingInput = {
  fullName: "",
  email: "",
  phone: "",
  serviceType: "",
  eventDate: "",
  location: "",
  message: "",
  website: "",
};

export function BookingForm() {
  const submit = useServerFn(submitBookingRequest);
  const [done, setDone] = useState<null | "form" | "whatsapp">(null);
  const form = useForm<BookingInput>({ resolver: zodResolver(bookingSchema), defaultValues: empty });
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await submit({ data: values });
      setDone("form");
      toast.success("Booking request received", { description: "We'll confirm availability shortly." });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  });

  const onWhatsApp = () => {
    const parsed = bookingSchema.safeParse(form.getValues());
    if (!parsed.success) {
      void form.trigger();
      toast.error("Please complete the highlighted fields first.");
      return;
    }
    window.open(whatsappLink(bookingWhatsAppText(parsed.data)), "_blank", "noopener,noreferrer");
    submit({ data: parsed.data }).catch(() => undefined);
    setDone("whatsapp");
  };

  if (done) {
    return (
      <SuccessPanel
        title={done === "form" ? "Your booking request is in" : "WhatsApp is opening"}
        message={
          done === "form"
            ? "Thank you! The MA Studio team will check availability and contact you to confirm your shoot."
            : "Send the pre-filled message and we'll reply on WhatsApp. A copy of your request is saved with us too."
        }
        onReset={() => {
          reset(empty);
          setDone(null);
        }}
        resetLabel="Book another shoot"
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-7 sm:grid-cols-2">
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register("website")} />
      <Field label="Full name" htmlFor="bk-name" required error={errors.fullName?.message}>
        <input id="bk-name" className={inputClass} autoComplete="name" placeholder="Your full name" {...register("fullName")} />
      </Field>
      <Field label="Email" htmlFor="bk-email" required error={errors.email?.message}>
        <input id="bk-email" type="email" className={inputClass} autoComplete="email" placeholder="you@email.com" {...register("email")} />
      </Field>
      <Field label="Phone" htmlFor="bk-phone" required error={errors.phone?.message}>
        <input id="bk-phone" type="tel" className={inputClass} autoComplete="tel" placeholder="03XX XXXXXXX" {...register("phone")} />
      </Field>
      <Field label="Service type" htmlFor="bk-service" required error={errors.serviceType?.message}>
        <Controller
          control={control}
          name="serviceType"
          render={({ field }) => (
            <SelectField id="bk-service" value={field.value} onChange={field.onChange} options={serviceOptions} placeholder="Choose a service" invalid={!!errors.serviceType} />
          )}
        />
      </Field>
      <Field label="Event date" htmlFor="bk-date" error={errors.eventDate?.message}>
        <Controller
          control={control}
          name="eventDate"
          render={({ field }) => <DateField id="bk-date" value={field.value} onChange={field.onChange} invalid={!!errors.eventDate} />}
        />
      </Field>
      <Field label="Location" htmlFor="bk-location" error={errors.location?.message}>
        <input id="bk-location" className={inputClass} placeholder="Venue or city" {...register("location")} />
      </Field>
      <Field label="Message" htmlFor="bk-message" error={errors.message?.message} className="sm:col-span-2">
        <textarea id="bk-message" rows={4} className={inputClass + " h-auto resize-none py-3"} placeholder="Tell us about your story…" {...register("message")} />
      </Field>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <Button type="submit" variant="gold" size="xl" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
          {isSubmitting ? "Sending…" : "Send Booking Request"}
        </Button>
        <Button type="button" variant="goldOutline" size="xl" onClick={onWhatsApp} className="flex-1">
          <WhatsAppIcon className="h-4 w-4" /> Book via WhatsApp
        </Button>
      </div>
    </form>
  );
}
