// src/ui/Carousel.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

export type Slide = {
  id: string | number;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel?: string;
  imageUrl: string;
  imageAlt?: string;
};

type Props = {
  slides: Slide[];
  className?: string;
  autoPlay?: boolean;
  autoPlayMs?: number;
};

export default function Carousel({
  slides,
  className = "",
  autoPlay = true,
  autoPlayMs = 6000,
}: Props) {
  const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);
  const [idx, setIdx] = useState(0);
  const total = safeSlides.length;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback(
    (n: number) => setIdx((p) => (n + total) % total),
    [total]
  );
  const next = useCallback(() => go(idx + 1), [go, idx]);
  const prev = useCallback(() => go(idx - 1), [go, idx]);

  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    if (timer.current) {
      clearInterval(timer.current);
    }
    timer.current = setInterval(
      () => setIdx((p) => (p + 1) % total),
      autoPlayMs
    );
    return () => {
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, [autoPlay, autoPlayMs, total]);

  if (!total) return null;
  const cur = safeSlides[idx];

  return (
    <section className={className}>
      <div
        className="
          group relative isolate w-full overflow-hidden
          rounded-[0.375rem] border border-[#383B42] bg-[#222327]
          px-[clamp(1.25rem,5vw,7.5rem)] py-[clamp(1.25rem,6vh,2.25rem) -20]
        "
      >
        <div
          className="grid items-center gap-[clamp(1rem,3vw,2.5rem)]
            grid-cols-1 lg:grid-cols-[minmax(18rem,_27.0625rem)_1fr]
            "
        >
          {/* Tekst lewa kolumna */}
          <div className="order-2 lg:order-1  w-full lg:w-[27.0625rem] max-w-[27.0625rem] shrink-0 h-full">
            <div
              className="
              order-2 lg:order-1 
              z-[1]
              w-full max-w-[27.0625rem]    
              flex flex-col gap-[1.25rem]
              lg:absolute lg:left-[clamp(1rem,5vw,3.75rem)]
              lg:top-1/2 lg:-translate-y-1/2
            "
            >
              <h2 className="text-[clamp(1.5rem,2.2vw,2rem)] leading-[clamp(2rem,2.6vw,2.5rem)] font-medium tracking-[-0.01em] text-[#FCFCFC]">
                {cur.title}
              </h2>

              <p className="text-[1rem] leading-[1.625rem] text-[#E7E7E7]/90">
                {cur.description}
              </p>

              {cur.ctaHref && (
                <Link
                  href={cur.ctaHref}
                  className="
                  inline-flex w-fit items-center justify-center
                  h-[clamp(2.5rem,6.5vh,3.375rem)] px-[1.25rem]
                  rounded-[0.375rem] border border-[#F29145] text-[#F29145]
                  hover:text-[#E05816] hover:border-[#E05816] transition-colors
                "
                >
                  <span className="text-[1rem] leading-[1.625rem] font-medium">
                    {cur.ctaLabel ?? "Explore"}
                  </span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="ml-2"
                    aria-hidden
                  >
                    <path
                      d="M5 12h12M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Obraz prawa kolumna — bleed jak w referencji */}
          <div className="order-1 lg:order-2 relative w-full ">
            {/* wrapper z kontrolą wysokości bannera */}
            <div className="relative  w-full min-h-[clamp(12rem,34vw,18rem)] lg:min-h-[clamp(16rem,30vw,22rem)]">
               <div className="absolute inset-0  rotate-[-25deg] will-change-transform">
                            
                <Image
                  src={cur.imageUrl}
                  alt={cur.imageAlt ?? cur.title}
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
                  priority
                  className="
                  select-none pointer-events-none
                  object-contain
                  translate-x-[6%] lg:translate-x-[10%]
                  scale-[1.18] lg:scale-[2.20]
                  transform-gpu
                "
                /> 
              </div>
            </div>
          </div>
        </div>

        {/* Strzałki wewnątrz karty */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="
                  hidden sm:flex items-center justify-center
                  absolute left-0 top-1/2 -translate-y-1/2
                  h-[clamp(2.25rem,7vh,4rem)] w-[clamp(1.75rem,4.2vw,2.5rem)]
                  rounded-r-[0.375rem] bg-[#F29145] hover:bg-[#E05816]
                  transition-colors z-[2]
                  opacity-0 pointer-events-none
                  group-hover:opacity-100 group-hover:pointer-events-auto
                  focus:opacity-100 focus:pointer-events-auto
                  group-focus-within:opacity-100 group-focus-within:pointer-events-auto
                  transition-opacity duration-200
                "
              aria-label="Previous slide"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
                <path
                  d="M10.5 3.5L6 8l4.5 4.5"
                  stroke="#262626"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={next}
              className="
                      hidden sm:flex items-center justify-center
                      absolute right-0 top-1/2 -translate-y-1/2
                      h-[clamp(2.25rem,7vh,4rem)] w-[clamp(1.75rem,4.2vw,2.5rem)]
                      rounded-l-[0.375rem] bg-[#F29145] hover:bg-[#E05816]
                      transition-colors z-[2]
                      opacity-0 pointer-events-none
                      group-hover:opacity-100 group-hover:pointer-events-auto
                      focus:opacity-100 focus:pointer-events-auto
                      group-focus-within:opacity-100 group-focus-within:pointer-events-auto
                      transition-opacity duration-200
                    "
              aria-label="Next slide"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden>
                <path
                  d="M5.5 3.5L10 8l-4.5 4.5"
                  stroke="#262626"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Kropki – wycentrowane */}
      {total > 1 && (
        <div className="mt-[0.75rem] flex items-center justify-center gap-[0.375rem]">
          {safeSlides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              className={`
                h-2 rounded-full transition-all
                ${i === idx ? "w-6 bg-[#EE701D]" : "w-2 bg-neutral-500/60"}
              `}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === idx ? "true" : "false"}
              type="button"
            />
          ))}
        </div>
      )}
    </section>
  );
}
