import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { KeyRound, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Field, inputClass } from "@/components/inquiry/fields";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Choose a new password — MA Studio" },
      { name: "description", content: "Set a new password for your MA Studio admin account." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Choose a new password — MA Studio" },
      { property: "og:description", content: "Set a new password for your MA Studio admin account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<"checking" | "form" | "no-link">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) setState("form");
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setState("form");
    });
    const timer = setTimeout(() => setState((s) => (s === "checking" ? "no-link" : s)), 2500);
    return () => {
      data.subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Use at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("The two passwords don't match");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast.error("Could not update the password", { description: error.message });
      return;
    }
    toast.success("Password updated");
    navigate({ to: "/admin", replace: true });
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,173,98,0.14),transparent_60%)]" />
      <div className="gold-frame relative w-full max-w-md rounded-2xl bg-card/80 p-8 backdrop-blur-md md:p-10">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="eyebrow mt-8 text-center">Studio Admin</p>
        <h1 className="mt-3 text-center font-serif text-4xl font-medium text-foreground">New password</h1>

        {state === "checking" && <p className="mt-6 text-center text-sm text-muted-foreground">Checking your reset link…</p>}

        {state === "no-link" && (
          <div className="mt-8 rounded-xl border border-hairline bg-accent/30 p-5 text-center">
            <p className="font-serif text-xl text-foreground">No reset link here</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Open the link we emailed you, or ask for a new one from the sign-in page.
            </p>
            <Button variant="goldOutline" size="pill" className="mt-4" onClick={() => navigate({ to: "/auth" })}>
              Go to sign in
            </Button>
          </div>
        )}

        {state === "form" && (
          <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
            <Field label="New password" htmlFor="np" required>
              <input
                id="np"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
              />
            </Field>
            <Field label="Confirm password" htmlFor="np2" required>
              <input
                id="np2"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className={inputClass}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Type it again"
              />
            </Field>
            <Button type="submit" variant="gold" size="xl" disabled={busy} className="mt-2 w-full">
              {busy ? <Loader2 className="animate-spin" /> : <KeyRound />}
              {busy ? "Saving…" : "Save new password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
