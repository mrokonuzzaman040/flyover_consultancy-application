"use client";
import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({ to, duration = 1200, className }: { to: number; duration?: number; className?: string }) {
  const [val, setVal] = useState(0);
  const startTs = useRef<number | null>(null);

  useEffect(() => {
    const step = (ts: number) => {
      if (!startTs.current) startTs.current = ts;
      const p = Math.min(1, (ts - startTs.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [to, duration]);

  return <span className={className}>{val.toLocaleString()}</span>;
}

