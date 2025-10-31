"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/ui/ToastContext";
import { CartProvider } from "@/ui/cards/CartContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (

      <SessionProvider>
        <ToastProvider>
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </SessionProvider>

  );
}
