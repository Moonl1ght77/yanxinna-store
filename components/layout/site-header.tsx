"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, ShoppingBag, X, Sun, Moon, Search } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useLocale } from "@/hooks/use-locale";
import { useTheme } from "@/providers/theme-provider";
import { LocaleRegionSwitcher } from "@/components/layout/locale-region-switcher";
import { SearchModal } from "@/components/ui/search-modal";

export function SiteHeader() {
  const { itemCount } = useCart();
  const { copy } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

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
    <header className="sticky top-0 z-30" style={{ backgroundColor: "var(--header-bg)", borderBottomColor: "var(--header-border)" }}>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <div className="grid w-full grid-cols-[auto,1fr,auto] items-center gap-4 px-4 py-4 md:px-8">
        {/* Hamburger button - mobile only */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center text-white md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" strokeWidth={1.7} />
        </button>

        <Link
          href="/"
          className="font-display text-[32px] leading-none tracking-[0.1em] text-white sm:text-[36px]"
        >
          YANXINNA
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center justify-center gap-8 text-[12px] font-medium uppercase tracking-[0.2em] text-white md:flex lg:gap-10 lg:text-[13px]"
        >
          {navigationItems.map((item) =>
            item.href.includes("category=shapewear") ? (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 transition-all duration-200 hover:text-white/80"
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.7} />
                </Link>
                <div className="pointer-events-none absolute left-1/2 top-full z-40 w-[240px] -translate-x-1/2 pt-4 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                  <div className="border border-borderSoft bg-card p-2 shadow-[0_18px_40px_rgba(35,31,27,0.08)]">
                    {shapewearDropdownItems.map((entry, index) => (
                      <Link
                        key={entry.label}
                        href={entry.href}
                        className={`block px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-fg transition hover:bg-surface ${
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
                className="transition-all duration-200 hover:text-white/80"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:h-11 sm:w-11"
            aria-label="Search"
          >
            <Search className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
          </button>
          <LocaleRegionSwitcher
            className="hidden text-white sm:inline-flex"
            selectClassName="rounded-full border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
          />
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:h-11 sm:w-11"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-[18px] w-[18px] sm:h-5 sm:w-5" /> : <Sun className="h-[18px] w-[18px] sm:h-5 sm:w-5" />}
          </button>
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:h-11 sm:w-11"
          >
            <ShoppingBag className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
            {itemCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-medium text-[#A89B8C]">
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
          <div className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-white dark:bg-[#1E1B18] mobile-menu-drawer">
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-borderSoft px-4 py-4">
              <Link
                href="/"
                className="font-display text-xl leading-none tracking-[0.08em] text-[#2C2825] dark:text-[#E8E2DA] sm:text-[26px]"
                onClick={() => setMobileMenuOpen(false)}
              >
                YANXINNA
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center text-[#2C2825] dark:text-[#E8E2DA]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" strokeWidth={1.7} />
              </button>
            </div>

            {/* Navigation items */}
            <nav className="overflow-y-auto px-4 pb-8 pt-2">
              {navigationItems.map((item) =>
                item.href.includes("category=shapewear") ? (
                  <div key={item.label} className="border-b border-borderSoft">
                    <button
                      onClick={() =>
                        setMobileExpandedItem(
                          mobileExpandedItem === item.label ? null : item.label
                        )
                      }
                      className="flex w-full items-center justify-between py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-[#2C2825] dark:text-[#E8E2DA] sm:py-4 sm:text-[13px]"
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
                            className="block py-2.5 text-[11px] uppercase tracking-[0.16em] text-[#5f5852] transition hover:text-[#2C2825] sm:text-[12px]"
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
                    className="block border-b border-borderSoft py-3.5 text-[12px] font-medium uppercase tracking-[0.18em] text-[#2C2825] transition hover:text-[#5f5852] sm:py-4 sm:text-[13px]"
                  >
                    {item.label}
                  </Link>
                )
              )}

              {/* Extra links */}
              <div className="mt-4 border-t border-borderSoft pt-4 sm:mt-6">
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-3 text-[12px] font-medium uppercase tracking-[0.18em] text-[#2C2825] sm:text-[13px]"
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
