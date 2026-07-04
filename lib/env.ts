type PublicEnv = {
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  VERCEL_URL?: string;
};

type SupabasePublicEnv = {
  publishableKey: string;
  url: string;
};

const publicEnv: PublicEnv = {
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
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
  if (publicEnv.VERCEL_URL) {
    return `https://${publicEnv.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
