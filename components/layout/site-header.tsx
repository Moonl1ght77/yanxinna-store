"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useLocale } from "@/hooks/use-locale";
import { LocaleRegionSwitcher } from "@/components/layout/locale-region-switcher";

export function SiteHeader() {
  const { itemCount } = useCart();
  const { copy } = useLocale();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);

  const navigationItems = [
    { label: copy.navShapewear, href: "/shop?category=shapewear" },
    { label: copy.navUnderwear, href: "/shop?category=underwear" },
    { label: copy.navBras, href: "/shop?category=bras" },
    { label: copy.navNew, href: "/shop?sort=new" },
    { label: copy.navBestsellers, href: "/shop?sort=best" }
  ];

  const shapewearDropdownItems = [
    { label: copy.navAllShapewear, href: "/shop?category=shapewear" },
    { label: copy.navBodysuits, href: "/shop?category=shapewear&subcategory=bodysuits" },
    { label: copy.navTops, href: "/shop?category=shapewear&subcategory=tops" },
    { label: copy.navBottoms, href: "/shop?category=shapewear&subcategory=bottoms" }
  ];

  return (
    <header
      className={`z-30 ${
        isHome
          ? "absolute inset-x-0 top-[43px]"
          : "sticky top-0 border-b border-borderSoft bg-white/95 backdrop-blur"
      }`}
    >
      <div className="grid w-full grid-cols-[auto,1fr,auto] items-center gap-4 px-4 py-4 md:px-8">
        {/* Hamburger button - mobile only */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`flex h-10 w-10 items-center justify-center md:hidden ${
            isHome ? "text-[#231f1b]" : "text-[#231f1b]"
          }`}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" strokeWidth={1.7} />
        </button>

        <Link
          href="/"
          className={`font-display text-[30px] leading-none tracking-[0.08em] ${
            isHome ? "text-[#231f1b]" : "text-[#231f1b]"
          }`}
        >
          YANXINNA
        </Link>

        {/* Desktop nav */}
        <nav
          className={`hidden items-center justify-center gap-8 text-[11px] font-medium uppercase tracking-[0.22em] md:flex ${
            isHome ? "text-[#231f1b]" : "text-[#5f5852]"
          }`}
        >
          {navigationItems.map((item) =>
            item.href.includes("category=shapewear") ? (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 transition-all duration-200 hover:text-black ${
                    isHome ? "" : ""
                  }`}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.7} />
                </Link>
                <div className="pointer-events-none absolute left-1/2 top-full z-40 w-[240px] -translate-x-1/2 pt-4 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                  <div className="border border-borderSoft bg-white p-2 shadow-[0_18px_40px_rgba(35,31,27,0.08)]">
                    {shapewearDropdownItems.map((entry, index) => (
                      <Link
                        key={entry.label}
                        href={entry.href}
                        className={`block px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-[#231f1b] transition hover:bg-[#f7f6f4] hover:text-black ${
                          index < shapewearDropdownItems.length - 1 ? "border-b border-borderSoft" : ""
                        }`}
                      >
                        {entry.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="transition-all duration-200 hover:text-black"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <LocaleRegionSwitcher
            className={isHome ? "text-[#231f1b]" : undefined}
            selectClassName={isHome ? "border-black/15 bg-white/70 text-[#231f1b]" : undefined}
          />
          <Link
            href="/cart"
            className={`relative rounded-none p-3 ${
              isHome ? "border border-black/15 bg-white/70 text-[#231f1b]" : "border border-borderSoft text-[#231f1b]"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 bg-[#231f1b] px-1.5 py-0.5 text-[10px] text-white">
                {itemCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 mobile-menu-backdrop"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute inset-y-0 left-0 w-full max-w-sm bg-white mobile-menu-drawer">
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-borderSoft px-4 py-4">
              <Link
                href="/"
                className="font-display text-[26px] leading-none tracking-[0.08em] text-[#231f1b]"
                onClick={() => setMobileMenuOpen(false)}
              >
                YANXINNA
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center text-[#231f1b]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" strokeWidth={1.7} />
              </button>
            </div>

            {/* Navigation items */}
            <nav className="overflow-y-auto px-4 pb-8 pt-4">
              {navigationItems.map((item) =>
                item.href.includes("category=shapewear") ? (
                  <div key={item.label} className="border-b border-borderSoft">
                    <button
                      onClick={() =>
                        setMobileExpandedItem(
                          mobileExpandedItem === item.label ? null : item.label
                        )
                      }
                      className="flex w-full items-center justify-between py-4 text-[13px] font-medium uppercase tracking-[0.18em] text-[#231f1b]"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          mobileExpandedItem === item.label ? "rotate-180" : ""
                        }`}
                        strokeWidth={1.7}
                      />
                    </button>
                    {mobileExpandedItem === item.label && (
                      <div className="pb-3 pl-4">
                        {shapewearDropdownItems.map((entry) => (
                          <Link
                            key={entry.label}
                            href={entry.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2.5 text-[12px] uppercase tracking-[0.16em] text-[#5f5852] transition hover:text-[#231f1b]"
                          >
                            {entry.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block border-b border-borderSoft py-4 text-[13px] font-medium uppercase tracking-[0.18em] text-[#231f1b] transition hover:text-[#5f5852]"
                  >
                    {item.label}
                  </Link>
                )
              )}

              {/* Extra links */}
              <div className="mt-6 border-t border-borderSoft pt-4">
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-3 text-[13px] font-medium uppercase tracking-[0.18em] text-[#231f1b]"
                >
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.7} />
                  {copy.cartTitle} {itemCount > 0 ? `(${itemCount})` : ""}
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
