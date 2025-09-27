"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/ui/ToastContext";
import { CartProvider } from "@/ui/cards/CartContext";
import { Suspense } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={children}>
      <SessionProvider>
        <ToastProvider>
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </SessionProvider>
    </Suspense>
  );
}
