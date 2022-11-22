// pixel data
export class Canvas {
  static WIDTH = 32;

  static HEIGHT = 32;

  constructor() {
    this.pixels = [];
    this.transformByRowAndColumn(() => [0, 0, 0]);
  }

  traverseByRowAndColumn(fn) {
    for(let y = 0; y < Canvas.HEIGHT; y++) {
      for(let x = 0; x < Canvas.WIDTH; x++) {
        const index = y * Canvas.WIDTH + x;
        fn(x, y, this.pixels[index], index);
      }
    }
  }

  transformByRowAndColumn(fn) {
    for(let y = 0; y < Canvas.HEIGHT; y++) {
      for(let x = 0; x < Canvas.WIDTH; x++) {
        const index = y * Canvas.WIDTH + x;
        this.pixels[index] = fn(x, y, this.pixels[index], index);
      }
    }
  }

  assertBounds(x, y) {
    if(x < 0 || x > Canvas.WIDTH) {
      throw new Error(`x coordinate out of bounds: ${x} > ${Canvas.WIDTH}`);
    }

    if(y < 0 || y > Canvas.HEIGHT) {
      throw new Error(`y coordinate out of bounds: ${y} > ${Canvas.HEIGHT}`);
    }
  }

  set(x, y, color) {
    this.assertBounds(x, y);
    const oldValue = this.pixels[y * Canvas.WIDTH + x];
    this.pixels[y * Canvas.WIDTH + x] = color;
    return oldValue;
  }

  get(x, y) {
    this.assertBounds(x, y);
    return this.pixels[y * Canvas.WIDTH + x];
  }
}