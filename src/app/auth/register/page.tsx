"use client";
import { useRouter } from "next/navigation";
import RegisterCard from "@/ui/auth/RegisterCard";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <RegisterCard
      standalone
      onSubmit={async (data) => {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const err = await res.json();
          throw err; 
        }

        router.push("/auth/success");
      }}
    />
  );
}
