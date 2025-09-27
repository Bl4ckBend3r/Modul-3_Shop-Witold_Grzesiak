"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Breadcrumb from "@/ui/Breadcrumb";

export const dynamic = "force-dynamic";

type Order = {
  id: string;
  date: string;
  number: string;
  products: string[];
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function loadOrders() {
      if (status !== "authenticated") return;

      try {
        const res = await fetch("/api/orders/me");
        if (!res.ok) return;
        const data = await res.json();
        setOrders(
          data.map((o: any) => ({
            id: o.id,
            date: new Date(o.date).toLocaleString("pl-PL"),
            number: o.number,
            products: o.products,
          }))
        );
      } catch (err) {
        console.error("Błąd pobierania zamówień", err);
      }
    }
    loadOrders();
  }, [status]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  if (status === "loading") {
    return <p className="text-white">Ładowanie...</p>;
  }

  if (status !== "authenticated") {
    return null;
  }

  const user = session!.user;

  return (
    <>
       <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: user?.name ?? "Profil", href: `/profile` },
        ]}
      />
    </div>
      <main className="flex flex-col lg:flex-row gap-6 lg:gap-12 px-4 md:px-8 lg:px-10 py-6 md:py-10 max-w-[1440px] mx-auto">
  {/* Sidebar */}
  <aside className="w-full lg:w-[320px] h-fit bg-[#262626] border border-[#383B42] rounded-[6px] p-6 flex flex-col gap-6">
    <div className="flex items-center gap-6">
      <div className="w-[72px] h-[72px] rounded-full overflow-hidden bg-neutral-700">
        <img src={user?.image ?? "/placeholder-avatar.png"} alt="avatar" />
      </div>
      <div className="flex flex-col">
        <span className="text-[16px] font-medium text-[#FCFCFC]">
          {user?.name ?? "Anonymous"}
        </span>
        <span className="text-[14px] text-[#E7E7E7]">{user?.email}</span>
      </div>
    </div>
    <div className="h-px w-full bg-[#383B42]" />
    <button
      onClick={handleLogout}
      className="text-[16px] font-medium text-[#E7E7E7] text-left hover:text-[#F29145]"
    >
      Logout
    </button>
  </aside>

  {/* Content */}
  <section className="flex flex-col items-start gap-8 w-full lg:w-[992px]">
    {/* Header */}
    <div className="flex flex-col items-center gap-3 w-full max-w-[470px] mx-auto lg:mx-0">
      <h2 className="text-[18px] font-semibold text-[#F29145]">
        Transactions
      </h2>
      <div className="w-full border-b-2 border-[#F29145]" />
    </div>

    {/* Orders list */}
    <div className="flex flex-col gap-4 w-full">
      {orders.length === 0 && (
        <p className="text-[#E7E7E7]">Brak transakcji</p>
      )}

      {orders.map((o) => (
        <div
          key={o.id}
          className="flex flex-row items-start gap-4 p-4 bg-[#262626] border border-[#383B42] rounded-[6px] w-full"
        >
          {/* Ikona */}
          <div className="w-[50px] h-[26px] flex items-center justify-center rounded-sm shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={26}
              height={26}
              viewBox="0 0 24 24"
              fill="none"
              stroke={"#F29145"}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8h12l1 10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2l1-10z" />
              <path d="M9 8a3 3 0 0 1 6 0" />
            </svg>
          </div>

          {/* Treść */}
          <div className="flex flex-col gap-3 flex-1">
            <div className="text-[16px] leading-[26px] text-[#E7E7E7]">
              {o.date}
            </div>
            <div className="text-[18px] leading-[28px] font-medium text-[#FCFCFC]">
              Your order nr {o.number}
            </div>
            <ul className="list-disc pl-6 text-[16px] leading-[26px] text-[#E7E7E7]">
              {o.products.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </section>
</main>

    </>
  );
}
