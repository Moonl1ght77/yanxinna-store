"use client";

import { useState } from "react";
import { HelpLayout } from "@/components/layout/help-layout";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";

export default function ContactUsPage() {
  const { copy, locale } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
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
          name,
          email,
          message,
          subject: subject || "other",
          source: "contact",
          locale,
          website
        })
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("sent");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <HelpLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-4xl tracking-[0.04em] text-[#2C2825]">Contact Us</h1>
          <p className="mt-4 text-sm leading-7 text-[#8A7F73]">
            We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <section className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl tracking-[0.04em] text-[#2C2825]">Get in Touch</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[#8A7F73]">
              <div>
                <p className="font-medium text-[#2C2825]">Email</p>
                <a href="mailto:13719947765@139.com" className="underline hover:text-[#2C2825]">
                  13719947765@139.com
                </a>
              </div>
              <div>
                <p className="font-medium text-[#2C2825]">Phone</p>
                <p>+7 (495) 123-45-67</p>
              </div>
              <div>
                <p className="font-medium text-[#2C2825]">Hours</p>
                <p>Monday - Friday: 10:00 AM - 7:00 PM MSK</p>
              </div>
              <div>
                <p className="font-medium text-[#2C2825]">Social Media</p>
                <div className="mt-2 flex gap-4">
                  <a href="#" className="underline hover:text-[#2C2825]">Instagram</a>
                  <a href="#" className="underline hover:text-[#2C2825]">Telegram</a>
                  <a href="#" className="underline hover:text-[#2C2825]">VK</a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl tracking-[0.04em] text-[#2C2825]">Send a Message</h2>
            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#A89B8C]">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-borderSoft bg-white px-4 py-3 text-sm text-[#2C2825] outline-none focus:border-[#5C4E43]"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#A89B8C]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-borderSoft bg-white px-4 py-3 text-sm text-[#2C2825] outline-none focus:border-[#5C4E43]"
                />
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#A89B8C]">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-borderSoft bg-white px-4 py-3 text-sm text-[#2C2825] outline-none focus:border-[#5C4E43]"
                >
                  <option value="">Select a topic</option>
                  <option value="oem">OEM / ODM Inquiry</option>
                  <option value="product">Product Question</option>
                  <option value="sample">Sample Request</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#A89B8C]">
                  Message
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full border border-borderSoft bg-white px-4 py-3 text-sm text-[#2C2825] outline-none focus:border-[#5C4E43]"
                />
              </div>

              {/* 蜜罐：对用户隐藏，脚本才会填 */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="hidden"
              />

              <Button className="w-full" disabled={status === "sending"}>
                {status === "sending" ? copy.sampleFormSending : "Send Message"}
              </Button>

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
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-2xl tracking-[0.04em] text-[#2C2825]">Response Time</h2>
          <div className="text-sm leading-7 text-[#8A7F73]">
            <p>
              We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
            </p>
          </div>
        </section>
      </div>
    </HelpLayout>
  );
}
