"use client";
import React from "react";

type Variant = "neutral" | "success" | "danger" | "warning" | "primary";
type Size = "sm" | "md" | "lg";
type Action = {
  label: string;
  intent?: "outline" | "solid";
  onClick?: () => void;
  disabled?: boolean;
};

export default function Alert({
  variant = "neutral",
  size = "md",
  title,
  description,
  actions = [],
  onClose,
  className = "",
  role = "status",
}: {
  variant?: Variant;
  size?: Size;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: Action[];
  onClose?: () => void;
  className?: string;
  role?: "alert" | "status";
}) {
  const T = TOKENS[variant];
  const S = SIZES[size];

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <div
        role={role}
        aria-live={role === "alert" ? "assertive" : "polite"}
        className="flex items-start gap-4 w-full max-w-[680px] rounded-[6px] border p-[18px] relative"
        style={{
          background: T.bg,
          borderColor: T.border,
          minHeight: S.minH,
        }}
      >
        {/* Ikona */}
        <div className="shrink-0 w-[30px] h-[30px] mt-[2px]" aria-hidden>
          {variant === "success" ? (
            <CheckIcon fill={T.accent} />
          ) : variant === "danger" ? (
            <DangerIcon stroke={T.accent} />
          ) : variant === "warning" ? (
            <WarningIcon stroke={T.accent} />
          ) : variant === "primary" ? (
            <InfoIcon stroke={T.accent} />
          ) : (
            <InfoIcon stroke="#262626" />
          )}
        </div>

        {/* Tekst + przyciski */}
        <div
          className="flex flex-col flex-1"
          style={{ gap: S.textActionsGap }}
        >
          {/* Tekst */}
          <div className="flex flex-col" style={{ gap: 8 }}>
            {title && (
              <div
                className="font-medium"
                style={{
                  color: "#262626",
                  fontFamily: "Inter",
                  fontSize: 20,
                  lineHeight: "30px",
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </div>
            )}
            {description && (
              <div
                style={{
                  color: "#5D5D5D",
                  fontFamily: "Inter",
                  fontSize: 16,
                  lineHeight: "26px",
                }}
              >
                {description}
              </div>
            )}
          </div>

          {/* Przyciski */}
          {actions.length > 0 && (
            <div
              className="flex items-start"
              style={{ gap: size === "lg" ? 16 : 32 }}
            >
              {actions.map((a, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={a.disabled}
                  onClick={a.onClick}
                  className={btnBase}
                  style={
                    a.intent === "solid"
                      ? {
                          background: T.solidBg,
                          color: T.solidText,
                          borderColor: T.solidBorder ?? "transparent",
                          height: size === "sm" ? 44 : 26,
                          padding:
                            size === "sm" ? "10px 20px" : "0px 0px", // wg Figma
                          width: size === "sm" ? 85 : 51,
                        }
                      : {
                          background: "transparent",
                          color: T.outlineText,
                          borderColor: T.outlineBorder,
                          height: size === "sm" ? 44 : 26,
                          padding:
                            size === "sm" ? "10px 20px" : "0px 0px",
                          width: size === "sm" ? 85 : 51,
                        }
                  }
                >
                  <span
                    style={{
                      fontFamily: "Inter",
                      fontWeight: 500,
                      fontSize: size === "sm" ? 14 : 16,
                      lineHeight: size === "sm" ? "24px" : "26px",
                    }}
                  >
                    {a.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Zamknij */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3"
            style={{ color: "#262626" }}
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </div>
  );
}

/* ===== tokens z Figma ===== */
const TOKENS: Record<
  Variant,
  {
    bg: string;
    border: string;
    accent: string;
    // przyciski
    outlineBorder: string;
    outlineText: string;
    solidBg: string;
    solidText: string;
    solidBorder?: string;
  }
> = {
  neutral: {
    bg: "#F7F8F8",
    border: "#8E95A2",
    accent: "#4A4E5A",
    outlineBorder: "#4A4E5A",
    outlineText: "#4A4E5A",
    solidBg: "#4A4E5A",
    solidText: "#FFFFFF",
  },
  success: {
    bg: "#F0FDF5",
    border: "#4ADE80",
    accent: "#16A34A",
    outlineBorder: "#16A34A",
    outlineText: "#16A34A",
    solidBg: "#16A34A",
    solidText: "#FFFFFF",
  },
  danger: {
    bg: "#FEF2F2",
    border: "#F87171",
    accent: "#DC2626",
    outlineBorder: "#DC2626",
    outlineText: "#DC2626",
    solidBg: "#DC2626",
    solidText: "#FFFFFF",
  },
  warning: {
    bg: "#FEF9E8",
    border: "#FAC215",
    accent: "#CA9A04",
    outlineBorder: "#CA9A04",
    outlineText: "#CA9A04",
    solidBg: "#CA9A04",
    solidText: "#FFFFFF",
  },
  primary: {
    bg: "#FEF7EE",
    border: "#F29145",
    accent: "#E05816",
    outlineBorder: "#E05816",
    outlineText: "#E05816",
    solidBg: "#E05816",
    solidText: "#FFFFFF",
  },
};

/* ===== rozmiary (Version 2/1/3) ===== */
const SIZES: Record<Size, { minH: number; textActionsGap: number }> = {
  sm: { minH: 116, textActionsGap: 24 }, // Version=2
  md: { minH: 176, textActionsGap: 24 }, // Version=1
  lg: { minH: 202, textActionsGap: 32 }, // Version=3
};

const btnBase =
  "inline-flex items-center justify-center rounded-[6px] border disabled:opacity-60 disabled:cursor-not-allowed";

/* ===== Ikony minimalistyczne ===== */
function InfoIcon({ stroke = "#262626" }: { stroke?: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={stroke} strokeWidth="2" />
      <path d="M12 8.5h.01M11 11h2v5h-2z" stroke={stroke} strokeWidth="2" />
    </svg>
  );
}
function CheckIcon({ fill = "#16A34A" }: { fill?: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={fill} />
      <path
        d="M7 12l3 3 7-7"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function DangerIcon({ stroke = "#DC2626" }: { stroke?: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={stroke} strokeWidth="2" />
      <path
        d="M12 7v7m0 3h.01"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function WarningIcon({ stroke = "#CA9A04" }: { stroke?: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4l8 14H4l8-14Z"
        stroke={stroke}
        strokeWidth="2"
        fill="none"
      />
      <path d="M12 9v4m0 3h.01" stroke={stroke} strokeWidth="2" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
