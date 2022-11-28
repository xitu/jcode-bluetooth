import {PixelData} from '../common/pixel-data.js';
import {int2Bytes} from './utils.js';

export class EpaperCore {
  static RAM_SIZE = 8000;

  constructor(width = 250, height = 122, mtu = 20) {
    this._width = width;
    this._height = height;
    this._mtu = mtu;
    this._pixelData = new PixelData(width, height);
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

  getARGBData() {
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

  getUploadPlayload(frameBuffer, offset) {
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
      payloads.push(this.getUploadPlayload(frameBuffer, offset));
    }
    return payloads;
  }
}