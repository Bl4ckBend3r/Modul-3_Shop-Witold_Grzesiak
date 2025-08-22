"use client";

import { InputHTMLAttributes, ReactNode, useId } from "react";

type Size = "xs" | "s" | "m" | "l" | "xl" | "xxl";
type Type = "stroke" | "leftButton";
type State = "default" | "active" | "typing" | "focussed";

type Props = {
  size?: Size;
  type?: Type;
  state?: State;
  destructive?: boolean;

  label?: string;
  helper?: string;
  error?: string;

  leftIcon?: ReactNode;
  /** Prosty tekst zamiast dropdownu */
  rightText?: string;
  /** Dowolny element (np. Dropdown) jako prawa część */
  rightNode?: React.ReactNode;

  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** Paleta z projektu */
const C = {
  base: "#EE701D",
  hover: "#E05816",
  pressed: "#F29145",
  muted: "#D8DBDF",
  disabled: "#F7B87A",
  bg: "#262626",
  line: "#616674",
  text: "#FCFCFC",
  sub: "#A1A1AA",
  error: "#E05816",
};

const SIZE: Record<Size, {
  h: number; px: number; gapY: number; radius: number;
  text: string; label: string; helper: string; icon: string;
}> = {
  xxl: { h: 60, px: 16, gapY: 16, radius: 8,  text: "text-[18px] leading-[28px]", label:"text-[14px] leading-[20px]", helper:"text-[12px] leading-[18px]", icon:"w-6 h-6" },
  xl:  { h: 54, px: 14, gapY: 16, radius: 6,  text: "text-[16px] leading-[26px]", label:"text-[14px] leading-[20px]", helper:"text-[12px] leading-[18px]", icon:"w-6 h-6" },
  l:   { h: 50, px: 14, gapY: 16, radius: 6,  text: "text-[16px] leading-[26px]", label:"text-[14px] leading-[20px]", helper:"text-[12px] leading-[18px]", icon:"w-6 h-6" },
  m:   { h: 44, px: 14, gapY: 16, radius: 6,  text: "text-[14px] leading-[24px]", label:"text-[13px] leading-[18px]", helper:"text-[12px] leading-[18px]", icon:"w-5 h-5" },
  s:   { h: 40, px: 14, gapY: 16, radius: 6,  text: "text-[14px] leading-[24px]", label:"text-[12px] leading-[16px]", helper:"text-[12px] leading-[18px]", icon:"w-5 h-5" },
  xs:  { h: 34, px: 12, gapY: 14, radius: 6,  text: "text-[12px] leading-[22px]", label:"text-[12px] leading-[16px]", helper:"text-[11px] leading-[16px]", icon:"w-4 h-4" },
};

function borderFor(state: State, destructive?: boolean) {
  if (destructive) return C.error;
  switch (state) {
    case "focussed": return C.base;
    case "active":   return C.pressed;
    case "typing":   return C.hover;
    default:         return C.line;
  }
}
function ringFor(state: State, destructive?: boolean) {
  if (state === "focussed") return destructive ? C.error : C.base;
  return "transparent";
}
function rightTextColor(state: State, destructive?: boolean) {
  if (destructive) return C.error;
  if (state === "active") return C.pressed;
  if (state === "typing") return C.hover;
  return C.text;
}

export default function InputField({
  size = "xl",
  type = "stroke",
  state = "default",
  destructive = false,

  label,
  helper,
  error,

  leftIcon,
  rightText,
  rightNode,

  className,
  id,
  ...rest
}: Props) {
  const reactId = useId();
  const s = SIZE[size];
  const controlId = id ?? `input-${reactId}`;

  const border = borderFor(state, destructive);
  const ring = ringFor(state, destructive);

  const wrapper = cx("w-[320px] text-left");

  const labelCls = cx("block font-medium text-neutral-200", s.label);

  const baseInput = cx(
    "w-full flex items-center overflow-hidden", // jedna ramka + bez rozjeżdżania
    "bg-transparent",
    `rounded-[${s.radius}px]`,
    "transition-[border,box-shadow]",
    "outline-none",
    "border"
  );

  const inputPaddingLeft = leftIcon ? s.px + 28 : s.px;
  const inputPaddingRight = s.px;

  const helperText = destructive ? (error ?? helper) : helper;

  return (
    <div className={cx(wrapper, className)}>
      {label && <label htmlFor={controlId} className={labelCls}>{label}</label>}

      {/* INPUT */}
      <div
        className={baseInput}
        style={{
          height: s.h,
          backgroundColor: C.bg,
          borderColor: border,
          boxShadow: ring !== "transparent" ? `0 0 0 3px ${ring}1A` : "none",
        }}
      >
        {/* left icon */}
        {leftIcon && (
          <span className={cx("shrink-0 mx-3 inline-flex items-center justify-center text-neutral-400", s.icon)}>
            {leftIcon}
          </span>
        )}

        <input
          id={controlId}
          className={cx("bg-transparent text-neutral-100 placeholder-neutral-500 outline-none w-full", s.text)}
          style={{ paddingLeft: inputPaddingLeft, paddingRight: inputPaddingRight, height: s.h }}
          {...rest}
        />

        {/* prawa część */}
        {type === "leftButton" && (rightNode || rightText) && (
          <div
            className="shrink-0 h-full flex items-center justify-center border-l"
            style={{
              width: 106,                              // Figma
              borderColor: C.line,
              backgroundColor: C.bg,
            }}
          >
            {rightNode ? (
              rightNode
            ) : (
              <span className="inline-flex items-center gap-2">
                <span className="text-[16px] leading-[26px] font-medium" style={{ color: rightTextColor(state, destructive) }}>
                  {rightText}
                </span>
                {/* chevron */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 9l6 6 6-6" stroke={C.text} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            )}
          </div>
        )}
      </div>

      {helperText && (
        <p className={cx("mt-2", s.helper, destructive ? "text-[#E05816]" : "text-neutral-400")}>
          {helperText}
        </p>
      )}
    </div>
  );
}
