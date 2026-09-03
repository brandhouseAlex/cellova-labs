import { buildMetadata } from "@/lib/seo";
import { CartView } from "@/components/cart/cart-view";

export const metadata = buildMetadata({
  title: "Cart",
  description: "Review your Cellova Labs research order.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
          Order
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
          Cart
        </h1>
      </header>
      <div className="mt-10">
        <CartView />
      </div>
    </div>
  );
}
