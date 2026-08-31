#!/usr/bin/env node
// Erzeugt die PNG-Icons aus derselben Geometrie wie icon.svg — ohne externe Abhängigkeiten.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SS = 4; // Supersampling gegen Treppenkanten

const BG = [0x08, 0x08, 0x0a];
const WHITE = [0xff, 0xff, 0xff];
const ACCENT = [0xff, 0x3b, 0x5c];

const mix = (a, b, t) => a.map((value, index) => Math.round(value + (b[index] - value) * t));

function render(size, scale) {
  const big = size * SS;
  const center = big / 2;
  const unit = (big * scale) / 512;
  const pixels = Buffer.alloc(big * big * 3);

  const ring = 150 * unit;
  const ringWidth = 22 * unit;
  const seats = [
    { x: 0, y: -150, r: 46, ring: 54, color: ACCENT },
    { x: 130, y: 75, r: 30, ring: 0, color: WHITE },
    { x: -130, y: 75, r: 30, ring: 0, color: WHITE }
  ];

  for (let y = 0; y < big; y++) {
    for (let x = 0; x < big; x++) {
      const distance = Math.hypot(x - center + 0.5, y - center + 0.5);
      let color = BG;

      if (Math.abs(distance - ring) <= ringWidth / 2) color = WHITE;

      for (const seat of seats) {
        const seatDistance = Math.hypot(x - (center + seat.x * unit), y - (center + seat.y * unit));
        if (seat.ring && seatDistance <= seat.ring * unit) color = BG;
        if (seatDistance <= seat.r * unit) color = seat.color;
      }

      const offset = (y * big + x) * 3;
      pixels[offset] = color[0];
      pixels[offset + 1] = color[1];
      pixels[offset + 2] = color[2];
    }
  }

  const out = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) {
    out[y * (size * 3 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const sums = [0, 0, 0];
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const offset = ((y * SS + sy) * big + (x * SS + sx)) * 3;
          sums[0] += pixels[offset];
          sums[1] += pixels[offset + 1];
          sums[2] += pixels[offset + 2];
        }
      }
      const target = y * (size * 3 + 1) + 1 + x * 3;
      for (let channel = 0; channel < 3; channel++) {
        out[target + channel] = Math.round(sums[channel] / (SS * SS));
      }
    }
  }
  return out;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

function png(size, scale) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // Bittiefe
  header[9] = 2; // Truecolor
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(render(size, scale), { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

const targets = [
  ['icon-180.png', 180, 1],
  ['icon-192.png', 192, 1],
  ['icon-512.png', 512, 1],
  ['icon-maskable-512.png', 512, 0.72]
];

for (const [name, size, scale] of targets) {
  writeFileSync(join(ROOT, name), png(size, scale));
  console.log(`${name} · ${size}×${size}`);
}
