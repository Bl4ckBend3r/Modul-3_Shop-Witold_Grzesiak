"use client";
import { useRouter } from "next/navigation";
import Button from "@/ui/Button";
import { useCart } from "@/ui/cards/CartContext";

export default function CartButton({
  size = "l",
}: { size?: "xs"|"s"|"m"|"l"|"xl"|"xxl" }) {
  const router = useRouter();
  const { items } = useCart();
  const count = items.reduce((sum, it) => sum + it.qty, 0);

  return (
    <Button
      size={size}
      onClick={() => router.push("/cart")}
      aria-label={`Przejdź do koszyka. Pozycji: ${count}`}
      rightIcon={<CartIcon />}
      variant="stroke"
      className="whitespace-nowrap"
    >
      {count > 0 ? `(${count})` : ""}
    </Button>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden>
      <path d="M3 5h2l2 12h10l2-8H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="19" r="1.5" fill="currentColor"/>
      <circle cx="17" cy="19" r="1.5" fill="currentColor"/>
    </svg>
  );
}
