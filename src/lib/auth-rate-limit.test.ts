import { describe, it, expect } from "vitest";
import {
  checkLoginRateLimit,
  recordFailedAttempt,
  recordSuccessfulLogin,
} from "./auth-rate-limit";

describe("auth-rate-limit", () => {
  it("allows initial attempts", () => {
    const ip = "192.168.1.100";
    const status = checkLoginRateLimit(ip);
    expect(status.isLocked).toBe(false);
    expect(status.remainingAttempts).toBe(5);
  });

  it("decrements remaining attempts on failed tries", () => {
    const ip = "192.168.1.101";
    const try1 = recordFailedAttempt(ip);
    expect(try1.remainingAttempts).toBe(4);
    expect(try1.isLocked).toBe(false);

    const try2 = recordFailedAttempt(ip);
    expect(try2.remainingAttempts).toBe(3);
  });

  it("locks out after 5 failed attempts", () => {
    const ip = "192.168.1.102";
    for (let i = 0; i < 4; i++) {
      recordFailedAttempt(ip);
    }
    const finalTry = recordFailedAttempt(ip);
    expect(finalTry.isLocked).toBe(true);
    expect(finalTry.remainingAttempts).toBe(0);

    const check = checkLoginRateLimit(ip);
    expect(check.isLocked).toBe(true);
  });

  it("resets on successful login", () => {
    const ip = "192.168.1.103";
    recordFailedAttempt(ip);
    recordFailedAttempt(ip);
    recordSuccessfulLogin(ip);

    const status = checkLoginRateLimit(ip);
    expect(status.isLocked).toBe(false);
    expect(status.remainingAttempts).toBe(5);
  });
});
