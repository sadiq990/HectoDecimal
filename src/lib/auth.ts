import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "hd_admin_session";
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24; // 24 hours

// Helper to convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    const val = bytes[i] ?? 0;
    hex += val.toString(16).padStart(2, "0");
  }
  return hex;
}

// Convert string to Uint8Array
function textToBuffer(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

// Constant-time string comparison to prevent timing attacks
function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Generate HMAC-SHA256 signature for session token
async function signMessage(message: string, secretKey: string): Promise<string> {
  const keyBuffer = textToBuffer(secretKey);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, textToBuffer(message));
  return bufferToHex(signature);
}

// Get the master password from environment or secure default
export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "hectoAdmin2026!";
}

// Check if default password is in use
export function isUsingDefaultPassword(): boolean {
  return !process.env.ADMIN_PASSWORD;
}

// Get secret key for signing sessions
function getSecretKey(): string {
  return process.env.ADMIN_SECRET_KEY || getAdminPassword() + "_hd_secure_salt_2026";
}

// Verify entered password in constant time
export async function verifyAdminPassword(passwordAttempt: string): Promise<boolean> {
  const actualPassword = getAdminPassword();
  
  // Hash both with SHA-256 before comparing to normalize length and prevent timing attacks
  const hashAttempt = await crypto.subtle.digest("SHA-256", textToBuffer(passwordAttempt));
  const hashActual = await crypto.subtle.digest("SHA-256", textToBuffer(actualPassword));

  const hexAttempt = bufferToHex(hashAttempt);
  const hexActual = bufferToHex(hashActual);

  return timingSafeEqualStrings(hexAttempt, hexActual);
}

// Create a cryptographically signed session token
export async function createAdminSessionToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    role: "admin",
    iat: now,
    exp: now + SESSION_EXPIRATION_SECONDS,
  };
  const payloadJson = JSON.stringify(payload);
  const encodedPayload = Buffer.from(payloadJson).toString("base64url");
  const signature = await signMessage(encodedPayload, getSecretKey());

  return `${encodedPayload}.${signature}`;
}

// Verify session token integrity and expiration
export async function verifyAdminSessionToken(token?: string | null): Promise<boolean> {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const encodedPayload = parts[0];
  const signature = parts[1];
  if (!encodedPayload || !signature) return false;

  // Verify signature
  const expectedSignature = await signMessage(encodedPayload, getSecretKey());
  if (!timingSafeEqualStrings(signature, expectedSignature)) {
    return false;
  }

  // Parse payload and check expiration
  try {
    const payloadJson = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp > now && payload.role === "admin") {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Check if the current request has a valid admin session
export async function getAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return await verifyAdminSessionToken(token);
  } catch {
    return false;
  }
}
