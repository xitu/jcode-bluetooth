// https://github.com/jakobwesthoff/divoom-pixoo-max-nodejs
import {TinyColor} from '@ctrl/tinycolor';
import {int2hexlittle, number2HexString} from './utils.js';
import {TimeboxEvoMessage} from './message.js';
import {Canvas} from './canvas.js';

export class Pixoo {
  constructor(server = 'http://localhost:9527', width = 16, height = 16) {
    this._server = server;
    this._matrix = new Canvas(width, height);
    this._canvas = null;
    this._updatePromise = null;
    this._updateDelay = 0;

    if(typeof OffscreenCanvas === 'function') {
      const pixoo = this;
      class PixooCanvas extends OffscreenCanvas {
        get width() {
          return super.width;
        }

        get height() {
          return super.height;
        }

        getContext(type, args = {}) {
          if(args.willReadFrequently !== false) args.willReadFrequently = true;
          if(type === '2d') {
            if(this._ctx) return this._ctx;
            this._ctx = super.getContext(type, args);
            const {fill, stroke, fillRect, drawImage, clearRect} = this._ctx;
            this._ctx.fill = (...rest) => {
              const ret = fill.apply(this._ctx, rest);
              pixoo.forceUpdate();
              return ret;
            };
            this._ctx.stroke = (...rest) => {
              const ret = stroke.apply(this._ctx, rest);
              pixoo.forceUpdate();
              return ret;
            };
            this._ctx.fillRect = (...rest) => {
              const ret = fillRect.apply(this._ctx, rest);
              pixoo.forceUpdate();
              return ret;
            };
            this._ctx.drawImage = (...rest) => {
              const ret = drawImage.apply(this._ctx, rest);
              pixoo.forceUpdate();
              return ret;
            };
            this._ctx._drawImage = drawImage;
            this._ctx.clearRect = (...rest) => {
              const ret = clearRect.apply(this._ctx, rest);
              pixoo.forceUpdate();
              return ret;
            };
            return this._ctx;
          }
          throw new Error(`Only 2d context is supported, not ${type}`);
        }
      }
      this._canvas = new PixooCanvas(width, height);
    }
  }

  get width() {
    return this._canvas.width;
  }

  get height() {
    return this._canvas.height;
  }

  get canvas() {
    return this._canvas;
  }

  get context() {
    return this.canvas.getContext('2d');
  }

  get matrix() {
    return this._matrix;
  }

  transferCanvasData() {
    const {canvas, matrix} = this;
    if(canvas.width !== matrix.width) {
      matrix.width = canvas.width;
      matrix.height = canvas.height;
    }
    const {width, height} = canvas;
    const ctx = canvas.getContext('2d');
    const {data} = ctx.getImageData(0, 0, width, height);
    matrix.transformByRowAndColumn((x, y, pixel, index) => {
      const i = index * 4;
      return [data[i], data[i + 1], data[i + 2]];
    });
    return matrix;
  }

  setUpdateLatency(latency = 0) {
    this._updateDelay = latency;
  }

  forceUpdate() {
    if(!this._updatePromise) {
      this._updatePromise = new Promise((resolve) => {
        if(this._updateDelay <= 0) {
          requestAnimationFrame(() => {
            this._updatePromise = null;
            this.update();
            resolve();
          });
        } else {
          setTimeout(() => {
            this._updatePromise = null;
            this.update();
            resolve();
          }, this._updateDelay);
        }
      });
    }
  }

  async update() {
    const matrix = this.transferCanvasData();
    const message = this.getStaticImage(matrix);
    await this.send(message);
    const e = new CustomEvent('pixooupdate', {detail: {device: this}});
    window.dispatchEvent(e);
    // const anmiData = this.getAnimationData([matrix]);
    // console.log(anmiData);
    // for(let i = 0; i < anmiData.length; i++) {
    //   const message = anmiData[i];
    //   this.send(message);
    // }
  }

  setEmulate(value = true) {
    if(value) console.warn('Emulation mode is enabled. No data will be send to the device.');
    this._emulate = value;
  }

  async send(message) {
    if(this._emulate) {
      // eslint-disable-next-line no-return-await
      return await Promise.resolve({status: 'OK'});
    }
    // eslint-disable-next-line no-return-await
    return await (await fetch(`${this._server}/send`, {
      method: 'POST',
      body: JSON.stringify({
        payload: message,
      }),
    })).json();
  }

  async isConnected() {
    try {
      const answer = await this.send('460000');
      return answer.status === 'OK';
    } catch (ex) {
      return false;
    }
  }

