import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] },
  },
};

export const staggerSmall: Variants = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.02 } },
};
