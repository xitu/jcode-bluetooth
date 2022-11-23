// https://github.com/jakobwesthoff/divoom-pixoo-max-nodejs
import {int2hexlittle, number2HexString} from './utils.js';
import {TimeboxEvoMessage} from './message.js';
import {Canvas} from './canvas.js';

const tempCanvas = new Canvas();

function transferCanvasData(pixoo) {
  const {canvas} = pixoo;
  if(canvas.width !== tempCanvas.width) {
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
  }
  const {width, height} = canvas;
  const ctx = canvas.getContext('2d');
  const {data} = ctx.getImageData(0, 0, width, height);
  tempCanvas.transformByRowAndColumn((x, y, pixel, index) => {
    const i = index * 4;
    return [data[i], data[i + 1], data[i + 2]];
  });

  return tempCanvas;
}

export class Pixoo {
  constructor(server = '//localhost:9527', width = 16, height = 16) {
    this.server = server;
    this._canvas = null;
    this._updatePromise = null;

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
            this._ctx.clear = () => {
              const ret = this._ctx.clearRect(0, 0, this.width, this.height);
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

  forceUpdate() {
    if(!this._updatePromise) {
      this._updatePromise = new Promise((resolve) => {
        requestAnimationFrame(() => {
          this._updatePromise = null;
          this.update();
          resolve();
        }, 0);
      });
    }
  }

  update() {
    const canvas = transferCanvasData(this);
    const message = this.getStaticImage(canvas);
    this.send(message);
    // const anmiData = this.getAnimationData([canvas]);
    // console.log(anmiData);
    // for(let i = 0; i < anmiData.length; i++) {
    //   const message = anmiData[i];
    //   this.send(message);
    // }
  }

  async send(message) {
    // eslint-disable-next-line no-return-await
    return await (await fetch(`${this.server}/send`, {
      method: 'POST',
      body: JSON.stringify({
        payload: message,
      }),
    })).json();
  }

  get canvas() {
    return this._canvas;
  }

  getBrightness(brightness) {
    if(brightness < 0 || brightness > 100) {
      throw Error(
        `Brightness must be in percent between 0 and 100 (inclusive). The given value was ${brightness}`,
      );
    }

    return new TimeboxEvoMessage(`74${number2HexString(brightness)}`).message;
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
        const index = palette.length - 1;
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
      for(let i = 0; i < screen.length; i++) {
        screen[i] = Math.min(screen[i], 932);
      }
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