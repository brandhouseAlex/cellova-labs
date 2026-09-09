import { describe, expect, it } from "vitest";
import { normaliseRegistrationInput } from "@/lib/server/registration-service";

describe("registration input validation", () => {
  it("normalizes email, phone, text fields, and mandatory research consent before Shopify is called", () => {
    expect(normaliseRegistrationInput({
      firstName: "  Ada  ", lastName: " Lovelace ", companyName: "  Cellova   Research ", email: " ADA@Example.COM ", phone: "(555) 000-0000", acceptsResearchUseTerms: true,
    })).toEqual({
      firstName: "Ada", lastName: "Lovelace", companyName: "Cellova Research", email: "ada@example.com", phone: "+15550000000", acceptsResearchUseTerms: true,
    });
  });

  it("fails closed when consent, phone, or email is invalid", () => {
    expect(() => normaliseRegistrationInput({ firstName: "Ada", lastName: "Lovelace", companyName: "Research", email: "invalid", phone: "1", acceptsResearchUseTerms: false })).toThrow();
  });
});
