"use client";
import { ReactNode, useState } from "react";
import clsx from "clsx";

type Size = "xs" | "s" | "m" | "l" | "xl" | "xxl";
type State = "default" | "active" | "open" | "pressed";

type Props = {
  label?: string;
  size?: Size;
  state?: State;
  options?: string[];
  value?: string;
  onChange?: (val: string) => void;
  className?: string;
  icon?: ReactNode;
  embedded?: boolean;
  border?: "none"|"border";
};

const SIZE: Record<Size, { h: number; text: string; fontSize: string }> = {
  xs: { h: 34, text: "text-[12px] leading-[22px]", fontSize: "text-xs" },
  s: { h: 40, text: "text-[14px] leading-[24px]", fontSize: "text-sm" },
  m: { h: 44, text: "text-[14px] leading-[24px]", fontSize: "text-sm" },
  l: { h: 50, text: "text-[16px] leading-[26px]", fontSize: "text-base" },
  xl: { h: 54, text: "text-[16px] leading-[26px]", fontSize: "text-base" },
  xxl: { h: 60, text: "text-[18px] leading-[28px]", fontSize: "text-lg" },
};



export default function Dropdown({
  label,
  size = "m",
  state = "default",
  options = [],
  value,
  onChange,
  className,
  icon,
  embedded = false,
  border = "none",
}: Props) {
  const [open, setOpen] = useState(state === "open");
  const sz = SIZE[size];

 const root = clsx(
    "flex items-center justify-between px-4",
    sz.text,
    embedded
      ? "bg-transparent text-[#FCFCFC]"
      : clsx(
          "bg-[#262626] text-[#FCFCFC] rounded-md",
          border === "border" ? "border border-[#383B42]" : "border border-transparent"
        ),
    className
  );

  return (
  <div
    className={clsx(
      "relative overflow-visible",   
      embedded ? "w-full max-w-400 h-full" : "inline-block w-48"
    )}
  >
    <button
      type="button"
      className={clsx(root, "w-full")}
      style={{ height: sz.h }}
      onClick={() => setOpen((o) => !o)}
    >
      <span>{value || label}</span>
      <span className="w-6 h-6 inline-flex items-center justify-center">
        {icon || (
          <svg
            className={clsx(
              "w-4 h-4 transition-transform",
              open && "rotate-180"
            )}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </button>

    {open && (
      <div
        className={clsx(
          "absolute left-0 mt-1 z-50 rounded-md shadow-xl ", 
          embedded ? "right-0" : "w-full ",
          "bg-[#262626] text-[#FCFCFC]  rounded-md border border-[#383B42]"
        )}
      >
        {options.map((opt) => {
          const active = value === opt;
          return (
            <button
              key={opt}
              className={clsx(
                "flex w-full items-center px-4 py-2 text-left  rounded-md border border-[#383B42]",
                active
                  ? "bg-[#EE701D] text-white "
                  : "hover:bg-[#E5610A] text-[#FCFCFC]  rounded-md border border-[#383B42]"
              )}
              onClick={() => {
                onChange?.(opt);
                setOpen(false);
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    )}
  </div>
);

}
