import { buildMetadata } from "@/lib/seo";
import { PolicyPage } from "@/components/layout/policy-page";

export const metadata = buildMetadata({
  title: "RUO Policy",
  description: "Research Use Only policy and regulatory context for Cellova Labs products.",
  path: "/policies/research-use",
});

/** Supplied RUO policy copy — rendered in the shared Cellova policy layout. */
export default function ResearchUsePolicyPage() {
  return (
    <PolicyPage title="RUO Policy" updated="September 1, 2026">
      <section>
        <h2>RUO Definition</h2>
        <p>“RUO” is an abbreviation for Research Use Only. It is a designation used primarily by the FDA (Food and Drug Administration) for products, often in vitro diagnostic (IVD) components like reagents or instruments, that are in the laboratory research phase of development and are not intended for clinical diagnostic use.</p>
      </section>
      <section>
        <h2>Research Use Only (RUO) Explained</h2>
        <ul>
          <li><strong>Intended Purpose:</strong> RUO products are intended solely for basic research or the development of new tests, not for diagnosing a disease or condition.</li>
          <li><strong>Labeling Requirement:</strong> The prominent RUO labeling serves as a critical warning to prevent their use in patient testing. Mislabeling products as RUO when they are actually intended for clinical use is illegal and can lead to FDA enforcement actions, including warning letters.</li>
          <li><strong>FDA Oversight:</strong> The FDA determines a product’s intended use based on the “totality of the circumstances,” including labeling, advertising, and sales practices.</li>
        </ul>
      </section>
      <section>
        <h2>The Role of the FTC</h2>
        <p>The FTC (Federal Trade Commission) has overlapping jurisdiction with the FDA regarding the advertising and promotion of health-related products. The FTC ensures that all marketing claims for products, including those that might be related to research or diagnostics, are truthful, non-misleading, and supported by appropriate science.</p>
        <p>While the FDA focuses on the safety and effectiveness of the diagnostic products themselves, the FTC focuses on the accuracy of the advertising claims made to consumers and potential buyers. The agencies work together to regulate product promotion compliance.</p>
      </section>
    </PolicyPage>
  );
}
