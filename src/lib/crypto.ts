/**
 * Application-level encryption (AES-256-GCM) for sensitive user content at
 * rest. Ciphertext values are stored in the database with a `v1.` prefix so
 * plaintext rows written before encryption was enabled keep working until a
 * backfill rewrites them.
 *
 * Works in both the browser and Node via the global WebCrypto API.
 */

export const ENCRYPTION_PREFIX = "v1.";

const IV_BYTES = 12;

export function isEncrypted(value: string | null | undefined): boolean {
  return typeof value === "string" && value.startsWith(ENCRYPTION_PREFIX);
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/** Imports a base64-encoded 256-bit key for AES-GCM. */
export async function importEncryptionKey(
  base64Key: string,
): Promise<CryptoKey> {
  const raw = fromBase64(base64Key);
  if (raw.length !== 32) {
    throw new Error("DATA_ENCRYPTION_KEY must be 32 bytes (base64-encoded).");
  }
  return crypto.subtle.importKey("raw", raw as BufferSource, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encryptText(
  plain: string,
  key: CryptoKey,
): Promise<string> {
  if (!plain) return plain;
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const encoded = new TextEncoder().encode(plain);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded,
  );
  return `${ENCRYPTION_PREFIX}${toBase64(iv)}.${toBase64(new Uint8Array(ciphertext))}`;
}

/**
 * Decrypts a `v1.` value. Plaintext input (pre-encryption rows) passes
 * through unchanged; undecryptable ciphertext returns the raw value so a
 * misconfigured key never shows users garbage or loses display of data.
 */
export async function decryptText(
  value: string,
  key: CryptoKey,
): Promise<string> {
  if (!value || !isEncrypted(value)) return value;
  try {
    const [, ivB64, dataB64] = value.split(".");
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64(ivB64) as BufferSource },
      key,
      fromBase64(dataB64) as BufferSource,
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    return value;
  }
}

export async function encryptList(
  items: string[],
  key: CryptoKey,
): Promise<string[]> {
  return Promise.all(items.map((item) => encryptText(item, key)));
}

export async function decryptList(
  items: string[],
  key: CryptoKey,
): Promise<string[]> {
  return Promise.all(items.map((item) => decryptText(item, key)));
}
