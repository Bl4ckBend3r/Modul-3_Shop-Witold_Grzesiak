"use client";

import * as React from "react";
import Button from "@/ui/Button";
import Input from "@/ui/InputField";
import Avatar from "@/ui/Avatar";
import Separator from "@/ui/Separator";
import Link from "next/link";
import { safeSrc } from "@/lib/safeSrc";
import { usePathname, useRouter } from "next/navigation";
import CartButton from "@/ui/CartButton";

import {
  Bell,
  Camera,
  ChevronDown,
  MessageSquare,
  Plus,
  Search as SearchIcon,
  ShoppingCart,
} from "lucide-react";
import clsx from "clsx";

type NavKey = "home" | "product" | "contact";

export interface HeaderProps {
  loggedIn?: boolean;
  search?: string; // opcjonalne
  onSearchChange?: (v: string) => void; // opcjonalne
  onSearchSubmit?: () => void;
  activeNav?: NavKey;
  onNavClick?: (k: NavKey) => void;
  onLoginClick?: () => void;
  onAddressClick?: () => void;
  avatarUrl?: string;
  className?: string;
}

export function Header({
  loggedIn = false,
  search,
  onSearchChange,
  onSearchSubmit,
  activeNav = "product",
  onNavClick,
  onLoginClick,
  onAddressClick,
  avatarUrl,
  className,
}: HeaderProps) {
  // ------ fallback dla opcjonalnych propsów ------
  const [internalSearch, setInternalSearch] = React.useState("");
  const handleChange: (v: string) => void =
    onSearchChange ?? ((v) => setInternalSearch(v));
  const value = search ?? internalSearch;

  return (
    <header
      className={clsx(
        "w-full h-auto px-5 pt-6 pb-6 sm:px-6 md:px-8",
        "lg:w-[1440px] bg-[#1A1A1A] lg:h-[244px] lg:px-[40px] lg:pt-[40px] lg:pb-[40px]",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 md:gap-8 pb-6 lg:pb-[40px]">
        {/* GÓRNY PASEK 54px */}
        <div className="flex items-center pt-[40px] pb-[40px] justify-between gap-4 md:gap-6 lg:h-[54px]">
          {/* Logo 159x44 */}
          <div
            className="flex h-[44px] w-[159px] items-center font-semibold leading-[400px]"
            style={{
              fontFamily: "Inter",
              fontSize: 32,
              letterSpacing: "-0.01em",
            }}
          >
            <span className="text-[#EE701D]">Nexus</span>
            <span className="text-neutral-900">Hub</span>
          </div>

          {/* Search 793px → płynnie, a od lg wraca do 793 */}
          <div className="w-full min-w-0 max-w-[793px] md:flex-1 lg:flex-none lg:w-[793px] ">
            <Input
              size="xl"
              state="default"
              type="stroke"
              placeholder="Search"
              leftIcon={<SearchIcon />}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearchSubmit?.()}
              className="w-full"
            />
          </div>

          {/* Sign in / po zalogowaniu */}
          
          <CartButton size="xxl" />

          {!loggedIn ? (
            <Button size="xl" variant="fill" onClick={onLoginClick}>
              Sign in
            </Button>
          ) : (
            <div className="flex items-center gap-4 md:gap-6">

                   <button
                type="button"
                className="flex items-center gap-2 bg-transparet hover:bg-muted/40 rounded-full p-2"
              >
                <Avatar src={avatarUrl ?? undefined} size={45} />
              </button>
            </div>
          )}
        </div>

        {/* NAWIGACJA 26px wysokości */}
        <div className="flex h-[26px] items-center pb-[40px] justify-between mb-6 lg:mb-[40px] gap-4 lg:gap-6">
          <nav className="flex items-center ml-0 lg:ml-[-20px]">
            <NavLink label="Home" href="/" />
            <NavLink label="Products" href="/products" />
            <NavLink label="Contact" href="/contact" />
          </nav>
        </div>

        <Separator />
      </div>
    </header>
  );
}

/* ---------- Mini helpery ---------- */

function NavLink({ label, href }: { label: string; href: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Button
      onClick={() => router.push(href)}
      aria-current={isActive ? "page" : undefined}
      className={clsx(
        "h-[26px] px-0 bg-transparent hover:bg-transparent",
        "text-[16px] leading-[26px] transition-colors duration-200",
        "hover:text-[#F29145] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F29145]/50 rounded",
        isActive ? "text-[#F29145] font-semibold" : "text-[#B0B0B0] font-medium"
      )}
      style={{ fontFamily: "Inter" }}
      variant="text"
      size="l"
    >
      {label}
    </Button>
  );
}

function IconBtn({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      className="h-10 w-10 rounded-full bg-transparent hover:bg-muted/40"
      {...rest}
    >
      {children}
    </Button>
  );
}

/* Opcjonalny toolbar ikon nad polem wejściowym */
export function InputBarIcons() {
  return (
    <div className="flex items-center gap-6 w-[72px] h-6">
      <Button className="h-6 w-6 bg-transparent hover:bg-transparent p-0">
        <Plus className="h-6 w-6 text-[#6B7280]" />
      </Button>
      <Button className="h-6 w-6 bg-transparent hover:bg-transparent p-0">
        <Camera className="h-6 w-6 text-[#6B7280]" />
      </Button>
    </div>
  );
}

export default Header;
