# Cellova Labs Shopify Setup

Cellova Labs has been configured with a **new, independent Shopify storefront**. It must remain separate from any pre-existing store: use new Cellova customer records, product records, metafield definitions, checkout configuration, email services, analytics, and credentials. Do not copy store domains, storefront tokens, customer IDs, product IDs, tracking identifiers, or contact data from another brand.

## Customer metafields

The customer-access flow should submit these fields to the new Cellova Shopify customer implementation after the store is claimed and its customer-account API is finalized. They should be scoped under the `cellova` namespace.

| Name | Namespace | Key | Shopify type | Required at registration | Purpose | Site location |
| --- | --- | --- | --- | --- | --- | --- |
| Company / affiliation | `cellova` | `company_affiliation` | `single_line_text_field` | Yes | Captures research organization or affiliation. | Research Access |
| State | `cellova` | `state` | `single_line_text_field` | Yes | Captures the requester’s state. | Research Access |
| Intended use | `cellova` | `intended_use` | `single_line_text_field` | Yes | Captures the stated research context. | Research Access |
| Research disclosure accepted | `cellova` | `research_disclosure_accepted` | `boolean` | Yes | Records acknowledgement of the research-use disclosure. | Research Access |
| Consent timestamp | `cellova` | `consent_timestamp` | `date_time` | Yes | Stores the UTC acknowledgement time. | Research Access |
| Catalog access status | `cellova` | `catalog_access_status` | `single_line_text_field` | No | Supports any manual or automated access-review process. | Catalog gate / account |

## Product and COA metafields

The Cellova COA Library should show only products whose lot record includes every required COA field and a valid document URL. Use the `cellova_coa` namespace. The product page places the concise product specifications above the fold and links the full lot record through the COA Library.

| Name | Namespace | Key | Shopify type | Purpose |
| --- | --- | --- | --- | --- |
| Lot number | `cellova_coa` | `lot_number` | `single_line_text_field` | Displays the tested lot or batch identifier. |
| Tested date | `cellova_coa` | `tested_date` | `date` | Displays the date associated with the COA result. |
| Laboratory | `cellova_coa` | `laboratory` | `single_line_text_field` | Identifies the testing laboratory. |
| Identity (MS) | `cellova_coa` | `identity_ms` | `single_line_text_field` | Stores the identity-testing result or method value. |
| Purity (HPLC) | `cellova_coa` | `purity_hplc` | `single_line_text_field` | Stores the purity result or method value. |
| Net content | `cellova_coa` | `net_content` | `single_line_text_field` | Stores the stated tested quantity. |
| Endotoxin | `cellova_coa` | `endotoxin` | `single_line_text_field` | Stores the endotoxin result or method value. |
| Heavy metals | `cellova_coa` | `heavy_metals` | `single_line_text_field` | Stores the heavy-metals result or method value. |
| COA PDF | `cellova_coa` | `pdf` | `url` | Links the source COA document. |
| COA status | `cellova_coa` | `status` | `single_line_text_field` | Enables controlled publication state such as `available`. |

## Storefront conventions

Use product tags only for broad storefront filters and current simple state, such as `research-peptide`, `documentation-pending`, and `coa-available`. The Cellova storefront adapter retrieves the fields above from the independent Shopify store and publishes a lot record only when it is complete and its status is `available`. Use `cellova_cart` for persisted cart state; never reuse a generic or legacy commerce key.

## Launch prerequisites

Before accepting production customers, claim the new Shopify store in the project settings, connect the approved Cellova payment configuration, publish final products to the intended sales channel, enable the customer-account workflow, define the metafields above, load tested product and COA values, and complete legal review of the site terms, privacy statement, and research disclosure.
