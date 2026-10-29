import { describe, it, expect } from "vitest";
import {
  verifyAdminPassword,
  createAdminSessionToken,
  verifyAdminSessionToken,
  getAdminPassword,
} from "./auth";

describe("auth cryptography", () => {
  it("verifies the correct password and rejects incorrect passwords", async () => {
    const validPass = getAdminPassword();
    const isCorrect = await verifyAdminPassword(validPass);
    expect(isCorrect).toBe(true);

    const isWrong = await verifyAdminPassword("wrongPassword123!");
    expect(isWrong).toBe(false);
  });

  it("creates and verifies valid signed session tokens", async () => {
    const token = await createAdminSessionToken();
    expect(token).toContain(".");

    const isValid = await verifyAdminSessionToken(token);
    expect(isValid).toBe(true);
  });

  it("rejects tampered session tokens", async () => {
    const token = await createAdminSessionToken();
    const tampered = token.slice(0, -4) + "abcd";
    const isValid = await verifyAdminSessionToken(tampered);
    expect(isValid).toBe(false);
  });

  it("rejects malformed tokens", async () => {
    expect(await verifyAdminSessionToken("not-a-token")).toBe(false);
    expect(await verifyAdminSessionToken(null)).toBe(false);
  });
});