  setBrightness(brightness) {
    if(brightness < 0 || brightness > 100) {
      throw Error(
        `Brightness must be in percent between 0 and 100 (inclusive). The given value was ${brightness}`,
      );
    }

    const message = new TimeboxEvoMessage(`74${number2HexString(brightness)}`).message;
    this.send(message);
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  setColor(x, y, color) {
    this.matrix.assertBounds(x, y);
    const {r, g, b} = new TinyColor(color);
    const originColor = this.getColor(x, y);
    if(r !== originColor.r || g !== originColor.g || b !== originColor.b) {
      this.context.fillStyle = color;
      this.context.fillRect(x, y, 1, 1);
    }
  }

  setPixel(x, y, color) {
    this.setColor(x, y, color);
  }

  getColor(x, y) {
    const [r, g, b] = this.matrix.get(x, y);
    return new TinyColor({r, g, b});
  }

  getPixel(x, y) {
    return this.getColor(x, y);
  }

  generateImageData(canvas, delay = 0) {
    const frameTimeString = int2hexlittle(delay);
    let paletteTypeString = '00';

    const {colorBufferString, screenBufferString, colorCount} = this.encodeCanvasToFrame(canvas);
    let paletteCountString = colorCount;

    if(canvas.width > 16) {
      paletteCountString = int2hexlittle(paletteCountString);
      paletteTypeString = '03';
    } else {
      paletteCountString = number2HexString(paletteCountString % 256);
    }

    // console.log(paletteCountString);
    // console.log(colorCount);

    const fsize = 3 + (frameTimeString.length
      + paletteTypeString.length
      + paletteCountString.length
      + colorBufferString.length
      + screenBufferString.length) / 2;

    const frameSizeString = int2hexlittle(fsize);

    return `aa${frameSizeString}${frameTimeString}${paletteTypeString}${paletteCountString}${colorBufferString}${screenBufferString}`;
  }

  getAnimationData(frames = [], speed = 100) {
    if(frames.length <= 0) {
      throw new Error('no frames given');
    }

    const frameData = [];
    for(let i = 0; i < frames.length; i++) {
      const canvas = frames[i];
      const delay = speed * i;
      frameData.push(this.generateImageData(canvas, delay));
    }

    const allData = frameData.join('');
    const totalSize = allData.length / 2 - frames.length; // 扣除 aa
    // console.log(totalSize, frameData[0].length);
    const nchunks = Math.ceil(allData.length / 400);
    const chunks = [];
    for(let i = 0; i < nchunks; i++) {
      const chunkHeader = int2hexlittle(totalSize) + number2HexString(i);
      chunks.push(`49${chunkHeader}${allData.substr(i * 400, 400)}`);
    }
    return chunks;
  }

  getStaticImage(canvas) {
    const imageData = this.generateImageData(canvas);
    const header = '44000a0a04';
    const payload = new TimeboxEvoMessage(
      header + imageData,
    );
    return payload.message;
  }

  encodeCanvasToFrame(canvas) {
    const palette = [];
    const paletteIndexMap = new Map();
    const screen = [];

    canvas.traverseByRowAndColumn((_x, _y, color) => {
      const stringifiedColor = JSON.stringify(color);
      if(!paletteIndexMap.has(stringifiedColor)) {
        palette.push(color);
        let index = palette.length - 1;
        if(this.type === 'max' && index > 932) { // 对于PixooMax来说，颜色太多了
          index = 932;
          // 寻找接近的颜色
          let minDist = Infinity;
          for(let i = 0; i < 933; i++) {
            const paletteColor = palette[i];
            const distance = Math.hypot(
              color[0] - paletteColor[0],
              color[1] - paletteColor[1],
              color[2] - paletteColor[2],
            );
            if(distance < minDist) {
              minDist = distance;
              index = i;
            }
          }
        }
        paletteIndexMap.set(stringifiedColor, index);
      }
      screen.push(paletteIndexMap.get(stringifiedColor));
    });

    if(palette.length > 1024) {
      throw new Error(
        `Palette to large: More than 1024 colors (${palette.length})`,
      );
    }
    // console.log(palette.length);

    if(this.type === 'max' && palette.length > 933) {
      console.warn('too many colors, some colors will be lost');
      palette.length = 933;
    }

    const colorBufferString = palette.map(color => color.map(c => number2HexString(c)).join('')).join('');

    // Calculate how many bits are needed to fit all the palette values in
    // log(1) === 0. Therefore we clamp to [1,..]
    const referenceBitLength = Math.max(1, Math.ceil(Math.log2(palette.length)));

    // Screen buffer is using minmal amount of bits to encode all palette codes.
    // Ordering of segments is Little endion
    let current = 0;
    let currentIndex = 0;

    let screenBufferString = '';

    screen.forEach((paletteIndex) => {
      // Add the new color reference to the accumulator
      const reference = paletteIndex & ((2 ** referenceBitLength) - 1);
      current |= (reference << currentIndex);
      currentIndex += referenceBitLength;

      // Write out all filled up bytes
      while(currentIndex >= 8) {
        const lastByte = current & 0xff;
        current >>= 8;
        currentIndex -= 8;
        screenBufferString += number2HexString(lastByte);
      }
    });

    // Add the last byte
    if(currentIndex !== 0) {
      screenBufferString += number2HexString(current);
    }

    return {
      colorBufferString,
      screenBufferString,
      colorCount: palette.length,
    };
  }
}