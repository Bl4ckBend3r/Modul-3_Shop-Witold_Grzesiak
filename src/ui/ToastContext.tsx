"use client";
import { createContext, useContext, useState, PropsWithChildren } from "react";

type Toast = { id: number; text: string };
const ToastCtx = createContext<{ notify: (text: string) => void } | null>(null);

export function ToastProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<Toast[]>([]);

  const notify = (text: string) => {
    const id = Date.now();
    setItems((s) => [...s, { id, text }]);
    setTimeout(() => setItems((s) => s.filter((t) => t.id !== id)), 2500);
  };

  return (
    <ToastCtx.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        {items.map((t) => (
          <div
            key={t.id}
            className="rounded-md bg-black/85 text-white px-4 py-2 shadow-lg"
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("ToastProvider missing");
  return ctx;
};
