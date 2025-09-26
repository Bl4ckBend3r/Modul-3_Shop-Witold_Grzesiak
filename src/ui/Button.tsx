"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Size = "xs" | "s" | "m" | "l" | "xl" | "xxl";
type Variant = "fill" | "stroke" | "text";

type Props = {
  children: ReactNode;
  size?: Size;
  variant?: Variant;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const cx = (...c: (string | false | null | undefined)[]) =>
  c.filter(Boolean).join(" ");

const SIZES: Record<
  Size,
  {
    h: string;
    px: string;
    py: string;
    gap: string;
    text: string;
    leading: string;
    rounded: string;
    icon: string; // width & height
  }
> = {
  xs: {
    h: "h-[34px]",
    px: "px-[20px]",
    py: "py-[6px]",
    gap: "gap-[14px]",
    text: "text-[12px] font-medium",
    leading: "leading-[22px]",
    rounded: "rounded-[6px]",
    icon: "w-4 h-4",
  },
  s: {
    h: "h-[40px]",
    px: "px-[20px]",
    py: "py-[8px]",
    gap: "gap-[14px]",
    text: "text-[14px] font-medium",
    leading: "leading-[24px]",
    rounded: "rounded-[6px]",
    icon: "w-5 h-5",
  },
  m: {
    h: "h-[44px]",
    px: "px-[20px]",
    py: "py-[10px]",
    gap: "gap-[14px]",
    text: "text-[14px] font-medium",
    leading: "leading-[24px]",
    rounded: "rounded-[6px]",
    icon: "w-5 h-5",
  },
  l: {
    h: "h-[50px]",
    px: "px-[20px]",
    py: "py-[12px]",
    gap: "gap-[14px]",
    text: "text-[16px] font-medium",
    leading: "leading-[26px]",
    rounded: "rounded-[6px]",
    icon: "w-6 h-6",
  },
  xl: {
    h: "h-[54px]",
    px: "px-[20px]",
    py: "py-[14px]",
    gap: "gap-[14px]",
    text: "text-[16px] font-medium",
    leading: "leading-[26px]",
    rounded: "rounded-[6px]",
    icon: "w-6 h-6",
  },
  xxl: {
    h: "h-[60px]",
    px: "px-[20px]",
    py: "py-[16px]",
    gap: "gap-[14px]",
    text: "text-[18px] font-medium",
    leading: "leading-[28px]",
    rounded: "rounded-[6px]",
    icon: "w-6 h-6",
  },
};

const COLORS = {
  base: "#EE701D", // default
  hover: "#E05816", // hover
  pressed: "#F29145", // pressed (stroke/text) / pressed-outline
  disabled: "#F7B87A", // disabled
  textMuted: "#D8DBDF", // pressed text in fill
};

export default function Button({
  children,
  size = "xl",
  variant = "fill",
  leftIcon,
  rightIcon,
  disabled,
  className,
  ...rest
}: Props) {
  const sz = SIZES[size];

  const root = cx(
    "inline-flex items-center justify-center select-none transition-colors",
    "border-0 outline-none ring-0 shadow-none",
    "focus:outline-none focus:ring-0 focus:shadow-none",
    sz.h,
    sz.px,
    sz.py,
    sz.gap,
    sz.rounded,
    disabled && "pointer-events-none opacity-100"
  );

  // Warianty + stany (default/hover/active/disabled)
  const style =
    variant === "fill"
      ? cx(
          "text-white",
          `bg-[${COLORS.base}]`,
          !disabled && `hover:bg-[${COLORS.hover}] active:bg-[${COLORS.hover}]`,
          disabled && `bg-[${COLORS.disabled}]`
        )
      : variant === "stroke"
      ? cx(
          "bg-transparent border-[1] text-[#EE701D]",
          "hover:border-[#E05816] active:border-[#F29145]",
          "disabled:border-[#F7B87A] disabled:text-[#F7B87A]"
        )
      : // text
        cx("bg-transparent border-0", disabled && `text-[${COLORS.disabled}]`);

  // Typografia
  const type = cx(sz.text, sz.leading);

  return (
    <button
      {...rest}
      disabled={disabled}
      className={cx(root, style, type, className)}
    >
      {leftIcon && (
        <span
          className={cx(sz.icon, "inline-flex items-center justify-center")}
        >
          {leftIcon}
        </span>
      )}
      <span className="whitespace-nowrap">{children}</span>
      {rightIcon && (
        <span
          className={cx(sz.icon, "inline-flex items-center justify-center")}
        >
          {rightIcon}
        </span>
      )}
    </button>
  );
}
