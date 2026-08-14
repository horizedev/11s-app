import "server-only";

import Stripe from "stripe";

import type { BillingInterval } from "@/lib/billing";

let stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  if (!stripe) {
    stripe = new Stripe(secretKey);
  }
  return stripe;
}

export function getPriceId(interval: BillingInterval): string | null {
  return interval === "year"
    ? (process.env.STRIPE_PRO_YEARLY_PRICE_ID ?? null)
    : (process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? null);
}

export function getAppUrl(origin: string): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? origin;
}
