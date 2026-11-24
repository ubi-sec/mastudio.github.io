/** Group digits with commas without relying on the runtime locale (same on server and browser). */
export function groupDigits(n: number) {
  const neg = n < 0;
  const abs = Math.abs(n);
  const whole = Math.trunc(abs);
  const cents = Math.round((abs - whole) * 100);
  const grouped = String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (neg ? "-" : "") + grouped + (cents ? "." + String(cents).padStart(2, "0") : "");
}

export function formatPKR(n: number | null | undefined) {
  return `PKR ${groupDigits(Number(n ?? 0))}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-11-24" or ISO timestamp → "24 Nov 2026". */
export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const [y, m, d] = value.slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return "—";
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Pakistani local numbers (03XX…) → wa.me digits (923XX…). */
export function toWhatsAppDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) return "92" + digits.slice(1);
  return digits;
}
