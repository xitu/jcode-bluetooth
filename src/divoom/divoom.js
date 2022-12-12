// https://github.com/jakobwesthoff/divoom-pixoo-max-nodejs
import {TinyColor} from '@ctrl/tinycolor';
import {int2hexlittle, boolean2HexString, number2HexString, color2HexString} from './utils.js';
import {TimeboxEvoMessage} from './message.js';
import {Matrix} from './matrix.js';

export class Divoom {
  static WeatherType = {
    Sunny: 1,
    Cloudy: 3,
    Stormy: 5,
    Rainy: 6,
    Snowy: 8,
    Foggy: 9,
  }

  static ClockType = {
    FullScreen: 0,
    Rainbow: 1,
    WithBox: 2,
    AnalogSquare: 3,
    FullScreenNegative: 4,
    AnalogRound: 5,
  }

  static LightningType = {
    PlainColor: 0,
    Love: 1,
    Plants: 2,
    NoMosquitto: 3,
    Sleeping: 4,
  }

  constructor({host = 'http://localhost:9527', width = 16, height = 16} = {}) {
    this._host = host;
    this._matrix = new Matrix(width, height);
    this._canvas = null;
    this._updatePromise = null;
    this._updateDelay = 0;
    this._animationFrames = [];
    this._emulate = false;

    if(typeof OffscreenCanvas === 'function') {
      const self = this;
      class DivoomCanvas extends OffscreenCanvas {
        get width() {
          return super.width;
        }

        get height() {
          return super.height;
        }

        getContext(type, args = {}) {
          if(args.willReadFrequently !== false) args.willReadFrequently = true;
          // if(args.alpha !== true) args.alpha = false;
          if(type === '2d') {
            if(this._ctx) return this._ctx;
            this._ctx = super.getContext(type, args);
            const {fill, stroke, fillRect, strokeRect, fillText, strokeText, drawImage, clearRect} = this._ctx;
            [fill, stroke, fillRect, strokeRect, fillText, strokeText, drawImage, clearRect].forEach((fn) => {
              this._ctx[fn.name] = (...rest) => {
                const ret = fn.apply(this._ctx, rest);
                self.forceUpdate();
                return ret;
              };
            });
            this._ctx._drawImage = drawImage;
            return this._ctx;
          }
          throw new Error(`Only 2d context is supported, not ${type}`);
        }
      }
      this._canvas = new DivoomCanvas(width, height);
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

  transferCanvasData(canvas = this.canvas, matrix = this.matrix) {
    return matrix.fromCanvas(canvas);
  }

  setUpdateLatency(latency = 0) {
    this._updateDelay = latency;
  }

  forceUpdate() {
    if(!this._updatePromise) {
      this._updatePromise = new Promise((resolve) => {
        if(this._updateDelay <= 0 && typeof requestAnimationFrame === 'function') {
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
    return this._updatePromise;
  }

  binarize({context = this.context, threadhold = 16, backgroundColor = 'black', foregroundColor} = {}) {
    foregroundColor = foregroundColor || context.fillStyle;
    if(typeof CanvasGradient === 'function' && foregroundColor instanceof CanvasGradient) {
      return;
    }
    const {width, height} = context.canvas;
    const imageData = context.getImageData(0, 0, width, height);
    const {data} = imageData;
    const foreground = new TinyColor(foregroundColor).toRgb();
    const background = new TinyColor(backgroundColor).toRgb();
    for(let i = 0; i < data.length; i += 4) {
      const brightness = (0.2126 * data[i]) + (0.7152 * data[i + 1]) + (0.0722 * data[i + 2]);
      if(brightness > threadhold) {
        data[i] = foreground.r;
        data[i + 1] = foreground.g;
        data[i + 2] = foreground.b;
      } else {
        data[i] = background.r;
        data[i + 1] = background.g;
        data[i + 2] = background.b;
      }
      data[i + 3] = 255;
    }
    context.putImageData(imageData, 0, 0);
  }

  async update() {
    const matrix = this.transferCanvasData();

    const message = this.getStaticImage(matrix);
    await this.send(message);

    // const animData = this.getAnimationData([matrix]);
    // const message = animData.join('');
    // console.log(animData.length, message.length);
    // await this.send(message);
    if(typeof CustomEvent === 'function') {
      const e = new CustomEvent('devicestatechange', {detail: {device: this}});
      window.dispatchEvent(e);
    }
  }

  async playAnimation(frames = this._animationFrames) {
    const messages = this.getAnimationData(frames);
    await this.send(messages.join(''));
  }

  clearAnimationFrames() {
    this._animationFrames.length = 0;
  }

  appendAnimationFrame(image, delay = 0) {
    let frame;
    if(typeof image.getContext === 'function') {
      // canvas
      frame = this.transferCanvasData(image, this._matrix.clone());
    } else if(!(image instanceof Matrix) && typeof OffscreenCanvas === 'function') {
      const ofc = new OffscreenCanvas(this.width, this.height);
      ofc.getContext('2d').drawImage(image, 0, 0, this.width, this.height);
      frame = this.transferCanvasData(ofc, this._matrix.clone());
    } else {
      frame = image.clone();
    }
    this._animationFrames.push({frame, delay});
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
    const payload = new TimeboxEvoMessage(message).message;

    // eslint-disable-next-line no-return-await
    return await (await fetch(`${this._host}/send`, {
      method: 'POST',
      body: JSON.stringify({
        payload,
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

  async setBrightness(brightness) {
    if(brightness < 0 || brightness > 100) {
      throw Error(
        `Brightness must be in percent between 0 and 100 (inclusive). The given value was ${brightness}`,
      );
    }

    await this.send(`74${number2HexString(brightness)}`);
  }

  async setDatetime(date = new Date()) {
    const fullYearStr = date.getFullYear().toString().padStart(4, '0');
    const timeCommand = `18${number2HexString(Number(fullYearStr.slice(2)))
      + number2HexString(Number(fullYearStr.slice(0, 2)))
      + number2HexString(date.getMonth() + 1)
      + number2HexString(date.getDate())
      + number2HexString(date.getHours())
      + number2HexString(date.getMinutes())
      + number2HexString(date.getSeconds())
    }00`;

    await this.send(timeCommand);
  }

  async setTemperatureAndWeather({temperature = 0, weather = Divoom.WeatherType.Clear} = {}) {
    const tempStr = number2HexString(temperature);
    const weatherStr = number2HexString(weather);
    await this.send(`5F${tempStr}${weatherStr}`);
  }

  async enterClockMode({
    type = Divoom.ClockType.FullScreen,
    showTime = true,
    showWeather = true,
    showTemp = true,
    showCalendar = true,
    color = 'white',
  } = {}) {
    const prefix = '450001';
    const clockTypeStr = number2HexString(type);
    const panelStr = [showTime, showWeather, showTemp, showCalendar].map(boolean2HexString).join('');
    const colorStr = color2HexString(color);
    await this.send(`${prefix}${clockTypeStr}${panelStr}${colorStr}`);
  }

  async enterLightningMode({
    color = 'white',
    brightness = 50,
    type = Divoom.LightningType.Love,
  } = {}) {
    const prefix = '4501';
    const suffix = '01000000';
    const colorStr = color2HexString(color);
    const brightnessStr = number2HexString(brightness);
    const typeStr = number2HexString(type);
    await this.send(`${prefix}${colorStr}${brightnessStr}${typeStr}${suffix}`);
  }

  async enterCloudMode() {
    await this.send('4502');
  }

  async setVJEffect(type = 0) {
    await this.send(`4503${number2HexString(type)}`);
  }

  async playMusicEQ(type = 0) {
    await this.send(`4504${number2HexString(type)}`);
  }

  async enterCustomMode() {
    await this.send('4505');
  }

  async showScoreBoard(player1 = 0, player2 = 0) {
    const prefix = '450600';
    const player1Str = int2hexlittle(player1);
    const player2Str = int2hexlittle(player2);
    await this.send(`${prefix}${player1Str}${player2Str}`);
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

  generateImageData(matrix, delay = 0) {
    const frameTimeString = int2hexlittle(delay);
    let paletteTypeString = '00';

    const {colorBufferString, screenBufferString, colorCount} = this.encodeMatrixToFrame(matrix);
    let paletteCountString = colorCount;

    if(matrix.width > 16) {
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

  getAnimationData(frames) {
    if(frames.length <= 0) {
      throw new Error('no frames given');
    }

    const frameData = [];
    for(let i = 0; i < frames.length; i++) {
      const {frame, delay} = frames[i];
      frameData.push(this.generateImageData(frame, delay));
    }

    const allData = frameData.join('');
    const totalSize = allData.length / 2;
    const chunkSize = 400;
    // console.log(totalSize, frameData.length, frameData[0].length);
    const nchunks = Math.ceil(allData.length / chunkSize);
    const chunks = [];
    for(let i = 0; i < nchunks; i++) {
      const body = allData.substr(i * chunkSize, chunkSize);
      let chunkHeader = int2hexlittle(totalSize) + number2HexString(i);
      if(this.type === 'max') {
        // eslint-disable-next-line prefer-template
        chunkHeader = int2hexlittle(totalSize) + '0000' + int2hexlittle(i);
      }
      chunks.push(`49${chunkHeader}${body}`);
    }
    return chunks;
  }

  getStaticImage(matrix) {
    const imageData = this.generateImageData(matrix);
    const header = '44000a0a04';
    return header + imageData;
  }

  encodeMatrixToFrame(matrix) {
    const palette = [];
    const paletteIndexMap = new Map();
    const screen = [];

    matrix.traverseByRowAndColumn((_x, _y, color) => {
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