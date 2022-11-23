// https://github.com/jakobwesthoff/divoom-pixoo-max-nodejs
import {int2hexlittle, number2HexString} from './utils.js';
import {TimeboxEvoMessage} from './message.js';

export class Pixoo {
  // constructor() {}

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
      paletteCountString = int2hexlittle(colorCount);
      paletteTypeString = '03';
    } else {
      paletteCountString = number2HexString(colorCount);
    }

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
    } else if(frames.length <= 1) {
      return this.getStaticImage(frames[0]);
    }
    const frameData = [];
    for(let i = 0; i < frames.length; i++) {
      const canvas = frames[i];
      const delay = speed * i;
      frameData.push(this.generateImageData(canvas, delay));
    }

    const allData = frameData.join('');
    const totalSize = allData.length / 2;
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