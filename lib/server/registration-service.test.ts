import { describe, expect, it } from "vitest";
import { normaliseRegistrationInput } from "@/lib/server/registration-service";

describe("registration input validation", () => {
  it("normalizes email, phone, text fields, and mandatory research consent before Shopify is called", () => {
    expect(normaliseRegistrationInput({
      firstName: "  Ada  ", lastName: " Lovelace ", companyName: "  Cellova   Research ", email: " ADA@Example.COM ", phone: "+1 (415) 555-2671", acceptsResearchUseTerms: true,
    })).toEqual({
      firstName: "Ada", lastName: "Lovelace", companyName: "Cellova Research", email: "ada@example.com", phone: "+14155552671", acceptsResearchUseTerms: true,
    });
  });

  it("fails closed when consent, phone, or email is invalid", () => {
    expect(() => normaliseRegistrationInput({ firstName: "Ada", lastName: "Lovelace", companyName: "Research", email: "invalid", phone: "1", acceptsResearchUseTerms: false })).toThrow();
    expect(() => normaliseRegistrationInput({ firstName: "Ada", lastName: "Lovelace", companyName: "Research", email: "ada@example.com", phone: "+15551234567", acceptsResearchUseTerms: true })).toThrow();
  });
});
