import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/providers/cart-provider";
import { LocaleProvider } from "@/providers/locale-provider";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans"
});

const display = Oswald({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "YANXINNA",
  description: "Интернет-магазин корректирующего белья, бюстгальтеров и базового белья YANXINNA."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${sans.variable} ${display.variable}`}>
        <LocaleProvider>
          <CartProvider>
            <AnnouncementBar />
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
