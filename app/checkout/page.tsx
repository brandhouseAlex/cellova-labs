import { buildMetadata } from "@/lib/seo";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata = buildMetadata({
  title: "Checkout",
  description: "Complete your Cellova Labs research order securely.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
          Secure Checkout
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
          Checkout
        </h1>
      </header>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </div>
  );
}
