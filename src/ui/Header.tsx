"use client";
import * as React from "react";
import Button from "@/ui/Button";
import Input from "@/ui/InputField";
import Avatar from "@/ui/Avatar";
import Separator from "@/ui/Separator";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import CartButton from "@/ui/CartButton";
import { Plus, Camera, Search as SearchIcon } from "lucide-react";
import clsx from "clsx";
import { useToast } from "@/ui/ToastContext";
import { useSession } from "next-auth/react";

type NavKey = "home" | "product" | "contact";

export interface HeaderProps {
  search?: string;
  onSearchChange?: (v: string) => void;
  onSearchSubmit?: () => void;
  activeNav?: NavKey;
  onNavClick?: (k: NavKey) => void;
  onLoginClick?: () => void;
  onAddressClick?: () => void;
  className?: string;
}

export function Header({
  search,
  onSearchChange,
  onSearchSubmit,
  activeNav = "product",
  onNavClick,
  onLoginClick,
  onAddressClick,
  className,
}: HeaderProps) {
  const sessionRes = useSession();
  const session = sessionRes?.data;
  const loggedIn = !!session?.user;
  const avatarUrl = session?.user?.image ?? undefined;

  const [internalSearch, setInternalSearch] = React.useState("");
  const [loginToastShown, setLoginToastShown] = React.useState(false);
  const handleChange = onSearchChange ?? ((v: string) => setInternalSearch(v));
  const value = search ?? internalSearch;
  const router = useRouter();

  const sp = useSearchParams();
  const { notify } = useToast();

  React.useEffect(() => {
    if (!loginToastShown && sp.get("login") === "success") {
      notify("Logowanie udane");

      const url = new URL(window.location.href);
      url.searchParams.delete("login");
      router.replace(url.pathname + url.search);

      setLoginToastShown(true);
    }
  }, [sp, router, notify, loginToastShown]);

  return (
    <header
      className={clsx(
        "flex flex-col justify-center items-start",
        "px-4 sm:px-6 lg:px-[clamp(1rem,3vw,2.5rem)]",
        "py-4 sm:py-6 lg:py-[clamp(1rem,3vh,2.5rem)]",
        "gap-4 sm:gap-6 lg:gap-[clamp(1rem,4vh,2.5rem)]",
        "w-full bg-[#1A1A1A]",
        className
      )}
    >
      <div className="mx-auto w-full max-w-[70rem] flex flex-col gap-4 sm:gap-6 lg:gap-[clamp(1rem,3vh,2rem)] pb-4 sm:pb-6 lg:pb-[clamp(1rem,3vh,2.5rem)]">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-[clamp(1rem,2vw,1.5rem)] w-full">
          <Link href="/" aria-label="NexusHub" className="flex items-center">
            <span className="text-[clamp(1.25rem,2vw,1.5rem)] font-semibold tracking-[-0.01em]">
              <span className="lg:hidden">
                <span className="text-[#EE701D]">N</span>
                <span className="text-white">H</span>
              </span>
              <span className="hidden lg:inline pl-4">
                <span className="text-[#EE701D]">Nexus</span>
                <span className="text-white">Hub</span>
              </span>
            </span>
          </Link>

          {!loggedIn ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <CartButton size="xxl" />
              <Button
                size="xl"
                variant="fill"
                className="w-full sm:w-auto"
                onClick={() => router.push("/auth/login")}
              >
                Sign in
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-[clamp(1rem,2vw,1.5rem)]">
              <CartButton size="xxl" />
              <Link
                href="/profile"
                aria-label="Open profile"
                className="flex items-center gap-2 rounded-full p-2"
              >
                <Avatar src={avatarUrl} size={45} />
              </Link>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav
          className="
    w-full max-w-[70rem]                     
    flex flex-wrap items-center justify-start
    gap-2 sm:gap-3
    h-auto sm:h-[1.625rem] mb-4 sm:mb-6 lg:mb-[clamp(1rem,4vh,2.5rem)]
  "
        >
          <NavLink label="Home" href="/" />
          <NavLink label="Products" href="/products" />
          <NavLink label="Contact" href="/contact" />
        </nav>

        <div className="h-[0.01rem] bg-[#1A1A1A]" />
      </div>
      <Separator className="w-full" />
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
        "px-0 bg-transparent hover:bg-transparent",
        "text-[1rem] leading-[1.625rem] transition-colors duration-200",
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

export function InputBarIcons() {
  return (
    <div className="flex items-center gap-[1.5rem] w-[4.5rem] h-[1.5rem]">
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
