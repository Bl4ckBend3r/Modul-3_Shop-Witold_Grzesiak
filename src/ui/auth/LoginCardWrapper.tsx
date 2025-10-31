"use client";
import { Suspense } from "react";
import LoginCardInner from "./LoginCardInner";

export default function LoginCardWrapper(props: any) {
  return (
    <Suspense fallback={<p className="text-white">Ładowanie...</p>}>
      <LoginCardInner {...props} />
    </Suspense>
  );
}
