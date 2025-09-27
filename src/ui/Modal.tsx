"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  open,
  onClose,
  children,
  className = "",
  disableOutsideClose = false,
}: {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  disableOutsideClose?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (typeof window === "undefined" || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={() => !disableOutsideClose && onClose?.()}
      />
      {/* dialog content */}
      <div
        className={
          "relative w-[680px] max-w-[92vw] rounded-[8px] border border-[#383B42] bg-[#262626] p-6 " +
          className
        }
        role="document"
      >
        <h2 id="modal-title" className="sr-only">
          Dialog
        </h2>

        {onClose && (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-4 top-4 text-neutral-300 hover:text-white"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        {children}
      </div>
    </div>,
    document.body
  );
}
