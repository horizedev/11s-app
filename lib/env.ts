type PublicEnv = {
  NEXT_PUBLIC_SITE_URL?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  VERCEL_URL?: string;
};

type SupabasePublicEnv = {
  publishableKey: string;
  url: string;
};

const publicEnv: PublicEnv = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SITE_URL: process.env.SITE_URL,
  VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  VERCEL_URL: process.env.VERCEL_URL,
};

export const hasSupabaseEnv = Boolean(
  publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
);

export function getSupabasePublicEnv(): SupabasePublicEnv {
  if (!hasSupabaseEnv) {
    throw new Error(
      "Supabase environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return {
    publishableKey: publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
    url: publicEnv.NEXT_PUBLIC_SUPABASE_URL as string,
  };
}

export function getSiteUrl() {
  const siteUrl =
    publicEnv.NEXT_PUBLIC_SITE_URL ??
    publicEnv.SITE_URL ??
    publicEnv.VERCEL_PROJECT_PRODUCTION_URL ??
    publicEnv.VERCEL_URL;

  if (siteUrl) {
    return siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
  }

  return "http://localhost:3000";
}
