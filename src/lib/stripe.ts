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
  switch (interval) {
    case "year":
      return process.env.STRIPE_PRO_YEARLY_PRICE_ID ?? null;
    case "quarter":
      return process.env.STRIPE_PRO_QUARTERLY_PRICE_ID ?? null;
    default:
      return process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? null;
  }
}

export function intervalFromPriceId(priceId: string): BillingInterval | null {
  if (priceId === process.env.STRIPE_PRO_MONTHLY_PRICE_ID) return "month";
  if (priceId === process.env.STRIPE_PRO_QUARTERLY_PRICE_ID) return "quarter";
  if (priceId === process.env.STRIPE_PRO_YEARLY_PRICE_ID) return "year";
  return null;
}

export function getAppUrl(origin: string): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? origin;
}
