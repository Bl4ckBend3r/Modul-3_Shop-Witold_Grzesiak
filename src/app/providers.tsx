"use client";

import { ToastProvider } from "@/ui/ToastContext";
import { CartProvider } from "@/ui/cards/CartContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    
    <ToastProvider>
      <CartProvider>{children}</CartProvider>
    </ToastProvider>
  );
}
