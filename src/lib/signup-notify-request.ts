import { REFERRAL_COOKIE } from "@/lib/referrals";

/** Reads the approximate signup location from edge geo headers. */
export function readSignupLocation(request: Request): string {
  const city = request.headers.get("x-vercel-ip-city");
  const country =
    request.headers.get("x-vercel-ip-country") ??
    request.headers.get("cf-ipcountry");
  const parts = [city, country]
    .map((part) => (part ? decodeURIComponent(part) : ""))
    .filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Unknown";
}

/** Extracts the referral cookie value from a request, if present. */
export function readSignupReferralCode(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const raw = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${REFERRAL_COOKIE}=`))
    ?.split("=")[1];
  return raw ? decodeURIComponent(raw) : null;
}
