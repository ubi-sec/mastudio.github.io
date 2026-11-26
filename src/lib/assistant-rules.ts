import { formatPKR } from "@/lib/format";

export interface AssistantPackage {
  name: string;
  price: number | null;
  features: string[];
}

export type BookingStep = "name" | "date" | "time" | "eventType" | "location" | "package";

export interface BookingDraft {
  step: BookingStep;
  name?: string;
  date?: string;
  time?: string;
  eventType?: string;
  location?: string;
}

export interface AssistantBooking {
  fullName: string;
  eventDate: string;
  eventTime: string;
  eventType: string;
  location: string;
  packageName: string;
}

export interface AssistantResult {
  reply: string;
  draft: BookingDraft | null;
  handoff: boolean;
  booking: AssistantBooking | null;
}

const HANDOFF = /\b(human|person|owner|agent|mujahid|call me|talk to someone)\b/i;
const BOOKING = /\b(book|booking|reserve|schedule|availability|available)\b/i;
const PRICING = /\b(price|prices|pricing|package|packages|quote|cost|rate|rates|charges)\b/i;
const GREETING = /^(hi|hello|hey|salam|salaam|assalam|good morning|good evening)\b/i;

function packageLine(p: AssistantPackage) {
  return `${p.name}: ${p.price == null ? "Price on request" : formatPKR(p.price)}`;
}

function packageList(packages: AssistantPackage[]) {
  return packages.length
    ? packages.map(packageLine).join("\n")
    : "Our current package list is being updated. I've flagged this chat for the studio to help you.";
}

function choosePackage(text: string, packages: AssistantPackage[]) {
  const clean = text.trim().toLowerCase().replace(/package/g, "").trim();
  const number = Number(clean);
  if (Number.isInteger(number) && number > 0 && number <= packages.length) return packages[number - 1];
  return packages.find((p) => clean.includes(p.name.toLowerCase().replace(/\s+package$/, "")) || p.name.toLowerCase().replace(/\s+package$/, "").includes(clean));
}

function handoffResult(draft: BookingDraft | null): AssistantResult {
  return {
    reply: "I’ve handed this conversation to MA Studio. The team will reply here as soon as they can. Your messages are saved in the studio inbox.",
    draft,
    handoff: true,
    booking: null,
  };
}

/**
 * Deterministic lead assistant: quotes only current studio packages, collects booking requests,
 * and hands off anything it does not understand. It never confirms a booking itself.
 */
export function answerLead(textInput: string, packages: AssistantPackage[], draft: BookingDraft | null, today: string): AssistantResult {
  const text = textInput.trim();
  if (!text) return handoffResult(draft);
  if (HANDOFF.test(text)) return handoffResult(draft);
  if (draft && /\b(cancel|stop|start over)\b/i.test(text)) {
    return { reply: "No problem — I’ve cleared that booking request. You can ask for prices or type ‘book’ whenever you’re ready.", draft: null, handoff: false, booking: null };
  }

  if (draft) {
    if (draft.step === "name") {
      if (text.length < 2) return { reply: "Please send your full name so the studio knows who to contact.", draft, handoff: false, booking: null };
      return { reply: `Thanks, ${text}. What is the event date? Please use YYYY-MM-DD, for example 2026-12-15.`, draft: { ...draft, step: "date", name: text }, handoff: false, booking: null };
    }
    if (draft.step === "date") {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(text) || Number.isNaN(Date.parse(`${text}T00:00:00Z`)) || text < today) {
        return { reply: `Please send a future date in YYYY-MM-DD format. Today is ${today}.`, draft, handoff: false, booking: null };
      }
      return { reply: "What time should the studio expect to start? For example, 2:00 PM.", draft: { ...draft, step: "time", date: text }, handoff: false, booking: null };
    }
    if (draft.step === "time") {
      if (text.length < 2 || text.length > 40) return { reply: "Please send a start time, for example 2:00 PM.", draft, handoff: false, booking: null };
      return { reply: "What type of event is it — wedding, portrait, birthday, corporate, or something else?", draft: { ...draft, step: "eventType", time: text }, handoff: false, booking: null };
    }
    if (draft.step === "eventType") {
      if (text.length < 2) return { reply: "Please tell me the event type.", draft, handoff: false, booking: null };
      return { reply: "Where will it take place? A venue or city is enough for now.", draft: { ...draft, step: "location", eventType: text }, handoff: false, booking: null };
    }
    if (draft.step === "location") {
      if (text.length < 2) return { reply: "Please send the event venue or city.", draft, handoff: false, booking: null };
      return {
        reply: `Which package would you like?\n${packages.map((p, i) => `${i + 1}. ${packageLine(p)}`).join("\n")}\nReply with a package name or number.`,
        draft: { ...draft, step: "package", location: text },
        handoff: false,
        booking: null,
      };
    }
    const selected = choosePackage(text, packages);
    if (!selected || !draft.name || !draft.date || !draft.time || !draft.eventType || !draft.location) {
      return { reply: `I couldn’t match that package. Please reply with one of: ${packages.map((p) => p.name).join(", ")}.`, draft, handoff: false, booking: null };
    }
    return {
      reply: `Your booking request is saved for ${draft.date} at ${draft.time}, ${draft.location}, with ${selected.name}. This is a request, not a confirmation — MA Studio will confirm availability with you here.`,
      draft: null,
      handoff: false,
      booking: { fullName: draft.name, eventDate: draft.date, eventTime: draft.time, eventType: draft.eventType, location: draft.location, packageName: selected.name },
    };
  }

  const namedPackage = packages.find((p) => text.toLowerCase().includes(p.name.toLowerCase().replace(/\s+package$/, "")));
  if (namedPackage && (PRICING.test(text) || text.split(/\s+/).length <= 3)) {
    return {
      reply: `${packageLine(namedPackage)}.\nIncludes: ${namedPackage.features.join("; ") || "details confirmed by the studio"}.\nWould you like to request a date? Type ‘book’.`,
      draft: null,
      handoff: false,
      booking: null,
    };
  }
  if (PRICING.test(text)) {
    return { reply: `Here are MA Studio’s current packages:\n${packageList(packages)}\n\nType ‘book’ to request a date. The studio confirms every booking personally.`, draft: null, handoff: false, booking: null };
  }
  if (BOOKING.test(text)) {
    return { reply: "I can collect a booking request for the studio to confirm. First, what is your full name?", draft: { step: "name" }, handoff: false, booking: null };
  }
  if (GREETING.test(text)) {
    return { reply: "Hello! Welcome to MA Studio. I can share current package prices or collect a booking request. Ask about ‘prices’, or type ‘book’. For anything else, I’ll bring in the studio team.", draft: null, handoff: false, booking: null };
  }
  return handoffResult(null);
}
