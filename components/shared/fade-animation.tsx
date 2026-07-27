"use client";

import { DURATION, EASE } from "@/lib/motion";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  Children,
  type ElementType,
  isValidElement,
  type ReactNode,
  useMemo,
  useRef,
} from "react";

const EASE_OUT_EXPO = EASE.out;
const ENTER_DURATION = DURATION.base;

type Props = {
  className?: string;
  delay?: number;
  as?: ElementType;
  childAs?: ElementType;
  direction: "up" | "down";
  children: ReactNode;
  staggerChildren?: number;
  initialOpacity?: number;
};

type FadeAnimationProps = {
  className?: string;
  delay?: number;
  distance?: number;
  amount?: number | "some" | "all";
  once?: boolean;
  as?: ElementType;
  direction: "up" | "down";
  children: ReactNode;
};

const FadeStaggeredAnimation = ({
  as: Component = "div",
  childAs: ChildComponent = "div",
  direction,
  children,
  className = "",
  staggerChildren = 0.1,
  initialOpacity = 0,
  delay = 0,
}: Props) => {
  // memoize so motion.create isn't re-run each render — a new
  // component type remounts the subtree and replays the entrance animation.
  const MotionComponent = useMemo(
    () => motion.create(Component, { forwardMotionProps: false }),
    [Component],
  );

  const MotionChild = useMemo(
    () => motion.create(ChildComponent, { forwardMotionProps: false }),
    [ChildComponent],
  );

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();

  return (
    <MotionComponent
      animate={isInView ? "show" : "hidden"}
      className={className}
      initial="hidden"
      ref={ref}
      variants={{
        hidden: {},
        show: {
          transition: reduceMotion
            ? { duration: 0 }
            : {
                staggerChildren,
                delayChildren: delay,
              },
        },
      }}
    >
      {Children.map(children, (child) =>
        isValidElement(child) ? (
          <MotionChild
            variants={{
              hidden: reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: initialOpacity,
                    transform: `translateY(${direction === "up" ? 18 : -18}px)`,
                  },
              show: {
                opacity: 1,
                transform: "translateY(0px)",
                transition: reduceMotion
                  ? { duration: 0 }
                  : { duration: ENTER_DURATION, ease: EASE_OUT_EXPO },
              },
            }}
          >
            {child}
          </MotionChild>
        ) : (
          child
        ),
      )}
    </MotionComponent>
  );
};

const FadeAnimation = ({
  direction,
  delay = 0,
  distance = 18,
  amount = 0.3,
  once = true,
  className,
  as: Component = "span",
  children,
}: FadeAnimationProps) => {
  const MotionComponent = useMemo(
    () => motion.create(Component, { forwardMotionProps: false }),
    [Component],
  );
  const reduceMotion = useReducedMotion();

  return (
    <MotionComponent
      className={className}
      initial="hidden"
      variants={{
        hidden: reduceMotion
          ? { opacity: 1 }
          : {
              opacity: 0,
              transform: `translateY(${direction === "up" ? distance : -distance}px)`,
            },
        show: {
          opacity: 1,
          transform: "translateY(0px)",
          transition: reduceMotion
            ? { duration: 0 }
            : { duration: ENTER_DURATION, ease: EASE_OUT_EXPO, delay },
        },
      }}
      viewport={{ once, amount }}
      whileInView="show"
    >
      {children}
    </MotionComponent>
  );
};

export { FadeAnimation, FadeStaggeredAnimation };
