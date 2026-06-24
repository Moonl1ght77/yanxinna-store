import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-borderSoft bg-white">
      <div className="grid w-full gap-10 px-4 py-14 md:grid-cols-[1fr,1.1fr,1fr] md:px-8">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8c837b]">Help</p>
          <div className="mt-5 space-y-3 text-sm text-[#524b45]">
            <Link href="/shop" className="block">
              Return Center
            </Link>
            <span className="block">Order Tracking</span>
            <span className="block">Size Guides</span>
            <span className="block">Shipping</span>
            <span className="block">FAQs</span>
            <span className="block">Contact Us</span>
          </div>
        </div>
        <div className="text-center">
          <p className="font-display text-[34px] tracking-[0.05em] text-[#231f1b]">Stay in the Know</p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#6b645d]">
            Be the first to discover new drops, fit updates, and elevated everyday essentials from AURELLE BODY.
          </p>
          <form className="mx-auto mt-8 flex max-w-md items-stretch">
            <input
              type="email"
              placeholder="your email"
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
            By submitting your email you agree to receive recurring marketing messages. View Terms and Privacy.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#8c837b]">More</p>
          <div className="mt-5 space-y-3 text-sm text-[#524b45]">
            <span className="block">About</span>
            <span className="block">Rewards</span>
            <span className="block">Gift Cards</span>
            <span className="block">Store Locator</span>
            <span className="block">Partners</span>
            <span className="block">Careers</span>
            <span className="block">Journal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
