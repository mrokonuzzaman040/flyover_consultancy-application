"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

type SliderProps = {
  children: React.ReactNode[] | React.ReactNode;
  className?: string;
  itemClassName?: string;
  showControls?: boolean;
  showIndicators?: boolean;
  autoplayMs?: number | null; // null disables autoplay
};

export default function Slider({
  children,
  className,
  itemClassName,
  showControls = true,
  showIndicators = true,
  autoplayMs = null,
}: SliderProps) {
  const items = useMemo(
    () => (Array.isArray(children) ? children : [children]).filter(Boolean) as React.ReactNode[],
    [children]
  );

  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollTo = (i: number) => {
    const el = viewportRef.current;
    if (!el) return;
    const clamped = ((i % items.length) + items.length) % items.length; // wrap
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
  };

  const prev = () => scrollTo(index - 1);
  const next = () => scrollTo(index + 1);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setIndex(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!autoplayMs) return;
    const id = setInterval(() => {
      next();
    }, autoplayMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplayMs, index, items.length]);

  return (
    <div className={clsx("relative", className)}>
      <div
        ref={viewportRef}
        className={clsx(
          "flex h-full snap-x snap-mandatory overflow-x-auto no-scrollbar scroll-smooth",
          "[&>*]:snap-start [&>*]:shrink-0 [&>*]:basis-full"
        )}
      >
        {items.map((child, i) => (
          <div key={i} className={clsx(itemClassName)}>
            {child}
          </div>
        ))}
      </div>

      {showControls && items.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-700 shadow ring-1 ring-black/10 hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-gray-700 shadow ring-1 ring-black/10 hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {showIndicators && items.length > 1 && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, i) => (
            <span
              key={i}
              className={clsx(
                "h-1.5 w-6 rounded-full",
                i === index ? "bg-brand" : "bg-white/60"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

