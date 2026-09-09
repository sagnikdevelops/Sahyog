import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { StateProvider } from "@/lib/store/stateContext";
import { I18nProvider } from "@/lib/i18n";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { DemoModeFab } from "@/components/shared/DemoModeFab";
import { ScrollToTop } from "@/components/shared/ScrollToTop";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Sahyog - Dignity in Labour. Trust in Service. India's Cooperative Platform",
  description:
    "A cooperative-owned digital service marketplace connecting skilled workers of Labour Cooperative Federations and Societies with households and businesses.",
  icons: { icon: "/logo.png", shortcut: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-[#F9FAF7] text-[#1F2937]`}
        suppressHydrationWarning
      >
        <I18nProvider>
          <StateProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <DemoModeFab />
            <ScrollToTop />
            <Footer />
          </StateProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
