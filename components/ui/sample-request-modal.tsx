"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

type SampleRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    name: string;
    productNumber: string;
    color: string;
    size: string;
  };
};

export function SampleRequestModal({
  isOpen,
  onClose,
  product
}: SampleRequestModalProps) {
  const { copy, locale } = useLocale();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    details: "",
    website: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.details,
          subject: "sample",
          source: product ? "product" : "contact",
          locale,
          website: formData.website,
          productName: product?.name ?? "",
          productNumber: product?.productNumber ?? "",
          productColor: product?.color ?? "",
          productSize: product?.size ?? ""
        })
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("sent");
      setFormData({ name: "", email: "", phone: "", details: "", website: "" });
    } catch {
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#A89B8C] transition hover:text-[#2C2825]"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-medium tracking-[0.02em] text-[#2C2825]">{copy.sampleFormTitle}</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs text-[#2C2825]">
              {copy.sampleFormName} <span className="text-[#A89B8C]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-[#e5e5e5] bg-[#f9f9f9] px-4 py-3 text-sm text-[#2C2825] outline-none transition focus:border-[#A89B8C]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs text-[#2C2825]">
              {copy.sampleFormEmail} <span className="text-[#A89B8C]">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-[#e5e5e5] bg-[#f9f9f9] px-4 py-3 text-sm text-[#2C2825] outline-none transition focus:border-[#A89B8C]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-xs text-[#2C2825]">
              {copy.sampleFormPhone} <span className="text-[#A89B8C]">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="+1 (201) 555-0123"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border border-[#e5e5e5] bg-[#f9f9f9] px-4 py-3 text-sm text-[#2C2825] outline-none transition focus:border-[#A89B8C]"
            />
          </div>

          {/* Details */}
          <div>
            <label className="mb-1.5 block text-xs text-[#2C2825]">
              {copy.sampleFormDetails} <span className="text-[#A89B8C]">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full resize-none border border-[#e5e5e5] bg-[#f9f9f9] px-4 py-3 text-sm text-[#2C2825] outline-none transition focus:border-[#A89B8C]"
            />
          </div>

          {/* 蜜罐：对用户隐藏，脚本才会填 */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="hidden"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-[#A89B8C] py-3.5 text-sm font-medium text-white transition hover:bg-[#4A3D34] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? copy.sampleFormSending : copy.sampleFormSubmit}
          </button>

          {status === "sent" && (
            <p role="status" className="text-sm text-[#5C4E43]">
              {copy.sampleFormSuccess}
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="text-sm text-[#B4453C]">
              {copy.sampleFormError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
