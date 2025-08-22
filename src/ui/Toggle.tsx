"use client";
import React, { forwardRef } from "react";
import clsx from "clsx";

type ToggleSize = "s" | "m";

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked: boolean;
  onChange: (next: boolean) => void;
  size?: ToggleSize;
  label?: string; 
}

const SIZES: Record<
  ToggleSize,
  {
    wrapper: string; 
    knob: string; 
  }
> = {
  m: {
   
    wrapper:
      "w-[68px] h-[36px] px-1 py-1.5 sm:p-1.5 [padding:4px] rounded-[30px]",
  
    knob: "w-[28px] h-[28px] rounded-full",
  },
  s: {

    wrapper:
      "w-[52px] h-[28px] [padding:2px] rounded-[30px]",
    
    knob: "w-[24px] h-[24px] rounded-full",
  },
};

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      checked,
      onChange,
      size = "m",
      disabled,
      className,
      label,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const sz = SIZES[size];

    return (
      <button
        {...rest}
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={(e) => {
          if (onKeyDown) onKeyDown(e);
          if (disabled) return;
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            onChange(!checked);
          }
          if (e.key === "ArrowLeft") onChange(false);
          if (e.key === "ArrowRight") onChange(true);
        }}
        className={clsx(
          // track
          "inline-flex items-center justify-start box-border select-none",
          "border rounded-[30px] transition-[border-color,box-shadow] duration-150",
          // exact Figma colors
          "bg-[#F7F8F8] border-[#8E95A2]",
          // alignment by state (Off = start, On = end)
          checked ? "justify-end" : "justify-start",
          // focus state
          !disabled &&
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EE701D]/40",
          // disabled
          disabled && "opacity-50 cursor-not-allowed",
          sz.wrapper,
          className
        )}
        style={{
          // preserve the 10px gap used on M in Figma by letting flex space handle it visually
          // (the knob has fixed width so padding creates the same appearance)
          gap: size === "m" ? 10 : 0,
        }}
      >
        <span
          aria-hidden="true"
          className={clsx(
            "block shrink-0",
            sz.knob,
            "transition-transform duration-150",
            // knob color by state
            checked ? "bg-[#EE701D]" : "bg-[#8E95A2]"
          )}
        />
      </button>
    );
  }
);

Toggle.displayName = "Toggle";

export default Toggle;
