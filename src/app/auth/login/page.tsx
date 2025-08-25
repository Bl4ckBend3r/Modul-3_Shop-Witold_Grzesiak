// src/app/auth/login/page.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import LoginCard from "@/ui/auth/LoginCard";
import { useRef } from "react";




export default function LoginPage() {
  return <LoginCard standalone />;
}

