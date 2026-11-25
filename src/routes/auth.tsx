import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, KeyRound, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Field, inputClass } from "@/components/inquiry/fields";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Mode = "signin" | "signup" | "forgot";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Studio sign in — MA Studio" },
      { name: "description", content: "Sign in to the MA Studio admin area to manage inquiries, bookings and invoices." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Studio sign in — MA Studio" },
      { property: "og:description", content: "MA Studio admin area for inquiries, bookings and invoices." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: "/admin" });
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const finish = () => navigate({ to: "/admin", replace: true });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast.error("Could not sign you in", { description: "Check the email and password, then try again." });
          return;
        }
        finish();
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) {
          toast.error("Could not create the account", { description: error.message });
          return;
        }
        if (data.session) finish();
        else {
          setSent(true);
          toast.success("Check your email", { description: "Confirm your address, then sign in." });
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) {
          toast.error("Could not send the reset link", { description: error.message });
          return;
        }
        setSent(true);
        toast.success("Reset link sent", { description: "Open it from your inbox to choose a new password." });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,173,98,0.14),transparent_60%)]" />
      <div className="gold-frame relative w-full max-w-md rounded-2xl bg-card/80 p-8 backdrop-blur-md md:p-10">
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="eyebrow mt-8 text-center">Studio Admin</p>
        <h1 className="mt-3 text-center font-serif text-4xl font-medium text-foreground">
          {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset your password"}
        </h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {mode === "forgot"
            ? "We'll email you a link to choose a new password."
            : "Admin access is limited to the studio's own email address."}
        </p>

        {sent && mode !== "signin" ? (
          <div className="mt-8 rounded-xl border border-hairline bg-accent/30 p-5 text-center">
            <p className="font-serif text-xl text-foreground">Almost there</p>
            <p className="mt-2 text-sm text-muted-foreground">
              We've sent a message to <span className="text-gold-ink">{email}</span>. Follow it to continue.
            </p>
            <Button variant="quiet" size="pill" className="mt-4" onClick={() => setSent(false)}>
              <ArrowLeft /> Back
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
            <Field label="Email" htmlFor="auth-email" required>
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </Field>

            {mode !== "forgot" && (
              <Field label="Password" htmlFor="auth-password" required>
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </Field>
            )}

            <Button type="submit" variant="gold" size="xl" disabled={busy} className="mt-2 w-full">
              {busy ? <Loader2 className="animate-spin" /> : mode === "signin" ? <KeyRound /> : <Mail />}
              {busy ? "Working…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
            </Button>
          </form>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-sm">
          {mode === "signin" ? (
            <>
              <button type="button" className="text-muted-foreground transition-colors hover:text-gold-ink" onClick={() => { setMode("forgot"); setSent(false); }}>
                Forgot password?
              </button>
              <button type="button" className="text-gold-ink transition-colors hover:text-gold-light" onClick={() => { setMode("signup"); setSent(false); }}>
                Create an account
              </button>
            </>
          ) : (
            <button type="button" className="text-muted-foreground transition-colors hover:text-gold-ink" onClick={() => { setMode("signin"); setSent(false); }}>
              <ArrowLeft className="mr-1 inline h-3 w-3" /> Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
