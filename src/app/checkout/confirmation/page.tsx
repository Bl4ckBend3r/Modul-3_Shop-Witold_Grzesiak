"use client";
import { useEffect, useState } from "react";
import Button from "@/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

type OrderItem = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  price: number;
  qty: number;
};

type OrderData = {
  id: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  shippingMethod: string;
  items: OrderItem[];
  fees: {
    protection: number;
    shipping: number;
    insurance: number;
    service: number;
  };
};

export default function OrderConfirmationPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId") ?? "";
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) {
          console.error("Order not found");
          setOrder(null);
          return;
        }
        const raw = await res.json();

        const mapped: OrderData = {
          id: raw.id,
          createdAt: new Date(raw.createdAt).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          status: raw.status,
          totalAmount: Number(raw.totalAmount),
          paymentMethod: raw.paymentMethod ?? "Unknown",
          shippingMethod: raw.shippingMethod ?? "Unknown",
          items: raw.items.map((it: any) => ({
            id: it.id,
            name: it.product.name,
            category: it.product.category?.name ?? "Unknown",
            imageUrl: it.product.imageUrl,
            price: Number(it.priceAtPurchase),
            qty: it.quantity,
          })),
          fees: {
            protection: Number(raw.fees?.protection ?? 0),
            shipping: Number(raw.fees?.shipping ?? 0),
            insurance: Number(raw.fees?.insurance ?? 0),
            service: Number(raw.fees?.service ?? 0),
          },
        };

        setOrder(mapped);
      } catch (err) {
        console.error("Failed to fetch order", err);
      }
    }
    if (orderId) loadOrder();
  }, [orderId]);

  if (!order) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#1A1A1A] text-white">
        Loading order...
      </main>
    );
  }

  const subtotal = order.items.reduce((sum, it) => sum + it.price * it.qty, 0);

  const grandTotal =
    subtotal +
    order.fees.protection +
    order.fees.shipping +
    order.fees.insurance +
    order.fees.service;

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#1A1A1A] p-6">
      <div className="flex flex-col gap-6 bg-[#262626] border border-[#383B42] rounded-md p-6 w-[640px]">
        {/* Success icon + header */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full border-[5px] border-[#4ADE80] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-[#4ADE80]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-[28px] leading-[40px] font-medium text-white">
            Thanks for Your Order!
          </h2>
          <p className="text-[#E7E7E7]">{order.id}</p>
        </div>

        {/* Transaction Date */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium text-white">Transaction Date</h3>
          <p className="text-base font-medium text-[#E7E7E7]">{order.createdAt}</p>
        </div>
        <div className="border-t border-[#383B42]" />

        {/* Payment Method */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium text-white">Payment Method</h3>
          <p className="text-base font-medium text-[#E7E7E7]">{order.paymentMethod}</p>
        </div>
        <div className="border-t border-[#383B42]" />

        {/* Shipping Method */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium text-white">Shipping Method</h3>
          <p className="text-base font-medium text-[#E7E7E7]">{order.shippingMethod}</p>
        </div>
        <div className="border-t border-[#383B42]" />

        {/* Order items */}
        <h3 className="text-lg font-medium text-white">Your Order</h3>
        {order.items.map((it) => (
          <div key={it.id} className="border border-[#383B42] rounded-md p-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-[120px] h-[100px] relative border border-[#383B42] rounded-md bg-white">
                <Image
                  src={it.imageUrl}
                  alt={it.name}
                  fill
                  className="object-contain rounded-md"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <h4 className="text-white text-lg font-medium">{it.name}</h4>
                <span className="text-[#E7E7E7]">{it.category}</span>
                <div className="flex justify-between">
                  <span className="text-white text-xl font-medium">
                    {formatPrice(it.price)}
                  </span>
                  <span className="text-white text-lg">x{it.qty}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Fees + Totals */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-[#E7E7E7]">
            <span>Total Product Price ({order.items.length} Items)</span>
            <span className="text-white">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-[#E7E7E7]">
            <span>Total Product Protection</span>
            <span className="text-white">{formatPrice(order.fees.protection)}</span>
          </div>
          <div className="flex justify-between items-center text-[#E7E7E7]">
            <span>Total Shipping Price</span>
            <span className="text-white">{formatPrice(order.fees.shipping)}</span>
          </div>
          <div className="flex justify-between items-center text-[#E7E7E7]">
            <span>Shipping Insurance</span>
            <span className="text-white">{formatPrice(order.fees.insurance)}</span>
          </div>
          <div className="border-t border-[#383B42]" />
          <span className="text-lg font-medium text-white">Transaction Fees</span>
          <div className="flex justify-between items-center text-[#E7E7E7]">
            <span>Service Fees</span>
            <span className="text-white">{formatPrice(order.fees.service)}</span>
          </div>
        </div>

        {/* Grand total */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-medium text-white">Grand total</span>
          <span className="text-2xl font-medium text-white">{formatPrice(grandTotal)}</span>
        </div>

        {/* Status */}
        <div className="flex justify-between items-center">
          <span className="text-white text-lg">Status</span>
          <span
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              order.status === "success"
                ? "bg-[#295B40] text-[#DCFCE8]"
                : order.status === "pending"
                ? "bg-yellow-700 text-yellow-100"
                : "bg-red-700 text-red-100"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* Button */}
        <Link href="/products" className="w-full">
          <Button
            size="xl"
            className="w-full bg-[#F29145] text-black hover:bg-[#E05816]"
          >
            Continue Shopping
          </Button>
        </Link>
      </div>
    </main>
  );
}
