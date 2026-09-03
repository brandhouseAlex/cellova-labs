"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-store";

/** Account dashboard shown to authenticated research customers. */
export function AccountDashboard() {
  const { customer, logout } = useAuth();

  if (!customer) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="border border-line bg-paper p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Profile
        </h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-silver">
              Name
            </dt>
            <dd className="mt-1 text-ink">
              {customer.firstName} {customer.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-silver">
              Email
            </dt>
            <dd className="mt-1 text-ink">{customer.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-silver">
              Account Type
            </dt>
            <dd className="mt-1 text-ink">Research Account</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => logout()}
          className="mt-6 border border-ink/20 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:border-ink"
        >
          Sign Out
        </button>
      </div>

      <Link
        href="/account/orders"
        className="group border border-line bg-paper p-6 transition-shadow hover:shadow-[0_12px_40px_-16px_rgba(27,31,28,0.25)]"
      >
        <h2 className="font-display text-lg font-semibold text-ink group-hover:text-brand">
          Order History
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate">
          Review past and in-progress research orders, fulfillment status,
          and batch documentation.
        </p>
        <span className="mt-4 inline-block text-xs font-medium uppercase tracking-[0.16em] text-brand">
          View Orders →
        </span>
      </Link>

      <Link
        href="/products"
        className="group border border-line bg-paper p-6 transition-shadow hover:shadow-[0_12px_40px_-16px_rgba(27,31,28,0.25)]"
      >
        <h2 className="font-display text-lg font-semibold text-ink group-hover:text-brand">
          Research Catalog
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate">
          Browse the full catalog of verified research peptides, blends, and
          laboratory essentials.
        </p>
        <span className="mt-4 inline-block text-xs font-medium uppercase tracking-[0.16em] text-brand">
          Browse Catalog →
        </span>
      </Link>
    </div>
  );
}
