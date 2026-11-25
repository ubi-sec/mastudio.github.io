import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAdmin } from "./admin-guard";

export interface DashboardData {
  inquiriesNew: number;
  inquiriesTotal: number;
  bookingRequestsOpen: number;
  bookingsThisMonth: number;
  bookingsUpcoming: number;
  invoicesUnpaid: number;
  outstanding: number;
  collectedThisMonth: number;
  collectedTotal: number;
  expensesThisMonth: number;
  customers: number;
  photosPublished: number;
  projectsPublished: number;
  revenueByMonth: { month: string; revenue: number }[];
  recentInquiries: {
    id: string;
    customerName: string;
    packageName: string;
    eventType: string;
    status: string;
    createdAt: string;
  }[];
  recentInvoices: {
    id: string;
    invoiceNumber: string;
    customerName: string;
    total: number;
    paymentStatus: string;
    invoiceDate: string;
  }[];
}

function rows<T>(result: { data: T[] | null; error: { message: string } | null }): T[] {
  if (result.error) throw new Error(result.error.message);
  return result.data ?? [];
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function lastMonths(n: number) {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) out.push(monthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)));
  return out;
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  const year = Number(y);
  const month = Number(m);
  if (!year || !month) return key;
  return `${MONTH_LABELS[month - 1]} ${String(year).slice(2)}`;
}

/** Studio numbers for the admin dashboard. Everything is read as the signed-in admin. */
export const getAdminDashboard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DashboardData> => {
    await assertAdmin(context.supabase, context.userId);
    const db = context.supabase;

    const [inq, breq, bk, inv, exp, cust, photos, projects] = await Promise.all([
      db
        .from("package_inquiries")
        .select("id, customer_name, package_name, event_type, status, created_at")
        .order("created_at", { ascending: false })
        .limit(300),
      db.from("booking_requests").select("id, status").limit(500),
      db.from("bookings").select("id, event_date, status").limit(500),
      db
        .from("invoices")
        .select("id, invoice_number, customer_name, total, amount_paid, payment_status, invoice_date")
        .order("invoice_date", { ascending: false })
        .limit(500),
      db.from("expenses").select("id, amount, expense_date").limit(1000),
      db.from("customers").select("id", { count: "exact", head: true }),
      db.from("gallery_photos").select("id", { count: "exact", head: true }).eq("published", true),
      db.from("portfolio_projects").select("id", { count: "exact", head: true }).eq("published", true),
    ]);

    for (const r of [cust, photos, projects]) if (r.error) throw new Error(r.error.message);

    const inquiryRows = rows(inq);
    const bookingRows = rows(bk);
    const invoiceRows = rows(inv);
    const expenseRows = rows(exp);

    const thisMonth = monthKey(new Date());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const collectedByMonth = new Map<string, number>();
    let collectedTotal = 0;
    let outstanding = 0;
    let invoicesUnpaid = 0;
    for (const i of invoiceRows) {
      const total = Number(i.total ?? 0);
      const paid = Number(i.amount_paid ?? 0);
      collectedTotal += paid;
      const key = (i.invoice_date ?? "").slice(0, 7);
      if (key) collectedByMonth.set(key, (collectedByMonth.get(key) ?? 0) + paid);
      if (paid + 0.005 < total) {
        invoicesUnpaid += 1;
        outstanding += total - paid;
      }
    }

    let collectedThisMonth = 0;
    for (const [key, value] of collectedByMonth) if (key === thisMonth) collectedThisMonth = value;

    let expensesThisMonth = 0;
    for (const e of expenseRows) if ((e.expense_date ?? "").slice(0, 7) === thisMonth) expensesThisMonth += Number(e.amount ?? 0);

    return {
      inquiriesNew: inquiryRows.filter((r) => r.status === "New").length,
      inquiriesTotal: inquiryRows.length,
      bookingRequestsOpen: rows(breq).filter((r) => r.status === "New" || r.status === "Contacted").length,
      bookingsThisMonth: bookingRows.filter((r) => (r.event_date ?? "").slice(0, 7) === thisMonth).length,
      bookingsUpcoming: bookingRows.filter((r) => (r.event_date ?? "") >= todayISO).length,
      invoicesUnpaid,
      outstanding,
      collectedThisMonth,
      collectedTotal,
      expensesThisMonth,
      customers: cust.count ?? 0,
      photosPublished: photos.count ?? 0,
      projectsPublished: projects.count ?? 0,
      revenueByMonth: lastMonths(6).map((key) => ({ month: monthLabel(key), revenue: collectedByMonth.get(key) ?? 0 })),
      recentInquiries: inquiryRows.slice(0, 6).map((r) => ({
        id: r.id,
        customerName: r.customer_name,
        packageName: r.package_name,
        eventType: r.event_type,
        status: r.status,
        createdAt: r.created_at,
      })),
      recentInvoices: invoiceRows.slice(0, 6).map((r) => ({
        id: r.id,
        invoiceNumber: r.invoice_number,
        customerName: r.customer_name,
        total: Number(r.total ?? 0),
        paymentStatus: r.payment_status,
        invoiceDate: r.invoice_date ?? "",
      })),
    };
  });
