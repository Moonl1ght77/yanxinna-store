"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, MessageCircle, ArrowUp, HelpCircle, X } from "lucide-react";

export function ContactFab() {
  const [showWechat, setShowWechat] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const menuItems = [
    {
      label: "询问",
      icon: HelpCircle,
      href: "#contact",
      color: "text-[#5C4E43]",
    },
    {
      label: "电子邮件",
      icon: Mail,
      href: "mailto:13719947765@139.com",
      color: "text-[#5C4E43]",
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      href: "https://wa.me/13719947765",
      color: "text-[#25d366]",
    },
    {
      label: "微信",
      icon: "wechat",
      onClick: () => setShowWechat(true),
      color: "text-[#07c160]",
    },
    {
      label: "顶部",
      icon: ArrowUp,
      onClick: scrollToTop,
      color: "text-[#5C4E43]",
    },
  ];

  return (
    <div className="fixed right-0 top-1/2 z-50 -translate-y-1/2">
      {/* WeChat QR Modal */}
      {showWechat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowWechat(false)}>
          <div className="relative mx-4 w-[300px] rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowWechat(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center text-[#A89B8C] transition hover:text-[#2C2825]"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-[#2C2825]">Scan WeChat QR</p>
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

      {/* Floating Panel - Vertical Menu */}
      <div
        className="relative flex flex-col items-center"
        onMouseEnter={() => setShowPanel(true)}
        onMouseLeave={() => setShowPanel(false)}
      >
        {/* Menu Items - Vertical Stack */}
        <div
          className={`flex flex-col items-center transition-all duration-300 ${
            showPanel ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          {menuItems.map((item, index) => (
            <div key={item.label} className="mb-2">
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex h-14 w-14 flex-col items-center justify-center rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.15)] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] sm:h-16 sm:w-16"
                >
                  <item.icon className={`h-5 w-5 ${item.color} sm:h-6 sm:w-6`} />
                  <span className="mt-1 text-[9px] font-medium text-[#2C2825] sm:text-[10px]">{item.label}</span>
                </a>
              ) : (
                <button
                  onClick={item.onClick}
                  className="flex h-14 w-14 flex-col items-center justify-center rounded-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.15)] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] sm:h-16 sm:w-16"
                >
                  {item.icon === "wechat" ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 fill-[#07c160] sm:h-6 sm:w-6"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05a6.127 6.127 0 0 1-.252-1.73c0-3.571 3.296-6.468 7.358-6.468.26 0 .514.017.764.04C16.834 4.758 13.062 2.188 8.69 2.188zm-2.81 4.19a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26zm5.62 0a1.13 1.13 0 1 1 0 2.26 1.13 1.13 0 0 1 0-2.26z" />
                      <path d="M23.925 14.981c0-3.26-3.295-5.906-7.358-5.906-4.064 0-7.358 2.646-7.358 5.906 0 3.262 3.294 5.907 7.358 5.907.85 0 1.672-.12 2.44-.342a.682.682 0 0 1 .568.078l1.522.892a.262.262 0 0 0 .134.043c.128 0 .232-.105.232-.235a.26.26 0 0 0-.039-.167l-.312-1.186a.468.468 0 0 1 .17-.53c1.48-1.09 2.443-2.8 2.443-4.46zm-9.753-1.04a.95.95 0 1 1 0-1.899.95.95 0 0 1 0 1.9zm4.79 0a.95.95 0 1 1 0-1.899.95.95 0 0 1 0 1.9z" />
                    </svg>
                  ) : (
                    <item.icon className={`h-5 w-5 ${item.color} sm:h-6 sm:w-6`} />
                  )}
                  <span className="mt-1 text-[9px] font-medium text-[#2C2825] sm:text-[10px]">{item.label}</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setShowPanel(!showPanel)}
          className={`flex h-14 w-14 items-center justify-center rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 sm:h-16 sm:w-16 ${
            showPanel
              ? "bg-[#5C4E43] text-white"
              : "bg-[#5C4E43] text-white hover:bg-[#4A3D34] hover:shadow-[0_6px_25px_rgba(0,0,0,0.2)]"
          }`}
        >
          {showPanel ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </button>
      </div>
    </div>
  );
}
