import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface AdminAccess {
  isAdmin: boolean;
  email: string | null;
}

/** Who is signed in, and are they a studio admin? Checked on the server, never in the browser. */
export const getAdminAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminAccess> => {
    const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    const claims = context.claims as Record<string, unknown>;
    const email = typeof claims["email"] === "string" ? claims["email"] : null;
    return { isAdmin: !!data, email };
  });
