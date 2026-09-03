# Shopify Storefront COA Metaobject Mapping

The product-detail provider requests the public Shopify product metafield `custom.coas` directly. Shopify Storefront metafields can expose a single resource through `reference` or a list through `references`; the implementation handles both forms and only projects the requested Certificate of Analysis fields into the normalized commerce model.[1]

The referenced Certificate of Analysis metaobject is read through its `fields` collection. Field values remain provider data; the UI receives only normalized values for Product Name, Lot Number, Tested Date, Laboratory, Identity (MS), Purity (HPLC), Net Content, Endotoxin, Heavy Metals, and the COA PDF.[2]

The COA PDF field is resolved only when its metaobject field reference is a public Shopify `GenericFile` URL. The provider derives a display filename from that public URL and never forwards a Shopify Global ID or raw GraphQL object to the product page.[3]

The Storefront access token needs the applicable unauthenticated metaobject-read scope, and the product metafield/metaobject definition must be published for Storefront access. No additional Vercel environment variable is required for this fixed `custom.coas` mapping.

## References

[1]: https://shopify.dev/docs/api/storefront/latest/objects/Metafield "Shopify Storefront API — Metafield"
[2]: https://shopify.dev/docs/api/storefront/latest/objects/Metaobject "Shopify Storefront API — Metaobject"
[3]: https://shopify.dev/docs/api/storefront/latest/objects/MetaobjectField "Shopify Storefront API — MetaobjectField"
