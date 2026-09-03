import { buildMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/layout/policy-page";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description: "Cellova Labs Terms of Use, cookies, communications, and product-use policy.",
  path: "/policies/terms",
});

/** Supplied Terms of Use copy — rendered in the shared Cellova policy layout. */
export default function TermsPolicyPage() {
  return (
    <PolicyPage title="Cookies, Web Beacons & Communications" updated="September 1, 2026">
      <section>
        <h2>Cookies and Web Beacons</h2>
        <p>Cellova Labs uses cookies, pixels, web beacons, and similar technologies to collect information about visitors’ preferences, understand website usage, track page visits, and improve the functionality and experience of the Site. These technologies may also allow us to customize content based on browser type, device information, or other data collected through the Site.</p>
        <p>You may disable or manage cookies through your browser settings. Please note that disabling cookies may affect certain features or functionality of the Site.</p>
      </section>
      <section>
        <h2>E-Mail Communications</h2>
        <p>By creating an account, placing an order, or submitting your email address through our Site, you may receive transactional and service-related communications, including order confirmations, shipping notifications, account updates, and customer service communications. If you have opted in to receive marketing communications, you may also receive promotional emails, product updates, and newsletters.</p>
        <p>You may unsubscribe from marketing communications at any time by clicking the unsubscribe link included in our emails or by contacting us at <a href="mailto:info@cellovalabs.com">info@cellovalabs.com</a>.</p>
      </section>
      <section>
        <h2>Disclaimer of Warranties</h2>
        <p>Cellova Labs provides the Site and its content on an <strong>“as is”</strong> and <strong>“as available”</strong> basis, without warranties of any kind, express or implied, to the fullest extent permitted by applicable law.</p>
        <p>The Site may not contain all information necessary for every product application or research use case. We do not guarantee that the Site will be uninterrupted, error-free, secure, free of viruses or other harmful components, or that all information presented on the Site will be complete, current, or accurate.</p>
        <p>You are responsible for maintaining appropriate security measures when accessing and using the Site. Cellova Labs is not responsible for technical failures, unauthorized access to information transmitted through the Site, or damages arising from your use of or reliance on the Site or its content.</p>
        <p>Your use of the Site is at your own risk. If you are dissatisfied with the Site or any portion of its content, your sole remedy is to discontinue use of the Site.</p>
      </section>
      <section>
        <h2>Use of Information</h2>
        <p>The information provided on this Site is for <strong>general informational and research purposes only</strong> and is not intended to provide medical, diagnostic, therapeutic, or other professional advice.</p>
        <p>Products offered by Cellova Labs are intended <strong>for laboratory research and in-vitro research purposes only</strong> and are <strong>not intended for human or animal consumption or use</strong>. Our products have not been evaluated or approved by the U.S. Food and Drug Administration (FDA) for medical use.</p>
      </section>
      <section>
        <h2>Product Use</h2>
        <p>Cellova Labs products are strictly intended for <strong>laboratory research and in-vitro research purposes only</strong> and are not intended for human or animal use or consumption.</p>
        <p>Customers are solely responsible for ensuring that their purchase, handling, storage, testing, and use of products comply with all applicable federal, state, and local laws, regulations, and institutional requirements.</p>
        <p>By purchasing products from Cellova Labs, you acknowledge and agree that the products are intended solely for legitimate research purposes and that you will use and handle them appropriately and in accordance with applicable laws and regulations.</p>
        <p>Cellova Labs does not assume liability for misuse, improper handling, negligence, unauthorized use, or any consequences arising from the improper use of its products.</p>
        <p>Cellova Labs reserves the right to modify these Terms of Use, disclaimers, or other website policies at any time. Any updates will be posted on this Site. We encourage visitors and customers to review these policies periodically to remain informed of any changes.</p>
        <p><strong>Contact:</strong> <a href="mailto:info@cellovalabs.com">info@cellovalabs.com</a></p>
      </section>
    </PolicyPage>
  );
}
