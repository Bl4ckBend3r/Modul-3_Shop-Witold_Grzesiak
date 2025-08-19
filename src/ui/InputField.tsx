"use client";

import { InputHTMLAttributes, ReactNode, useId } from "react";

type Size = "xs" | "s" | "m" | "l" | "xl" | "xxl";
type Type = "stroke" | "leftButton";
type State = "default" | "active" | "typing" | "focussed";

type Props = {
  /** Rozmiar z Figmy */
  size?: Size;
  /** Wariant pola (z ramką lub z prawym przyciskiem tekstowym) */
  type?: Type;
  /** Stan z Figmy: Default / Active / Typing / Focussed */
  state?: State;
  /** Czy stan „destructive” (błąd) – koloruje obramowanie i opis */
  destructive?: boolean;

  /** Label nad polem */
  label?: string;
  /** Tekst pomocniczy pod polem (gdy nie ma błędu) */
  helper?: string;
  /** Treść błędu (gdy destructive=true można dodatkowo nadpisać tekstem) */
  error?: string;

  /** Ikonka po lewej stronie inputa */
  leftIcon?: ReactNode;
  /** Tekstowy „przycisk” po prawej (tylko dla type="leftButton") */
  rightText?: string;

  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "size">;

const cx = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ");

/** Paleta z projektu */
const C = {
  base: "#EE701D", // brand
  hover: "#E05816",
  pressed: "#F29145",
  muted: "#D8DBDF",
  disabled: "#F7B87A",
  bg: "#0b0b0c", // neutral-950 ish (dark default)
  line: "#27272a", // neutral-800
  text: "#f5f5f6", // near white
  sub: "#A1A1AA",
  error: "#E05816",
};

const SIZE: Record<
  Size,
  {
    h: number; // height of control
    px: number; // horizontal padding input
    gapY: number; // gap between label/input and input/helper
    radius: number;
    text: string; // input text size/leading
    label: string; // label text
    helper: string; // helper text
    icon: string; // icon box size
  }
> = {
  xxl: {
    h: 60,
    px: 16,
    gapY: 16,
    radius: 8,
    text: "text-[18px] leading-[28px]",
    label: "text-[14px] leading-[20px]",
    helper: "text-[12px] leading-[18px]",
    icon: "w-6 h-6",
  },
  xl: {
    h: 54,
    px: 14,
    gapY: 16,
    radius: 6,
    text: "text-[16px] leading-[26px]",
    label: "text-[14px] leading-[20px]",
    helper: "text-[12px] leading-[18px]",
    icon: "w-6 h-6",
  },
  l: {
    h: 50,
    px: 14,
    gapY: 16,
    radius: 6,
    text: "text-[16px] leading-[26px]",
    label: "text-[14px] leading-[20px]",
    helper: "text-[12px] leading-[18px]",
    icon: "w-6 h-6",
  },
  m: {
    h: 44,
    px: 14,
    gapY: 16,
    radius: 6,
    text: "text-[14px] leading-[24px]",
    label: "text-[13px] leading-[18px]",
    helper: "text-[12px] leading-[18px]",
    icon: "w-5 h-5",
  },
  s: {
    h: 40,
    px: 14,
    gapY: 16,
    radius: 6,
    text: "text-[14px] leading-[24px]",
    label: "text-[12px] leading-[16px]",
    helper: "text-[12px] leading-[18px]",
    icon: "w-5 h-5",
  },
  xs: {
    h: 34,
    px: 12,
    gapY: 14,
    radius: 6,
    text: "text-[12px] leading-[22px]",
    label: "text-[12px] leading-[16px]",
    helper: "text-[11px] leading-[16px]",
    icon: "w-4 h-4",
  },
};

/** Kolory obramowania i akcentów zależnie od stanu/destructive */
function borderFor(state: State, destructive?: boolean) {
  if (destructive) {
    // tryb error
    if (state === "active" || state === "focussed" || state === "typing")
      return C.error;
    return C.error; // Default error też pomarańcz
  }
  switch (state) {
    case "focussed":
      return C.base;
    case "active":
      return C.pressed;
    case "typing":
      return C.hover;
    default:
      return C.line;
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
  return C.base;
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

  className,
  id,
  ...rest
}: Props) {
  const reactId = useId();
  const s = SIZE[size];
  const controlId = id ?? `input-${reactId}`;

  const border = borderFor(state, destructive);
  const ring = ringFor(state, destructive);

  const wrapper = cx(
    "w-[320px] text-left",

    ""
  );

  const labelCls = cx(
    "block font-medium text-neutral-200",
    s.label,
    destructive && "text-neutral-200"
  );

  const baseInput = cx(
    "w-full flex items-center",
    "bg-[${P.bg}]",
    `rounded-[${s.radius}px]`,
    "transition-[border,box-shadow]",
    "outline-none",
    "border",

    ring !== "transparent" && "ring-2 ring-offset-0 ring-neutral-900/0",
    s.text
  );

  const inputPaddingLeft = leftIcon ? s.px - 10 : s.px;
  const inputPaddingRight =
    type === "leftButton" && rightText ? s.px + 56 : s.px;

  const helperText =
    destructive && (error || helper)
      ? error || helper
      : !destructive
      ? helper
      : undefined;

  return (
    <div className={cx(wrapper, className)}>
      {label && (
        <label htmlFor={controlId} className={labelCls}>
          {label}
        </label>
      )}

      {/* INPUT */}
      <div
        className={cx(baseInput)}
        style={{
          height: s.h,
          borderColor: border,
          boxShadow: ring !== "transparent" ? `0 0 0 3px ${ring}1A` : "none", // lekki glow
        }}
      >
        {/* left icon */}
        {leftIcon && (
          <span
            className={cx(
              "shrink-0 mx-3 inline-flex items-center justify-center text-neutral-400",
              s.icon
            )}
          >
            {leftIcon}
          </span>
        )}

        <input
          id={controlId}
          className={cx(
            "bg-transparent border-none text-neutral-100 placeholder-neutral-500 outline-none w-full",
            s.text
          )}
          style={{
            paddingLeft: inputPaddingLeft,
            paddingRight: inputPaddingRight,
          }}
          {...rest}
        />

        {/* right text button (tylko leftButton) */}
        {type === "leftButton" && rightText && (
          <button
            type="button"
            tabIndex={-1}
            className={cx(
              "ml-2 mr-2 rounded-[6px] px-3 py-1.5",
              "text-sm font-medium",
              "bg-neutral-800"
            )}
            style={{ color: rightTextColor(state, destructive) }}
          >
            {rightText}
          </button>
        )}
      </div>

      {/* HELPER / ERROR */}
      {helperText && (
        <p
          className={cx(
            "mt-2",
            s.helper,
            destructive ? "text-[#E05816]" : "text-neutral-400"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
