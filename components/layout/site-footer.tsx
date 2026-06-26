"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

export function SiteFooter() {
  const { copy } = useLocale();

  return (
    <footer className="border-t border-borderSoft bg-white">
      <div className="grid w-full gap-8 px-4 py-10 sm:gap-10 sm:py-14 md:grid-cols-[1fr,1.1fr,1fr] md:px-8">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#8c837b] sm:text-[11px]">{copy.footerHelp}</p>
          <div className="mt-4 space-y-2.5 text-xs text-[#524b45] sm:mt-5 sm:space-y-3 sm:text-sm">
            <Link href="/pages/returns" className="block transition hover:text-[#231f1b]">
              {copy.footerReturns}
            </Link>
            <Link href="/track-order" className="block transition hover:text-[#231f1b]">
              {copy.footerTrackOrder}
            </Link>
            <Link href="/pages/size-guides" className="block transition hover:text-[#231f1b]">
              {copy.footerSizeGuide}
            </Link>
            <Link href="/pages/shipping" className="block transition hover:text-[#231f1b]">
              {copy.footerShipping}
            </Link>
            <Link href="/pages/faqs" className="block transition hover:text-[#231f1b]">
              {copy.footerFaq}
            </Link>
            <Link href="/pages/contact-us" className="block transition hover:text-[#231f1b]">
              {copy.footerContact}
            </Link>
          </div>
        </div>
        <div className="text-center">
          <p className="font-display text-xl tracking-[0.05em] text-[#231f1b] sm:text-[34px]">{copy.footerStayUpdated}</p>
          <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-[#6b645d] sm:mt-4 sm:text-sm sm:leading-7">
            {copy.footerStayUpdatedBody}
          </p>
          <form className="mx-auto mt-5 flex max-w-md items-stretch sm:mt-8">
            <input
              type="email"
              placeholder={copy.footerEmailPlaceholder}
              className="h-10 flex-1 border border-borderSoft px-3 text-xs text-[#231f1b] outline-none sm:h-12 sm:px-4 sm:text-sm"
            />
            <button
              type="submit"
              className="flex h-10 items-center justify-center border border-l-0 border-[#231f1b] bg-[#231f1b] px-4 text-white transition hover:bg-[#342f2a] sm:h-12 sm:px-5"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <p className="mx-auto mt-4 max-w-lg text-[10px] leading-5 text-[#8b837b] sm:mt-5 sm:text-xs sm:leading-6">
            {copy.footerLegalNotice}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#8c837b] sm:text-[11px]">{copy.footerMore}</p>
          <div className="mt-4 space-y-2.5 text-xs text-[#524b45] sm:mt-5 sm:space-y-3 sm:text-sm">
            <Link href="/pages/about" className="block transition hover:text-[#231f1b]">
              {copy.footerAbout}
            </Link>
            <Link href="/pages/rewards" className="block transition hover:text-[#231f1b]">
              {copy.footerRewards}
            </Link>
            <Link href="/pages/gift-cards" className="block transition hover:text-[#231f1b]">
              {copy.footerGiftCards}
            </Link>
            <Link href="/pages/stores" className="block transition hover:text-[#231f1b]">
              {copy.footerStores}
            </Link>
            <Link href="/pages/partners" className="block transition hover:text-[#231f1b]">
              {copy.footerPartners}
            </Link>
            <Link href="/pages/careers" className="block transition hover:text-[#231f1b]">
              {copy.footerCareers}
            </Link>
            <Link href="/pages/journal" className="block transition hover:text-[#231f1b]">
              {copy.footerJournal}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
