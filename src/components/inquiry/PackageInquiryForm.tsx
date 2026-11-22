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
import { packageOptions } from "@/data/packages";
import { eventTypes } from "@/data/services";
import { submitPackageInquiry } from "@/lib/inquiries.functions";
import { packageInquirySchema, packageInquiryWhatsAppText, type PackageInquiryInput } from "@/lib/inquiry-schema";

export function PackageInquiryForm({
  defaultPackage,
  defaultEventType,
  onDone,
}: {
  defaultPackage?: string | undefined;
  defaultEventType?: string | undefined;
  onDone?: (() => void) | undefined;
}) {
  const submit = useServerFn(submitPackageInquiry);
  const [done, setDone] = useState<null | "form" | "whatsapp">(null);
  const form = useForm<PackageInquiryInput>({
    resolver: zodResolver(packageInquirySchema),
    defaultValues: {
      customerName: "",
      phone: "",
      email: "",
      packageName: defaultPackage ?? "",
      eventType: defaultEventType ?? "",
      eventDate: "",
      eventLocation: "",
      requirements: "",
      website: "",
    },
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await submit({ data: values });
      setDone("form");
      toast.success("Inquiry received", { description: "MA Studio will contact you shortly." });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  });

  const onWhatsApp = () => {
    const values = form.getValues();
    const parsed = packageInquirySchema.safeParse(values);
    if (!parsed.success) {
      void form.trigger();
      toast.error("Please complete the highlighted fields first.");
      return;
    }
    window.open(whatsappLink(packageInquiryWhatsAppText(parsed.data)), "_blank", "noopener,noreferrer");
    // Keep a copy of the inquiry even when it continues on WhatsApp.
    submit({ data: parsed.data }).catch(() => undefined);
    setDone("whatsapp");
  };

  if (done) {
    return (
      <SuccessPanel
        title={done === "form" ? "Thank you — inquiry received" : "WhatsApp is opening"}
        message={
          done === "form"
            ? "Your package inquiry is with the MA Studio team. We'll reach out on your phone or email shortly."
            : "Send the pre-filled message in WhatsApp and we'll reply there. We've also kept a copy of your inquiry."
        }
        onReset={onDone}
        resetLabel="Close"
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6 sm:grid-cols-2">
      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register("website")} />
      <Field label="Customer name" htmlFor="pi-name" required error={errors.customerName?.message}>
        <input id="pi-name" className={inputClass} autoComplete="name" placeholder="Your full name" {...register("customerName")} />
      </Field>
      <Field label="Phone / WhatsApp" htmlFor="pi-phone" required error={errors.phone?.message}>
        <input id="pi-phone" type="tel" className={inputClass} autoComplete="tel" placeholder="03XX XXXXXXX" {...register("phone")} />
      </Field>
      <Field label="Email" htmlFor="pi-email" required error={errors.email?.message}>
        <input id="pi-email" type="email" className={inputClass} autoComplete="email" placeholder="you@email.com" {...register("email")} />
      </Field>
      <Field label="Selected package" htmlFor="pi-package" required error={errors.packageName?.message}>
        <Controller
          control={control}
          name="packageName"
          render={({ field }) => (
            <SelectField id="pi-package" value={field.value} onChange={field.onChange} options={packageOptions} placeholder="Choose a package" invalid={!!errors.packageName} />
          )}
        />
      </Field>
      <Field label="Event type" htmlFor="pi-event" required error={errors.eventType?.message}>
        <Controller
          control={control}
          name="eventType"
          render={({ field }) => (
            <SelectField id="pi-event" value={field.value} onChange={field.onChange} options={eventTypes} placeholder="Choose an event type" invalid={!!errors.eventType} />
          )}
        />
      </Field>
      <Field label="Event date" htmlFor="pi-date" error={errors.eventDate?.message}>
        <Controller
          control={control}
          name="eventDate"
          render={({ field }) => <DateField id="pi-date" value={field.value} onChange={field.onChange} invalid={!!errors.eventDate} />}
        />
      </Field>
      <Field label="Event location" htmlFor="pi-location" error={errors.eventLocation?.message} className="sm:col-span-2">
        <input id="pi-location" className={inputClass} placeholder="Venue or city" {...register("eventLocation")} />
      </Field>
      <Field label="Additional requirements" htmlFor="pi-req" error={errors.requirements?.message} className="sm:col-span-2">
        <textarea
          id="pi-req"
          rows={3}
          className={inputClass + " h-auto resize-none py-3"}
          placeholder="Guest count, timings, special shots, video needs…"
          {...register("requirements")}
        />
      </Field>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <Button type="submit" variant="gold" size="xl" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
          {isSubmitting ? "Sending…" : "Submit Inquiry"}
        </Button>
        <Button type="button" variant="goldOutline" size="xl" onClick={onWhatsApp} className="flex-1">
          <WhatsAppIcon className="h-4 w-4" /> WhatsApp Inquiry
        </Button>
      </div>
    </form>
  );
}
