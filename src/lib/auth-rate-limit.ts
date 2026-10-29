interface AttemptRecord {
  count: number;
  lockUntil: number;
  lastAttempt: number;
}

// In-memory sliding window for rate limiting
const loginAttempts = new Map<string, AttemptRecord>();

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes window

export interface RateLimitResult {
  isLocked: boolean;
  remainingAttempts: number;
  lockoutRemainingSeconds?: number;
}

export function checkLoginRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) {
    return { isLocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  // Check if actively locked out
  if (record.lockUntil > now) {
    const lockoutRemainingSeconds = Math.ceil((record.lockUntil - now) / 1000);
    return {
      isLocked: true,
      remainingAttempts: 0,
      lockoutRemainingSeconds,
    };
  }

  // Check if previous attempt window has expired
  if (now - record.lastAttempt > ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(ip);
    return { isLocked: false, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }

  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - record.count);
  return {
    isLocked: false,
    remainingAttempts: remaining,
  };
}

export function recordFailedAttempt(ip: string): RateLimitResult {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lockUntil: 0, lastAttempt: now };

  record.count += 1;
  record.lastAttempt = now;

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockUntil = now + LOCKOUT_DURATION_MS;
    loginAttempts.set(ip, record);
    return {
      isLocked: true,
      remainingAttempts: 0,
      lockoutRemainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
    };
  }

  loginAttempts.set(ip, record);
  return {
    isLocked: false,
    remainingAttempts: MAX_FAILED_ATTEMPTS - record.count,
  };
}

export function recordSuccessfulLogin(ip: string): void {
  loginAttempts.delete(ip);
}

export function getSecurityStats() {
  const now = Date.now();
  let lockedIps = 0;
  let trackedIps = 0;

  for (const [, rec] of loginAttempts.entries()) {
    if (now - rec.lastAttempt <= ATTEMPT_WINDOW_MS) {
      trackedIps++;
      if (rec.lockUntil > now) {
        lockedIps++;
      }
    }
  }

  return { lockedIps, trackedIps, maxAttempts: MAX_FAILED_ATTEMPTS };
}
