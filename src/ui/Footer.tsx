"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import cloudMap from "cloudinary-map.json";
import Separator from "./Separator";

type PaymentMethod = {
  id: string;
  slug: string;
  name: string;
  iconUrl?: string | null;
};

/** Ikony płatności z cloudinary-map.json */
const PAYMENT_ICONS: Record<string, string> = (
  cloudMap as Array<{ type: string; basenameSlug: string; secure_url: string }>
)
  .filter((x) => x.type === "payment")
  .reduce((acc, x) => {
    acc[x.basenameSlug] = x.secure_url;
    return acc;
  }, {} as Record<string, string>);

/** alias slugów z DB -> slug w mapie */
const PAYMENT_ALIAS: Record<string, string> = {
  gpay: "googlepay",
  mc: "mastercard",
  visa: "visa",
  paypal: "paypal",
  applepay: "applepay",
};

const columns = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Partner", href: "/partner" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Twitter", href: "https://twitter.com" },
      { label: "Facebook", href: "https://facebook.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
    ],
  },
  {
    title: "FAQ",
    links: [
      { label: "Account", href: "/account" },
      { label: "Deliveries", href: "/deliveries" },
      { label: "Orders", href: "/orders" },
      { label: "Payments", href: "/payments" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "E-books", href: "/ebooks" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Course", href: "/courses" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

export default function Footer() {
  const [payments, setPayments] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/payments", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as PaymentMethod[];
        setPayments(data);
      } catch {
        setPayments([
          { id: "fallback-visa", slug: "visa", name: "Visa" },
          { id: "fallback-mc", slug: "mc", name: "Mastercard" },
          { id: "fallback-paypal", slug: "paypal", name: "PayPal" },
          { id: "fallback-applepay", slug: "applepay", name: "Apple Pay" },
          { id: "fallback-gpay", slug: "gpay", name: "G Pay" },
        ]);
      }
    })();
  }, []);

  return (
   <footer className="w-full bg-[#222327] text-[#E7E7E7]">
  <Separator />

  <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12 py-10 lg:py-16">
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12">
      {/* LEWA KOLUMNA */}
      <div className="flex flex-col gap-6">
        <div className="text-2xl lg:text-3xl font-semibold tracking-[-0.01em]">
          <span className="text-[#EE701D]">Nexus</span>
          <span className="text-white">Hub</span>
        </div>

        <p className="text-sm lg:text-base">
          © 2023 NexusHub. All rights reserved.
        </p>

        {/* Ikony płatności */}
        <div className="flex flex-wrap gap-3">
          {Object.entries(PAYMENT_ALIAS).map(([dbSlug, mapSlug]) => {
            const match = payments.find((p) => p.slug === dbSlug);
            const icon = match?.iconUrl ?? PAYMENT_ICONS[mapSlug] ?? null;

            const name = match?.name ?? mapSlug;
            return (
              <span
                key={dbSlug}
                className="flex items-center justify-center h-8 w-12 rounded-md border border-[#383B42] bg-white shadow"
                aria-label={name}
              >
                {icon ? (
                  <Image
                    src={icon}
                    alt={name}
                    width={32}
                    height={16}
                    unoptimized
                    className="object-contain"
                  />
                ) : (
                  <span className="text-xs text-neutral-700">{name}</span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* MENU */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mt-8 lg:mt-0">
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-lg font-semibold text-white">
              {col.title}
            </h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm lg:text-base text-[#E7E7E7] hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </div>
</footer>

  );
}
