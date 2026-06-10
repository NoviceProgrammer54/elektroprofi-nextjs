import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { SiteBackground } from "@/components/SiteBackground";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ELEKTROPROFI — Сообщество электромонтажников Казахстана",
  description:
    "Профессиональное сообщество электромонтажников Казахстана. Найдите опытного электрика, присоединитесь к профессиональному сообществу, изучите базу знаний.",
  keywords: ["электрик", "электромонтаж", "Казахстан", "Алматы", "Астана", "ELEKTROPROFI"],
  openGraph: {
    title: "ELEKTROPROFI — Сообщество электромонтажников Казахстана",
    description: "Профессиональное сообщество электромонтажников Казахстана.",
    type: "website",
    locale: "ru_KZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${oswald.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <SiteBackground />
        <Suspense fallback={null}>
          <Header />
        </Suspense>
        <main id="main" className="flex-1">
          <div className="mx-auto max-w-[1240px] px-6 py-10">
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </div>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
        <ChatWidget />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "var(--color-depth-3)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-strong)",
            },
          }}
        />
      </body>
    </html>
  );
}
