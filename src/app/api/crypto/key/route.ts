import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Issues the data-encryption key to the signed-in user so sensitive fields
 * can be encrypted/decrypted client-side (the server decrypts only when AI
 * preparation needs the context). Never cached.
 */
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.DATA_ENCRYPTION_KEY;
  if (!key) {
    return Response.json(
      { error: "Encryption is not configured." },
      { status: 503 },
    );
  }

  return Response.json(
    { key },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
