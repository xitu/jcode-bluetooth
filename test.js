import {EpaperCore} from './src/epaper/epaper-core.js';

const epaper = new EpaperCore();
epaper.frameBuffer.transformByRowAndColumn((x, y) => {
  return [0xFF, 0, 0];
});
// epaper.frameBuffer.pixels[250 * 100 + 2] = [0xFF, 0, 0];

const pixels = epaper.getARGBData();
console.log(pixels);
const buffer = epaper.encodeFrameBuffer();
console.log(buffer);

for(let i = 0; i < buffer.length; i++) {
  if(buffer[i] !== 0) {
    console.log(i, buffer[i]);
  }
}

const payloads = epaper.generateUploadPlayloads();
console.log(payloads);

console.log(payloads.slice(-1));

const decoded = epaper.decodeFrameBuffer(buffer);
// console.log(decoded);

for(let i = 0; i < pixels.length; i++) {
  if(pixels[i] !== decoded[i]) {
    throw new Error(`pixel mismatch at index ${i}`);
  }
}

// Pixoo: 11:75:58:A1:21:3E
// Pixoo-max: 11:75:58:A5:B1:0A
// Pixoo64: C0:03:56:FA:EB:51