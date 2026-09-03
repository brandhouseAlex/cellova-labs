"use client";

import { useState } from "react";
import { Field, TextInput, TextArea, Select } from "@/components/ui/primitives";

/**
 * Contact form. Submissions currently acknowledge client-side; connect the
 * submit handler to your email/CRM endpoint (e.g. a Next.js Route Handler
 * calling your transactional email provider) before production.
 */
export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    // TODO(production): POST to /api/contact backed by your email provider.
    await new Promise((r) => setTimeout(r, 600));
    setBusy(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="border border-brand/30 bg-brand-tint p-8 text-center"
      >
        <p className="font-display text-xl font-semibold text-ink">
          Message received
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate">
          Thank you for contacting Cellova Labs. A member of our team will
          respond to your inquiry as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <TextInput id="name" name="name" autoComplete="name" required />
        </Field>
        <Field label="Email" htmlFor="contact-email">
          <TextInput
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </Field>
      </div>

      <Field label="Company / Laboratory (optional)" htmlFor="contact-company">
        <TextInput id="contact-company" name="company" autoComplete="organization" />
      </Field>

      <Field label="Subject" htmlFor="subject">
        <Select id="subject" name="subject" required defaultValue="">
          <option value="" disabled>
            Select a subject
          </option>
          <option value="order">Customer / Order Inquiry</option>
          <option value="research">Research Inquiry</option>
          <option value="documentation">Batch Documentation Request</option>
          <option value="wholesale">Institutional / Volume Inquiry</option>
          <option value="other">Other</option>
        </Select>
      </Field>

      <Field label="Order Number (optional)" htmlFor="order-number">
        <TextInput id="order-number" name="orderNumber" placeholder="e.g. BL-1001" />
      </Field>

      <Field label="Message" htmlFor="message">
        <TextArea id="message" name="message" required />
      </Field>

      <button
        type="submit"
        disabled={busy}
        className="rounded-[8px] bg-ink px-8 py-4 text-sm font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-brand-deep disabled:opacity-50"
      >
        {busy ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
