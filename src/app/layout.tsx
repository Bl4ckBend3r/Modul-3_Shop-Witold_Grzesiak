import type { Metadata } from "next";
import "./globals.css";
import Header from "@/ui/Header";
import Footer from "@/ui/Footer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NexusHub",
  description: "Sklep internetowy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-50`}>
        <Header  />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
