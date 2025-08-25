"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginSuccessBanner() {
  const sp = useSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(sp.get("login") === "success");
  }, [sp]);

  if (!visible) return null;

  const close = () => {
    setVisible(false);
    const params = new URLSearchParams(sp.toString());
    params.delete("login");
    // usuń flagę z URL, bez scrolla
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full flex justify-center px-4 mt-4">
      <div
        className="flex items-start gap-4 w-full max-w-[1360px] h-[66px] rounded-[6px] border p-[18px]"
        style={{ background: "#295B40", borderColor: "#22C55E" }}
        role="status"
        aria-live="polite"
      >
        {/* Ikona sukcesu */}
        <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0" aria-hidden>
          <circle cx="12" cy="12" r="10" fill="#22C55E" />
          <path d="M7 12l3 3 7-7" stroke="#295B40" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

        <div className="text-white text-[16px] leading-[26px]">
          Zalogowano pomyślnie. Witamy ponownie!
        </div>

        <button
          type="button"
          onClick={close}
          className="ml-auto text-white/80 hover:text-white"
          aria-label="Zamknij powiadomienie"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
