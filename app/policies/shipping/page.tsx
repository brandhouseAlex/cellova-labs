import { buildMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/layout/policy-page";

export const metadata = buildMetadata({
  title: "Shipping Policy",
  description: "Cellova Labs Shipping Policy.",
  path: "/policies/shipping",
});

/** Supplied Shipping Policy copy — rendered in the shared Cellova policy layout. */
export default function ShippingPolicyPage() {
  return (
    <PolicyPage title="Shipping Policy" updated="September 1, 2026">
      <section>
        <p>At <strong>Cellova Labs</strong>, we strive to provide fast, reliable, and flexible shipping options to meet your needs. We offer multiple shipping options designed to accommodate different delivery preferences. We also provide <strong>free shipping on qualifying U.S. orders of $150 or more</strong>, helping customers save on shipping costs while receiving their research products.</p>
      </section>
      <section>
        <h2>Shipping Availability</h2>
        <p>Shipping is currently available <strong>within the United States only</strong>. At this time, Cellova Labs does not offer international shipping.</p>
        <p>We work with trusted shipping carriers to help ensure orders are delivered safely and efficiently. <strong>Free shipping is not available for orders shipped to Alaska or Hawaii.</strong></p>
      </section>
      <section>
        <h2>Shipping Schedule</h2>
        <p>Orders are processed and shipped <strong>Monday through Thursday, excluding federal holidays</strong>.</p>
        <p>Orders placed after the designated Thursday shipping cutoff will generally be processed for shipment the following Monday. This schedule helps minimize weekend transit delays and supports appropriate handling of research products during shipment.</p>
      </section>
      <section>
        <h2>Shipping Costs &amp; Policy Updates</h2>
        <p>Shipping costs vary based on the selected shipping method and destination. Available shipping methods, rates, delivery estimates, and free-shipping eligibility are subject to change at any time without prior notice.</p>
        <p>Customers are responsible for providing accurate and complete shipping information when placing an order. Cellova Labs is not responsible for delays or delivery issues resulting from incorrect or incomplete shipping information provided by the customer.</p>
        <p>For questions regarding shipping options, estimated delivery times, tracking information, or an existing order, please contact our support team at <a href="mailto:info@cellovalabs.com">info@cellovalabs.com</a>.</p>
        <p>We encourage customers to review this Shipping Policy periodically for the most current information.</p>
      </section>
    </PolicyPage>
  );
}
