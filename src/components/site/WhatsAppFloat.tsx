import { whatsappLink } from "@/config/site";

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.19 4.23-9.42 9.43-9.42 2.52 0 4.89.98 6.67 2.77a9.36 9.36 0 0 1 2.76 6.67c0 5.2-4.23 9.42-9.43 9.42zm8.03-17.45A11.27 11.27 0 0 0 12.04.75C5.8.75.72 5.83.72 12.07c0 2 .52 3.94 1.51 5.66L.62 23.25l5.65-1.48a11.3 11.3 0 0 0 5.77 1.47h.01c6.24 0 11.32-5.08 11.32-11.32 0-3.02-1.18-5.87-3.3-8z" />
    </svg>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("Hello MA Studio! I'd like to know more about your photography services.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MA Studio on WhatsApp"
      className="group fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gold-gradient text-ink shadow-glow transition-transform duration-500 hover:scale-110"
    >
      <span className="animate-pulse-ring absolute inset-0 rounded-full border border-gold" aria-hidden />
      <WhatsAppIcon className="h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full border border-border bg-surface-raised px-4 py-2 text-xs text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Chat on WhatsApp
      </span>
    </a>
  );
}
