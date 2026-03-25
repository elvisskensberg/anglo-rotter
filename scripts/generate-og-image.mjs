/**
 * Generates a minimal valid PNG file at public/og-image.png
 * 1200x630, solid #71B7E6 background (Rotter.net main header blue)
 * Uses only built-in Node.js modules — no canvas or sharp required.
 *
 * PNG format reference:
 * https://www.w3.org/TR/PNG/
 */

import { createWriteStream } from "fs";
import { createDeflate } from "zlib";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_PATH = join(__dirname, "..", "public", "og-image.png");

const WIDTH = 1200;
const HEIGHT = 630;

// #71B7E6 = R:113, G:183, B:230
const R = 0x71;
const G = 0xb7;
const B = 0xe6;

// --- CRC32 table ---
function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
}
const CRC_TABLE = makeCrcTable();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function uint32BE(n) {
  const b = Buffer.allocUnsafe(4);
  b.writeUInt32BE(n, 0);
  return b;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const lenBytes = uint32BE(data.length);
  const crcVal = crc32(Buffer.concat([typeBytes, data]));
  return Buffer.concat([lenBytes, typeBytes, data, uint32BE(crcVal)]);
}

// IHDR: 13 bytes
function ihdr(width, height) {
  const data = Buffer.allocUnsafe(13);
  data.writeUInt32BE(width, 0);
  data.writeUInt32BE(height, 4);
  data[8] = 8; // bit depth
  data[9] = 2; // color type: RGB truecolor
  data[10] = 0; // compression method
  data[11] = 0; // filter method
  data[12] = 0; // interlace method
  return chunk("IHDR", data);
}

// Build raw image data: each row has a filter byte (0 = None) + RGB pixels
function buildRawRows(width, height, r, g, b) {
  const rowSize = 1 + width * 3;
  const raw = Buffer.allocUnsafe(rowSize * height);
  for (let y = 0; y < height; y++) {
    const offset = y * rowSize;
    raw[offset] = 0; // filter byte: None
    for (let x = 0; x < width; x++) {
      raw[offset + 1 + x * 3] = r;
      raw[offset + 1 + x * 3 + 1] = g;
      raw[offset + 1 + x * 3 + 2] = b;
    }
  }
  return raw;
}

function deflateSync(buf) {
  return new Promise((resolve, reject) => {
    const deflate = createDeflate({ level: 1 });
    const chunks = [];
    deflate.on("data", (c) => chunks.push(c));
    deflate.on("end", () => resolve(Buffer.concat(chunks)));
    deflate.on("error", reject);
    deflate.end(buf);
  });
}

async function generatePng() {
  const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const rawRows = buildRawRows(WIDTH, HEIGHT, R, G, B);
  const compressed = await deflateSync(rawRows);

  const idatChunk = chunk("IDAT", compressed);
  const iendChunk = chunk("IEND", Buffer.alloc(0));

  const png = Buffer.concat([PNG_SIGNATURE, ihdr(WIDTH, HEIGHT), idatChunk, iendChunk]);

  const ws = createWriteStream(OUTPUT_PATH);
  ws.write(png);
  ws.end();

  await new Promise((resolve, reject) => {
    ws.on("finish", resolve);
    ws.on("error", reject);
  });

  const sizeKB = (png.length / 1024).toFixed(1);
  console.log(`Generated: ${OUTPUT_PATH}`);
  console.log(`Size: ${sizeKB} KB (${WIDTH}x${HEIGHT} px, #${R.toString(16)}${G.toString(16)}${B.toString(16)})`);
}

generatePng().catch((err) => {
  console.error("Failed to generate OG image:", err);
  process.exit(1);
});
