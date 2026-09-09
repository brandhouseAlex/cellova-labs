# Product Detail COA Tab Reference Notes

The supplied 1432 × 458 COA-tab image was reviewed in three ordered, overlapping horizontal crops. The repeated overlap is reconciled once below.

| Area | Verified reference treatment |
| --- | --- |
| Container | A single almost-white flat card with a subtle blue-gray border, 8–10px radius, and no color gradient. |
| Tab rail | Three equal, centered tabs sit in a 1px divided rail: **Certificate of Analysis**, **Storage Instructions**, and **FDA Disclosure & Intended Use**. Each tab has a small thin navy/orange outline icon. The selected COA tab has an orange 2px bottom rule and an orange certificate icon. |
| COA body | The selected tab body is a two-column desktop grid of two distinct white, softly bordered panels with 16–20px internal padding. |
| Batch panel | A navy **Batch Information** heading appears above a five-row two-column table: Product Name, Lot Number, Tested Date, Laboratory, and Identity (MS). A small muted two-line note follows the table. |
| Results panel | An orange **Analytical Results** heading appears above a three-column table labelled Test, Method, and Result. The reference rows are Purity (HPLC), Net Content, Endotoxin, and Heavy Metals. An outlined full-width **Download COA** action with a download icon follows beneath. |
| Responsive intent | At smaller widths the tab rail and body must remain legible; the two table panels stack without merging data or inventing provider values. |

The implementation must preserve provider-backed product, lot, laboratory, date, test, method, result, and document-link values. The reference supplies the information hierarchy and visual treatment, not fixed data values.

## Live variant-media observation

On the published BPC-157 PDP, the selected provider image completed loading in the primary gallery and matched the first thumbnail after the media request resolved. The primary frame preserves the provider gallery controls and has no empty-state copy once the image is loaded. This confirms the final client composition may prioritize selected variant media without replacing platform-supplied URLs with static visual overrides.

## Published COA tab observation

After the main-branch deployment refreshed, the published BPC-157 product page displayed the flat tab rail with its three requested labels and the selected COA body with separate **Batch Information** and **Analytical Results** tables. The live values remained provider records: BPC-157 10mg, lot BPC-10-726-1, 2026-07-17, Bioviridian, plus purity, net content, endotoxin, and heavy-metals results. The page exposed the provider PDF as the outlined **Download COA** action. The initial main gallery image resolves after its normal media load, showing the selected provider product image in the primary frame and corresponding thumbnails.

The completed implementation carries Shopify `variant.image` through the normalized commerce contract and makes it the first gallery image whenever that variant is selected. The active mock provider now supplies the same contract field using its available product media; where a mock product has only one provider image, the selected variant correctly retains that single source rather than inventing a separate asset. The client gallery remounts on a variant ID change, ensuring its visible primary image resets to the newly selected variant media. The provider-normalization, interactive PDP media, keyboard-tab, flat COA structure, and provider PDF-link regressions pass in the 20-test suite.
