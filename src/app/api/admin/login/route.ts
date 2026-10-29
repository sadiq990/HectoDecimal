import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminPassword,
  createAdminSessionToken,
  ADMIN_COOKIE_NAME,
  isUsingDefaultPassword,
} from "@/lib/auth";
import {
  checkLoginRateLimit,
  recordFailedAttempt,
  recordSuccessfulLogin,
} from "@/lib/auth-rate-limit";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "127.0.0.1";

  // 1. Rate Limiting / Brute-force Shield
  const rateLimit = checkLoginRateLimit(ip);
  if (rateLimit.isLocked) {
    const mins = Math.ceil((rateLimit.lockoutRemainingSeconds || 900) / 60);
    return NextResponse.json(
      {
        ok: false,
        error: `Too many failed login attempts. IP locked for security. Please try again in ${mins} minutes.`,
        locked: true,
      },
      { status: 429 }
    );
  }

  try {
    const { password } = (await req.json()) as { password?: string };

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { ok: false, error: "Password is required." },
        { status: 400 }
      );
    }

    // 2. Constant-time Password Verification
    const isValid = await verifyAdminPassword(password);

    if (!isValid) {
      // Artificial delay (500ms) against rapid dictionary attacks
      await new Promise((resolve) => setTimeout(resolve, 500));
      const attemptResult = recordFailedAttempt(ip);

      if (attemptResult.isLocked) {
        return NextResponse.json(
          {
            ok: false,
            error: "Security lockout: 5 failed attempts reached. Access temporarily locked for 15 minutes.",
            locked: true,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          ok: false,
          error: `Incorrect admin credentials. ${attemptResult.remainingAttempts} attempts remaining before temporary lockout.`,
          remainingAttempts: attemptResult.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // 3. Successful Login
    recordSuccessfulLogin(ip);
    const sessionToken = await createAdminSessionToken();

    const response = NextResponse.json({
      ok: true,
      isDefaultPassword: isUsingDefaultPassword(),
    });

    const isProd = process.env.NODE_ENV === "production";
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: sessionToken,
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[Admin Login Error]", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
