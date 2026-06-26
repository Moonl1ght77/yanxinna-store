"use client";

import { useState } from "react";
import { HelpLayout } from "@/components/layout/help-layout";
import { Button } from "@/components/ui/button";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <HelpLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-4xl tracking-[0.04em] text-[#231f1b]">Contact Us</h1>
          <p className="mt-4 text-sm leading-7 text-[#6b635d]">
            We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <section className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl tracking-[0.04em] text-[#231f1b]">Get in Touch</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[#6b635d]">
              <div>
                <p className="font-medium text-[#231f1b]">Email</p>
                <a href="mailto:support@yanxinna.com" className="underline hover:text-[#231f1b]">
                  support@yanxinna.com
                </a>
              </div>
              <div>
                <p className="font-medium text-[#231f1b]">Phone</p>
                <p>+7 (495) 123-45-67</p>
              </div>
              <div>
                <p className="font-medium text-[#231f1b]">Hours</p>
                <p>Monday - Friday: 10:00 AM - 7:00 PM MSK</p>
              </div>
              <div>
                <p className="font-medium text-[#231f1b]">Social Media</p>
                <div className="mt-2 flex gap-4">
                  <a href="#" className="underline hover:text-[#231f1b]">Instagram</a>
                  <a href="#" className="underline hover:text-[#231f1b]">Telegram</a>
                  <a href="#" className="underline hover:text-[#231f1b]">VK</a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-[0.04em] text-[#231f1b]">Send a Message</h2>
            <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-borderSoft bg-white px-4 py-3 text-sm text-[#231f1b] outline-none focus:border-[#231f1b]"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-borderSoft bg-white px-4 py-3 text-sm text-[#231f1b] outline-none focus:border-[#231f1b]"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-borderSoft bg-white px-4 py-3 text-sm text-[#231f1b] outline-none focus:border-[#231f1b]"
                >
                  <option value="">Select a topic</option>
                  <option value="order">Order Inquiry</option>
                  <option value="returns">Returns & Exchanges</option>
                  <option value="product">Product Question</option>
                  <option value="shipping">Shipping</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8077]">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full border border-borderSoft bg-white px-4 py-3 text-sm text-[#231f1b] outline-none focus:border-[#231f1b]"
                />
              </div>
              <Button className="w-full">Send Message</Button>
            </form>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#231f1b]">Response Time</h2>
          <div className="text-sm leading-7 text-[#6b635d]">
            <p>
              We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
            </p>
          </div>
        </section>
      </div>
    </HelpLayout>
  );
}
