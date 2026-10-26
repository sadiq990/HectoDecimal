import { formatOutput, type FormatOptions } from "./format";
import { generateSteps, type StepsResult } from "./steps";

export type SupportedBase = 2 | 10 | 16;
export type BaseInput = SupportedBase | "hex" | "decimal" | "binary" | "2" | "10" | "16";

export interface ConvertSuccess {
  ok: true;
  output: string;
  rawOutput: string;
  steps: StepsResult | null;
  isNegative: boolean;
  isIncomplete?: boolean;
}

export interface ConvertError {
  ok: false;
  error: string;
  code: "EMPTY" | "INVALID_CHAR" | "TOO_LONG" | "UNSUPPORTED_BASE" | "INVALID_INPUT";
  position?: number;
  char?: string;
}

export type ConvertResult = ConvertSuccess | ConvertError;

export const BASE_NAMES: Record<SupportedBase, string> = {
  2: "binary",
  10: "decimal",
  16: "hexadecimal",
};

/**
 * Normalizes base input into 2 | 10 | 16.
 */
export function normalizeBase(base: BaseInput): SupportedBase | null {
  if (base === 2 || base === "2" || base === "binary") return 2;
  if (base === 10 || base === "10" || base === "decimal") return 10;
  if (base === 16 || base === "16" || base === "hex") return 16;
  return null;
}

/**
 * Normalizes input text: converts full-width chars, strips surrounding quotes,
 * tabs, newlines, non-breaking spaces, commas, and underscores.
 */
export function normalizeInputString(input: string): string {
  // Convert full-width ASCII variants (e.g. ０-９, ａ-ｆ, Ａ-Ｆ) to standard ASCII
  let normalized = input.replace(/[\uFF01-\uFF5E]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
  );

  // Strip surrounding quotation marks (single, double, smart quotes)
  normalized = normalized.trim().replace(/^["'“‘]+|["'”’]+$/g, "");

  // Remove spaces, non-breaking spaces, underscores, commas, tabs, and newlines
  normalized = normalized.replace(/[\s_,\u00A0\u200B\u202F\uFEFF]/g, "");

  return normalized;
}

/**
 * Checks if a character is valid for the given base.
 */
export function isValidDigit(char: string, base: SupportedBase): boolean {
  switch (base) {
    case 2:
      return char === "0" || char === "1";
    case 10:
      return /^[0-9]$/.test(char);
    case 16:
      return /^[0-9a-fA-F]$/.test(char);
  }
}

/**
 * Converts a number between bases (2, 10, 16) with BigInt precision.
 */
export function convert(
  input: string,
  fromBaseInput: BaseInput,
  toBaseInput: BaseInput,
  options: FormatOptions = {}
): ConvertResult {
  const fromBase = normalizeBase(fromBaseInput);
  const toBase = normalizeBase(toBaseInput);

  if (!fromBase || !toBase) {
    return {
      ok: false,
      error: "Unsupported base. Supported bases are 2 (binary), 10 (decimal), and 16 (hex).",
      code: "UNSUPPORTED_BASE",
    };
  }

  // Length safety check: cap at 10,000 characters
  if (input.length > 10000) {
    return {
      ok: false,
      error: "Input exceeds maximum limit of 10,000 characters.",
      code: "TOO_LONG",
    };
  }

  const normalized = normalizeInputString(input);

  // Empty input returns empty output
  if (!normalized) {
    return {
      ok: true,
      output: "",
      rawOutput: "",
      steps: null,
      isNegative: false,
    };
  }

  // Check leading negative sign
  let isNegative = false;
  let remaining = normalized;

  if (remaining.startsWith("-")) {
    isNegative = true;
    remaining = remaining.slice(1);

    // Lone "-" treated as incomplete input, not an error
    if (remaining.length === 0) {
      return {
        ok: true,
        output: "",
        rawOutput: "",
        steps: null,
        isNegative: true,
        isIncomplete: true,
      };
    }
  }

  // Strip standard prefixes for hex (0x/0X) and binary (0b/0B)
  let prefixOffset = isNegative ? 1 : 0;

  if (fromBase === 16 && (remaining.startsWith("0x") || remaining.startsWith("0X"))) {
    remaining = remaining.slice(2);
    prefixOffset += 2;

    // Lone "0x" or "-0x" treated as incomplete input
    if (remaining.length === 0) {
      return {
        ok: true,
        output: "",
        rawOutput: "",
        steps: null,
        isNegative,
        isIncomplete: true,
      };
    }
  } else if (fromBase === 2 && (remaining.startsWith("0b") || remaining.startsWith("0B"))) {
    remaining = remaining.slice(2);
    prefixOffset += 2;

    // Lone "0b" or "-0b" treated as incomplete input
    if (remaining.length === 0) {
      return {
        ok: true,
        output: "",
        rawOutput: "",
        steps: null,
        isNegative,
        isIncomplete: true,
      };
    }
  }

  // Validate allowed characters and report the first invalid digit with 1-indexed position
  for (let i = 0; i < remaining.length; i++) {
    const ch = remaining[i] ?? "";
    if (!isValidDigit(ch, fromBase)) {
      const position = prefixOffset + i + 1;
      const baseName = BASE_NAMES[fromBase];
      return {
        ok: false,
        error: `${ch} is not a valid ${baseName} digit (position ${position})`,
        code: "INVALID_CHAR",
        position,
        char: ch,
      };
    }
  }

  // Strip leading zeros for calculation and steps, but "0" stays "0"
  const stripped = remaining.replace(/^0+/, "");
  const magnitudeDigits = stripped.length === 0 ? "0" : stripped;

  // Convert to BigInt
  let valueBig: bigint;
  try {
    if (fromBase === 16) {
      valueBig = BigInt(`0x${magnitudeDigits}`);
    } else if (fromBase === 2) {
      valueBig = BigInt(`0b${magnitudeDigits}`);
    } else {
      valueBig = BigInt(magnitudeDigits);
    }
  } catch {
    return {
      ok: false,
      error: "Unable to parse number value.",
      code: "INVALID_INPUT",
    };
  }

  // If value is 0, negative sign does not apply
  const effectiveNegative = isNegative && valueBig !== 0n;

  // Format raw output in target base
  let rawMagnitude: string;
  switch (toBase) {
    case 10:
      rawMagnitude = valueBig.toString(10);
      break;
    case 16:
      rawMagnitude = (options.uppercase ?? true)
        ? valueBig.toString(16).toUpperCase()
        : valueBig.toString(16).toLowerCase();
      break;
    case 2:
      rawMagnitude = valueBig.toString(2);
      break;
  }

  const rawOutput = effectiveNegative ? `-${rawMagnitude}` : rawMagnitude;
  const formattedOutput = formatOutput(rawOutput, toBase, options);

  // Generate steps if converting to decimal from hex or binary
  let steps: StepsResult | null = null;
  if ((fromBase === 16 || fromBase === 2) && toBase === 10) {
    steps = generateSteps(magnitudeDigits, fromBase, effectiveNegative);
  }

  return {
    ok: true,
    output: formattedOutput,
    rawOutput,
    steps,
    isNegative: effectiveNegative,
  };
}
