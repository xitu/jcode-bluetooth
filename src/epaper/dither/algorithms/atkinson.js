import {approximateColor} from './utils.js';

export function atkinson(uint8data, palette, step, h, w) {
  const d = new Uint8ClampedArray(uint8data);
  const out = new Uint8ClampedArray(uint8data);
  const ratio = 1 / 8;

  const $i = function (x, y) {
    return (4 * x) + (4 * y * w);
  };

  let r,
    g,
    b,
    q,
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

      color = [d[r], d[g], d[b]];
      approx = approximateColor(color, palette);

      q = [];
      q[r] = d[r] - approx[0];
      q[g] = d[g] - approx[1];
      q[b] = d[b] - approx[2];

      // Diffuse the error for three colors
      d[$i(x + step, y) + 0] += ratio * q[r];
      d[$i(x - step, y + step) + 0] += ratio * q[r];
      d[$i(x, y + step) + 0] += ratio * q[r];
      d[$i(x + step, y + step) + 0] += ratio * q[r];
      d[$i(x + (2 * step), y) + 0] += ratio * q[r];
      d[$i(x, y + (2 * step)) + 0] += ratio * q[r];

      d[$i(x + step, y) + 1] += ratio * q[g];
      d[$i(x - step, y + step) + 1] += ratio * q[g];
      d[$i(x, y + step) + 1] += ratio * q[g];
      d[$i(x + step, y + step) + 1] += ratio * q[g];
      d[$i(x + (2 * step), y) + 1] += ratio * q[g];
      d[$i(x, y + (2 * step)) + 1] += ratio * q[g];

      d[$i(x + step, y) + 2] += ratio * q[b];
      d[$i(x - step, y + step) + 2] += ratio * q[b];
      d[$i(x, y + step) + 2] += ratio * q[b];
      d[$i(x + step, y + step) + 2] += ratio * q[b];
      d[$i(x + (2 * step), y) + 2] += ratio * q[b];
      d[$i(x, y + (2 * step)) + 2] += ratio * q[b];

      tr = approx[0];
      tg = approx[1];
      tb = approx[2];

      // Draw a block
      for(dx = 0; dx < step; dx++) {
        for(dy = 0; dy < step; dy++) {
          di = i + (4 * dx) + (4 * w * dy);

          // Draw pixel
          out[di] = tr;
          out[di + 1] = tg;
          out[di + 2] = tb;
        }
      }
    }
  }
  return out;
}