import { generateSteps, type StepsResult } from "./steps";

// Generate 0 to FF (256 values)
const BYTE_HEX_VALUES: string[] = [];
for (let i = 0; i <= 255; i++) {
  BYTE_HEX_VALUES.push(i.toString(16).toUpperCase());
}

// Additional common programmatic values
const EXTRA_HEX_VALUES = [
  "100",
  "1FF",
  "3E8",
  "7FF",
  "FFF",
  "FFFF",
  "7FFFFFFF",
  "FFFFFFFF",
];

export const STATIC_HEX_VALUES = Array.from(
  new Set([...BYTE_HEX_VALUES, ...EXTRA_HEX_VALUES])
);

export interface HexValueData {
  hex: string;
  dec: string;
  bin: string;
  binNibbles: string;
  steps: StepsResult;
  asciiChar: string | null;
  rgbNote: string | null;
  specialNote: string | null;
  prevHex: string | null;
  nextHex: string | null;
}

export function getHexValueData(rawHex: string): HexValueData | null {
  const hex = rawHex.toUpperCase().replace(/^0X/, "");
  if (!/^[0-9A-F]+$/.test(hex)) return null;

  const decBig = BigInt(`0x${hex}`);
  const decStr = decBig.toString(10);
  const binStr = decBig.toString(2);

  // Nibble formatting
  const remainder = binStr.length % 4;
  const parts: string[] = [];
  if (remainder > 0) parts.push(binStr.slice(0, remainder));
  for (let i = remainder; i < binStr.length; i += 4) {
    parts.push(binStr.slice(i, i + 4));
  }
  const binNibbles = parts.join(" ");

  // Steps
  const steps = generateSteps(hex, 16);

  // ASCII
  let asciiChar: string | null = null;
  if (decBig >= 32n && decBig <= 126n) {
    const code = Number(decBig);
    const char = String.fromCharCode(code);
    asciiChar = `'${char}' (ASCII decimal ${code})`;
  } else if (decBig === 0n) {
    asciiChar = "NUL (Null character, ASCII 0)";
  } else if (decBig === 9n) {
    asciiChar = "TAB (Horizontal tab, ASCII 9)";
  } else if (decBig === 10n) {
    asciiChar = "LF (Line feed / newline, ASCII 10)";
  } else if (decBig === 13n) {
    asciiChar = "CR (Carriage return, ASCII 13)";
  }

  // RGB Note
  let rgbNote: string | null = null;
  if (decBig <= 255n) {
    const percentage = ((Number(decBig) / 255) * 100).toFixed(1);
    const padded = hex.padStart(2, "0");
    rgbNote = `Represents an 8-bit color channel intensity of ${decStr}/255 (${percentage}%) in hex colors like #${padded}${padded}${padded}.`;
  }

  // Special Notes for common benchmarks
  let specialNote: string | null = null;
  if (hex === "0") {
    specialNote = "The base representation of zero; origin of all positional numbering systems.";
  } else if (hex === "FF") {
    specialNote = "The maximum value representable by a single 8-bit unsigned byte (2⁸ - 1 = 255).";
  } else if (hex === "100") {
    specialNote = "Equal to 16² (256); the minimum 3-digit hexadecimal number and the size of an 8-bit address space.";
  } else if (hex === "3E8") {
    specialNote = "Corresponds to the decimal millennium 1,000 (10³).";
  } else if (hex === "7FF") {
    specialNote = "The maximum 11-bit unsigned integer (2047), used in standard CAN bus identifiers.";
  } else if (hex === "FFF") {
    specialNote = "The maximum 12-bit unsigned integer (4095); commonly used in 12-bit ADC converters.";
  } else if (hex === "FFFF") {
    specialNote = "The maximum 16-bit unsigned integer (65,535), corresponding to 2¹⁶ - 1.";
  } else if (hex === "7FFFFFFF") {
    specialNote = "The maximum 32-bit signed two's complement integer (2,147,483,647); famous as INT_MAX.";
  } else if (hex === "FFFFFFFF") {
    specialNote = "The maximum 32-bit unsigned integer (4,294,967,295), corresponding to 2³² - 1.";
  }

  // Prev / Next links within STATIC_HEX_VALUES
  const currentIndex = STATIC_HEX_VALUES.indexOf(hex);
  const prevHex = currentIndex > 0 ? (STATIC_HEX_VALUES[currentIndex - 1] ?? null) : null;
  const nextHex =
    currentIndex >= 0 && currentIndex < STATIC_HEX_VALUES.length - 1
      ? (STATIC_HEX_VALUES[currentIndex + 1] ?? null)
      : null;

  return {
    hex,
    dec: decStr,
    bin: binStr,
    binNibbles,
    steps,
    asciiChar,
    rgbNote,
    specialNote,
    prevHex,
    nextHex,
  };
}
