"use client";
import React, { forwardRef, useEffect, useRef } from "react";
import clsx from "clsx";

type CheckboxSize = "l" | "m" | "s";

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "onChange"
  > {
  checked: boolean;
  onChange: (next: boolean) => void; 
  size?: CheckboxSize;
  label?: string;
  indeterminate?: boolean;
}

const SIZES: Record<
  CheckboxSize,
  {
    box: { w: number; h: number; radius: number; pad?: number; gap: number; borderWidth: number };
    label: { className: string };
    rowH: number;
  }
> = {
  l: {
    box: { w: 26, h: 26, radius: 6, gap: 16, borderWidth: 1 },
    label: { className: "text-[16px] leading-[26px] font-medium" },
    rowH: 26,
  },
  m: {
    // w/g Figma pudełko 18x18, BW ≈ 0.69 px
    box: { w: 18, h: 18, radius: 4.15385, gap: 12, borderWidth: 0.692308 },
    label: { className: "text-[14px] leading-[24px] font-medium" },
    rowH: 24,
  },
  s: {
    box: { w: 18, h: 18, radius: 4.15385, gap: 12, borderWidth: 0.692308 },
    label: { className: "text-[12px] leading-[22px] font-medium" },
    rowH: 22,
  },
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      onChange,
      size = "l",
      label,
      className,
      disabled,
      indeterminate,
      id,
      ...rest
    },
    ref
  ) => {
    const s = SIZES[size];
    const localRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const el = (ref && "current" in (ref as any) ? (ref as any).current : null) || localRef.current;
      if (el) el.indeterminate = !!indeterminate && !checked;
    }, [indeterminate, checked, ref]);

    return (
      <label
        htmlFor={id}
        className={clsx(
          "inline-flex items-center select-none",
          className
        )}
        style={{ gap: s.box.gap, height: s.rowH }}
      >
        {/* ukryty natywny input dla dostępności */}
        <input
          {...rest}
          ref={(node) => {
            localRef.current = node as HTMLInputElement | null;
            if (typeof ref === "function") ref(node as any);
            else if (ref && "current" in ref) (ref as any).current = node;
          }}
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />

        {/* pudełko */}
        <span
          aria-hidden="true"
          className={clsx(
            "box-border inline-flex items-center justify-center",
            "transition-shadow",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer focus-within:outline-none",
          )}
          style={{
            width: s.box.w,
            height: s.box.h,
            borderRadius: s.box.radius,
            background: checked || indeterminate ? "#EE701D" : "#F7F8F8",
            border: checked || indeterminate ? "none" : `${s.box.borderWidth}px solid #8E95A2`,
          }}
        >
          {/* znacznik (SVG) z dokładnym białym obrysem */}
          {indeterminate && !checked ? (
            <svg width={s.box.w - 8} height={s.box.h - 8} viewBox="0 0 18 18" fill="none">
              <path d="M3 9H15" stroke="#FFFFFF" strokeWidth={size === "l" ? 1.35 : 0.934615} strokeLinecap="round" />
            </svg>
          ) : checked ? (
            <svg width={s.box.w - 8} height={s.box.h - 8} viewBox="0 0 18 18" fill="none">
              <path
                d="M3.5 9.5L7.25 13.25L14.5 5.75"
                stroke="#FFFFFF"
                strokeWidth={size === "l" ? 1.35 : 0.934615}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>

        {/* etykieta */}
        {label && (
          <span
            className={clsx(
              s.label.className,
              "font-['Inter'] text-[#262626]"
            )}
          >
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
