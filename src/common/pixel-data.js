// pixel data
export class PixelData {
  constructor(width, height) {
    this._width = width;
    this._height = height;
    this.pixels = [];
    this.transformByRowAndColumn(() => [0, 0, 0]);
  }

  set width(value) {
    this._width = value;
    this.pixels = [];
    this.transformByRowAndColumn(() => [0, 0, 0]);
  }

  get width() {
    return this._width;
  }

  set height(value) {
    this._height = value;
    this.pixels = [];
    this.transformByRowAndColumn(() => [0, 0, 0]);
  }

  get height() {
    return this._height;
  }

  clone() {
    const cloned = new PixelData(this._width, this._height);
    cloned.pixels = [...this.pixels];
    return cloned;
  }

  fromImageData(imageData) {
    const data = imageData.data;
    this.transformByRowAndColumn((x, y, pixel, index) => {
      const i = index * 4;
      return [data[i], data[i + 1], data[i + 2]];
    });
    return this;
  }

  fromCanvas(canvas, scale = true) {
    if(scale && canvas.width !== this.width) {
      this.width = canvas.width;
      this.height = canvas.height;
    }
    const {width, height} = this;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, width, height);
    return this.fromImageData(imageData);
  }

  traverseByRowAndColumn(fn) {
    for(let y = 0; y < this._height; y++) {
      for(let x = 0; x < this._width; x++) {
        const index = y * this._width + x;
        fn(x, y, this.pixels[index], index);
      }
    }
  }

  transformByRowAndColumn(fn) {
    for(let y = 0; y < this._height; y++) {
      for(let x = 0; x < this._width; x++) {
        const index = y * this._width + x;
        this.pixels[index] = fn(x, y, this.pixels[index], index);
      }
    }
  }

  assertBounds(x, y) {
    if(x < 0 || x > this._width) {
      throw new Error(`x coordinate out of bounds: ${x} > ${this._width}`);
    }

    if(y < 0 || y > this._height) {
      throw new Error(`y coordinate out of bounds: ${y} > ${this._height}`);
    }
  }

  set(x, y, color) {
    this.assertBounds(x, y);
    const oldValue = this.pixels[y * this._width + x];
    this.pixels[y * this._width + x] = color;
    return oldValue;
  }

  get(x, y) {
    this.assertBounds(x, y);
    return this.pixels[y * this._width + x];
  }
}