import { describe, it, expect } from "vitest";
import { convert } from "./convert";

describe("Converter Engine (convert.ts)", () => {
  it("converts 0 correctly across all bases", () => {
    const hexToDec = convert("0", 16, 10);
    expect(hexToDec.ok).toBe(true);
    if (hexToDec.ok) {
      expect(hexToDec.output).toBe("0");
      expect(hexToDec.steps?.finalSum).toBe("0");
    }

    const decToHex = convert("0", 10, 16);
    expect(decToHex.ok).toBe(true);
    if (decToHex.ok) expect(decToHex.output).toBe("0");

    const binToDec = convert("0", 2, 10);
    expect(binToDec.ok).toBe(true);
    if (binToDec.ok) expect(binToDec.output).toBe("0");

    // Multiple zeros normalize to single zero
    const multiZeros = convert("0000", 16, 10);
    expect(multiZeros.ok).toBe(true);
    if (multiZeros.ok) expect(multiZeros.output).toBe("0");
  });

  it("converts 1 correctly", () => {
    const res = convert("1", 16, 10);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.output).toBe("1");
  });

  it("converts F and FF correctly", () => {
    const resF = convert("F", 16, 10);
    expect(resF.ok).toBe(true);
    if (resF.ok) expect(resF.output).toBe("15");

    const resFF = convert("FF", 16, 10);
    expect(resFF.ok).toBe(true);
    if (resFF.ok) expect(resFF.output).toBe("255");

    const resffLower = convert("ff", 16, 10);
    expect(resffLower.ok).toBe(true);
    if (resffLower.ok) expect(resffLower.output).toBe("255");
  });

  it("converts 7DE -> 2014 with verified step-by-step math", () => {
    const res = convert("7DE", 16, 10);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.output).toBe("2014");
      expect(res.steps).not.toBeNull();
      expect(res.steps?.rows).toHaveLength(3);
      // 7 * 16^2 = 7 * 256 = 1792
      expect(res.steps?.rows[0]?.digit).toBe("7");
      expect(res.steps?.rows[0]?.power).toBe("256");
      expect(res.steps?.rows[0]?.product).toBe("1792");
      // D(13) * 16^1 = 208
      expect(res.steps?.rows[1]?.digit).toBe("D");
      expect(res.steps?.rows[1]?.value).toBe("13");
      expect(res.steps?.rows[1]?.product).toBe("208");
      // E(14) * 16^0 = 14
      expect(res.steps?.rows[2]?.digit).toBe("E");
      expect(res.steps?.rows[2]?.value).toBe("14");
      expect(res.steps?.rows[2]?.product).toBe("14");
      expect(res.steps?.finalSum).toBe("2014");
      expect(res.steps?.formula).toContain("2014");
    }
  });

  it("converts 1D9 -> 473", () => {
    const res = convert("1D9", 16, 10);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.output).toBe("473");
  });

  it("converts 80E1 -> 32993", () => {
    const res = convert("80E1", 16, 10);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.output).toBe("32993");
  });

  it("converts 10CE -> 4302", () => {
    const res = convert("10CE", 16, 10);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.output).toBe("4302");
  });

  it("converts 7fffffffffffffff (signed 64-bit max)", () => {
    const res = convert("7fffffffffffffff", 16, 10);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.output).toBe("9223372036854775807");
  });

  it("converts ffffffffffffffff (unsigned 64-bit max)", () => {
    const res = convert("ffffffffffffffff", 16, 10);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.output).toBe("18446744073709551615");
  });

  it("converts a 300-digit hex with BigInt precision without loss", () => {
    const hex300 = "A".repeat(300);
    const res = convert(hex300, 16, 10);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.output.length).toBeGreaterThan(300);
      // Round trip back to hex
      const roundTrip = convert(res.output, 10, 16);
      expect(roundTrip.ok).toBe(true);
      if (roundTrip.ok) expect(roundTrip.output).toBe(hex300);
    }
  });

  it("handles negative numbers correctly", () => {
    const resHex = convert("-7DE", 16, 10);
    expect(resHex.ok).toBe(true);
    if (resHex.ok) {
      expect(resHex.output).toBe("-2014");
      expect(resHex.isNegative).toBe(true);
      expect(resHex.steps?.finalSum).toBe("-2014");
    }

    const resDec = convert("-2014", 10, 16);
    expect(resDec.ok).toBe(true);
    if (resDec.ok) expect(resDec.output).toBe("-7DE");

    const resBin = convert("-1010", 2, 10);
    expect(resBin.ok).toBe(true);
    if (resBin.ok) expect(resBin.output).toBe("-10");

    // -0 normalizes to 0
    const resZero = convert("-0", 16, 10);
    expect(resZero.ok).toBe(true);
    if (resZero.ok) {
      expect(resZero.output).toBe("0");
      expect(resZero.isNegative).toBe(false);
    }
  });

  it("handles 0x and 0X prefix for hex and 0b/0B for binary", () => {
    const resLower = convert("0x7DE", 16, 10);
    expect(resLower.ok).toBe(true);
    if (resLower.ok) expect(resLower.output).toBe("2014");

    const resUpper = convert("0X7DE", 16, 10);
    expect(resUpper.ok).toBe(true);
    if (resUpper.ok) expect(resUpper.output).toBe("2014");

    const resNegPrefix = convert("-0x7DE", 16, 10);
    expect(resNegPrefix.ok).toBe(true);
    if (resNegPrefix.ok) expect(resNegPrefix.output).toBe("-2014");

    const resBinPrefix = convert("0b1011", 2, 10);
    expect(resBinPrefix.ok).toBe(true);
    if (resBinPrefix.ok) expect(resBinPrefix.output).toBe("11");
  });

  it("handles spaces, tabs, underscores, commas, and full-width characters", () => {
    const resSpaces = convert("7 D E", 16, 10);
    expect(resSpaces.ok).toBe(true);
    if (resSpaces.ok) expect(resSpaces.output).toBe("2014");

    const resUnderscores = convert("7_D_E", 16, 10);
    expect(resUnderscores.ok).toBe(true);
    if (resUnderscores.ok) expect(resUnderscores.output).toBe("2014");

    const resCommas = convert("1,000,000", 10, 16);
    expect(resCommas.ok).toBe(true);
    if (resCommas.ok) expect(resCommas.output).toBe("F4240");

    // Full-width characters
    const resFullWidth = convert("７ＤＥ", 16, 10);
    expect(resFullWidth.ok).toBe(true);
    if (resFullWidth.ok) expect(resFullWidth.output).toBe("2014");
  });

  it("handles empty and incomplete inputs gracefully", () => {
    const resEmpty = convert("", 16, 10);
    expect(resEmpty.ok).toBe(true);
    if (resEmpty.ok) expect(resEmpty.output).toBe("");

    const resWhitespace = convert("   ", 16, 10);
    expect(resWhitespace.ok).toBe(true);
    if (resWhitespace.ok) expect(resWhitespace.output).toBe("");

    const resLoneMinus = convert("-", 16, 10);
    expect(resLoneMinus.ok).toBe(true);
    if (resLoneMinus.ok) {
      expect(resLoneMinus.output).toBe("");
      expect(resLoneMinus.isIncomplete).toBe(true);
    }

    const resLone0x = convert("0x", 16, 10);
    expect(resLone0x.ok).toBe(true);
    if (resLone0x.ok) {
      expect(resLone0x.output).toBe("");
      expect(resLone0x.isIncomplete).toBe(true);
    }
  });

  it("reports invalid characters with exact character and 1-based position", () => {
    const resG = convert("7DEG", 16, 10);
    expect(resG.ok).toBe(false);
    if (!resG.ok) {
      expect(resG.code).toBe("INVALID_CHAR");
      expect(resG.char).toBe("G");
      expect(resG.position).toBe(4);
      expect(resG.error).toContain("G is not a valid hexadecimal digit (position 4)");
    }

    // With 0x prefix
    const res0xInvalid = convert("0x7DEG", 16, 10);
    expect(res0xInvalid.ok).toBe(false);
    if (!res0xInvalid.ok) {
      expect(res0xInvalid.char).toBe("G");
      expect(res0xInvalid.position).toBe(6);
    }

    // Decimal invalid char
    const resDecInvalid = convert("123A", 10, 16);
    expect(resDecInvalid.ok).toBe(false);
    if (!resDecInvalid.ok) {
      expect(resDecInvalid.char).toBe("A");
      expect(resDecInvalid.position).toBe(4);
      expect(resDecInvalid.error).toContain("decimal");
    }

    // Binary invalid char
    const resBinInvalid = convert("102", 2, 10);
    expect(resBinInvalid.ok).toBe(false);
    if (!resBinInvalid.ok) {
      expect(resBinInvalid.char).toBe("2");
      expect(resBinInvalid.position).toBe(3);
    }
  });

  it("enforces 10,000 character limit", () => {
    const huge = "A".repeat(10001);
    const res = convert(huge, 16, 10);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.code).toBe("TOO_LONG");
    }
  });

  it("verifies all numeric examples in copy match the engine exactly", () => {
    // Hex to Dec example: 7DE -> 2014
    const h2d = convert("7DE", 16, 10);
    expect(h2d.ok && h2d.output).toBe("2014");

    // Dec to Hex example: 2014 -> 7DE
    const d2h = convert("2014", 10, 16);
    expect(d2h.ok && d2h.output).toBe("7DE");

    // Bin to Dec example: 110101 -> 53
    const b2d = convert("110101", 2, 10);
    expect(b2d.ok && b2d.output).toBe("53");

    // Dec to Bin example: 53 -> 110101
    const d2b = convert("53", 10, 2);
    expect(d2b.ok && d2b.output).toBe("110101");

    // Hex to Bin example: 2F -> 101111
    const h2b = convert("2F", 16, 2);
    expect(h2b.ok && h2b.output).toBe("101111");

    // Bin to Hex example: 11011111 -> DF
    const b2h = convert("11011111", 2, 16);
    expect(b2h.ok && b2h.output).toBe("DF");
  });

  it("handles unsupported bases gracefully", () => {
    // @ts-expect-error Testing invalid base
    const res = convert("123", "octal", 10);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.code).toBe("UNSUPPORTED_BASE");
    }
  });

  it("handles inputs longer than 16 digits with ellipsis row in steps", () => {
    const longHex = "1234567890ABCDEF12"; // 18 hex digits
    const res = convert(longHex, 16, 10);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.steps?.isTruncated).toBe(true);
      expect(res.steps?.omittedCount).toBe(2);
      expect(res.steps?.rows.length).toBe(17); // 8 head + 1 ellipsis + 8 tail
      const ellipsisRow = res.steps?.rows.find((r) => r.isEllipsis);
      expect(ellipsisRow).toBeDefined();
    }
  });

  it("applies output formatting options accurately", () => {
    // Decimal grouping
    const resDecGrouped = convert("F4240", 16, 10, { groupDigits: true });
    expect(resDecGrouped.ok).toBe(true);
    if (resDecGrouped.ok) expect(resDecGrouped.output).toBe("1,000,000");

    // Hex lowercase
    const resHexLower = convert("255", 10, 16, { uppercase: false });
    expect(resHexLower.ok).toBe(true);
    if (resHexLower.ok) expect(resHexLower.output).toBe("ff");

    // Binary nibbles
    const resBinNibbles = convert("255", 10, 2, { groupNibbles: true });
    expect(resBinNibbles.ok).toBe(true);
    if (resBinNibbles.ok) expect(resBinNibbles.output).toBe("1111 1111");
  });

  it("passes property round-trip test across all 6 directions for 1,000 random values", () => {
    // Test 1000 values covering small numbers, 32-bit, 64-bit, and large 256-bit BigInts
    const hexChars = "0123456789ABCDEF";

    for (let i = 0; i < 1000; i++) {
      // Generate random positive BigInt
      const len = 1 + Math.floor(Math.random() * 40); // 1 to 40 hex digits
      let hexStr = "";
      for (let j = 0; j < len; j++) {
        const randIdx = Math.floor(Math.random() * 16);
        hexStr += hexChars[randIdx];
      }
      // Strip leading zeros unless length is 1
      hexStr = hexStr.replace(/^0+/, "") || "0";

      const bigVal = BigInt(`0x${hexStr}`);
      const decStr = bigVal.toString(10);
      const binStr = bigVal.toString(2);

      // Direction 1: Hex -> Dec -> Hex
      const h2d = convert(hexStr, 16, 10);
      expect(h2d.ok).toBe(true);
      if (h2d.ok) {
        expect(h2d.output).toBe(decStr);
        const d2h = convert(h2d.output, 10, 16);
        expect(d2h.ok).toBe(true);
        if (d2h.ok) expect(d2h.output).toBe(hexStr);
      }

      // Direction 2: Dec -> Bin -> Dec
      const d2b = convert(decStr, 10, 2);
      expect(d2b.ok).toBe(true);
      if (d2b.ok) {
        expect(d2b.output).toBe(binStr);
        const b2d = convert(d2b.output, 2, 10);
        expect(b2d.ok).toBe(true);
        if (b2d.ok) expect(b2d.output).toBe(decStr);
      }

      // Direction 3: Hex -> Bin -> Hex
      const h2b = convert(hexStr, 16, 2);
      expect(h2b.ok).toBe(true);
      if (h2b.ok) {
        expect(h2b.output).toBe(binStr);
        const b2h = convert(h2b.output, 2, 16);
        expect(b2h.ok).toBe(true);
        if (b2h.ok) expect(b2h.output).toBe(hexStr);
      }

      // Test negative variant periodically
      if (i % 10 === 0 && hexStr !== "0") {
        const negHex = `-${hexStr}`;
        const negH2D = convert(negHex, 16, 10);
        expect(negH2D.ok).toBe(true);
        if (negH2D.ok) {
          expect(negH2D.output).toBe(`-${decStr}`);
          const negD2H = convert(negH2D.output, 10, 16);
          expect(negD2H.ok).toBe(true);
          if (negD2H.ok) expect(negD2H.output).toBe(negHex);
        }
      }
    }
  });
});
