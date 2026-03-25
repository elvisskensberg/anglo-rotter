#!/usr/bin/env node
/**
 * Generates minimal valid PNG icon files for the MultiRotter PWA.
 * Creates solid #71B7E6 (theme blue) squares at 192x192 and 512x512.
 *
 * Uses raw PNG binary construction: IHDR + IDAT (zlib-deflated scanlines) + IEND.
 * No external dependencies required — pure Node.js crypto + zlib.
 */

import { createDeflate } from "zlib";
import { promisify } from "util";
import { deflate } from "zlib";
import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const deflateAsync = promisify(deflate);

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = resolve(__dirname, "../public/icons");

// Theme color #71B7E6 = R:113, G:183, B:230
const R = 113;
const G = 183;
const B = 230;

function crc32(buf) {
  let crc = 0xffffffff;
  const table = makeCrcTable();
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

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

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcVal = Buffer.alloc(4);
  crcVal.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([length, typeBytes, data, crcVal]);
}

async function generatePng(size) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk: width, height, bit depth 8, color type 2 (RGB), compression 0, filter 0, interlace 0
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);  // width
  ihdrData.writeUInt32BE(size, 4);  // height
  ihdrData[8] = 8;   // bit depth
  ihdrData[9] = 2;   // color type: RGB
  ihdrData[10] = 0;  // compression
  ihdrData[11] = 0;  // filter
  ihdrData[12] = 0;  // interlace

  // Build raw scanlines: each row is [filter_byte=0, R, G, B, R, G, B, ...]
  const rowSize = 1 + size * 3; // 1 filter byte + RGB per pixel
  const rawData = Buffer.alloc(size * rowSize);
  for (let y = 0; y < size; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // filter type: None
    for (let x = 0; x < size; x++) {
      const pixelOffset = rowOffset + 1 + x * 3;
      rawData[pixelOffset] = R;
      rawData[pixelOffset + 1] = G;
      rawData[pixelOffset + 2] = B;
    }
  }

  // Compress with zlib (deflate)
  const compressed = await deflateAsync(rawData, { level: 6 });

  // IEND chunk
  const iendData = Buffer.alloc(0);

  const png = Buffer.concat([
    signature,
    pngChunk("IHDR", ihdrData),
    pngChunk("IDAT", compressed),
    pngChunk("IEND", iendData),
  ]);

  return png;
}

async function main() {
  mkdirSync(iconsDir, { recursive: true });

  const sizes = [192, 512];
  for (const size of sizes) {
    const png = await generatePng(size);
    const outPath = resolve(iconsDir, `icon-${size}x${size}.png`);
    writeFileSync(outPath, png);
    console.log(`Generated: ${outPath} (${png.length} bytes)`);
  }
  console.log("Icons generated successfully.");
}

main().catch((err) => {
  console.error("Failed to generate icons:", err);
  process.exit(1);
});
