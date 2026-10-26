const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

// CRC32 implementation for PNG chunks
function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c;
  }
  return table;
}

const crcTable = makeCrcTable();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createPngChunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcPayload = Buffer.concat([typeBuf, data]);
  const crc = crc32(crcPayload);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lenBuf, crcPayload, crcBuf]);
}

function generatePng(width, height, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = createPngChunk("IHDR", ihdrData);

  // Scanlines (RGBA)
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // filter type 0: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      // Draw rounded dark card with indigo border
      const isBorder =
        x < 4 || x >= width - 4 || y < 4 || y >= height - 4;
      if (isBorder) {
        rawData[pixelOffset] = 99; // R (#6366F1)
        rawData[pixelOffset + 1] = 102; // G
        rawData[pixelOffset + 2] = 241; // B
        rawData[pixelOffset + 3] = 255; // A
      } else {
        rawData[pixelOffset] = r;
        rawData[pixelOffset + 1] = g;
        rawData[pixelOffset + 2] = b;
        rawData[pixelOffset + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createPngChunk("IDAT", compressedData);
  const iendChunk = createPngChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve(__dirname, "../public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PNG icons (dark background #07080A = 7, 8, 10)
fs.writeFileSync(path.join(publicDir, "apple-touch-icon.png"), generatePng(180, 180, 7, 8, 10));
fs.writeFileSync(path.join(publicDir, "icon-192.png"), generatePng(192, 192, 7, 8, 10));
fs.writeFileSync(path.join(publicDir, "icon-512.png"), generatePng(512, 512, 7, 8, 10));

// Copy icon.svg to public/icon.svg as well
const iconSvg = fs.readFileSync(path.resolve(__dirname, "../src/app/icon.svg"));
fs.writeFileSync(path.join(publicDir, "icon.svg"), iconSvg);

console.log("PNG and SVG icons generated successfully in public/.");
