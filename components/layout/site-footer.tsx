"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail, MessageCircle, X } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

export function SiteFooter() {
  const { copy } = useLocale();
  const [showWechat, setShowWechat] = useState(false);

  return (
    <footer className="border-t border-borderSoft bg-bg">
      {/* WeChat QR Modal */}
      {showWechat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowWechat(false)}>
          <div className="relative mx-4 w-[300px] rounded-lg bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowWechat(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center text-accent transition hover:text-fg"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-fg">Scan WeChat QR</p>
              <div className="relative mx-auto h-[250px] w-[250px]">
                <Image
                  src="/wechat-qr.jpg"
                  alt="WeChat QR Code"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-4 text-xs text-[#A89B8C]">Open WeChat and scan to add friend</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid w-full gap-8 px-4 py-10 sm:gap-10 sm:py-14 md:grid-cols-[1fr,1.1fr,1fr] md:px-8">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#8c837b] sm:text-[11px]">{copy.footerHelp}</p>
          <div className="mt-4 space-y-2.5 text-xs text-[#524b45] sm:mt-5 sm:space-y-3 sm:text-sm">
            <Link href="/pages/returns" className="block transition hover:text-[#2C2825]">
              {copy.footerReturns}
            </Link>
            <Link href="/track-order" className="block transition hover:text-[#2C2825]">
              {copy.footerTrackOrder}
            </Link>
            <Link href="/pages/size-guides" className="block transition hover:text-[#2C2825]">
              {copy.footerSizeGuide}
            </Link>
            <Link href="/pages/shipping" className="block transition hover:text-[#2C2825]">
              {copy.footerShipping}
            </Link>
            <Link href="/pages/faqs" className="block transition hover:text-[#2C2825]">
              {copy.footerFaq}
            </Link>
            <Link href="/pages/contact-us" className="block transition hover:text-[#2C2825]">
              {copy.footerContact}
            </Link>
          </div>
        </div>
        <div className="text-center">
          <p className="font-display text-xl tracking-[0.05em] text-[#2C2825] sm:text-[34px]">{copy.footerStayUpdated}</p>
          <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-[#6b645d] sm:mt-4 sm:text-sm sm:leading-7">
            {copy.footerStayUpdatedBody}
          </p>
          <form className="mx-auto mt-5 flex max-w-md items-stretch sm:mt-8">
            <input
              type="email"
              placeholder={copy.footerEmailPlaceholder}
              className="h-10 flex-1 border border-borderSoft px-3 text-xs text-[#2C2825] outline-none sm:h-12 sm:px-4 sm:text-sm"
            />
            <button
              type="submit"
              className="flex h-10 items-center justify-center border border-l-0 border-[#5C4E43] bg-[#5C4E43] px-4 text-white transition hover:bg-[#4A3D34] sm:h-12 sm:px-5"
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
            <Link href="/pages/about" className="block transition hover:text-[#2C2825]">
              {copy.footerAbout}
            </Link>
            <Link href="/pages/rewards" className="block transition hover:text-[#2C2825]">
              {copy.footerRewards}
            </Link>
            <Link href="/pages/gift-cards" className="block transition hover:text-[#2C2825]">
              {copy.footerGiftCards}
            </Link>
            <Link href="/pages/stores" className="block transition hover:text-[#2C2825]">
              {copy.footerStores}
            </Link>
            <Link href="/pages/partners" className="block transition hover:text-[#2C2825]">
              {copy.footerPartners}
            </Link>
            <Link href="/pages/careers" className="block transition hover:text-[#2C2825]">
              {copy.footerCareers}
            </Link>
            <Link href="/pages/journal" className="block transition hover:text-[#2C2825]">
              {copy.footerJournal}
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="border-t border-borderSoft bg-[#FDFBF8]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-8 sm:flex-row sm:justify-between sm:px-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#8c837b] sm:text-[11px]">{copy.footerContact}</p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {/* WeChat */}
            <button
              onClick={() => setShowWechat(true)}
              className="group flex items-center gap-2 text-xs text-[#524b45] transition hover:text-[#07c160] sm:text-sm"
              title="WeChat"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-current sm:h-6 sm:w-6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05a6.127 6.127 0 0 1-.252-1.73c0-3.571 3.296-6.468 7.358-6.468.26 0 .514.017.764.04C16.834 4.758 13.062 2.188 8.69 2.188zm-2.81 4.19a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26zm5.62 0a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26z" />
                <path d="M23.925 14.981c0-3.26-3.295-5.906-7.358-5.906-4.064 0-7.358 2.646-7.358 5.906 0 3.262 3.294 5.907 7.358 5.907.85 0 1.672-.12 2.44-.342a.682.682 0 0 1 .568.078l1.522.892a.262.262 0 0 0 .134.043c.128 0 .232-.105.232-.235a.26.26 0 0 0-.039-.167l-.312-1.186a.468.468 0 0 1 .17-.53c1.48-1.09 2.443-2.8 2.443-4.46zm-9.753-1.04a.95.95 0 1 1 0-1.899.95.95 0 0 1 0 1.9zm4.79 0a.95.95 0 1 1 0-1.899.95.95 0 0 1 0 1.9z" />
              </svg>
              <span className="hidden sm:inline">WeChat</span>
            </button>

            {/* WhatsApp */}
            <a
              href="https://wa.me/13719947765"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-xs text-[#524b45] transition hover:text-[#25d366] sm:text-sm"
              title="WhatsApp"
            >
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Email */}
            <a
              href="mailto:13719947765@139.com"
              className="group flex items-center gap-2 text-xs text-[#524b45] transition hover:text-[#2C2825] sm:text-sm"
              title="Email"
            >
              <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="hidden sm:inline">13719947765@139.com</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
