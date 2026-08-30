'use client';

import { useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function AnimatedCounter({ value, suffix = '' }: { value: number | null; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 34, stiffness: 90 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === null) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue, reduced]);

  useEffect(() => spring.on('change', (v) => setDisplay(Math.round(v))), [spring]);

  if (value === null) {
    return (
      <span ref={ref} className="text-mute" title="Figure to be supplied by Alexon">
        —
      </span>
    );
  }
  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}
