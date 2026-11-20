import { motion, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number };

/** Fades and lifts content into view once. */
export function Reveal({ delay = 0, y = 28, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.8, 0.2, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Image that unveils with a gold curtain wipe. */
export function RevealImage({
  src,
  alt,
  className,
  imgClassName,
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  return (
    <motion.div
      className={"relative overflow-hidden " + (className ?? "")}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-40px" }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={"h-full w-full object-cover " + (imgClassName ?? "")}
        variants={{ hidden: { scale: 1.15 }, shown: { scale: 1 } }}
        transition={{ duration: 1.6, ease: [0.2, 0.8, 0.2, 1] }}
      />
      <motion.span
        aria-hidden
        className="absolute inset-0 origin-right bg-gold-gradient"
        variants={{ hidden: { scaleX: 1 }, shown: { scaleX: 0 } }}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
      />
    </motion.div>
  );
}
