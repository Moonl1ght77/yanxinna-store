"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone, X, Mail, MessageCircle } from "lucide-react";

export function ContactFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWechat, setShowWechat] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8">
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

      {/* Contact Panel */}
      {isOpen && (
        <div className="mb-4 w-[280px] rounded-lg border border-borderSoft bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:w-[300px]">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium uppercase tracking-[0.08em] text-[#2C2825]">Contact Us</p>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-6 w-6 items-center justify-center text-[#A89B8C] transition hover:text-[#2C2825]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* WeChat */}
            <button
              onClick={() => {
                setIsOpen(false);
                setShowWechat(true);
              }}
              className="group flex w-full items-center gap-3 rounded-md border border-borderSoft p-3 transition hover:border-[#07c160] hover:bg-[#f0fdf4]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#07c160]/10">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 fill-[#07c160]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05a6.127 6.127 0 0 1-.252-1.73c0-3.571 3.296-6.468 7.358-6.468.26 0 .514.017.764.04C16.834 4.758 13.062 2.188 8.69 2.188zm-2.81 4.19a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26zm5.62 0a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26z" />
                  <path d="M23.925 14.981c0-3.26-3.295-5.906-7.358-5.906-4.064 0-7.358 2.646-7.358 5.906 0 3.262 3.294 5.907 7.358 5.907.85 0 1.672-.12 2.44-.342a.682.682 0 0 1 .568.078l1.522.892a.262.262 0 0 0 .134.043c.128 0 .232-.105.232-.235a.26.26 0 0 0-.039-.167l-.312-1.186a.468.468 0 0 1 .17-.53c1.48-1.09 2.443-2.8 2.443-4.46zm-9.753-1.04a.95.95 0 1 1 0-1.899.95.95 0 0 1 0 1.9zm4.79 0a.95.95 0 1 1 0-1.899.95.95 0 0 1 0 1.9z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-[#2C2825]">WeChat</p>
                <p className="text-[11px] text-[#A89B8C]">Scan to add</p>
              </div>
            </button>

            {/* WhatsApp */}
            <a
              href="https://wa.me/13719947765"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-md border border-borderSoft p-3 transition hover:border-[#25d366] hover:bg-[#f0fdf4]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25d366]/10">
                <MessageCircle className="h-5 w-5 text-[#25d366]" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#2C2825]">WhatsApp</p>
                <p className="text-[11px] text-[#A89B8C]">Chat with us</p>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:13719947765@139.com"
              className="group flex items-center gap-3 rounded-md border border-borderSoft p-3 transition hover:border-[#5C4E43] hover:bg-[#F5F1ED]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5C4E43]/10">
                <Mail className="h-5 w-5 text-[#2C2825]" />
              </div>
              <div>
                <p className="text-xs font-medium text-[#2C2825]">Email</p>
                <p className="text-[11px] text-[#A89B8C]">13719947765@139.com</p>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 sm:h-16 sm:w-16 ${
          isOpen
            ? "bg-[#5C4E43] text-white rotate-45"
            : "bg-[#5C4E43] text-white hover:bg-[#4A3D34] hover:shadow-[0_6px_25px_rgba(0,0,0,0.2)]"
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Phone className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}
