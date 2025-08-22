"use client";
import { PropsWithChildren, useRef, useState, useEffect } from "react";
import clsx from "clsx";
import Button from "@/ui/Button";

type Props = {
  itemWidth?: number;      // px szerokość kafla (ułatwia obliczenie "See all")
  gap?: number;            // px między kaflami
  className?: string;
  onChange?: (val: string) => void;
};

export default function Slider({
  children,
  itemWidth = 264,
  gap = 16,
  className,
}: PropsWithChildren<Props>) {
  const ref = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  const recalc = () => {
    const el = ref.current;
    if (!el) return;
    setCanScroll(el.scrollWidth > el.clientWidth + 4); // margines bezpieczeństwa
  };

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const scrollMore = () => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div className={clsx("relative", className)}>
      <div
        ref={ref}
        className="flex overflow-x-auto no-scrollbar"
        style={{ gap }}
      >
        {children}
      </div>

      {canScroll && (
        <div className="mt-4 flex justify-end">
          <Button variant="text" size="m" onClick={scrollMore}>
            See all
          </Button>
        </div>
      )}
    </div>
  );
}
