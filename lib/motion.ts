export const EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  in: [0.4, 0, 1, 1],
} as const;

export const DURATION = {
  fast: 0.3,
  quick: 0.45,
  base: 0.8,
  slow: 1,
} as const;

export const SPRING = {
  smooth: { type: "spring", bounce: 0, duration: DURATION.base },
} as const;

export const STAGGER = {
  base: 0.08,
  tight: 0.05,
} as const;

// // Section reveal (use for every major section)
// export const sectionReveal = {
//   initial: { opacity: 0, y: 20 },
//   whileInView: { opacity: 1, y: 0 },
//   viewport: { once: true },
//   transition: { duration: 0.5 },
// };

// // Card grid stagger
// export const cardReveal = (index: number) => ({
//   initial: { opacity: 0, y: 20 },
//   whileInView: { opacity: 1, y: 0 },
//   viewport: { once: true },
//   transition: { duration: 0.5, delay: index * 0.08 },
// });
