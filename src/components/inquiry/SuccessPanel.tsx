import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SuccessPanel({
  title,
  message,
  onReset,
  resetLabel = "Send another",
}: {
  title: string;
  message: string;
  onReset?: () => void;
  resetLabel?: string;
}) {
  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center py-10 text-center"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
        className="grid h-16 w-16 place-items-center rounded-full bg-gold-gradient text-ink shadow-glow"
      >
        <Check className="h-7 w-7" />
      </motion.span>
      <h3 className="mt-6 text-3xl text-foreground">{title}</h3>
      <p className="mt-3 max-w-sm text-muted-foreground">{message}</p>
      {onReset && (
        <Button variant="goldOutline" size="pill" className="mt-8" onClick={onReset}>
          {resetLabel}
        </Button>
      )}
    </motion.div>
  );
}
