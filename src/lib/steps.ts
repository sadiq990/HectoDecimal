export interface StepRow {
  digit: string;
  value: string;
  position: number;
  power: string;
  powerFormatted: string;
  product: string;
  runningSum: string;
  isEllipsis?: boolean;
  omittedCount?: number;
}

export interface StepsResult {
  fromBase: 2 | 16;
  toBase: 10;
  inputMagnitude: string;
  isNegative: boolean;
  rows: StepRow[];
  totalDigits: number;
  isTruncated: boolean;
  omittedCount: number;
  finalSum: string;
  formula: string;
}

const SUPERSCRIPTS: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "-": "⁻",
};

export function toSuperscript(num: number): string {
  const s = num.toString();
  return s
    .split("")
    .map((ch) => SUPERSCRIPTS[ch] ?? `^${ch}`)
    .join("");
}

export function formatPowerString(base: number, exponent: number): string {
  if (exponent <= 9) {
    return `${base}${toSuperscript(exponent)}`;
  }
  return `${base}^${exponent}`;
}

/**
 * Generates positional notation conversion steps for hex->decimal and binary->decimal.
 */
export function generateSteps(
  rawDigits: string,
  fromBase: 2 | 16,
  isNegative = false
): StepsResult {
  const digits = rawDigits.toUpperCase();
  const totalDigits = digits.length;

  if (totalDigits === 0) {
    return {
      fromBase,
      toBase: 10,
      inputMagnitude: "",
      isNegative,
      rows: [],
      totalDigits: 0,
      isTruncated: false,
      omittedCount: 0,
      finalSum: "0",
      formula: "",
    };
  }

  const baseBig = BigInt(fromBase);
  let runningSumBig = 0n;

  // Build all individual step rows first
  const allRows: StepRow[] = [];
  const formulaTerms: string[] = [];

  for (let i = 0; i < totalDigits; i++) {
    const digit = digits[i] ?? "0";
    const position = totalDigits - 1 - i;
    const valueBig = BigInt(Number.parseInt(digit, fromBase));
    const powerBig = baseBig ** BigInt(position);
    const productBig = valueBig * powerBig;
    runningSumBig += productBig;

    const powerFormatted = formatPowerString(fromBase, position);

    allRows.push({
      digit,
      value: valueBig.toString(),
      position,
      power: powerBig.toString(),
      powerFormatted,
      product: productBig.toString(),
      runningSum: runningSumBig.toString(),
    });

    if (totalDigits <= 16) {
      formulaTerms.push(`${valueBig.toString()}×${powerFormatted}`);
    }
  }

  const finalSum = isNegative ? `-${runningSumBig.toString()}` : runningSumBig.toString();

  // If longer than 16 digits: show first 8 and last 8 rows with an ellipsis row in between
  let displayRows: StepRow[] = allRows;
  let isTruncated = false;
  let omittedCount = 0;

  if (totalDigits > 16) {
    isTruncated = true;
    omittedCount = totalDigits - 16;
    const head = allRows.slice(0, 8);
    const tail = allRows.slice(totalDigits - 8);

    const ellipsisRow: StepRow = {
      digit: "…",
      value: "…",
      position: -1,
      power: "…",
      powerFormatted: "…",
      product: "…",
      runningSum: "…",
      isEllipsis: true,
      omittedCount,
    };

    displayRows = [...head, ellipsisRow, ...tail];
  }

  // Formula summary
  let formula = "";
  if (totalDigits <= 8) {
    const termStr = formulaTerms.join(" + ");
    formula = `${digits} = ${termStr} = ${finalSum}`;
  } else if (totalDigits <= 16) {
    const termStr = formulaTerms.slice(0, 4).join(" + ") + " + … + " + formulaTerms.slice(-2).join(" + ");
    formula = `${digits} = ${termStr} = ${finalSum}`;
  } else {
    formula = `${digits.slice(0, 6)}…${digits.slice(-4)} = (sum of ${totalDigits} positional terms) = ${finalSum}`;
  }

  if (isNegative && totalDigits > 0) {
    formula = `-${digits} = -(${formula.split(" = ")[1] ?? finalSum}) = ${finalSum}`;
  }

  return {
    fromBase,
    toBase: 10,
    inputMagnitude: digits,
    isNegative,
    rows: displayRows,
    totalDigits,
    isTruncated,
    omittedCount,
    finalSum,
    formula,
  };
}
