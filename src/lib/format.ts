export interface FormatOptions {
  groupDigits?: boolean;
  uppercase?: boolean;
  groupNibbles?: boolean;
}

/**
 * Formats a decimal string with thousand separators (commas).
 * Preserves optional leading minus sign.
 */
export function formatDecimal(decimalStr: string, group = true): string {
  if (!decimalStr || !group) return decimalStr;
  const isNegative = decimalStr.startsWith("-");
  const digits = isNegative ? decimalStr.slice(1) : decimalStr;
  if (!/^\d+$/.test(digits)) return decimalStr;

  // Insert commas from right to left using regex
  const formattedDigits = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return isNegative ? `-${formattedDigits}` : formattedDigits;
}

/**
 * Formats a hexadecimal string with uppercase/lowercase preference.
 * Preserves optional leading minus sign.
 */
export function formatHex(hexStr: string, uppercase = true): string {
  if (!hexStr) return hexStr;
  const isNegative = hexStr.startsWith("-");
  const value = isNegative ? hexStr.slice(1) : hexStr;
  const converted = uppercase ? value.toUpperCase() : value.toLowerCase();
  return isNegative ? `-${converted}` : converted;
}

/**
 * Formats a binary string grouped in 4-bit nibbles from right to left.
 * e.g., "11110000" -> "1111 0000", "101111" -> "10 1111".
 * Preserves optional leading minus sign.
 */
export function formatBinary(binStr: string, group = true): string {
  if (!binStr || !group) return binStr;
  const isNegative = binStr.startsWith("-");
  const digits = isNegative ? binStr.slice(1) : binStr;
  if (!/^[01]+$/.test(digits)) return binStr;

  // Group into nibbles from right to left
  const remainder = digits.length % 4;
  const parts: string[] = [];

  if (remainder > 0) {
    parts.push(digits.slice(0, remainder));
  }

  for (let i = remainder; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }

  const result = parts.join(" ");
  return isNegative ? `-${result}` : result;
}

/**
 * General formatter applying options for the target base.
 */
export function formatOutput(
  rawOutput: string,
  base: 2 | 10 | 16,
  options: FormatOptions = {}
): string {
  if (!rawOutput) return "";
  switch (base) {
    case 10:
      return formatDecimal(rawOutput, options.groupDigits ?? false);
    case 16:
      return formatHex(rawOutput, options.uppercase ?? true);
    case 2:
      return formatBinary(rawOutput, options.groupNibbles ?? false);
  }
}
