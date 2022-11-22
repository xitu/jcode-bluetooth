// https://github.com/jakobwesthoff/divoom-pixoo-max-nodejs
import {int2hexlittle} from './utils.js';
import {TimeboxEvoMessage} from './message.js';

export class PixooMax {
  // constructor() {}

  setBrightness(brightness) {
    if(brightness < 0 || brightness > 100) {
      throw Error(
        `Brightness must be in percent between 0 and 100 (inclusive). The given value was ${brightness}`,
      );
    }

    return new TimeboxEvoMessage(`74${`0${brightness.toString(16)}`.slice(-2)}`).message;
  }

  setStaticImage(canvas) {
    const frameTimeString = int2hexlittle(0);
    const paletteTypeString = '03';

    const {colorBufferString, screenBufferString, colorCount} = this.encodeCanvasToFrame(canvas);
    const paletteCountString = int2hexlittle(colorCount);

    const fsize = 2 + (frameTimeString.length
      + paletteTypeString.length
      + paletteCountString.length
      + colorBufferString.length
      + screenBufferString.length) / 2;

    const frameSizeString = int2hexlittle(fsize);

    const payload = new TimeboxEvoMessage(
      // eslint-disable-next-line prefer-template
      '44000a0a04aa'
      + frameSizeString
      + frameTimeString
      + paletteTypeString
      + paletteCountString
      + colorBufferString
      + screenBufferString,
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

    const colorBufferString = palette.map(color => color.map(c => `0${c.toString(16)}`.slice(-2)).join('')).join('');

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
        screenBufferString += `0${lastByte.toString(16)}`.slice(-2);
      }
    });

    // Add the last byte
    if(currentIndex !== 0) {
      screenBufferString += `0${current.toString(16)}`.slice(-2);
    }

    return {
      colorBufferString,
      screenBufferString,
      colorCount: palette.length,
    };
  }
}