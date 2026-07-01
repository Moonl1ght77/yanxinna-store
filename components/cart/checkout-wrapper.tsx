"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CheckoutPageClient } from "./checkout-page-client";

export function CheckoutWrapper() {
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  if (!paypalClientId) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="border border-borderSoft bg-white p-10 text-center">
          <p className="font-display text-3xl tracking-[0.04em] text-[#2C2825]">PayPal Not Configured</p>
          <p className="mt-3 text-sm leading-7 text-[#8A7F73]">
            Please add your PayPal Client ID to .env.local file to enable payments.
          </p>
          <p className="mt-2 text-xs text-[#A89B8C]">
            NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id_here
          </p>
        </div>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: "USD",
        intent: "capture"
      }}
    >
      <CheckoutPageClient />
    </PayPalScriptProvider>
  );
}
