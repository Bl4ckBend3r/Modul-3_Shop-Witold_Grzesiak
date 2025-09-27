import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/ui/Header";
import Footer from "@/ui/Footer";
import { Inter } from "next/font/google";
import Providers from "./providers"; 

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NexusHub",
  description: "Sklep internetowy",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className="h-full w-full bg-[#222327] overflow-x-hidden">
      <head />
      <body
        className={`${inter.variable} min-h-screen w-full bg-[#222327] text-white antialiased`}
      >
        <Providers>
          <div className="min-h-screen w-full flex flex-col">
            <header className="w-full">
              <Header />
            </header>

            <main className="flex-1 w-full flex justify-center bg-[#1A1A1A]">
              <div className="w-full max-w-[2440px] px-4">{children}</div>
            </main>

            <footer className="w-full">
              <Footer />
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
