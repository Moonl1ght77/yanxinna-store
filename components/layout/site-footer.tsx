"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

export function SiteFooter() {
  const { copy } = useLocale();

  return (
    <footer className="border-t border-borderSoft bg-white">
      <div className="grid w-full gap-10 px-4 py-14 md:grid-cols-[1fr,1.1fr,1fr] md:px-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8c837b]">{copy.footerHelp}</p>
          <div className="mt-5 space-y-3 text-sm text-[#524b45]">
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
          <p className="font-display text-[34px] tracking-[0.05em] text-[#231f1b]">{copy.footerStayUpdated}</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#6b645d]">
            {copy.footerStayUpdatedBody}
          </p>
          <form className="mx-auto mt-8 flex max-w-md items-stretch">
            <input
              type="email"
              placeholder={copy.footerEmailPlaceholder}
              className="h-12 flex-1 border border-borderSoft px-4 text-sm text-[#231f1b] outline-none"
            />
            <button
              type="submit"
              className="flex h-12 items-center justify-center border border-l-0 border-[#231f1b] bg-[#231f1b] px-5 text-white transition hover:bg-[#342f2a]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          <p className="mx-auto mt-5 max-w-lg text-xs leading-6 text-[#8b837b]">
            {copy.footerLegalNotice}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8c837b]">{copy.footerMore}</p>
          <div className="mt-5 space-y-3 text-sm text-[#524b45]">
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
