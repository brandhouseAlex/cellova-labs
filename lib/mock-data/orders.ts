import type { CommerceOrder } from "@/lib/commerce/types";

/**
 * TEMPORARY demo orders shown in the account area when using the mock
 * provider. Replace by connecting a live provider and removing
 * lib/mock-data/.
 */
export const mockOrders: CommerceOrder[] = [
  {
    id: "order_1001",
    orderNumber: "BL-1001",
    status: "fulfilled",
    email: "researcher@example.com",
    items: [
      {
        id: "line_1001_1",
        productTitle: "BPC-157",
        variantTitle: "5 mg",
        quantity: 2,
        price: { amount: "49.00", currencyCode: "USD" },
        lineTotal: { amount: "98.00", currencyCode: "USD" },
        image: {
          url: "/products/bpc-157.svg",
          altText: "BPC-157 research vial",
          width: 1200,
          height: 1200,
        },
      },
      {
        id: "line_1001_2",
        productTitle: "Bacteriostatic Water (Research Grade)",
        variantTitle: "10 mL",
        quantity: 1,
        price: { amount: "12.00", currencyCode: "USD" },
        lineTotal: { amount: "12.00", currencyCode: "USD" },
        image: {
          url: "/products/bacteriostatic-water.svg",
          altText: "Bacteriostatic water vial",
          width: 1200,
          height: 1200,
        },
      },
    ],
    subtotal: { amount: "110.00", currencyCode: "USD" },
    shippingTotal: { amount: "9.00", currencyCode: "USD" },
    taxTotal: { amount: "0.00", currencyCode: "USD" },
    discountTotal: { amount: "0.00", currencyCode: "USD" },
    total: { amount: "119.00", currencyCode: "USD" },
    shippingAddress: {
      firstName: "A.",
      lastName: "Researcher",
      company: "Example Laboratory",
      address1: "100 Laboratory Way",
      address2: "Suite 200",
      city: "Austin",
      province: "TX",
      postalCode: "78701",
      country: "US",
    },
    createdAt: "2026-07-14T15:30:00.000Z",
  },
  {
    id: "order_1002",
    orderNumber: "BL-1002",
    status: "processing",
    email: "researcher@example.com",
    items: [
      {
        id: "line_1002_1",
        productTitle: "GHK-Cu",
        variantTitle: "50 mg",
        quantity: 1,
        price: { amount: "39.00", currencyCode: "USD" },
        lineTotal: { amount: "39.00", currencyCode: "USD" },
        image: {
          url: "/products/ghk-cu.svg",
          altText: "GHK-Cu research vial",
          width: 1200,
          height: 1200,
        },
      },
    ],
    subtotal: { amount: "39.00", currencyCode: "USD" },
    shippingTotal: { amount: "9.00", currencyCode: "USD" },
    taxTotal: { amount: "0.00", currencyCode: "USD" },
    discountTotal: { amount: "0.00", currencyCode: "USD" },
    total: { amount: "48.00", currencyCode: "USD" },
    shippingAddress: {
      firstName: "A.",
      lastName: "Researcher",
      company: "Example Laboratory",
      address1: "100 Laboratory Way",
      address2: "Suite 200",
      city: "Austin",
      province: "TX",
      postalCode: "78701",
      country: "US",
    },
    createdAt: "2026-08-21T10:05:00.000Z",
  },
];
