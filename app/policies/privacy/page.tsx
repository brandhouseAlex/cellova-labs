import { buildMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/layout/policy-page";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Cellova Labs Privacy Policy.",
  path: "/policies/privacy",
});

/** Supplied Privacy Policy copy — rendered in the shared Cellova policy layout. */
export default function PrivacyPolicyPage() {
  return (
    <PolicyPage title="Privacy Policy" updated="September 1, 2026">
      <section>
        <p><strong>Cellova Labs</strong> (“we,” “us,” or “our”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, <strong>cellovalabs.com</strong> (the “Site”). Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access or use the Site.</p>
      </section>
      <section>
        <h2>1. Information We Collect</h2>
        <h3>1.1. Personal Information:</h3>
        <p>When you register on our Site, place an order, subscribe to our newsletter, submit an inquiry, or complete a form, we may collect personal information, including, but not limited to, your name, email address, mailing address, phone number, and payment information.</p>
        <h3>1.2. Non-Personal Information:</h3>
        <p>We may collect non-personal information about you whenever you interact with our Site. This may include your browser type, computer or device type, operating system, Internet service provider, IP address, and other technical information related to your use of the Site.</p>
        <h3>1.3. Cookies and Tracking Technologies:</h3>
        <p>Our Site may use cookies, web beacons, pixels, and other tracking technologies to collect information about your activities on the Site, including browsing behavior, pages visited, and links clicked. This information may be used to improve the functionality of our Site, understand how visitors use our services, and provide a more personalized experience.</p>
      </section>
      <section>
        <h2>2. How We Use Your Information</h2>
        <h3>2.1. To Process Transactions:</h3>
        <p>We may use the information you provide to process orders, manage your account, communicate with you regarding your orders, and provide customer support.</p>
        <h3>2.2. To Improve Our Site and Services:</h3>
        <p>We may use feedback and other information you provide to improve our website, products, services, and overall customer experience.</p>
        <h3>2.3. To Send Emails and Communications:</h3>
        <p>We may use the email address you provide to send transactional communications, order updates, account information, company news, product updates, and promotional or marketing communications. You may unsubscribe from marketing emails at any time by following the unsubscribe instructions included in the email.</p>
        <h3>2.4. To Personalize User Experience:</h3>
        <p>We may use information in aggregate to understand how visitors use our Site and the resources and services available through it.</p>
      </section>
      <section>
        <h2>3. How We Protect Your Information</h2>
        <p>We maintain reasonable administrative, technical, and organizational safeguards designed to protect your personal information against unauthorized access, alteration, disclosure, loss, or destruction. However, no method of transmission over the Internet or method of electronic storage is completely secure, and we cannot guarantee absolute security.</p>
      </section>
      <section>
        <h2>4. Sharing Your Information</h2>
        <h3>4.1. Third-Party Service Providers:</h3>
        <p>We may share information with trusted third-party service providers that assist us in operating our business and Site. These providers may include payment processors, shipping and fulfillment providers, website hosting providers, email and communication services, customer service providers, analytics providers, and marketing service providers.</p>
        <h3>4.2. Legal Requirements:</h3>
        <p>We may disclose your information when required or permitted by applicable law, regulation, legal process, or governmental request, or when necessary to protect our rights, property, safety, or the safety of others.</p>
        <h3>4.3. Business Transfers:</h3>
        <p>If Cellova Labs is involved in a merger, acquisition, reorganization, financing, sale of assets, or other business transaction, your information may be transferred as part of that transaction, subject to applicable law.</p>
      </section>
      <section>
        <h2>5. Third-Party Websites</h2>
        <p>Our Site may contain links to third-party websites or services. We do not control and are not responsible for the content, security, or privacy practices of third-party websites. We encourage you to review the privacy policies and terms of any third-party websites you visit.</p>
      </section>
      <section>
        <h2>6. Your Rights and Choices</h2>
        <h3>6.1. Access and Update:</h3>
        <p>You may request access to or correction of certain personal information we maintain about you. You may also update certain account information by logging into your account or contacting us.</p>
        <h3>6.2. Marketing Opt-Out:</h3>
        <p>You may opt out of receiving promotional emails from us at any time by using the unsubscribe link included in our marketing communications or by contacting us directly.</p>
        <h3>6.3. Data Deletion:</h3>
        <p>You may request that we delete certain personal information we maintain about you. Please note that we may be required to retain certain information to comply with legal, regulatory, accounting, security, or administrative requirements.</p>
      </section>
      <section>
        <h2>7. Children&apos;s Privacy</h2>
        <p>Our Site is not intended for individuals under the age of 21. We do not knowingly collect personal information from individuals under 21. If we become aware that we have inadvertently collected personal information from an individual under 21, we will take reasonable steps to delete such information from our records.</p>
      </section>
      <section>
        <h2>8. Changes to This Privacy Policy</h2>
        <p>We reserve the right to update or modify this Privacy Policy from time to time. When changes are made, we will post the revised policy on this page and update the <strong>“Last Updated”</strong> date. We encourage you to review this Privacy Policy periodically to remain informed about how we collect, use, and protect your information.</p>
      </section>
      <section>
        <h2>9. Contact Us</h2>
        <p>If you have questions or concerns about this Privacy Policy or our privacy practices, please contact us:</p>
        <p><strong>Cellova Labs</strong></p>
        <p>Email: <a href="mailto:info@cellovalabs.com">info@cellovalabs.com</a></p>
        <p><strong>Last Updated: September 1, 2026</strong></p>
      </section>
    </PolicyPage>
  );
}
