"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { commerce } from "@/lib/commerce";
import type { CommerceOrder } from "@/lib/commerce/types";
import { useAuth } from "@/lib/auth/auth-store";
import { formatDate, formatMoney, formatOrderStatus } from "@/lib/utils";

export default function OrdersPage() {
  const { isAuthenticated, isReady } = useAuth();
  const [orders, setOrders] = useState<CommerceOrder[] | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    commerce.getOrders("mock_session").then((result) => {
      if (!cancelled) setOrders(result);
    });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  if (!isReady) {
    return (
      <div className="py-24 text-center text-sm text-slate" role="status">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Sign in required
        </h1>
        <p className="mt-3 text-sm text-slate">
          Sign in to your research account to view order history.
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
          Account
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
          Order History
        </h1>
      </header>

      {orders === null ? (
        <p className="mt-10 text-sm text-slate" role="status">
          Loading orders…
        </p>
      ) : orders.length === 0 ? (
        <div className="mt-10 border border-line bg-mist p-12 text-center">
          <p className="font-display text-xl font-semibold text-ink">
            No orders yet
          </p>
          <p className="mt-2 text-sm text-slate">
            Your completed research orders will appear here.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block bg-ink px-8 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-brand-deep"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="mt-10 overflow-x-auto border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">Your research orders</caption>
            <thead className="border-b border-line bg-mist text-xs uppercase tracking-[0.14em] text-slate">
              <tr>
                <th scope="col" className="px-5 py-3.5 font-medium">Order</th>
                <th scope="col" className="px-5 py-3.5 font-medium">Date</th>
                <th scope="col" className="px-5 py-3.5 font-medium">Status</th>
                <th scope="col" className="px-5 py-3.5 font-medium">Items</th>
                <th scope="col" className="px-5 py-3.5 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-mist/60">
                  <td className="px-5 py-4">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="font-medium text-brand underline-offset-2 hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-slate">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex bg-brand-tint px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-brand-deep">
                      {formatOrderStatus(order.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate">
                    {order.items.reduce((n, i) => n + i.quantity, 0)}
                  </td>
                  <td className="px-5 py-4 text-right font-medium text-ink">
                    {formatMoney(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
