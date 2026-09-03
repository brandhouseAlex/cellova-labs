"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/auth/cart-store";
import { useAuth } from "@/lib/auth/auth-store";
import { formatMoney } from "@/lib/utils";
import { Field, TextInput, Select } from "@/components/ui/primitives";
import { ResearchUseNotice } from "@/components/research/research-use-notice";
import {
  PaymentProvider,
  PaymentElement,
  PaymentStatusMessage,
  PaymentErrorMessage,
  usePayment,
} from "@/components/checkout/payment/payment-section";
import { payments } from "@/lib/payments";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY","DC",
];

const SHIPPING_METHODS = [
  { id: "standard", label: "Standard Ground", detail: "3–5 business days", price: 9 },
  { id: "express", label: "Express", detail: "1–2 business days", price: 24 },
  { id: "coldchain", label: "Cold-Chain Express", detail: "Temperature-controlled", price: 39 },
];

function CheckoutInner() {
  const router = useRouter();
  const { cart } = useCart();
  const { customer, isAuthenticated } = useAuth();
  const { setStatus, setError } = usePayment();

  const [acknowledged, setAcknowledged] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [discountCode, setDiscountCode] = useState("");

  const items = cart?.items ?? [];

  async function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setError(null);

    if (!acknowledged) {
      setFormError(
        "Please confirm the research-use acknowledgement before placing your order."
      );
      return;
    }

    const form = new FormData(e.currentTarget);
    const required = [
      "email",
      "firstName",
      "lastName",
      "address1",
      "city",
      "postalCode",
    ];
    for (const field of required) {
      if (!String(form.get(field) ?? "").trim()) {
        setFormError("Please complete all required fields.");
        return;
      }
    }

    setPlacing(true);
    setStatus("processing");
    try {
      // Mock payment session — replaced by Tagada Pay adapter at launch.
      const session = await payments.initialize({
        cartId: cart?.id ?? "unknown",
        idempotencyKey: `${cart?.id ?? "cart"}_${Date.now()}`,
        email: String(form.get("email")),
      });
      const confirmed = await payments.confirm(session.id);
      setStatus(confirmed.status);
      if (confirmed.status === "succeeded") {
        router.push("/account/orders?placed=1");
      }
    } catch {
      setStatus("failed");
      setError({
        code: "payment_failed",
        message: "Payment could not be completed in the demo environment.",
        retryable: true,
      });
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="border border-line bg-mist p-12 text-center">
        <p className="font-display text-2xl font-semibold text-ink">
          Your cart is empty
        </p>
        <p className="mt-3 text-sm text-slate">
          Add research materials to your cart before beginning checkout.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block bg-ink px-8 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-brand-deep"
        >
          Explore Research Catalog
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={placeOrder}
      className="grid gap-10 lg:grid-cols-[1fr_380px]"
      noValidate={false}
    >
      <div className="space-y-10">
        {/* Contact */}
        <section aria-labelledby="checkout-contact">
          <h2
            id="checkout-contact"
            className="font-display text-lg font-semibold text-ink"
          >
            Contact Information
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Email" htmlFor="email" className="sm:col-span-2">
              <TextInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={customer?.email ?? ""}
                placeholder="you@laboratory.com"
              />
            </Field>
            <Field label="First Name" htmlFor="firstName">
              <TextInput
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                required
                defaultValue={customer?.firstName ?? ""}
              />
            </Field>
            <Field label="Last Name" htmlFor="lastName">
              <TextInput
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                required
                defaultValue={customer?.lastName ?? ""}
              />
            </Field>
          </div>
          {!isAuthenticated ? (
            <p className="mt-3 text-xs text-silver">
              Checking out as a guest.{" "}
              <Link href="/account" className="text-brand underline-offset-2 hover:underline">
                Sign in
              </Link>{" "}
              to attach this order to your research account.
            </p>
          ) : null}
        </section>

        {/* Shipping address */}
        <section aria-labelledby="checkout-shipping">
          <h2
            id="checkout-shipping"
            className="font-display text-lg font-semibold text-ink"
          >
            Shipping Address
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Company / Laboratory (optional)" htmlFor="company" className="sm:col-span-2">
              <TextInput id="company" name="company" autoComplete="organization" />
            </Field>
            <Field label="Address" htmlFor="address1" className="sm:col-span-2">
              <TextInput
                id="address1"
                name="address1"
                autoComplete="address-line1"
                required
              />
            </Field>
            <Field label="Apartment, suite, etc. (optional)" htmlFor="address2" className="sm:col-span-2">
              <TextInput id="address2" name="address2" autoComplete="address-line2" />
            </Field>
            <Field label="City" htmlFor="city">
              <TextInput id="city" name="city" autoComplete="address-level2" required />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="State" htmlFor="province">
                <Select id="province" name="province" autoComplete="address-level1" defaultValue="TX">
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="ZIP Code" htmlFor="postalCode">
                <TextInput
                  id="postalCode"
                  name="postalCode"
                  autoComplete="postal-code"
                  required
                />
              </Field>
            </div>
          </div>
        </section>

        {/* Billing */}
        <section aria-labelledby="checkout-billing">
          <h2
            id="checkout-billing"
            className="font-display text-lg font-semibold text-ink"
          >
            Billing Address
          </h2>
          <label className="mt-4 flex items-center gap-3 text-sm text-slate">
            <input
              type="checkbox"
              name="billingSame"
              defaultChecked
              className="h-4 w-4 accent-brand"
            />
            Same as shipping address
          </label>
        </section>

        {/* Shipping method */}
        <section aria-labelledby="checkout-shipping-method">
          <h2
            id="checkout-shipping-method"
            className="font-display text-lg font-semibold text-ink"
          >
            Shipping Method
          </h2>
          <fieldset className="mt-4 space-y-3">
            <legend className="sr-only">Choose a shipping method</legend>
            {SHIPPING_METHODS.map((method) => (
              <label
                key={method.id}
                className="flex cursor-pointer items-center justify-between gap-4 border border-line bg-paper px-5 py-4 transition-colors has-checked:border-brand has-checked:bg-brand-tint/40"
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value={method.id}
                    checked={shippingMethod === method.id}
                    onChange={() => setShippingMethod(method.id)}
                    className="h-4 w-4 accent-brand"
                  />
                  <span>
                    <span className="block text-sm font-medium text-ink">
                      {method.label}
                    </span>
                    <span className="block text-xs text-slate">
                      {method.detail}
                    </span>
                  </span>
                </span>
                <span className="text-sm font-semibold text-ink">
                  ${method.price.toFixed(2)}
                </span>
              </label>
            ))}
          </fieldset>
        </section>

        {/* Payment */}
        <section aria-labelledby="checkout-payment">
          <h2
            id="checkout-payment"
            className="font-display text-lg font-semibold text-ink"
          >
            Payment
          </h2>
          <div className="mt-4">
            <PaymentElement />
            <PaymentStatusMessage />
            <PaymentErrorMessage />
          </div>
        </section>

        {/* Acknowledgement + place order */}
        <section aria-labelledby="checkout-confirm">
          <ResearchUseNotice variant="prominent" />
          <label
            htmlFor="research-ack"
            className="mt-4 flex cursor-pointer items-start gap-3"
          >
            <input
              id="research-ack"
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-brand"
            />
            <span className="text-xs leading-relaxed text-slate">
              I confirm that I am at least 21 years of age and that all
              products in this order are intended strictly for laboratory
              research use and are not for human or animal consumption.
            </span>
          </label>

          {formError ? (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {formError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={placing || !acknowledged}
            className="mt-6 w-full bg-ink px-8 py-4 text-sm font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            {placing ? "Placing Order…" : "Place Order"}
          </button>
        </section>
      </div>

      {/* Order summary */}
      <aside className="h-fit border border-line bg-mist p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-lg font-semibold text-ink">
          Order Summary
        </h2>
        <ul className="mt-5 space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4">
              <span className="relative block h-14 w-14 shrink-0 overflow-hidden border border-line bg-paper">
                {item.image ? (
                  <Image
                    src={item.image.url}
                    alt={item.image.altText}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : null}
                <span className="absolute -right-0 -top-0 flex h-5 min-w-5 items-center justify-center bg-ink px-1 text-[10px] font-semibold text-paper">
                  {item.quantity}
                </span>
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium text-ink">
                  {item.productTitle}
                </span>
                <span className="block text-xs text-slate">
                  {item.variantTitle}
                </span>
              </span>
              <span className="text-sm font-medium text-ink">
                {formatMoney(item.lineTotal)}
              </span>
            </li>
          ))}
        </ul>

        {/* Discount code */}
        <div className="mt-5 border-t border-line pt-5">
          <label
            htmlFor="discount"
            className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-slate"
          >
            Discount Code
          </label>
          <div className="flex">
            <input
              id="discount"
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Enter code"
              className="w-full border border-line bg-paper px-4 py-2.5 text-sm focus:border-brand focus:outline-none"
            />
            <button
              type="button"
              className="shrink-0 border border-l-0 border-line bg-ink px-4 text-xs font-medium uppercase tracking-[0.12em] text-paper transition-colors hover:bg-brand-deep"
              onClick={() => {
                /* Discounts are validated by the commerce backend once connected. */
              }}
            >
              Apply
            </button>
          </div>
          <p className="mt-2 text-xs text-silver">
            Discounts are validated and applied by the commerce backend.
          </p>
        </div>

        <dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate">Subtotal</dt>
            <dd className="font-medium text-ink">
              {formatMoney(cart?.subtotal)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate">Shipping</dt>
            <dd className="font-medium text-ink">
              {formatMoney(cart?.estimatedShipping)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate">Taxes</dt>
            <dd className="font-medium text-ink">
              {formatMoney(cart?.estimatedTaxes)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <dt className="font-semibold text-ink">Total</dt>
            <dd className="font-semibold text-ink">
              {formatMoney(cart?.total)}
            </dd>
          </div>
        </dl>
      </aside>
    </form>
  );
}

export function CheckoutForm() {
  return (
    <PaymentProvider>
      <CheckoutInner />
    </PaymentProvider>
  );
}
