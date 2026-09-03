"use client";

import Link from "next/link";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { commerce } from "@/lib/commerce";
import type { CommerceOrder } from "@/lib/commerce/types";
import { useAuth } from "@/lib/auth/auth-store";
import { formatDate, formatMoney, formatOrderStatus } from "@/lib/utils";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { isAuthenticated, isReady } = useAuth();
  const [order, setOrder] = useState<CommerceOrder | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    commerce.getOrderById("mock_session", id).then((result) => {
      if (!cancelled) setOrder(result);
    });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, id]);

  if (!isReady || (isAuthenticated && order === undefined)) {
    return (
      <div className="py-24 text-center text-sm text-slate" role="status">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Sign in required
        </h1>
        <p className="mt-3 text-sm text-slate">
          Sign in to your research account to view this order.
        </p>
        <Link
          href="/account"
          className="mt-6 inline-block bg-ink px-8 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-brand-deep"
        >
          Go to Account
        </Link>
      </div>
    );
  }

  if (order === null || order === undefined) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Order not found
        </h1>
        <p className="mt-3 text-sm text-slate">
          This order does not exist or does not belong to your account.
        </p>
        <Link
          href="/account/orders"
          className="mt-6 inline-block border border-ink/20 px-8 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const confirmedOrder: CommerceOrder = order;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/account/orders"
        className="text-xs font-medium uppercase tracking-[0.16em] text-slate hover:text-brand"
      >
        ← Back to Orders
      </Link>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
            Order {confirmedOrder.orderNumber}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-ink">
            {formatDate(confirmedOrder.createdAt)}
          </h1>
        </div>
        <span className="inline-flex bg-brand-tint px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-brand-deep">
          {formatOrderStatus(confirmedOrder.status)}
        </span>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-line border border-line bg-paper">
          {confirmedOrder.items.map((item) => (
            <li key={item.id} className="flex items-center gap-5 p-5">
              <span className="relative block h-20 w-20 shrink-0 overflow-hidden border border-line bg-mist">
                {item.image ? (
                  <Image
                    src={item.image.url}
                    alt={item.image.altText}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : null}
              </span>
              <div className="flex-1">
                <p className="font-medium text-ink">{item.productTitle}</p>
                <p className="mt-0.5 text-sm text-slate">{item.variantTitle}</p>
                <p className="mt-0.5 text-xs text-silver">
                  Qty {item.quantity} × {formatMoney(item.price)}
                </p>
              </div>
              <p className="font-semibold text-ink">
                {formatMoney(item.lineTotal)}
              </p>
            </li>
          ))}
        </ul>

        <aside className="h-fit space-y-6">
          <div className="border border-line bg-mist p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              Summary
            </h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate">Subtotal</dt>
                <dd className="font-medium text-ink">
                  {formatMoney(confirmedOrder.subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate">Shipping</dt>
                <dd className="font-medium text-ink">
                  {formatMoney(confirmedOrder.shippingTotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate">Taxes</dt>
                <dd className="font-medium text-ink">
                  {formatMoney(confirmedOrder.taxTotal)}
                </dd>
              </div>
              {parseFloat(confirmedOrder.discountTotal.amount) > 0 ? (
                <div className="flex justify-between">
                  <dt className="text-slate">Discounts</dt>
                  <dd className="font-medium text-brand-deep">
                    −{formatMoney(confirmedOrder.discountTotal)}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between border-t border-line pt-2.5 text-base">
                <dt className="font-semibold text-ink">Total</dt>
                <dd className="font-semibold text-ink">
                  {formatMoney(confirmedOrder.total)}
                </dd>
              </div>
            </dl>
          </div>

          {confirmedOrder.shippingAddress ? (
            <div className="border border-line p-6">
              <h2 className="font-display text-lg font-semibold text-ink">
                Shipping Address
              </h2>
              <address className="mt-3 text-sm not-italic leading-relaxed text-slate">
                {confirmedOrder.shippingAddress.firstName}{" "}
                {confirmedOrder.shippingAddress.lastName}
                {confirmedOrder.shippingAddress.company ? (
                  <>
                    <br />
                    {confirmedOrder.shippingAddress.company}
                  </>
                ) : null}
                <br />
                {confirmedOrder.shippingAddress.address1}
                {confirmedOrder.shippingAddress.address2 ? (
                  <>
                    <br />
                    {confirmedOrder.shippingAddress.address2}
                  </>
                ) : null}
                <br />
                {confirmedOrder.shippingAddress.city},{" "}
                {confirmedOrder.shippingAddress.province}{" "}
                {confirmedOrder.shippingAddress.postalCode}
                <br />
                {confirmedOrder.shippingAddress.country}
              </address>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
