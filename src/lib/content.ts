import type { FaqItem } from "@/components/Faq";
import type { ReferenceRow } from "@/components/ReferenceTable";
import type { SupportedBase } from "@/lib/convert";

export interface ToolPageContent {
  slug: string;
  fromBase: SupportedBase;
  toBase: SupportedBase;
  h1: string;
  targetKeyword: string;
  metaTitle: string;
  metaDescription: string;
  intro: [string, string];
  workedExample: {
    heading: string;
    description: string;
    input: string;
    output: string;
    stepsList: string[];
    summary: string;
  };
  referenceTable: {
    title: string;
    caption: string;
    headers: [string, string, string?];
    rows: ReferenceRow[];
  };
  faqs: FaqItem[];
}

export const TOOL_PAGES: Record<string, ToolPageContent> = {
  "hex-to-decimal": {
    slug: "/hex-to-decimal",
    fromBase: 16,
    toBase: 10,
    h1: "Hex to Decimal Converter",
    targetKeyword: "hex to decimal",
    metaTitle: "Hex to Decimal Converter – Instant, Free, Step by Step | HexDec",
    metaDescription:
      "Convert hexadecimal to decimal instantly with full step-by-step math. Free, client-side, zero ads, unlimited BigInt precision, and complete reference charts.",
    intro: [
      "Convert any hexadecimal number (base 16) into its standard decimal equivalent (base 10) in real time with complete positional notation steps.",
      "Engineered with pure BigInt precision, this tool handles single byte codes up to 10,000-character cryptographic keys completely in your browser.",
    ],
    workedExample: {
      heading: "Worked Example: Converting 7DE to Decimal",
      description:
        "To convert the hexadecimal number 7DE to decimal, assign positional weights as powers of 16 starting from position 0 on the far right.",
      input: "7DE",
      output: "2014",
      stepsList: [
        "Position 2 (weight 16² = 256): Digit 7 has decimal value 7. Product = 7 × 256 = 1792.",
        "Position 1 (weight 16¹ = 16): Digit D has decimal value 13. Product = 13 × 16 = 208.",
        "Position 0 (weight 16⁰ = 1): Digit E has decimal value 14. Product = 14 × 1 = 14.",
        "Sum all products: 1792 + 208 + 14 = 2014.",
      ],
      summary: "Therefore, 7DE in base 16 is exactly equal to 2014 in decimal.",
    },
    referenceTable: {
      title: "Hex to Decimal Quick Reference",
      caption: "Conversion values for common hexadecimal digits and power boundaries",
      headers: ["Hexadecimal", "Decimal", "Description"],
      rows: [
        { col1: "0", col2: "0", note: "Zero" },
        { col1: "1", col2: "1", note: "One" },
        { col1: "9", col2: "9", note: "Last single digit" },
        { col1: "A", col2: "10", note: "Ten" },
        { col1: "B", col2: "11", note: "Eleven" },
        { col1: "C", col2: "12", note: "Twelve" },
        { col1: "D", col2: "13", note: "Thirteen" },
        { col1: "E", col2: "14", note: "Fourteen" },
        { col1: "F", col2: "15", note: "Fifteen (max single nibble)" },
        { col1: "10", col2: "16", note: "16¹" },
        { col1: "20", col2: "32", note: "32" },
        { col1: "40", col2: "64", note: "64" },
        { col1: "80", col2: "128", note: "128" },
        { col1: "FF", col2: "255", note: "Max 8-bit byte (2⁸ - 1)" },
        { col1: "100", col2: "256", note: "16² (256)" },
        { col1: "7DE", col2: "2014", note: "Worked example value" },
        { col1: "FFFF", col2: "65,535", note: "Max 16-bit word (2¹⁶ - 1)" },
      ],
    },
    faqs: [
      {
        question: "How do you convert hexadecimal to decimal manually?",
        answer:
          "To convert hex to decimal manually, write out each digit from right to left, assigning powers of 16 starting at 16⁰. Multiply each digit value (0–9, and 10–15 for A–F) by its corresponding power of 16, then sum the products together.",
      },
      {
        question: "What does the 0x prefix mean in hexadecimal?",
        answer:
          "The '0x' or '0X' prefix is a programming convention popularized by C, C++, Python, and JavaScript to indicate that the characters following are represented in base 16 rather than base 10.",
      },
      {
        question: "What are the values of hex letters A through F?",
        answer:
          "In hexadecimal, letters represent values from 10 to 15: A = 10, B = 11, C = 12, D = 13, E = 14, and F = 15. The casing does not change the numeric value (both 'a' and 'A' equal 10).",
      },
      {
        question: "What is the maximum number of digits this converter supports?",
        answer:
          "Unlike legacy online converters that restrict inputs to 16 characters or 64-bit integers, HexDec leverages native JavaScript BigInt arithmetic, supporting calculations over 10,000 characters without rounding or overflow.",
      },
      {
        question: "Is any conversion data sent to a backend server?",
        answer:
          "No. All number parsing, string normalization, and positional math calculations execute strictly inside your local web browser. No telemetry or values ever touch a network server.",
      },
    ],
  },

  "decimal-to-hex": {
    slug: "/decimal-to-hex",
    fromBase: 10,
    toBase: 16,
    h1: "Decimal to Hex Converter",
    targetKeyword: "decimal to hex",
    metaTitle: "Decimal to Hex Converter – Fast, Accurate, Step by Step | HexDec",
    metaDescription:
      "Convert decimal integers to hexadecimal strings instantly with division-by-16 steps. Free, private, live calculation with uppercase toggle and zero ads.",
    intro: [
      "Convert base 10 decimal integers into clean hexadecimal strings in real time using verified repeated division algorithms.",
      "Toggle between uppercase and lowercase hex notation, strip leading zeros, and verify multi-million digit calculations without precision limits.",
    ],
    workedExample: {
      heading: "Worked Example: Converting 2014 to Hexadecimal",
      description:
        "To convert the decimal integer 2014 to hexadecimal, repeatedly divide by 16 and record the remainder at each step until the quotient becomes 0.",
      input: "2014",
      output: "7DE",
      stepsList: [
        "Divide 2014 by 16: Quotient = 125, Remainder = 14. Remainder 14 corresponds to hex digit E.",
        "Divide 125 by 16: Quotient = 7, Remainder = 13. Remainder 13 corresponds to hex digit D.",
        "Divide 7 by 16: Quotient = 0, Remainder = 7. Remainder 7 corresponds to hex digit 7.",
        "Read the recorded remainder digits in reverse order (bottom to top): 7, D, E.",
      ],
      summary: "Therefore, 2014 in decimal equals 7DE in hexadecimal.",
    },
    referenceTable: {
      title: "Decimal to Hex Reference Table",
      caption: "Common decimal integers and their corresponding hexadecimal encodings",
      headers: ["Decimal", "Hexadecimal", "Category"],
      rows: [
        { col1: "0", col2: "0", note: "Zero" },
        { col1: "10", col2: "A", note: "First letter digit" },
        { col1: "15", col2: "F", note: "Nibble maximum" },
        { col1: "16", col2: "10", note: "Base 16 boundary" },
        { col1: "32", col2: "20", note: "Multiple of 16" },
        { col1: "64", col2: "40", note: "Quarter byte" },
        { col1: "100", col2: "64", note: "Century" },
        { col1: "255", col2: "FF", note: "One full byte" },
        { col1: "256", col2: "100", note: "16² power" },
        { col1: "1000", col2: "3E8", note: "Kilobyte prefix benchmark" },
        { col1: "2014", col2: "7DE", note: "Worked example value" },
        { col1: "65,535", col2: "FFFF", note: "Two full bytes" },
      ],
    },
    faqs: [
      {
        question: "How do you convert decimal to hexadecimal by hand?",
        answer:
          "Divide your decimal number by 16. Record the integer quotient and the remainder (0–15). If the remainder is 10–15, map it to A–F. Repeat dividing the quotient until you reach 0, then read your remainders from last to first.",
      },
      {
        question: "Why do programmers use hexadecimal instead of decimal?",
        answer:
          "Computers store data in binary bits. Since 16 is 2⁴, exactly one hex character represents 4 binary bits (a nibble), and two hex characters represent an 8-bit byte. This makes reading memory addresses, machine code, and color values far more compact and human-readable than raw binary or decimal.",
      },
      {
        question: "Can decimal to hex handle negative integers?",
        answer:
          "Yes. HexDec supports standard sign-magnitude negative values by preserving the '-' prefix (e.g. -2014 converts to -7DE).",
      },
      {
        question: "How does the uppercase hex toggle work?",
        answer:
          "The formatting toggle lets you choose between standard uppercase digits ('7DE') and lowercase notation ('7de') according to your codebase style guide or protocol requirements.",
      },
      {
        question: "What is the largest decimal number this converter can handle?",
        answer:
          "The tool handles integers exceeding 10,000 digits using native BigInt data types with zero floating-point rounding errors.",
      },
    ],
  },

  "binary-to-decimal": {
    slug: "/binary-to-decimal",
    fromBase: 2,
    toBase: 10,
    h1: "Binary to Decimal Converter",
    targetKeyword: "binary to decimal",
    metaTitle: "Binary to Decimal Converter – Instant, Step by Step | HexDec",
    metaDescription:
      "Convert binary bits (base 2) into decimal integers (base 10) instantly. Free, private, live calculation with positional powers and full bit breakdown.",
    intro: [
      "Convert raw binary strings of zeros and ones into standard base 10 integers with live power-of-two positional calculations.",
      "Includes nibble-grouped formatting, arbitrary bit-length inputs, and instant step-by-step verification.",
    ],
    workedExample: {
      heading: "Worked Example: Converting 110101 to Decimal",
      description:
        "To convert the binary number 110101 to decimal, evaluate powers of 2 for each active bit position from right (position 0) to left.",
      input: "110101",
      output: "53",
      stepsList: [
        "Position 5 (2⁵ = 32): Bit 1 × 32 = 32.",
        "Position 4 (2⁴ = 16): Bit 1 × 16 = 16.",
        "Position 3 (2³ = 8): Bit 0 × 8 = 0.",
        "Position 2 (2² = 4): Bit 1 × 4 = 4.",
        "Position 1 (2¹ = 2): Bit 0 × 2 = 0.",
        "Position 0 (2⁰ = 1): Bit 1 × 1 = 1.",
        "Sum all products: 32 + 16 + 0 + 4 + 0 + 1 = 53.",
      ],
      summary: "Therefore, the binary sequence 110101 equals 53 in decimal.",
    },
    referenceTable: {
      title: "Binary to Decimal Powers of 2",
      caption: "Essential binary bit positions and their standard decimal values",
      headers: ["Binary", "Decimal", "Bit Weight"],
      rows: [
        { col1: "1", col2: "1", note: "2⁰" },
        { col1: "10", col2: "2", note: "2¹" },
        { col1: "100", col2: "4", note: "2²" },
        { col1: "1000", col2: "8", note: "2³" },
        { col1: "10000", col2: "16", note: "2⁴" },
        { col1: "100000", col2: "32", note: "2⁵" },
        { col1: "110101", col2: "53", note: "Worked example value" },
        { col1: "1000000", col2: "64", note: "2⁶" },
        { col1: "10000000", col2: "128", note: "2⁷" },
        { col1: "11111111", col2: "255", note: "Max 8-bit unsigned value" },
        { col1: "100000000", col2: "256", note: "2⁸" },
      ],
    },
    faqs: [
      {
        question: "How do you calculate binary to decimal manually?",
        answer:
          "Write down the powers of 2 (1, 2, 4, 8, 16, 32, 64, 128...) under each bit from right to left. Add together only the powers of 2 that have a '1' above them.",
      },
      {
        question: "Can I enter binary numbers with spaces between nibbles?",
        answer:
          "Yes. Our input sanitizer automatically ignores spaces, underscores, and commas (e.g. '1101 0101' and '1101_0101' parse identically).",
      },
      {
        question: "What does the 0b prefix mean?",
        answer:
          "The '0b' or '0B' prefix indicates a binary literal in programming languages like Python, JavaScript (ES6+), Java, and C++.",
      },
      {
        question: "What happens if I type a digit other than 0 or 1?",
        answer:
          "The converter detects non-binary characters immediately and displays an inline error highlighting the first invalid character and its position.",
      },
      {
        question: "Can this tool convert 64-bit and 128-bit binary registers?",
        answer:
          "Yes. HexDec uses BigInt math and can calculate binary sequences of several thousand bits without truncation or precision degradation.",
      },
    ],
  },

  "decimal-to-binary": {
    slug: "/decimal-to-binary",
    fromBase: 10,
    toBase: 2,
    h1: "Decimal to Binary Converter",
    targetKeyword: "decimal to binary",
    metaTitle: "Decimal to Binary Converter – Instant, Free, Step by Step | HexDec",
    metaDescription:
      "Convert decimal numbers into binary bits instantly. Free, private, client-side calculator with division-by-2 steps and 4-bit nibble formatting.",
    intro: [
      "Convert positive and negative base 10 decimal integers into exact binary strings in real time.",
      "Includes automatic 4-bit nibble grouping, copy-to-clipboard functionality, and verified mathematical division steps.",
    ],
    workedExample: {
      heading: "Worked Example: Converting 53 to Binary",
      description:
        "To convert the decimal number 53 to binary, repeatedly divide by 2 and collect the remainders (0 or 1) until the quotient is 0.",
      input: "53",
      output: "110101",
      stepsList: [
        "53 ÷ 2 = 26 remainder 1.",
        "26 ÷ 2 = 13 remainder 0.",
        "13 ÷ 2 = 6 remainder 1.",
        "6 ÷ 2 = 3 remainder 0.",
        "3 ÷ 2 = 1 remainder 1.",
        "1 ÷ 2 = 0 remainder 1.",
        "Read remainders from bottom to top: 1, 1, 0, 1, 0, 1.",
      ],
      summary: "Therefore, 53 in decimal is 110101 in binary (or 0011 0101 in an 8-bit byte).",
    },
    referenceTable: {
      title: "Decimal to Binary Lookup Chart",
      caption: "Benchmark decimal integers and their corresponding binary values",
      headers: ["Decimal", "Binary (Raw)", "Binary (Nibble Grouped)"],
      rows: [
        { col1: "1", col2: "1", note: "0001" },
        { col1: "2", col2: "10", note: "0010" },
        { col1: "4", col2: "100", note: "0100" },
        { col1: "8", col2: "1000", note: "1000" },
        { col1: "15", col2: "1111", note: "1111" },
        { col1: "16", col2: "10000", note: "0001 0000" },
        { col1: "32", col2: "100000", note: "0010 0000" },
        { col1: "53", col2: "110101", note: "0011 0101 (Worked Example)" },
        { col1: "64", col2: "1000000", note: "0100 0000" },
        { col1: "128", col2: "10000000", note: "1000 0000" },
        { col1: "255", col2: "11111111", note: "1111 1111" },
      ],
    },
    faqs: [
      {
        question: "How do you convert decimal to binary using division?",
        answer:
          "Divide your decimal number by 2. Write down the remainder (which will always be 0 or 1). Take the whole number quotient and repeat division by 2 until the quotient reaches 0. Write the remainders in reverse order to get the binary answer.",
      },
      {
        question: "Why are binary numbers grouped into groups of 4?",
        answer:
          "Grouping bits into groups of 4 (known as nibbles) improves readability and makes direct translation to hexadecimal effortless, since each nibble directly equals one hex digit.",
      },
      {
        question: "How does the converter handle negative decimal numbers?",
        answer:
          "Negative inputs are converted in sign-magnitude representation, preserving the negative sign in the binary output.",
      },
      {
        question: "What is the maximum decimal number supported?",
        answer:
          "The converter is built on JavaScript BigInt and easily supports numbers with thousands of decimal digits.",
      },
      {
        question: "Is internet access required to convert numbers?",
        answer:
          "No. Once the web page loads in your browser, all conversion computations run completely offline on your device.",
      },
    ],
  },

  "hex-to-binary": {
    slug: "/hex-to-binary",
    fromBase: 16,
    toBase: 2,
    h1: "Hex to Binary Converter",
    targetKeyword: "hex to binary",
    metaTitle: "Hex to Binary Converter – Instant 4-Bit Nibble Output | HexDec",
    metaDescription:
      "Convert hexadecimal into binary bits with instant 4-bit nibble mapping. Free, private, browser-based converter with zero ads and BigInt precision.",
    intro: [
      "Convert hexadecimal characters into their exact 4-bit binary representations with instant live conversion.",
      "Each hex digit translates cleanly into a 4-bit binary nibble, making memory address and byte inspections fast and intuitive.",
    ],
    workedExample: {
      heading: "Worked Example: Converting 2F to Binary",
      description:
        "Converting hexadecimal to binary is straightforward because each hex digit corresponds exactly to 4 binary bits.",
      input: "2F",
      output: "101111",
      stepsList: [
        "Take the first digit '2': In 4-bit binary, 2 is 0010.",
        "Take the second digit 'F': In 4-bit binary, F (decimal 15) is 1111.",
        "Concatenate the nibbles: 0010 1111.",
        "Strip leading zeros for the minimal representation: 101111.",
      ],
      summary: "Therefore, 2F in hexadecimal equals 0010 1111 in binary (minimal value 101111).",
    },
    referenceTable: {
      title: "Hex to 4-Bit Binary Conversion Table",
      caption: "Direct mapping between single hexadecimal digits and 4-bit binary nibbles",
      headers: ["Hex Digit", "Decimal Value", "4-Bit Binary"],
      rows: [
        { col1: "0", col2: "0", note: "0000" },
        { col1: "1", col2: "1", note: "0001" },
        { col1: "2", col2: "2", note: "0010" },
        { col1: "3", col2: "3", note: "0011" },
        { col1: "4", col2: "4", note: "0100" },
        { col1: "5", col2: "5", note: "0101" },
        { col1: "6", col2: "6", note: "0110" },
        { col1: "7", col2: "7", note: "0111" },
        { col1: "8", col2: "8", note: "1000" },
        { col1: "9", col2: "9", note: "1001" },
        { col1: "A", col2: "10", note: "1010" },
        { col1: "B", col2: "11", note: "1011" },
        { col1: "C", col2: "12", note: "1100" },
        { col1: "D", col2: "13", note: "1101" },
        { col1: "E", col2: "14", note: "1110" },
        { col1: "F", col2: "15", note: "1111" },
      ],
    },
    faqs: [
      {
        question: "How do you convert hex to binary directly without using decimal?",
        answer:
          "Simply substitute each hex character with its 4-bit binary counterpart (e.g., A becomes 1010, 3 becomes 0011). Combine the 4-bit groups in the exact same order.",
      },
      {
        question: "Why does 1 hex digit equal 4 binary bits?",
        answer:
          "Because 2⁴ = 16. A single hex digit can take on 16 distinct values (0 to 15), which is precisely the number of unique combinations that 4 binary bits can represent (0000 to 1111).",
      },
      {
        question: "Does letter casing matter when converting hex to binary?",
        answer:
          "No, hexadecimal is case-insensitive. Entering '2f' produces the exact same binary output as '2F'.",
      },
      {
        question: "Can I paste an entire byte array or MAC address?",
        answer:
          "Yes. Our sanitizer strips colons, dashes, and spaces, allowing you to paste formatted values like '00:1A:2B' directly.",
      },
      {
        question: "How does nibble grouping help in binary output?",
        answer:
          "Enabling the 4-bit nibble grouping toggle inserts a space between each 4 bits, allowing you to visually line up each binary segment with its corresponding hex character.",
      },
    ],
  },

  "binary-to-hex": {
    slug: "/binary-to-hex",
    fromBase: 2,
    toBase: 16,
    h1: "Binary to Hex Converter",
    targetKeyword: "binary to hex",
    metaTitle: "Binary to Hex Converter – Fast 4-Bit Grouping | HexDec",
    metaDescription:
      "Convert binary sequences into compact hexadecimal notation instantly. Free, client-side, zero ads, with uppercase toggle and unlimited bit-length support.",
    intro: [
      "Convert binary bitstreams into compact, human-readable hexadecimal codes in real time.",
      "Groups bits from right to left into 4-bit nibbles, with uppercase/lowercase toggles and zero precision limits.",
    ],
    workedExample: {
      heading: "Worked Example: Converting 11011111 to Hex",
      description:
        "To convert binary to hexadecimal, divide the bits into groups of 4 starting from the right. If the leftmost group has fewer than 4 bits, pad with leading zeros.",
      input: "11011111",
      output: "DF",
      stepsList: [
        "Divide into 4-bit nibbles from right: [1101] and [1111].",
        "First nibble (1101): 8 + 4 + 0 + 1 = 13, which equals hex digit D.",
        "Second nibble (1111): 8 + 4 + 2 + 1 = 15, which equals hex digit F.",
        "Combine the resulting hex characters: DF.",
      ],
      summary: "Therefore, the binary sequence 11011111 is DF in hexadecimal (decimal 223).",
    },
    referenceTable: {
      title: "Binary to Hex Conversion Table",
      caption: "Standard 4-bit binary values and their single-character hexadecimal equivalents",
      headers: ["Binary (4-Bit)", "Decimal", "Hex Character"],
      rows: [
        { col1: "0000", col2: "0", note: "0" },
        { col1: "0001", col2: "1", note: "1" },
        { col1: "0010", col2: "2", note: "2" },
        { col1: "0011", col2: "3", note: "3" },
        { col1: "0100", col2: "4", note: "4" },
        { col1: "0101", col2: "5", note: "5" },
        { col1: "0110", col2: "6", note: "6" },
        { col1: "0111", col2: "7", note: "7" },
        { col1: "1000", col2: "8", note: "8" },
        { col1: "1001", col2: "9", note: "9" },
        { col1: "1010", col2: "10", note: "A" },
        { col1: "1011", col2: "11", note: "B" },
        { col1: "1100", col2: "12", note: "C" },
        { col1: "1101", col2: "13", note: "D" },
        { col1: "1110", col2: "14", note: "E" },
        { col1: "1111", col2: "15", note: "F" },
      ],
    },
    faqs: [
      {
        question: "How do you convert binary to hex quickly?",
        answer:
          "Group the binary digits into sets of four from right to left. Translate each 4-bit set into its single hexadecimal character (0–9, A–F). Combine the characters in the same order.",
      },
      {
        question: "What if the total number of binary bits is not divisible by 4?",
        answer:
          "Always start grouping from the right (least significant bit). If the leftmost group has fewer than 4 bits, add imaginary leading zeros to make it a full 4 bits before converting.",
      },
      {
        question: "Why is hex more common than binary in systems programming?",
        answer:
          "Binary strings are very long and difficult for humans to read without errors. Hexadecimal compresses 4 bits into 1 character, cutting string length by 75% while keeping bit boundaries intact.",
      },
      {
        question: "Can I convert large binary files or hashes with this tool?",
        answer:
          "Yes. HexDec handles bitstrings up to 10,000 characters without crashing or slowing down your browser.",
      },
      {
        question: "Does the output update automatically as I type?",
        answer:
          "Yes. The conversion occurs live on every keystroke with zero delay and without needing to click any 'Convert' button.",
      },
    ],
  },
};
