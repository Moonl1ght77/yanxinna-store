"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Product content request failed", error.digest ?? error.name);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-8">
      <div className="border border-borderSoft bg-white px-6 py-12">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#A89B8C]">
          Content unavailable
        </p>
        <h1 className="mt-4 font-display text-3xl tracking-[0.04em] text-[#2C2825]">
          We could not load the product information
        </h1>
        <p className="mt-4 text-sm leading-7 text-[#8A7F73]">
          Please try again. If the problem continues, contact YANXINNA.
        </p>
        <div className="mt-8 flex justify-center">
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </div>
  );
}
