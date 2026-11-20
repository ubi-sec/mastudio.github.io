import { createContext, useCallback, useContext, useState } from "react";
import { PackageInquiryForm } from "./PackageInquiryForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OpenOptions {
  packageName?: string;
  eventType?: string;
}

const InquiryContext = createContext<{ openInquiry: (o?: OpenOptions) => void } | null>(null);

export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<OpenOptions>({});
  const [key, setKey] = useState(0);

  const openInquiry = useCallback((o: OpenOptions = {}) => {
    setOpts(o);
    setKey((k) => k + 1); // fresh form, prefilled with the chosen package
    setOpen(true);
  }, []);

  return (
    <InquiryContext.Provider value={{ openInquiry }}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto border-hairline bg-surface-raised p-6 shadow-glow sm:rounded-xl md:p-10">
          <DialogHeader className="text-left">
            <p className="eyebrow">Package Inquiry</p>
            <DialogTitle className="font-serif text-4xl font-medium text-foreground">
              {opts.packageName ?? "Plan your shoot"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Share a few details and MA Studio will get back to you with availability and a tailored quote.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <PackageInquiryForm
              key={key}
              defaultPackage={opts.packageName}
              defaultEventType={opts.eventType}
              onDone={() => setOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  const ctx = useContext(InquiryContext);
  if (!ctx) throw new Error("useInquiry must be used inside InquiryProvider");
  return ctx;
}
