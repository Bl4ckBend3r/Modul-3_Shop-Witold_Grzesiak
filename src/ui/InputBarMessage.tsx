import React, { useId, useRef, useState } from "react";
import clsx from "clsx";

type Mode = "default" | "typing" | "active" | "highlighted" | "focus";

export interface InputBarMessageProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "size" | "onChange"
  > {
  mode?: Mode;
  value: string;
  onChange: (val: string) => void; 
  onSend?: (val: string) => void;
  highlightPx?: number;
}


export default function InputBarMessage({
  mode = "default",
  value,
  onChange,
  onSend,
  placeholder = "Write your message....",
  disabled,
  className,
  highlightPx = 85,
  ...rest
}: InputBarMessageProps) {
  const id = useId();
  const [isFocused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const showFocus = mode === "focus" || isFocused;
  const showTyping = mode === "typing";
  const showActive = mode === "active";
  const showHighlighted = mode === "highlighted";

  const send = () => {
    if (disabled) return;
    onSend?.(value.trim());
  };

  return (
    <div
      className={clsx(
        "w-full max-w-[1008px] h-[74px] box-border",
        "flex flex-row items-center gap-4 p-4",
        "bg-white border border-[#D8DBDF]",
        className
      )}
      role="group"
      aria-labelledby={`${id}-label`}
    >
      {/* TEXT AREA (input + prefix help / emojis) */}
      <div className="flex items-center gap-[14px] flex-1 h-[26px]">
        {/* emoji icon */}
        <button
          type="button"
          className="inline-flex items-center justify-center w-6 h-6"
          aria-label="Emoji or stickers"
          disabled={disabled}
        >
          <Emoji stroke="#EE701D" />
        </button>

        {/* CONTENT AREA */}
        {showTyping && (
          <div className="flex items-center gap-2 w-full h-[26px]">
            <span
              id={`${id}-label`}
              className="text-[16px] leading-[26px] text-[#262626] font-normal"
            >
              Chat Help
            </span>
            <span className="h-[26px] border border-[#262626]" />
            <span className="text-[16px] leading-[26px] text-[#262626]">
              Hello! is this product available?
            </span>
          </div>
        )}

        {showActive && (
          <span className="text-[16px] leading-[26px] text-[#262626]">
            Hello! is this product available?
          </span>
        )}

        {showHighlighted && (
          <div className="relative isolate w-full h-[26px] flex items-center">
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 h-6 bg-[#FAD6AE] z-0"
              style={{ width: highlightPx }}
              aria-hidden
            />
            <span className="relative z-10 text-[16px] leading-[26px] text-[#262626]">
              Hello! is this product available?
            </span>
          </div>
        )}

        {/* INPUT (default/focus) */}
        {(mode === "default" || mode === "focus") && (
          <>
            {showFocus && (
              <span className="h-[26px] border border-[#262626]" />
            )}
            <input
              {...rest}
              ref={inputRef}
              id={`${id}-input`}
              className={clsx(
                "w-full h-[26px] outline-none bg-transparent",
                "text-[16px] leading-[26px] font-normal",
                showFocus ? "text-[#B6BAC3]" : "text-[#6B7280]"
              )}
              placeholder={placeholder}
              disabled={disabled}
              value={value}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onChange={(e) => onChange(e.target.value)}
            />
          </>
        )}
      </div>

      {/* RIGHT CONTROLS */}
      <div className="flex items-center gap-6 w-[194px] h-[42px]">
        {/* plus & camera */}
        <div className="flex items-center gap-6 w-[72px] h-6">
          <button
            type="button"
            className="inline-flex items-center justify-center w-6 h-6"
            aria-label="Add attachment"
            disabled={disabled}
          >
            <PlusCircle stroke="#6B7280" />
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center w-6 h-6"
            aria-label="Open camera"
            disabled={disabled}
          >
            <Camera stroke="#6B7280" />
          </button>
        </div>

        {/* SEND BUTTON */}
        <button
          type="button"
          onClick={send}
          disabled={disabled}
          className={clsx(
            "inline-flex items-center justify-center gap-[14px] rounded-[6px]",
            "w-[98px] h-[42px] px-5",
            "bg-[#EE701D] text-white",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EE701D]/40 disabled:opacity-60"
          )}
        >
          {/* stop icon ukryty w makiecie – zostawiamy warunek do ewentualnego użycia */}
          {/* <StopIcon className="w-5 h-5 hidden" /> */}
          <span className="text-[14px] leading-[24px] font-medium">Send</span>
          <Send stroke="#FFFFFF" />
        </button>
      </div>
    </div>
  );
}

/* ================= Icons (SVG, wymiary i grubości jak w Figma) ================= */

function Emoji({ stroke = "#EE701D" }: { stroke?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1" fill={stroke} />
      <circle cx="15" cy="10" r="1" fill={stroke} />
      <path d="M8 14c1.2 1 2.6 1.5 4 1.5s2.8-.5 4-1.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusCircle({ stroke = "#6B7280" }: { stroke?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.5" />
      <path d="M12 8v8M8 12h8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Camera({ stroke = "#6B7280" }: { stroke?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke={stroke} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.5" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

function Send({ stroke = "#FFFFFF" }: { stroke?: string }) {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
      <path d="M3 10l14-6-4 14-3-5-7-3z" stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
