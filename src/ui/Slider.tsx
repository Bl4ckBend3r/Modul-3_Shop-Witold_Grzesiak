"use client";
import { PropsWithChildren, useRef, useState, useEffect } from "react";
import clsx from "clsx";
import Button from "@/ui/Button";

type Props = { className?: string };

export default function Slider({ children, className }: PropsWithChildren<Props>) {
  const ref = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  const recalc = () => {
    const el = ref.current;
    if (!el) return;
    setCanScroll(el.scrollWidth > el.clientWidth + 4);
  };

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const scrollMore = () => ref.current?.scrollBy({ left: ref.current.clientWidth * 0.9, behavior: "smooth" });

  return (
    <div className={clsx("relative", className)}>
            {canScroll && (
        <div className="mt-4 flex justify-end text-[#F29145]">
          <Button variant="text" size="m" onClick={scrollMore}>
            See All →
          </Button>
        </div>
      )}
      
      <div
        ref={ref}
        className="flex overflow-x-auto mt-4 overflow-y-hidden no-scrollbar gap-4 sm:gap-6 md:gap-8 snap-x snap-mandatory"
      >
        {children}
      </div>


    </div>
  );
}
