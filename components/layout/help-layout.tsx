"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";

type HelpLayoutProps = {
  children: React.ReactNode;
};

const helpLinks = [
  { key: "footerReturns", href: "/pages/returns" },
  { key: "footerTrackOrder", href: "/track-order" },
  { key: "footerSizeGuide", href: "/pages/size-guides" },
  { key: "footerShipping", href: "/pages/shipping" },
  { key: "footerFaq", href: "/pages/faqs" },
  { key: "footerContact", href: "/pages/contact-us" }
];

export function HelpLayout({ children }: HelpLayoutProps) {
  const pathname = usePathname();
  const { copy } = useLocale();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">
        <Link href="/">{copy.breadcrumbHome}</Link> / {copy.footerHelp}
      </div>

      <div className="grid gap-10 md:grid-cols-[240px,1fr]">
        {/* Sidebar */}
        <nav className="space-y-1">
          {helpLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 text-sm transition ${
                  isActive
                    ? "font-medium text-[#231f1b]"
                    : "text-[#6b635d] hover:text-[#231f1b]"
                }`}
              >
                {copy[link.key as keyof typeof copy]}
              </Link>
            );
          })}
        </nav>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
