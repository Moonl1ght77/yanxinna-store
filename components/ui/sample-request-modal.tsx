"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";

type SampleRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SampleRequestModal({ isOpen, onClose }: SampleRequestModalProps) {
  const { copy } = useLocale();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    details: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you! We will contact you soon.");
    onClose();
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
          className="absolute right-4 top-4 text-[#8a8077] transition hover:text-[#231f1b]"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-medium tracking-[0.02em] text-[#231f1b]">{copy.sampleFormTitle}</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs text-[#231f1b]">
              {copy.sampleFormName} <span className="text-[#3B82F6]">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-[#e5e5e5] bg-[#f9f9f9] px-4 py-3 text-sm text-[#231f1b] outline-none transition focus:border-[#3B82F6]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs text-[#231f1b]">
              {copy.sampleFormEmail} <span className="text-[#3B82F6]">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-[#e5e5e5] bg-[#f9f9f9] px-4 py-3 text-sm text-[#231f1b] outline-none transition focus:border-[#3B82F6]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-xs text-[#231f1b]">
              {copy.sampleFormPhone} <span className="text-[#3B82F6]">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="+1 (201) 555-0123"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full border border-[#e5e5e5] bg-[#f9f9f9] px-4 py-3 text-sm text-[#231f1b] outline-none transition focus:border-[#3B82F6]"
            />
          </div>

          {/* Details */}
          <div>
            <label className="mb-1.5 block text-xs text-[#231f1b]">
              {copy.sampleFormDetails} <span className="text-[#3B82F6]">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full resize-none border border-[#e5e5e5] bg-[#f9f9f9] px-4 py-3 text-sm text-[#231f1b] outline-none transition focus:border-[#3B82F6]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#3B82F6] py-3.5 text-sm font-medium text-white transition hover:bg-[#2563EB]"
          >
            {copy.sampleFormSubmit}
          </button>
        </form>
      </div>
    </div>
  );
}
