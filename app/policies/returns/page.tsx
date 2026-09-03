import { buildMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/layout/policy-page";

export const metadata = buildMetadata({
  title: "Returns Policy",
  description:
    "Cellova Labs returns and replacement policy for research materials.",
  path: "/policies/returns",
});

export default function ReturnsPolicyPage() {
  return (
    <PolicyPage title="Returns Policy" updated="August 2026">
      <section>
        <h2>Research Materials</h2>
        <p>
          Because of the nature of research materials, opened or used
          products cannot be returned. Unopened materials in their original
          sealed packaging may be eligible for return within 30 days of
          delivery, subject to inspection.
        </p>
      </section>
      <section>
        <h2>Damaged or Incorrect Orders</h2>
        <p>
          If your order arrives damaged, incorrect, or incomplete, contact us
          through the Contact page within 7 days of delivery with your order
          number and photographs of the issue. Verified issues will be
          resolved by replacement or refund.
        </p>
      </section>
      <section>
        <h2>Refunds</h2>
        <p>
          Approved refunds are issued to the original payment method through
          our payment processor. Processing times depend on the payment
          provider and your financial institution.
        </p>
      </section>
      <section>
        <h2>How to Start a Return</h2>
        <p>
          Submit a request through the Contact page with your order number
          and the reason for the return. Do not ship materials back before
          receiving return instructions.
          {/* EDIT: confirm final returns terms with counsel before launch. */}
        </p>
      </section>
    </PolicyPage>
  );
}
