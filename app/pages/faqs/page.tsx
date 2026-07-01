"use client";

import { useState } from "react";
import { HelpLayout } from "@/components/layout/help-layout";

const faqs = [
  {
    question: "What is shapewear?",
    answer: "Shapewear is undergarments designed to temporarily smooth and shape your body. Our pieces provide gentle compression to enhance your natural silhouette while remaining comfortable for all-day wear."
  },
  {
    question: "How do I choose the right size?",
    answer: "We recommend measuring your bust, waist, and hips and comparing them to our size chart. If you're between sizes, size up for a more comfortable fit. Our shapewear is designed to feel snug but not restrictive."
  },
  {
    question: "Can I wear shapewear every day?",
    answer: "Yes! Our shapewear is designed for everyday comfort. We use breathable, stretchy fabrics that move with your body. However, we recommend giving your body breaks and not wearing shapewear for more than 8-10 hours at a time."
  },
  {
    question: "How do I care for my shapewear?",
    answer: "Hand wash in cold water with mild detergent. Lay flat to dry. Avoid bleach, fabric softeners, and machine drying to maintain the elasticity and shape of your pieces."
  },
  {
    question: "What's your return policy?",
    answer: "We accept returns within 30 days of delivery. Items must be in original condition with tags attached. Returns are free for orders within Russia. See our full returns policy for details."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping within Russia takes 3-5 business days (free over 12,000 ₽). Express shipping is available for 1-2 day delivery. International shipping takes 7-14 business days."
  },
  {
    question: "Do you offer exchanges?",
    answer: "Yes! We offer free exchanges within 30 days. Simply initiate a return and place a new order for your preferred size."
  },
  {
    question: "Are your products sustainable?",
    answer: "We're committed to sustainability. Our fabrics are sourced from certified suppliers, and we're working towards using 100% recycled packaging by 2025."
  }
];

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <HelpLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-4xl tracking-[0.04em] text-[#2C2825]">FAQ</h1>
          <p className="mt-4 text-sm leading-7 text-[#8A7F73]">
            Find answers to commonly asked questions.
          </p>
        </div>

        <section className="divide-y divide-borderSoft border border-borderSoft">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-sm font-medium text-[#2C2825]">{faq.question}</span>
                <span className="ml-4 shrink-0 text-[#A89B8C]">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-sm leading-7 text-[#8A7F73]">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </section>

        <section className="border-t border-borderSoft pt-8">
          <p className="text-sm leading-7 text-[#8A7F73]">
            <strong className="text-[#2C2825]">Still have questions?</strong>{" "}
            Contact our support team at{" "}
            <a href="mailto:13719947765@139.com" className="underline hover:text-[#2C2825]">
              13719947765@139.com
            </a>
          </p>
        </section>
      </div>
    </HelpLayout>
  );
}
