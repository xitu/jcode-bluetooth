import {PixelData} from '../common/pixel-data.js';
import {int2Bytes} from './utils.js';
import {Dither} from './dither/index.js';

export class EpaperCore {
  static RAM_SIZE = 8000;

  static DITHER_AKTINSON = 'atkinson';

  static DITHER_ORDERED = 'ordered';

  static DITHER_ERR_DIFFUSION = 'errDiffusion';

  constructor({width = 250, height = 122, mtu = 127} = {}) {
    this._width = width;
    this._height = height;
    this._mtu = mtu;
    this._pixelData = new PixelData(width, height);
    this._paintCanvas = new OffscreenCanvas(width, height);
    this._ctx = this._paintCanvas.getContext('2d', {willReadFrequently: true});
    this._dither = new Dither();
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get frameBuffer() {
    return this._pixelData;
  }

  fromImage({image, x, y, width, height, dither, step, paletteType} = {}) {
    this._ctx.clearRect(0, 0, this.width, this.height);
    this._ctx.fillStyle = 'white';
    this._ctx.fillRect(0, 0, this.width, this.height);
    this._ctx.drawImage(image, x, y, width, height, 0, 0, this.width, this.height);
    const imageData = this._ctx.getImageData(0, 0, this.width, this.height);

    let palette;
    if(paletteType === 0) {
      palette = [[0, 0, 0], [255, 255, 255]];
    } else if(paletteType === 1) {
      palette = [[255, 0, 0], [255, 255, 255]];
    } else if(paletteType === 2) {
      palette = [[0, 0, 0], [255, 255, 255], [255, 0, 0]];
    } else {
      throw new Error('Invalid palette type.');
    }
    this._dither.ditherImageData(imageData, {
      algorithm: Dither[dither],
      palette,
      step,
    });

    this._pixelData.fromImageData(imageData);
    this._ctx.putImageData(imageData, 0, 0);

    return this._pixelData;
  }

  getARGBData() { // RGBA 转成32位整数
    const argbData = new Uint32Array(this._width * this._height);
    this._pixelData.traverseByRowAndColumn((x, y, color, i) => {
      const c = 0xFF000000 | color[0] << 16 | color[1] << 8 | color[2];
      argbData[i] = c;
    });
    return argbData;
  }

  encodeFrameBuffer() {
    const {width, height} = this;
    const colorLUT = new Map();

    colorLUT.set(0xFF000000, 0);
    colorLUT.set(0xFFFFFFFF, 1);
    colorLUT.set(0xFFFF0000, 3);

    const pixels = this.getARGBData();

    const displayBuffer = new Uint8Array(EpaperCore.RAM_SIZE);

    for(let y = 0; y < height; y++) {
      for(let x = 0; x < width; x++) {
        const color = pixels[(y * width) + x];
        const bits = colorLUT.get(color) & 0x3;
        const y2 = ((width - 1) - x);
        const index = (y2 * 32) + Math.floor(y / 4);
        const shift = ((y & 3) << 1);
        displayBuffer[index] |= (bits << shift);
      }
    }

    return displayBuffer;
  }

  decodeFrameBuffer(frameBuffer) {
    const {width, height} = this;
    const pixels = new Uint32Array(width * height);
    const colorLUT = [0xFF000000, 0xFFFFFFFF, 0, 0xFFFF0000];
    for(let y = 0; y < height; y++) {
      for(let x = 0; x < width; x++) {
        const y2 = ((width - 1) - x);
        const index = (y2 * 32) + Math.floor(y / 4);
        const shift = ((y & 3) << 1);
        const px = ((frameBuffer[index] >>> shift) & 0x3);
        pixels[y * width + x] = colorLUT[px];
      }
    }
    return pixels;
  }

  _getUploadPlayload(frameBuffer, offset) {
    const mtu = this._mtu;
    const action_write = 0x00;
    const header_size = 6;

    const trunkSize = Math.min((mtu - header_size), (EpaperCore.RAM_SIZE - offset));
    if(trunkSize <= 0) {
      throw new Error('Data out of bound.');
    }

    const data = new Uint8Array(mtu);
    data[0] = action_write;
    int2Bytes(data, 1, offset, 4);
    data[5] = trunkSize & 0xff;
    data.set(frameBuffer.subarray(offset, offset + trunkSize), header_size);
    // for(let i = 0; i < trunkSize; i++) {
    //   data[i + header_size] = frameBuffer[offset + i];
    // }

    return data;
  }

  generateUploadPlayloads(frameBuffer = this.encodeFrameBuffer()) {
    const payloads = [];
    const header_size = 6;

    for(let offset = 0; offset < EpaperCore.RAM_SIZE; offset += this._mtu - header_size) {
      payloads.push(this._getUploadPlayload(frameBuffer, offset));
    }
    return payloads;
  }
}