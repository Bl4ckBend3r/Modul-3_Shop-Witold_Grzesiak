"use client";
import Button from "@/ui/Button";
import Link from "next/link";
import InputField from "@/ui/InputField";
import router from "next/router";

export default function CartSummary({ total, count }: { total: number; count: number }) {
  return (
    <aside
      id="cartSummary"
      className="h-max w-full max-w-[423px] rounded-md border border-[#383B42] bg-[#262626] p-6"
    >
      {/* Divider */}
      <div className="mb-6 h-px w-full bg-[#383B42]" />

      {/* Total product */}
      <div id="cartTotalProduct" className="mb-6 flex flex-col gap-4">
        <div className="text-[18px]/[28px] font-medium">Total product</div>
        <div className="flex items-center justify-between text-[#E7E7E7]">
          <span className="text-base leading-6">
            Total Product Price ({count} Item{count !== 1 ? "s" : ""})
          </span>
          <span id="cartTotalPrice" className="text-[18px]/[28px] font-medium text-white">
            ${total.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="my-6 h-px w-full bg-[#383B42]" />

      {/* Subtotal */}
      <div id="cartSubtotal" className="mb-6 flex items-center justify-between">
        <span className="text-[18px]/[28px] font-medium">Subtotal</span>
        <span
          id="cartSubtotalPrice"
          className="text-[28px]/[40px] font-medium tracking-[-0.01em]"
        >
          ${total.toFixed(1)}
        </span>
      </div>

      <Link href="/checkout">
        <Button id="checkoutBtn" size="xl" className="w-full">
          Checkout
        </Button>
      </Link>
    </aside>
  );
}
