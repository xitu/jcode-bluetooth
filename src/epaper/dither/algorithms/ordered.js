import {approximateColor} from './utils.js';

export function ordered(uint8data, palette, step, h, w) {
  const d = new Uint8ClampedArray(uint8data);
  const ratio = 3;
  const m = [
    [1, 9, 3, 11],
    [13, 5, 15, 7],
    [4, 12, 2, 10],
    [16, 8, 14, 6],
  ];

  let r,
    g,
    b,
    i,
    color,
    approx,
    tr,
    tg,
    tb,
    dx,
    dy,
    di;

  for(let y = 0; y < h; y += step) {
    for(let x = 0; x < w; x += step) {
      i = (4 * x) + (4 * y * w);

      // Define bytes
      r = i;
      g = i + 1;
      b = i + 2;

      d[r] += m[x % 4][y % 4] * ratio;
      d[g] += m[x % 4][y % 4] * ratio;
      d[b] += m[x % 4][y % 4] * ratio;

      color = [d[r], d[g], d[b]];
      approx = approximateColor(color, palette);
      tr = approx[0];
      tg = approx[1];
      tb = approx[2];

      // Draw a block
      for(dx = 0; dx < step; dx++) {
        for(dy = 0; dy < step; dy++) {
          di = i + (4 * dx) + (4 * w * dy);

          // Draw pixel
          d[di] = tr;
          d[di + 1] = tg;
          d[di + 2] = tb;
        }
      }
    }
  }
  return d;
}