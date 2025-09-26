"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Button from "@/ui/Button";
import Checkbox from "@/ui/Checkbox";
import { Toggle } from "@/ui/Toggle";
import { useCart } from "@/ui/cards/CartContext";
import Breadcrumb, { useRegisterBreadcrumb } from "@/ui/Breadcrumb";
import Link from "next/link";
import NewAddressForm from "@/ui/NewAddressForm";
import CartItem from "@/app/cart/_parts/CartItem";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const COLORS = {
  panel: "#262626",
  line: "#383B42",
  text: "#FCFCFC",
};

type CheckoutConfig = {
  address: {
    line: string;
    country: string;
    province: string;
    city: string;
    postal: string;
    isDefault?: boolean;
  };
  shipping: {
    method: string;
    price: number;
    insuranceDefault: boolean;
    insurancePrice: number;
  };
  protection: { enabledByDefault: boolean; price: number; description: string };
  fees: { service: number };
  payments: { applePay: boolean };
};

export default function CheckoutClient({ config }: { config: CheckoutConfig }) {
  useRegisterBreadcrumb("Checkout");

  const { items } = useCart();
  const router = useRouter();
  const line = items[0];

  // stany pochodne od konfiguracji backendowej
  const [qty, setQty] = useState<number>(line?.qty ?? 1);
  const [protect, setProtect] = useState<boolean>(
    !!config.protection.enabledByDefault
  );
  const [shipIns, setShipIns] = useState<boolean>(
    !!config.shipping.insuranceDefault
  );
  const [applePay, setApplePay] = useState<boolean>(!!config.payments.applePay);

  const unitPrice = Number(line?.product.price ?? 0);
  const priceProduct = useMemo(() => unitPrice * qty, [unitPrice, qty]);

  const totalProductsPrice = useMemo(() => {
    return items.reduce((sum, it) => sum + it.product.price * it.qty, 0);
  }, [items]);

  const totalQty = useMemo(() => {
    return items.reduce((sum, it) => sum + it.qty, 0);
  }, [items]);

  const { data: session } = useSession();

  const protection = protect ? config.protection.price : 0;
  const shipping = config.shipping.price ?? 0;
  const insurance = shipIns ? config.shipping.insurancePrice : 0;
  const fees = config.fees.service ?? 0;
  const subtotal =
    totalProductsPrice + protection + shipping + insurance + fees;
  const [tab, setTab] = useState<"existing" | "new">("existing");

  return (
    <main className="min-h-screen bg-[#1A1A1A]">
      <div id="paddside">
        <div
          className="
            mx-auto mt-4 flex w-full max-w-[1360px] 
            flex-col lg:flex-row 
            items-start gap-12 px-5 pb-20
          "
          style={{ paddingTop: 40 }}
        >
          {/* LEWA KOLUMNA */}
          <div className="flex min-w-0 flex-1 flex-col gap-10 w-full">
            {/* Your Order */}
            <section className="flex flex-col gap-4">
              <h2 className="text-[24px] leading-[36px] font-medium text-white">
                Your Order
              </h2>

              <div
                className="rounded-[6px] border p-6"
                style={{ background: COLORS.panel, borderColor: COLORS.line }}
              >
                {items.length === 0 ? (
                  <div id="paddside">
                    <div className="text-neutral-200">
                      Koszyk jest pusty.{" "}
                      <Link
                        href="/products"
                        className="underline decoration-[#EE701D] underline-offset-4"
                      >
                        Przejdź do produktów
                      </Link>
                      .
                    </div>
                  </div>
                ) : (
                  <>
                    <div id="paddside" className="flex flex-col gap-6 ">
                      {items.map((it) => (
                        <CartItem
                          variant="summary"
                          key={it.product.id}
                          item={it}
                          selected={true}
                          onToggle={() => {}}
                          onInc={() => {}}
                          onDec={() => {}}
                          onRemove={() => {}}
                        />
                      ))}

                      {/* divider */}
                      <div
                        className="my-6"
                        style={{ borderTop: `1px solid ${COLORS.line}` }}
                      />

                      {/* Product protection */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Checkbox
                              checked={protect}
                              onChange={setProtect}
                              size="l"
                              label="Product Protection"
                            />
                          </div>
                          <div className="text-[18px] leading-[28px] text-white">
                            ${" "}
                            {protect
                              ? `${config.protection.price.toFixed(2)}`
                              : "0"}
                          </div>
                        </div>
                        <div className="px-10 text-[14px] leading-[24px] text-[#E7E7E7]">
                          {config.protection.description}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Address */}
            <section className="flex flex-col gap-4">
              <h2 className="text-[24px] leading-[36px] font-medium text-white">
                Address
              </h2>

              <div
                className="rounded-[6px] border p-6"
                style={{ background: COLORS.panel, borderColor: COLORS.line }}
              >
                {/* tabs */}
                <div id="tabsAddres" className="grid grid-cols-2">
                  <button
                    onClick={() => setTab("existing")}
                    className="flex flex-col items-center gap-3"
                    aria-pressed={tab === "existing"}
                  >
                    <div
                      className={`text-[18px] leading-[28px] ${
                        tab === "existing"
                          ? "font-semibold text-[#F29145]"
                          : "text-[#B0B0B0]"
                      }`}
                    >
                      Existing Address
                    </div>
                    <div
                      className={`w-full ${
                        tab === "existing"
                          ? "border-t-2 border-[#F29145]"
                          : "border-t border-[#383B42]"
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => setTab("new")}
                    className="flex flex-col items-center gap-3"
                    aria-pressed={tab === "new"}
                  >
                    <div
                      className={`text-[18px] leading-[28px] ${
                        tab === "new"
                          ? "font-semibold text-[#F29145]"
                          : "text-[#B0B0B0]"
                      }`}
                    >
                      New Address
                    </div>
                    <div
                      className={`w-full ${
                        tab === "new"
                          ? "border-t-2 border-[#F29145]"
                          : "border-t border-[#383B42]"
                      }`}
                    />
                  </button>
                </div>

                {/* content */}
                {tab === "existing" ? (
                  <div id="tabsAddres" className="mt-8 flex flex-col gap-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-[16px] leading-[26px] text-[#E7E7E7]">
                          Address
                        </span>
                        {config.address.isDefault && (
                          <span className="inline-flex h-9 items-center rounded-[6px] bg-[#E5610A] px-2.5 text-[14px] leading-[24px] text-[#FDEDD7]">
                            &nbsp; &nbsp;Main Address &nbsp; &nbsp;
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-[18px] leading-[28px] text-white">
                      {config.address.line}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Field label="Country" value={config.address.country} />
                      <Field label="Province" value={config.address.province} />
                      <Field label="City" value={config.address.city} />
                      <Field
                        label="Postal Code"
                        value={config.address.postal}
                      />
                    </div>
                  </div>
                ) : (
                  <div id="tabsAddres" className="mt-8">
                    <NewAddressForm
                      onSaved={async () => {
                        window.location.reload();
                      }}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Shipping */}
            <section className="flex flex-col gap-4">
              <h2 className="text-[24px] leading-[36px] font-medium text-white">
                Shipping
              </h2>
              <div
                id="tabsAddres"
                className="flex items-center justify-between rounded-[6px] border p-6"
                style={{ background: COLORS.panel, borderColor: COLORS.line }}
              >
                <div className="flex items-center gap-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#4ADE80"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-none"
                  >
                    <path d="M12 3L3 7v5c0 5 3.6 9.3 9 11 5.4-1.7 9-6 9-11V7l-9-4z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  <div className="text-[18px] leading-[28px] text-white">
                    {config.shipping.method}
                  </div>
                </div>
                <div className="text-[16px] text-white">
                  {config.shipping.price} zł
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="flex flex-col gap-4">
              <h2 className="text-[24px] leading-[36px] font-medium text-white">
                Payment Method
              </h2>
              <div
                id="tabsAddres"
                className="flex items-center gap-8 rounded-[6px] border p-6"
                style={{ background: COLORS.panel, borderColor: COLORS.line }}
              >
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div
                      className="flex h-[30px] w-[46px] items-center justify-center rounded bg-white shadow-[0_4.4px_8.8px_rgba(183,183,183,0.08),0_0.44px_4.42px_rgba(183,183,183,0.08)] ring-1"
                      style={{ borderColor: COLORS.line }}
                    >
                      <Image
                        src="https://res.cloudinary.com/damzxycku/image/upload/applepay.png"
                        alt="Apple Pay"
                        width={32}
                        height={14}
                      />
                    </div>
                    <span className="text-[18px] leading-[28px] text-white">
                      Apple Pay
                    </span>
                  </div>
                </div>
                <div className="ml-auto"></div>
              </div>
            </section>
          </div>

          {/* PRAWA KOLUMNA – podsumowanie */}
          <aside
            className="sticky top-6 w-full lg:max-w-[423px] rounded-[6px] border p-6"
            style={{ background: COLORS.panel, borderColor: COLORS.line }}
          >
            <div id="tabsAddres" className="flex flex-col gap-4">
              <div className="text-[18px] leading-[28px] text-white">
                Total Product
              </div>
              <Row
                label={`Total Product Price (${totalQty} item${
                  totalQty > 1 ? "s" : ""
                })`}
                price={`$ ${totalProductsPrice.toFixed(2)}`}
              />

              <Row
                label="Total Product Protection"
                price={`$ ${protection.toFixed(2)}`}
              />
              <Row
                label="Total Shipping Price"
                price={`$ ${shipping.toFixed(2)} `}
              />
              <Row
                label="Shipping Insurance"
                price={`$ ${insurance.toFixed(2)}`}
              />
            </div>

            <div
              className="my-6"
              style={{ borderTop: `1px solid ${COLORS.line}` }}
            />

            <div id="tabsAddres" className="flex flex-col gap-4">
              <div className="text-[18px] leading-[28px] text-white">
                Transaction Fees
              </div>
              <Row label="Service Fees" price={`$ ${fees.toFixed(2)} `} />
            </div>

            <div
              className="my-6"
              style={{ borderTop: `1px solid ${COLORS.line}` }}
            />

            <div id="tabsAddres" className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <span className="text-[18px] leading-[28px] text-white">
                  Subtotal
                </span>
                <span className="text-[28px] leading-[40px] font-medium text-white">
                  $ {subtotal.toFixed(2)}
                </span>
              </div>

              <Button
                size="xl"
                className="w-full"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        userId: session?.user?.id,
                        items,
                        address: config.address,
                        shipping: config.shipping,
                        protection: protect ? config.protection.price : 0,
                        fees: config.fees,
                      }),
                    });

                    if (!res.ok) {
                      return;
                    }

                    const data = await res.json().catch(() => null);
                    const order = data?.order;

                    if (order?.id) {
                      router.push(`/checkout/confirmation?orderId=${order.id}`);
                    }
                  } catch (err) {
                    console.error("Checkout error:", err);
                  }
                }}
              >
                Pay Now
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Row({ label, price }: { label: string; price: string }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-[16px] leading-[26px] text-[#E7E7E7]">{label}</span>
      <span className="text-[18px] leading-[28px] text-white">{price}</span>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[16px] leading-[26px] text-[#E7E7E7]">{label}</span>
      <span className="text-[18px] leading-[28px] text-white">{value}</span>
    </div>
  );
}
