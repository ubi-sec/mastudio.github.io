import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { InquiryProvider } from "@/components/inquiry/InquiryProvider";
import { CustomCursor } from "@/components/site/CustomCursor";
import { Footer } from "@/components/site/Footer";
import { Loader } from "@/components/site/Loader";
import { Navbar } from "@/components/site/Navbar";
import { themeInitScript } from "@/components/site/ThemeToggle";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Lost in the frame</p>
        <h1 className="mt-4 text-8xl text-gold-gradient">404</h1>
        <p className="mt-4 text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-ink"
        >
          Back to MA Studio
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end. You can try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-gold-gradient px-5 py-2 text-sm font-semibold text-ink"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-sm text-foreground hover:border-gold">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MA Studio — Photography & Cinematography" },
      { name: "description", content: "Professional photography & cinematography in Faisalabad for your most precious moments." },
      { name: "author", content: "MA Studio" },
      { name: "theme-color", content: "#080808" },
      { property: "og:site_name", content: "MA Studio" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Great+Vibes&family=Manrope:wght@300;400;500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "MA Studio",
          description: "Professional photography & cinematography studio.",
          telephone: "+923076998873",
          email: "mujahidameen8@gmail.com",
          address: { "@type": "PostalAddress", addressLocality: "Faisalabad", addressCountry: "PK" },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { pathname } = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <InquiryProvider>
        <Loader />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <Navbar />
        <motion.main
          id="main"
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Required: nested routes render here. */}
          <Outlet />
        </motion.main>
        <Footer />
        <WhatsAppFloat />
        <CustomCursor />
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              toast: "!bg-surface-raised !text-foreground !border-hairline",
              description: "!text-muted-foreground",
            },
          }}
        />
      </InquiryProvider>
    </QueryClientProvider>
  );
}
