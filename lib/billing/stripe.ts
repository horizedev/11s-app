import "server-only";

import { getSiteUrl } from "@/lib/env";
import type { StripeSubscriptionLike } from "@/lib/billing/stripe-events";

type CheckoutSessionResponse = {
  url?: string | null;
};

type PortalSessionResponse = {
  url?: string | null;
};

export async function createStripeCustomer(params: {
  email?: string | null;
  userId: string;
}) {
  const response = await stripeRequest<{ id: string }>("/v1/customers", {
    method: "POST",
    body: new URLSearchParams({
      ...(params.email ? { email: params.email } : {}),
      "metadata[user_id]": params.userId,
    }),
  });

  return response.id;
}

export async function createCheckoutSession(params: {
  customerId: string;
  userId: string;
}) {
  const priceId = getRequiredEnv("STRIPE_PRO_PRICE_ID");
  const siteUrl = getSiteUrl();
  const response = await stripeRequest<CheckoutSessionResponse>("/v1/checkout/sessions", {
    method: "POST",
    body: new URLSearchParams({
      customer: params.customerId,
      mode: "subscription",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      success_url: `${siteUrl}/app/billing?checkout=success`,
      cancel_url: `${siteUrl}/app/billing?checkout=cancelled`,
      "metadata[user_id]": params.userId,
      "subscription_data[metadata][user_id]": params.userId,
    }),
  });

  if (!response.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }

  return response.url;
}

export async function createCustomerPortalSession(params: { customerId: string }) {
  const response = await stripeRequest<PortalSessionResponse>("/v1/billing_portal/sessions", {
    method: "POST",
    body: new URLSearchParams({
      customer: params.customerId,
      return_url: `${getSiteUrl()}/app/billing`,
    }),
  });

  if (!response.url) {
    throw new Error("Stripe did not return a customer portal URL.");
  }

  return response.url;
}

export async function constructStripeWebhookEvent(payload: string, signature: string) {
  const webhookSecret = getRequiredEnv("STRIPE_WEBHOOK_SECRET");
  const secret = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(webhookSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const timestamp = getStripeSignaturePart(signature, "t");
  const expectedSignature = getStripeSignaturePart(signature, "v1");

  if (!timestamp || !expectedSignature) {
    throw new Error("Invalid Stripe signature header.");
  }

  const signedPayload = `${timestamp}.${payload}`;
  const digest = await crypto.subtle.sign(
    "HMAC",
    secret,
    new TextEncoder().encode(signedPayload),
  );
  const actualSignature = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  if (!timingSafeEqual(actualSignature, expectedSignature)) {
    throw new Error("Invalid Stripe webhook signature.");
  }

  return JSON.parse(payload) as {
    type: string;
    data: { object: StripeSubscriptionLike | Record<string, unknown> };
  };
}

async function stripeRequest<T>(path: string, init: RequestInit): Promise<T> {
  const secretKey = getRequiredEnv("STRIPE_SECRET_KEY");
  const response = await fetch(`https://api.stripe.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Stripe request failed: ${response.status} ${body}`);
  }

  return (await response.json()) as T;
}

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

function getStripeSignaturePart(signature: string, key: string) {
  return signature
    .split(",")
    .map((part) => part.split("="))
    .find(([partKey]) => partKey === key)?.[1];
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return result === 0;
}
